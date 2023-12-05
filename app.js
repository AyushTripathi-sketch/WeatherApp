const express = require('express');
const axios = require('axios');
const dotenv = require("dotenv");

const app = express();
const port = 3000;

dotenv.config()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

// Function to get weather for a city
const getWeather = async (city) => {
  try {
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(apiUrl);
    return `${response.data.main.temp}C`;
  } catch (error) {
    console.error(`Error fetching weather for ${city}: ${error}`);
    return 'N/A';
  }
};

// POST endpoint to get weather for multiple cities
app.post('/getWeather', async (req, res) => {
  const { cities } = req.body;
  const weatherResults = {};

  // Fetch weather for each city
  for (const city of cities) {
    const weather = await getWeather(city);
    weatherResults[city] = weather;
  }

  res.json({ weather: weatherResults });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
