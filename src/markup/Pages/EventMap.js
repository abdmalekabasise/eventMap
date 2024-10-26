import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const EventMap = ({ onAddEvent, searchData, loading, setLoading }) => {
    const [viewport, setViewport] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 8,
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

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/events', {
                params: {
                    lat: viewport.latitude,
                    lng: viewport.longitude,
                    date: searchData.date || new Date().toISOString().split('T')[0]
                }
            });

            const formattedEvents = response.data
                .filter(event => {
                    const eventDate = new Date(event.dates.start.localDate);
                    const selectedDate = new Date(searchData.date || new Date());

                    return (
                        eventDate.toDateString() === selectedDate.toDateString() &&
                        (!searchData.category || event.classifications?.[0]?.segment.name === searchData.category) &&
                        (!searchData.searchInput || event.name.toLowerCase().includes(searchData.searchInput.toLowerCase())) &&
                        (!searchData.city || event._embedded.venues[0].city.name.toLowerCase() === searchData.city.toLowerCase())
                    );
                })
                .map(event => ({
                    title: event.name,
                    lat: event._embedded.venues[0].location.latitude,
                    lng: event._embedded.venues[0].location.longitude,
                    category: event.classifications?.[0].segment.name,
                    date: event.dates.start.localDate,
                    time: convertTo12Hour(event.dates.start.localTime),
                    venue: event._embedded.venues[0].name
                }));

            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [searchData]);

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
                            {events.map((event, index) => (
                                <Marker
                                    key={index}
                                    latitude={parseFloat(event.lat)}
                                    longitude={parseFloat(event.lng)}
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <div style={{ fontSize: '24px', cursor: 'pointer' }}>
                                        {getCategoryIcon(event.category)}
                                    </div>
                                </Marker>
                            ))}

                            {selectedEvent && (
                                <Popup
                                    latitude={parseFloat(selectedEvent.lat)}
                                    longitude={parseFloat(selectedEvent.lng)}
                                    onClose={() => setSelectedEvent(null)}
                                    closeOnClick={false}
                                    anchor="top"
                                >
                                    <div style={{
                                        width: '150px',
                                        padding: '8px',
                                        fontSize: '14px'
                                    }}>
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
