# Weather App - Rails

A modern, responsive weather application built with Ruby on Rails 8.0. Search for weather information by city name and view current conditions along with a 24-hour forecast.

![Rails](https://img.shields.io/badge/Rails-8.0.3-red)
![Ruby](https://img.shields.io/badge/Ruby-3.1+-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-supported-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue)

## Features

- 🌤️ **Weather Search**: Search for weather information by city name
- 📊 **Current Conditions**: View current temperature, weather description, humidity, and wind speed
- 📅 **24-Hour Forecast**: See detailed weather forecast for the next 24 hours
- 🔍 **Search History**: Automatically saves recent searches (stored locally in browser)
- 📱 **Progressive Web App**: Installable PWA with offline support
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS and smooth animations
- ⚡ **Fast Performance**: Built with Turbo Rails for SPA-like experience

## Screenshots

<img width="1916" height="947" alt="image" src="https://github.com/user-attachments/assets/acb7b14b-c30c-437d-8ac2-abd6a7a52de2" />

<img width="1903" height="949" alt="image" src="https://github.com/user-attachments/assets/aa493254-1b58-4d24-ad84-a6181db87bb5" />

<img width="1915" height="947" alt="image" src="https://github.com/user-attachments/assets/91eae3d1-52f0-4377-8c47-1f9b0be8519f" />

## Tech Stack

- **Backend**: Ruby on Rails 8.0.3
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **JavaScript**: Stimulus.js, Turbo Rails
- **API**: OpenWeatherMap API
- **HTTP Client**: HTTParty
- **Deployment**: Kamal (Docker-based)

## Prerequisites

Before you begin, ensure you have the following installed:

- Ruby 3.1 or higher
- Rails 8.0.3
- PostgreSQL
- Node.js (for asset compilation)
- An OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ror-weather-app
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (or use `dotenv-rails`):
   ```bash
   OPENWEATHER_API_KEY=your_api_key_here
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   ```

4. **Set up the database**
   ```bash
   rails db:create
   rails db:migrate
   ```

5. **Compile assets**
   ```bash
   rails tailwindcss:build
   ```

6. **Start the server**
   ```bash
   bin/dev
   ```
   
   Or separately:
   ```bash
   rails server
   ```

7. **Visit the application**
   
   Open your browser and navigate to `http://localhost:3000`

## Configuration

### Environment Variables

The application requires the following environment variables:

- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (required)
- `POSTGRES_USER`: PostgreSQL username (for development)
- `POSTGRES_PASSWORD`: PostgreSQL password (for development)

### Database Configuration

The application uses PostgreSQL. Configure your database settings in `config/database.yml` or through environment variables.

## Usage

1. **Search for Weather**
   - Enter a city name in the search box
   - Click "Search" or press Enter
   - View current weather conditions and forecast

2. **View Recent Searches**
   - Recent searches are automatically saved
   - Click on any recent search to quickly retrieve weather for that city
   - Clear history using the "Clear" button

3. **Weather Information Displayed**
   - Current temperature and "feels like" temperature
   - Weather description with icon
   - Humidity percentage
   - Wind speed
   - 24-hour forecast with 3-hour intervals

## Project Structure

```
ror-weather-app/
├── app/
│   ├── controllers/
│   │   └── weather_controller.rb      # Main controller handling weather search
│   ├── services/
│   │   └── weather_service.rb          # Service class for API interactions
│   ├── views/
│   │   └── weather/
│   │       └── index.html.erb         # Main view template
│   └── javascript/
│       └── controllers/
│           └── search_history_controller.js  # Stimulus controller for search history
├── config/
│   ├── routes.rb                       # Application routes
│   └── database.yml                    # Database configuration
└── test/
    └── controllers/
        └── weather_controller_test.rb  # Controller tests
```

## API Integration

This application uses the [OpenWeatherMap API](https://openweathermap.org/api) to fetch weather data. The service makes two API calls:

1. **Current Weather**: `/weather` endpoint
2. **Forecast**: `/forecast` endpoint

Both endpoints use metric units (Celsius) and require city name queries.

## Testing

Run the test suite:

```bash
rails test
```

Run specific tests:

```bash
rails test test/controllers/weather_controller_test.rb
```

## Development

### Running in Development Mode

```bash
bin/dev
```

This command runs both the Rails server and Tailwind CSS watcher.

### Code Quality

The project includes:

- **RuboCop**: Ruby style checker (`rubocop-rails-omakase`)
- **Brakeman**: Security vulnerability scanner
- **Bundler Audit**: Gem vulnerability checker

Run checks:

```bash
bin/rubocop
bin/brakeman
bin/bundler-audit
```

## Deployment

The application is configured for deployment using Kamal. See `config/deploy.yml` for deployment configuration.

### Docker Deployment

The project includes a `Dockerfile` for containerized deployment.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Rails](https://rubyonrails.org/) community
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Hotwire](https://hotwired.dev/) for Turbo and Stimulus

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Roadmap

- [ ] Add unit conversion (Celsius/Fahrenheit)
- [ ] Add 5-day forecast view
- [ ] Add weather maps
- [ ] Add favorites functionality
- [ ] Add weather alerts
- [ ] Improve error handling and user feedback

---

Built with ❤️ using Ruby on Rails
