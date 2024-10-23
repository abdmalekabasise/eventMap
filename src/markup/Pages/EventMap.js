import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import '../../css/EventMap.css';

const libraries = ['places'];

const EventMap = ({ searchQuery, categoryFilter, dateFilter, cityFilter, activeTab }) => {
    const [events, setEvents] = useState([]);
    const [center, setCenter] = useState({ lat: 40.78767, lng: -73.95505 });
    const [zoom, setZoom] = useState(10);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    const [creatingEvent, setCreatingEvent] = useState({
        title: '',
        description: '',
        date: '',
        category: '',  // New category field
        address: '',   // New address field
        lat: '',
        lng: ''
    });

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAAQLly-IDZ28ST3SdcR5v8Kbn5ysnZswM', // Replace with your actual API key
        libraries,
    });

    const mapRef = useRef(null);

    const onMapLoad = (map) => {
        mapRef.current = map;
    };

    const handleZoomChanged = () => {
        if (mapRef.current) {
            setZoom(mapRef.current.getZoom());
        }
    };

    // Function to reverse geocode latitude and longitude to an address
    const reverseGeocodeLatLng = async (lat, lng) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    latlng: `${lat},${lng}`,
                    key: 'AIzaSyAAQLly-IDZ28ST3SdcR5v8Kbn5ysnZswM', // Replace with your actual API key
                },
            });

            if (response.data.results.length > 0) {
                return response.data.results[0].formatted_address; // Return the first formatted address
            } else {
                return 'Address not found';
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            return 'Error fetching address';
        }
    };

    // Step 1: Function to geocode an address to get lat/lng and formatted address
    const geocodeAddress = async (address) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    address: address,
                    key: 'AIzaSyAAQLly-IDZ28ST3SdcR5v8Kbn5ysnZswM', // Replace with your actual API key
                },
            });

            if (response.data.results.length > 0) {
                const result = response.data.results[0];
                const { lat, lng } = result.geometry.location;
                const formattedAddress = result.formatted_address;
                return { lat, lng, formattedAddress }; // Return the coordinates and formatted address
            } else {
                return null; // Address not found
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
        }
    };

    const handleMapClick = async (event) => {
        const latLng = event.latLng;
        const lat = latLng.lat();
        const lng = latLng.lng();

        // Get the address using reverse geocoding
        const address = await reverseGeocodeLatLng(lat, lng);

        // Update the creating event state with the lat, lng, and address
        setCreatingEvent((prev) => ({
            ...prev,
            lat,
            lng,
            address
        }));
    };

    // Step 2: Modify handleEventSubmit to geocode address before saving the event
    const handleEventSubmit = async (e) => {
        e.preventDefault();

        // Geocode the address before proceeding
        const geocodedData = await geocodeAddress(creatingEvent.address);

        if (geocodedData) {
            const { lat, lng, formattedAddress } = geocodedData;

            const newEvent = {
                ...creatingEvent,
                lat: lat, // Update with geocoded lat
                lng: lng, // Update with geocoded lng
                address: formattedAddress, // Update with formatted address
            };

            setUserEvents((prevEvents) => [...prevEvents, newEvent]);
            setCreatingEvent({ lat: '', lng: '', title: '', description: '', date: '', address: '', category: '' });
        } else {
            alert('Invalid address. Please enter a valid address.');
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('https://business-search-service-833157073960.us-central1.run.app/api/events', {
                    params: {
                        lat: center.lat,
                        lng: center.lng,
                        date: dateFilter || '',
                    },
                });

                if (response.data) {
                    setEvents(response.data);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        if (isLoaded) {
            fetchEvents();
        }
    }, [center, dateFilter, isLoaded]);

    useEffect(() => {
        const handleLocationSearch = async () => {
            if (cityFilter) {
                try {
                    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                        params: {
                            address: cityFilter,
                            key: 'AIzaSyAAQLly-IDZ28ST3SdcR5v8Kbn5ysnZswM', // Replace with your actual API key
                        },
                    });
                    const location = response.data.results[0].geometry.location;
                    setCenter({ lat: location.lat, lng: location.lng });
                } catch (error) {
                    console.error('Error fetching location:', error);
                }
            }
        };
        handleLocationSearch();
    }, [cityFilter]);

    const mapContainerStyle = {
        width: '100%',
        height: '600px',
    };

    const mapOptions = {
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "saturation": 36 },
                    { "color": "#1e1f29" },
                    { "lightness": "59" }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    { "visibility": "on" },
                    { "color": "#1e1f29" },
                    { "lightness": "-25" }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    { "visibility": "off" }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#444658" },
                    { "lightness": "18" }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "color": "#444658" },
                    { "lightness": 17 },
                    { "weight": 1.2 }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#444658" }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "lightness": "100" },
                    { "saturation": "27" }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "labels.text.stroke",
                "stylers": [
                    { "color": "#1e1f29" },
                    { "lightness": "100" }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#1e1f29" },
                    { "lightness": "-6" }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#1e1f29" },
                    { "lightness": "4" },
                    { "saturation": "11" }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#1e1f29" },
                    { "lightness": "60" }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#1e1f29" },
                    { "lightness": "21" },
                    { "saturation": "26" },
                    { "gamma": "1" }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "color": "#1e1f29" },
                    { "lightness": "27" },
                    { "weight": 0.2 },
                    { "visibility": "off" }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#1e1f29" },
                    { "lightness": "45" },
                    { "saturation": "9" }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#121318" },
                    { "lightness": "17" },
                    { "saturation": "32" }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#262c42" },
                    { "lightness": "-24" },
                    { "saturation": "10" },
                    { "visibility": "on" }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#1e1f29" },
                    { "lightness": 17 },
                    { "saturation": "14" }
                ]
            }
        ],
        disableDefaultUI: false
    };

    const tabSegmentMap = {
        'Place': ['Attractions', 'Sports', 'Community'],
        'Party': ['Music', 'Festivals', 'Family'],
        'Rest': ['Food'],
    };

    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.dates?.start?.localDate).toISOString().split('T')[0];
        const isMatchingSearch = !searchQuery || event.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isMatchingCategory = !categoryFilter || categoryFilter === 'All Categories' ||
            (event.classifications?.[0]?.segment?.name?.toLowerCase() === categoryFilter.toLowerCase());
        const isMatchingDate = !dateFilter || eventDate === dateFilter;
        const isMatchingTab = !activeTab || (event.classifications?.[0]?.segment?.name &&
            tabSegmentMap[activeTab] &&
            tabSegmentMap[activeTab].includes(event.classifications[0].segment.name));

        return isMatchingSearch && isMatchingCategory && isMatchingDate && isMatchingTab;
    });

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading Maps...</div>;
    }

    return (
        <div className="event-map-container">
            <h2 className="header">Event Map</h2>

            <div className="map-and-search">
                <div className="google-map">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        options={mapOptions}
                        zoom={zoom}
                        center={center}
                        onZoomChanged={handleZoomChanged}
                        onLoad={onMapLoad}
                        onClick={handleMapClick} // Add map click handler
                    >
                        {filteredEvents.map((event) => {
                            const venue = event._embedded?.venues?.[0];
                            const lat = parseFloat(venue?.location?.latitude);
                            const lng = parseFloat(venue?.location?.longitude);
                            const category = event.classifications?.[0]?.segment?.name || 'Unknown';

                            if (!isNaN(lat) && !isNaN(lng)) {
                                return (
                                    <Marker
                                        key={event.id}
                                        position={{ lat, lng }}
                                        title={event.name}
                                        icon={{
                                            url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
                                            scaledSize: new window.google.maps.Size(30, 30),
                                        }}
                                        onClick={() => setSelectedEvent({
                                            ...event,
                                            lat,
                                            lng,
                                            date: event.dates?.start?.localDate,
                                            category: category,
                                            type: 'ticketmaster'
                                        })}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })}

                        {userEvents.map((event, index) => (
                            <Marker
                                key={`user-event-${index}`}
                                position={{ lat: parseFloat(event.lat), lng: parseFloat(event.lng) }}
                                title={event.title}
                                icon={{
                                    url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png', // Yellow marker icon
                                    scaledSize: new window.google.maps.Size(30, 30), // Adjust the size if needed
                                }}
                                onClick={() => setSelectedEvent({
                                    ...event,
                                    lat: parseFloat(event.lat),
                                    lng: parseFloat(event.lng),
                                    type: 'user'
                                })}
                            />
                        ))}

                        {selectedEvent && (
                            <InfoWindow
                                position={{ lat: selectedEvent.lat, lng: selectedEvent.lng }}
                                onCloseClick={() => setSelectedEvent(null)}
                            >
                                <div className="info-window">
                                    <h2>{selectedEvent.name || selectedEvent.title}</h2>
                                    <p>{selectedEvent.info || selectedEvent.description || 'No description available'}</p>
                                    <p>
                                        <strong>Date:</strong> {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Category:</strong> {selectedEvent.category || 'N/A'}
                                    </p>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>

                <form onSubmit={handleEventSubmit} className="event-form">
                    <h3 className="event-container-window">Create an Event</h3>
                    <div className="form-group">
                        <label>Title:</label>
                        <input
                            type="text"
                            value={creatingEvent.title}
                            onChange={(e) => setCreatingEvent({ ...creatingEvent, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={creatingEvent.description}
                            onChange={(e) => setCreatingEvent({ ...creatingEvent, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={creatingEvent.date}
                            onChange={(e) => setCreatingEvent({ ...creatingEvent, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <select
                            value={creatingEvent.category}
                            onChange={(e) => setCreatingEvent({ ...creatingEvent, category: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select a category</option>
                            <option value="Music">Music</option>
                            <option value="Food & Drink">Food & Drink</option>
                            <option value="Arts & Culture">Arts & Culture</option>
                            <option value="Sports">Sports</option>
                            <option value="Networking">Networking</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input
                            type="text"
                            value={creatingEvent.address}
                            onChange={(e) => setCreatingEvent({ ...creatingEvent, address: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Add Event</button>
                </form>
            </div>
        </div>
    );
};

export default EventMap;
