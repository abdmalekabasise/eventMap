const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

const apiKey = '107HeyhXFbdyn7MdrutUz7SuCzfpo86T';

app.use(cors());

const isDevelopment = process.env.NODE_ENV !== 'production';
if (!isDevelopment) {
    app.use(express.static(path.join(__dirname, 'dist')));
}

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/api/events', async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
    const pageSize = 200;
    const maxPages = 5;
    let allEvents = [];

    try {
        let currentPage = 0;
        let totalPages = 1;

        while (currentPage < totalPages && currentPage < maxPages) {
            const response = await axios.get(baseUrl, {
                params: {
                    apikey: apiKey,
                    latlong: `${lat},${lng}`,
                    radius: 50,
                    size: pageSize,
                    page: currentPage,
                    sort: 'date,asc',
                },
            });

            const events = response.data._embedded?.events || [];
            allEvents = [...allEvents, ...events];

            if (response.data.page) {
                totalPages = response.data.page.totalPages;
            }

            currentPage += 1;

            // Throttle requests by adding a delay if close to the limit
            if (response.headers['rate-limit-available'] < 2) {
                console.log('Approaching rate limit, waiting for 1 second...');
                await delay(1000);
            }
        }

        if (allEvents.length === 0) {
            return res.status(404).json({ error: 'No events found' });
        }

        res.json(allEvents);

    } catch (error) {
        console.error('Error fetching events from Ticketmaster:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            console.error('Data:', error.response.data);
            res.status(500).json({
                error: 'Failed to fetch events from Ticketmaster',
                details: error.response.data
            });
        } else {
            res.status(500).json({
                error: 'Failed to fetch events from Ticketmaster',
                details: error.message
            });
        }
    }
});

if (!isDevelopment) {
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
} else {
    app.get('*', (req, res) => {
        res.send('Running in development mode. Webpack Dev Server is serving the front-end.');
    });
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

    if (isDevelopment) {
        console.log(`Running in development mode. Ensure Webpack Dev Server is running at http://localhost:9000.`);
    }
});
