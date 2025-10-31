class WeatherController < ApplicationController
  def index
  end

  def autocomplete
    query = params[:q]

    # Ensure query is present and has minimum length
    if query.blank? || query.strip.length < 2
      render json: []
      return
    end

    suggestions = WeatherService.fetch_city_suggestions(query, limit: 5)

    render json: suggestions.as_json
  end

  def search
    city = params[:city]

    if city.blank?
      @error = "Please enter a city name"
      render :index
      return
    end

    if city.length < 2
      @error = "City name must be at least 2 characters"
      render :index
      return
    end

    begin
      weather_data = WeatherService.fetch_weather(city)

      @city = city
      @current = weather_data[:current]
      @forecast = weather_data[:forecast]["list"]&.first(8)

      # Check if API returned an error
      if @current["cod"].to_i != 200
        @error = case @current["cod"].to_i
        when 404
                   "City not found. Please check the spelling and try again."
        when 401
                   "API key error. Please contact support."
        else
                   "Unable to fetch weather data. Please try again later."
        end
      end
    rescue StandardError => e
      @error = "Network error. Please check your connection and try again."
      Rails.logger.error "Weather API Error: #{e.message}"
    end

    render :index
  end
end
