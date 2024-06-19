const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));

// Function to truncate text
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Define the route to fetch and display news articles
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://newsdata.io/api/1/latest`, {
            params: {
                apikey: process.env.API_KEY,
                language: 'en',
            }
        });

        const articles = response.data.results.map(article => ({
            title: truncateText(article.title, 12),
            link: article.link,
            description: truncateText(article.description, 50),
            pubDate: article.pubDate,
            image_url: article.image_url
        }));

        res.render('index', { articles });
    } catch (error) {
        console.error('Error fetching news articles:', error);
        res.status(500).send('Error fetching news articles');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
