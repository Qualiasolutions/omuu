# Instagram Post Generator

A React application that uses the Templated.io API to generate professional Instagram posts.

## Setup

1. **Get an API Key**
   - Create an account at [Templated.io](https://templated.io)
   - Go to your account settings to get your API key

2. **Configure the API Key**
   - Open `src/services/api.js`
   - Replace `YOUR_API_KEY` with your actual Templated.io API key:
   ```javascript
   const API_KEY = 'YOUR_API_KEY'; // Replace with your actual Templated.io API key
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start the Application**
   ```bash
   npm start
   ```

## Features

- Select from available templates
- Customize content for different business types
- Choose content style (casual/energetic)
- Add custom text
- Generate and preview Instagram posts

## Troubleshooting

- **Error 404: Failed to load templates**
  - Verify your API key is correct
  - Check that your account has access to templates
  - Ensure your internet connection is stable

- **No templates available**
  - Your account might not have any templates available
  - Try creating or adding templates in your Templated.io account

## API Documentation

For more details on the Templated.io API, refer to the [official documentation](https://templated.io/docs/api).

## Technology Stack

- React with TypeScript
- React Router for navigation
- Axios for API requests
- CSS with Tailwind-like utility classes

## License

MIT
