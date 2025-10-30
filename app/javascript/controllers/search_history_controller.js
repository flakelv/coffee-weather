import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "historyList", "container"]
  static values = { maxItems: { type: Number, default: 5 } }

  connect() {
    this.loadHistory()
  }

  // Save search
  saveSearch(event) {
    const city = this.inputTarget.value.trim()
    if (city) {
      this.addToHistory(city)
    }
  }

  addToHistory(city) {
    let history = this.getHistory()
    
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase())
    
    history.unshift(city)
    
    history = history.slice(0, this.maxItemsValue)
    
    localStorage.setItem('weatherSearchHistory', JSON.stringify(history))
    
    this.displayHistory()
  }

  getHistory() {
    const history = localStorage.getItem('weatherSearchHistory')
    return history ? JSON.parse(history) : []
  }

  displayHistory() {
    const history = this.getHistory()
    
    if (history.length === 0) {
      if (this.hasContainerTarget) {
        this.containerTarget.classList.add('fade-out')
        setTimeout(() => {
          this.containerTarget.classList.add('hidden')
          this.containerTarget.classList.remove('fade-out')
        }, 300)
      }
      return
    }

    if (this.hasContainerTarget && this.containerTarget.classList.contains('hidden')) {
      this.containerTarget.classList.remove('hidden')
      this.containerTarget.classList.add('fade-in')
      setTimeout(() => {
        this.containerTarget.classList.remove('fade-in')
      }, 300)
    }

    const historyHTML = history.map(city => `
      <button 
        type="button"
        data-action="click->search-history#selectCity"
        data-city="${city}"
        class="history-item w-full text-left px-4 py-3 bg-[#e8dcc8] hover:bg-[#d4c4b0] text-[#5c4a3a] rounded-xl transition-all cursor-pointer text-base"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 inline mr-2 text-[#7a6552]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        ${city}
      </button>
    `).join('')

    this.historyListTarget.innerHTML = historyHTML
  }

  loadHistory() {
    this.displayHistory()
  }

  selectCity(event) {
    const city = event.currentTarget.dataset.city
    this.inputTarget.value = city
    this.inputTarget.form.requestSubmit()
  }

  clearHistory() {
    localStorage.removeItem('weatherSearchHistory')
    this.displayHistory()
  }
}

