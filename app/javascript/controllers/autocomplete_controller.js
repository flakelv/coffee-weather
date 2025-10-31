import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "suggestions", "dropdown"]
  static values = { url: String, minLength: { type: Number, default: 2 }, debounceMs: { type: Number, default: 300 } }

  connect() {
    this.debounceTimer = null
    this.selectedIndex = -1
    this.suggestions = []
    
    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    document.addEventListener("click", this.boundHandleClickOutside)
  }

  disconnect() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    document.removeEventListener("click", this.boundHandleClickOutside)
  }

  handleClickOutside(event) {
    if (!this.hasDropdownTarget || this.dropdownTarget.classList.contains("hidden")) {
      return
    }

    if (this.dropdownTarget.contains(event.target)) {
      return
    }
    
    if (this.inputTarget && (this.inputTarget === event.target || this.inputTarget.contains(event.target))) {
      return
    }

    this.hideSuggestions()
  }

  search() {
    const query = this.inputTarget.value.trim()

    if (query.length < this.minLengthValue) {
      this.hideSuggestions()
      return
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.fetchSuggestions(query)
    }, this.debounceMsValue)
  }

  async fetchSuggestions(query) {
    try {
      // Normalize the query: trim and replace multiple spaces with single space
      const normalizedQuery = query.trim().replace(/\s+/g, ' ')
      
      if (normalizedQuery.length < this.minLengthValue) {
        this.hideSuggestions()
        return
      }

      const response = await fetch(`${this.urlValue}?q=${encodeURIComponent(normalizedQuery)}`)
      
      if (!response.ok) {
        this.hideSuggestions()
        return
      }
      
      const data = await response.json()
      this.suggestions = Array.isArray(data) ? data : []
      this.displaySuggestions()
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      this.hideSuggestions()
    }
  }

  highlightItem(items) {
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add("bg-[#d4c4b0]")
        item.scrollIntoView({ block: "nearest", behavior: "smooth" })
      } else {
        item.classList.remove("bg-[#d4c4b0]")
      }
    })
  }

  displaySuggestions() {
    if (!Array.isArray(this.suggestions) || this.suggestions.length === 0) {
      this.hideSuggestions()
      return
    }

    if (!this.hasDropdownTarget) {
      return
    }

    this.dropdownTarget.classList.remove("hidden")
    this.selectedIndex = -1

    const suggestionsHTML = this.suggestions.map((suggestion, index) => {
      const displayName = suggestion.display_name || suggestion.displayName || `${suggestion.name || ''}, ${suggestion.country || ''}`
      return `
      <button
        type="button"
        data-action="click->autocomplete#selectSuggestion"
        data-index="${index}"
        class="autocomplete-item w-full text-left px-4 py-3 bg-[#e8dcc8] hover:bg-[#d4c4b0] text-[#5c4a3a] rounded-xl transition-all cursor-pointer text-base first:rounded-t-xl last:rounded-b-xl ${index === 0 ? 'rounded-t-xl' : ''} ${index === this.suggestions.length - 1 ? 'rounded-b-xl' : ''}"
      >
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-[#7a6552] flex-shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span class="truncate">${this.escapeHtml(displayName)}</span>
        </div>
      </button>
    `}).join('')

    if (!this.hasSuggestionsTarget) {
      return
    }

    this.suggestionsTarget.innerHTML = suggestionsHTML
  }

  selectSuggestion(event) {
    const index = parseInt(event.currentTarget.dataset.index)
    const suggestion = this.suggestions[index]
    
    if (suggestion) {
      const searchQuery = suggestion.country 
        ? `${suggestion.name || ''}, ${suggestion.country || ''}`
        : suggestion.name || ''
      
      this.inputTarget.value = searchQuery.trim()
      this.hideSuggestions()
      if (this.inputTarget.form) {
        this.inputTarget.form.requestSubmit()
      }
    }
  }

  hideSuggestions() {
    this.dropdownTarget.classList.add("hidden")
    this.suggestions = []
    this.selectedIndex = -1
  }

  hideOnSubmit() {
    this.hideSuggestions()
  }

  handleKeydown(event) {
    // Only handle keyboard navigation if dropdown is visible
    if (!this.hasDropdownTarget || this.dropdownTarget.classList.contains("hidden")) {
      return
    }

    const items = this.suggestionsTarget.querySelectorAll('.autocomplete-item')

    if (items.length === 0) {
      return
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1)
        this.highlightItem(items)
        break
      case "ArrowUp":
        event.preventDefault()
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1)
        if (this.selectedIndex === -1) {
          // If at top, clear selection but keep dropdown open
          items.forEach(item => item.classList.remove("bg-[#d4c4b0]"))
        } else {
          this.highlightItem(items)
        }
        break
      case "Enter":
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
          event.preventDefault()
          items[this.selectedIndex].click()
        } else {
          // Hide suggestions when submitting form with Enter
          this.hideSuggestions()
        }
        // Allow normal form submission if no suggestion selected
        break
      case "Escape":
        event.preventDefault()
        this.hideSuggestions()
        break
    }
  }

  highlightItem(items) {
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add("bg-[#d4c4b0]")
        item.scrollIntoView({ block: "nearest", behavior: "smooth" })
      } else {
        item.classList.remove("bg-[#d4c4b0]")
      }
    })
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}

