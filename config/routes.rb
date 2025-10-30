Rails.application.routes.draw do
  root "weather#index"
  get 'weather/search', to: 'weather#search'
  
  # Catch all and redirect if someone tries something funky
  match '*path', to: redirect('/'), via: :all
end
