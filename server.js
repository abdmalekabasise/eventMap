const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000; // Use PORT environment variable for Cloud Run, fallback to 5000 for local development


// Enable CORS to allow cross-origin requests
app.use(cors());


// Root route
app.get('/', (req, res) => {
    res.send('Hello! Your Node.js app is running.');
});


// Route to handle requests for events
app.get('/api/events', async (req, res) => {
    const { lat, lng } = req.query;

    // Validate that lat and lng are provided
    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const apiKey = 'hMRgQdelCew6LWjjO8wbDEVkLlDzPCsO';  // Replace with your Ticketmaster API key
    const baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
    const pageSize = 200;  // Max size per request (Ticketmaster limit)
    const maxPages = 5;  // Define the number of pages you want to retrieve (adjust as needed)
    let allEvents = [];  // To store all events across multiple pages

    try {
        let currentPage = 0;
        let totalPages = 1;  // Assume at least 1 page initially

        // Loop through pages until you've fetched all events or reached the maximum page limit
        while (currentPage < totalPages && currentPage < maxPages) {
            const response = await axios.get(baseUrl, {
                params: {
                    apikey: apiKey,
                    latlong: `${lat},${lng}`,  // Use lat and lng from the query parameters
                    radius: 50,  // Radius in miles
                    size: pageSize,  // Maximum events per request
                    page: currentPage,  // Current page number
                    sort: 'date,asc'  // Sort events by date (ascending)
                }
            });

            const events = response.data._embedded?.events || [];

            // Append events from this page to the allEvents array
            allEvents = [...allEvents, ...events];

            // Update totalPages based on the first response (Ticketmaster provides the page count)
            if (response.data.page) {
                totalPages = response.data.page.totalPages;
            }

            // Move to the next page
            currentPage += 1;
        }

        // If no events are found, return a 404 response
        if (allEvents.length === 0) {
            return res.status(404).json({ error: 'No events found' });
        }

        // Return all fetched events
        res.json(allEvents);

    } catch (error) {
        // Log the error and send a failure response
        console.error('Error fetching events from Ticketmaster:', error.message);
        res.status(500).json({ error: 'Failed to fetch events from Ticketmaster' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
