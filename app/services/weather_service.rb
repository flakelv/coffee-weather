class WeatherService
    BASE_URL = "https://api.openweathermap.org/data/2.5"
    GEOCODING_URL = "https://api.openweathermap.org/geo/1.0"

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

  def self.fetch_city_suggestions(query, limit: 5)
    api_key = ENV["OPENWEATHER_API_KEY"]
    return [] if query.blank? || query.length < 2

    normalized_query = query.strip.gsub(/\s+/, " ")
    return [] if normalized_query.length < 2

    encoded_query = CGI.escape(normalized_query)
    url = "#{GEOCODING_URL}/direct?q=#{encoded_query}&limit=#{limit}&appid=#{api_key}"

    response = HTTParty.get(url)
    parsed_data = response.parsed_response

    suggestions = []

    if parsed_data.is_a?(Array)
      suggestions = parsed_data.map do |city_data|
        {
          name: city_data["name"],
          country: city_data["country"],
          state: city_data["state"],
          display_name: format_city_name(city_data)
        }
      end
    end

    # If no results and query has spaces, searching with just the first word
    if suggestions.empty? && normalized_query.include?(" ")
      first_word = normalized_query.split(" ").first
      return [] if first_word.length < 2

      encoded_first_word = CGI.escape(first_word)
      fallback_url = "#{GEOCODING_URL}/direct?q=#{encoded_first_word}&limit=#{limit * 2}&appid=#{api_key}"

      fallback_response = HTTParty.get(fallback_url)
      fallback_parsed = fallback_response.parsed_response

      if fallback_parsed.is_a?(Array)
        filtered_suggestions = fallback_parsed.select do |city_data|
          city_name = city_data["name"]&.downcase || ""
          query_words = normalized_query.downcase.split(" ")
          city_name.start_with?(query_words.first) &&
            (query_words.length == 1 || city_name.include?(query_words.last[0..2]))
        end

        suggestions = filtered_suggestions.first(limit).map do |city_data|
          {
            name: city_data["name"],
            country: city_data["country"],
            state: city_data["state"],
            display_name: format_city_name(city_data)
          }
        end
      end
    end

    suggestions
  rescue StandardError => e
    Rails.logger.error "Geocoding API Error: #{e.message}"
    []
  end

  def self.format_city_name(city_data)
    name = city_data["name"]
    state = city_data["state"]
    country = city_data["country"]

    parts = [ name ]
    parts << state if state.present?
    parts << country
    parts.join(", ")
  end
end
