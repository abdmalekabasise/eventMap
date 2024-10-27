import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const EventMap = ({ onAddEvent, searchData, loading, setLoading }) => {
    const [viewport, setViewport] = useState({
        latitude: 40.7831,
        longitude: -73.9712,
        zoom: 12,
        width: '100%',
        height: '600px',
    });
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        category: '',
        address: '',
        time: '',
        date: '',
        venueInfo: '',
        lat: '',
        lng: ''
    });
    const timeoutRef = useRef(null);

    const ZOOM_THRESHOLD = 12;
    const FETCH_THRESHOLD = 0.2; // Adjust as needed (approx. 20 km)
    const [lastFetchCenter, setLastFetchCenter] = useState({ latitude: 40.7831, longitude: -73.9712 });
    const [fetchedOnce, setFetchedOnce] = useState(false);



    const hasMovedSignificantly = (lat1, lng1, lat2, lng2, threshold) => {
        return Math.abs(lat1 - lat2) > threshold || Math.abs(lng1 - lng2) > threshold;
    };

    useEffect(() => {
        const hasMovedSignificantly = (lat1, lng1, lat2, lng2, threshold) => {
            return Math.abs(lat1 - lat2) > threshold || Math.abs(lng1 - lng2) > threshold;
        };

        if (
            viewport.zoom >= ZOOM_THRESHOLD && // Check zoom level
            hasMovedSignificantly(viewport.latitude, viewport.longitude, lastFetchCenter.latitude, lastFetchCenter.longitude, FETCH_THRESHOLD)
        ) {
            fetchEvents();
            setLastFetchCenter({ latitude: viewport.latitude, longitude: viewport.longitude });
        }
    }, [viewport.latitude, viewport.longitude, viewport.zoom]); // Re-run only when lat, lng, or zoom changes



    const [eventsLoading, setEventsLoading] = useState(false);





    const fetchEvents = async () => {
        setEventsLoading(true);
        try {
            const response = await axios.get(`https://eventmaps-main-1071080686287.us-central1.run.app/api/events`, {
                params: {
                    lat: viewport.latitude,
                    lng: viewport.longitude,
                    date: searchData.date || new Date().toISOString().split('T')[0]
                }
            });

            const formattedEvents = response.data.map(event => ({
                id: event.id, // Assuming each event has a unique 'id'
                title: event.name,
                lat: event._embedded.venues[0].location.latitude,
                lng: event._embedded.venues[0].location.longitude,
                category: event.classifications?.[0].segment.name,
                date: event.dates.start.localDate,
                time: event.dates.start.localTime ? convertTo12Hour(event.dates.start.localTime) : 'Time not available',
                venue: event._embedded.venues[0].name
            }));

            setEvents(prevEvents => {
                // Create a map to prevent duplicates
                const eventMap = {};
                prevEvents.forEach(event => {
                    eventMap[event.id] = event;
                });
                formattedEvents.forEach(event => {
                    eventMap[event.id] = event;
                });
                // Convert the map back to an array
                return Object.values(eventMap);
            });
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setEventsLoading(false);
        }
    };




    useEffect(() => {
        // Only fetch events if zoomed in enough
        if (viewport.zoom >= ZOOM_THRESHOLD) {
            // Debounce fetchEvents
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                fetchEvents();
                setLastFetchCenter({ latitude: viewport.latitude, longitude: viewport.longitude });
            }, 500);
        }
    }, [viewport, searchData]);




    useEffect(() => {
        // Clear any existing timeout
        clearTimeout(timeoutRef.current);

        // Set a new timeout to debounce the API call when viewport changes
        timeoutRef.current = setTimeout(() => {
            if (viewport.zoom >= ZOOM_THRESHOLD) {
                fetchEvents();
            }
        }, 500); // Adjust debounce delay as needed
    }, [viewport, searchData]);



    const convertTo12Hour = (time) => {
        const [hour, minute] = time.split(':');
        const hour12 = (hour % 12) || 12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minute} ${ampm}`;
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Music':
                return '🎸';
            case 'Sports':
                return '🏅';
            case 'Arts & Theatre':
                return '🎭';
            case 'Film':
                return '🎬';
            case 'Miscellaneous':
                return '🎉';
            case 'Party':
                return '🎊';
            case 'Bar Event':
                return '🍻';
            case 'Social Gathering':
                return '👥';
            case 'Game Night':
                return '🎲';
            case 'Food & Drink':
                return '🍔';
            case 'Comedy':
                return '😂';
            case 'Festival':
                return '🎪';
            default:
                return '📍';
        }
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();

        if (newEvent.address) {
            try {
                const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newEvent.address)}.json`, {
                    params: {
                        access_token: MAPBOX_TOKEN,
                    }
                });

                const location = response.data.features[0];
                const [lng, lat] = location.center;

                const newEventToAdd = {
                    ...newEvent,
                    lat,
                    lng,
                };

                setEvents((prevEvents) => [...prevEvents, newEventToAdd]);
                onAddEvent(newEventToAdd);

                setNewEvent({ title: '', category: '', address: '', time: '', date: '', venueInfo: '', lat: '', lng: '' });
            } catch (error) {
                console.error('Error fetching location from address:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="event-map-container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 className="text-center text-event">Event Map</h1>

            {loading ? (
                <div className="loading-animation" style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Loading...</p>
                    <div className="spinner" style={{
                        border: '4px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '50%',
                        borderTop: '4px solid #3498db',
                        width: '40px',
                        height: '40px',
                        animation: 'spin 1s linear infinite'
                    }} />
                </div>
            ) : (
                <div style={{ width: '100%', height: '600px', marginBottom: '20px' }}>
                    {MAPBOX_TOKEN ? (
                        <ReactMapGL
                            {...viewport}
                            mapboxAccessToken={MAPBOX_TOKEN}
                            mapStyle="mapbox://styles/dudebrochill/cm2pb7ch600di01qi3a2a5cvo/draft"
                            onMove={(evt) => setViewport(evt.viewState)}
                        >
                            {events.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '10px', color: '#888' }}>
                                    No events available in this area
                                </div>
                            ) : (
                                events.map((event, index) => (
                                    <Marker
                                        key={event.id}
                                        latitude={parseFloat(event.lat)}
                                        longitude={parseFloat(event.lng)}
                                        onClick={() => setSelectedEvent(event)}
                                    >
                                        <div style={{ fontSize: '24px', cursor: 'pointer' }}>
                                            {getCategoryIcon(event.category)}
                                        </div>
                                    </Marker>
                                ))
                            )}


                            {selectedEvent && (
                                <Popup
                                    latitude={parseFloat(selectedEvent.lat)}
                                    longitude={parseFloat(selectedEvent.lng)}
                                    onClose={() => setSelectedEvent(null)}
                                    closeOnClick={false}
                                    anchor="top"
                                >
                                    <div style={{ width: '150px', padding: '8px', fontSize: '14px' }}>
                                        <button
                                            onClick={() => setSelectedEvent(null)}
                                            style={{
                                                float: 'right',
                                                cursor: 'pointer',
                                                border: 'none',
                                                background: 'none',
                                                fontSize: '14px',
                                                padding: 0
                                            }}
                                        >
                                            ✖
                                        </button>
                                        <h4 style={{ fontSize: '16px', margin: '0 0 5px' }}>{selectedEvent.title}</h4>
                                        <p style={{ margin: '5px 0' }}>Category: {selectedEvent.category}</p>
                                        <p style={{ margin: '5px 0' }}>Date: {selectedEvent.date}</p>
                                        <p style={{ margin: '5px 0' }}>Time: {selectedEvent.time}</p>
                                        <p style={{ margin: '5px 0' }}>Venue Info: {selectedEvent.venueInfo}</p>
                                    </div>
                                </Popup>
                            )}
                        </ReactMapGL>



                    ) : (
                        <div className="error-message">
                            <p>Map cannot be loaded. Mapbox token is missing.</p>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleEventSubmit} className="event-form" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h3 className="text-event" style={{ textAlign: 'center', marginBottom: '15px' }}>Create an Event</h3>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Category:</label>
                    <select
                        name="category"
                        value={newEvent.category}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="">Select Category</option>
                        <option value="Music">Music</option>
                        <option value="Sports">Sports</option>
                        <option value="Arts & Theatre">Arts & Theatre</option>
                        <option value="Film">Film</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                        <option value="Party">Party</option>
                        <option value="Bar Event">Bar Event</option>
                        <option value="Social Gathering">Social Gathering</option>
                        <option value="Game Night">Game Night</option>
                        <option value="Food & Drink">Food & Drink</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Festival">Festival</option>
                    </select>
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={newEvent.address}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={newEvent.date}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Time:</label>
                    <input
                        type="time"
                        name="time"
                        value={newEvent.time}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label>Venue Info:</label>
                    <input
                        type="text"
                        name="venueInfo"
                        value={newEvent.venueInfo}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>

                <button type="submit" className="submit-button" style={{ width: '100%', padding: '10px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Add Event
                </button>
            </form>
        </div>

    );

};

// CSS for the spinner animation
const spinnerStyle = document.createElement('style');
spinnerStyle.innerHTML = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(spinnerStyle);

export default EventMap;
