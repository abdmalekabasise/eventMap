import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Header from './../Layout/Header';
import Footer from './../Layout/Footer';
import Popcity from './../Element/popCity';
import Topplacesowl from './../Element/Topplacesowl';
import EventMap from './../Pages/EventMap';

import bnr from './../../images/main-slider/slide1.jpg';

const Homepage = () => {
	const [searchData, setSearchData] = useState({
		searchInput: '',
		category: '',
		date: '',
		city: '',
	});
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(false); // Loading state

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setSearchData(prev => ({ ...prev, [name]: value }));
	};

	const handleCategoryChange = (event) => {
		const value = event.target.value;
		setSearchData(prev => ({ ...prev, category: value === 'All Categories' ? '' : value }));
	};

	const handleSearch = (event) => {
		event.preventDefault();
		setLoading(true); // Set loading to true when search begins
		setSearchData(prev => ({ ...prev })); // Update searchData to trigger EventMap refresh
	};

	const handleAddEvent = (newEvent) => {
		setEvents(prevEvents => [...prevEvents, newEvent]);
	};

	const allCategories = [
		'All Categories', 'Sports', 'Music', 'Community', 'Concerts',
		'Birthday', 'Wedding', 'Corporate', 'Festival',
		'Italian', 'Chinese', 'Fast Food', 'Seafood'
	];

	return (
		<div className="page-wraper">
			<Header />
			<div className="page-content bg-white">
				<div className="dlab-bnr-inr dlab-bnr-inr-md" style={{ backgroundImage: `url(${bnr})`, backgroundSize: 'cover' }}>
					<div className="container">
						<div className="dlab-bnr-inr-entry align-m dlab-home">
							<div className="bnr-content">
								<h2>
									<strong>Find & Get</strong> Events.
								</h2>
							</div>

							<div className="dlab-tabs search-filter">
								<div className="tab-content">
									<div className="tab-pane active">
										<Form onSubmit={handleSearch} className="search-form">
											<div className="input-group">
												<input
													type="text"
													className="form-control"
													placeholder="What are you looking for?"
													name="searchInput"
													value={searchData.searchInput}
													onChange={handleInputChange}
												/>

												<Form.Control
													as="select"
													name="category"
													value={searchData.category}
													onChange={handleCategoryChange}
													className="form-control"
												>
													{allCategories.map((cat, index) => (
														<option key={index} value={cat === 'All Categories' ? '' : cat}>
															{cat}
														</option>
													))}
												</Form.Control>

												<input
													type="date"
													className="form-control"
													name="date"
													value={searchData.date}
													onChange={handleInputChange}
												/>

												<input
													type="text"
													className="form-control"
													placeholder="Enter city"
													name="city"
													value={searchData.city}
													onChange={handleInputChange}
												/>

												<div className="input-group-prepend">
													<button type="submit" className="site-button text-uppercase">
														<i className="fa m-r5 fa-search"></i> Search
													</button>
												</div>
											</div>
										</Form>
									</div>
								</div>

								<p className="text-center text-white m-b10 m-t30">
									Find awesome places, bars, restaurants & activities.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="event-map">
					<EventMap
						events={events}
						onAddEvent={handleAddEvent}
						searchData={searchData} // Pass searchData here
						loading={loading} // Pass loading state
						setLoading={setLoading} // Pass setLoading function
					/>
				</div>

				<div className="content-block">
					<div className="section-full bg-white content-inner">
						<div className="container">
							<div className="section-head text-black text-center">
								<h2 className="box-title">Popular Cities</h2>
								<div className="dlab-separator bg-primary"></div>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.
								</p>
							</div>
							<Popcity />
						</div>
					</div>
					<Topplacesowl />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Homepage;
