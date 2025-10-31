Rails.application.routes.draw do
  root "weather#index"
  get "weather/search", to: "weather#search"
  get "weather/autocomplete", to: "weather#autocomplete"

  # Catch all and redirect if someone tries something funny
  match "*path", to: redirect("/"), via: :all
end
