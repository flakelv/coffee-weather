class WeatherService
    BASE_URL = "https://api.openweathermap.org/data/2.5"

  def self.fetch_weather(city)
    api_key = ENV["OPENWEATHER_API_KEY"]
    encoded_city = CGI.escape(city)

    current_url = "#{BASE_URL}/weather?q=#{encoded_city}&appid=#{api_key}&units=metric"
    current_response = HTTParty.get(current_url)

    forecast_url = "#{BASE_URL}/forecast?q=#{encoded_city}&appid=#{api_key}&units=metric"
    forecast_response = HTTParty.get(forecast_url)

      {
        current: current_response,
        forecast: forecast_response
      }
    end
end
