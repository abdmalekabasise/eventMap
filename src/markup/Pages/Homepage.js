import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Header from './../Layout/Header';
import Footer from './../Layout/Footer';
import Popcity from './../Element/popCity';
import Topplacesowl from './../Element/Topplacesowl';
import Userowl from './../Element/Userowl';
import Fromblog from './../Element/Fromblog';
import EventMap from './../Pages/EventMap';

// Import images
var bnr = require('./../../images/main-slider/slide1.jpg');

class Homepage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchData: {
				searchInput: '',
				category: '',
				date: '',
				city: '',
			},
		};
	}

	handleInputChange = (event) => {
		const value = event.target.value;
		this.setState((prevState) => ({
			searchData: {
				...prevState.searchData,
				searchInput: value,
			},
		}));
	};

	handleCategoryChange = (event) => {
		const value = event.target.value;
		this.setState((prevState) => ({
			searchData: {
				...prevState.searchData,
				category: value === 'All Categories' ? '' : value,
			},
		}));
	};

	handleDateChange = (event) => {
		const value = event.target.value;
		this.setState((prevState) => ({
			searchData: {
				...prevState.searchData,
				date: value,
			},
		}));
	};

	handleCityChange = (event) => {
		const value = event.target.value;
		this.setState((prevState) => ({
			searchData: {
				...prevState.searchData,
				city: value,
			},
		}));
	};

	handleSearch = (event) => {
		event.preventDefault();
		// Add search handling logic here
	};

	render() {
		const { searchData } = this.state;

		// Define categories for the dropdown
		const allCategories = [
			'All Categories', 'Sports', 'Music', 'Community', 'Concerts',
			'Birthday', 'Wedding', 'Corporate', 'Festival',
			'Italian', 'Chinese', 'Fast Food', 'Seafood'
		];

		return (
			<div className="page-wraper">
				<Header />

				<div className="page-content bg-white">
					<div
						className="dlab-bnr-inr dlab-bnr-inr-md"
						style={{ backgroundImage: `url(${bnr})`, backgroundSize: 'cover' }}
					>
						<div className="container">
							<div className="dlab-bnr-inr-entry align-m dlab-home">
								<div className="bnr-content">
									<h2>
										<strong>Find & Get</strong> Events.
									</h2>
								</div>

								{/* Updated Search Form with retained layout and styling */}
								<div className="dlab-tabs search-filter">
									<div className="tab-content">
										<div className="tab-pane active">
											<form onSubmit={this.handleSearch} className="search-form">
												<div className="input-group">
													{/* Search Input */}
													<input
														type="text"
														className="form-control"
														placeholder="What are you looking for?"
														value={searchData.searchInput}
														onChange={this.handleInputChange}
													/>

													{/* Category Dropdown */}
													<Form.Control
														as="select"
														value={searchData.category}
														onChange={this.handleCategoryChange}
														className="form-control"
													>
														{allCategories.map((cat, index) => (
															<option key={index} value={cat === 'All Categories' ? '' : cat}>
																{cat}
															</option>
														))}
													</Form.Control>

													{/* Date Input */}
													<input
														type="date"
														className="form-control"
														value={searchData.date}
														onChange={this.handleDateChange}
													/>

													{/* City Input */}
													<input
														type="text"
														className="form-control"
														placeholder="Enter city"
														value={searchData.city}
														onChange={this.handleCityChange}
													/>

													{/* Search Button */}
													<div className="input-group-prepend">
														<button type="submit" className="site-button text-uppercase">
															<i className="fa m-r5 fa-search"></i> Search
														</button>
													</div>
												</div>
											</form>
										</div>
									</div>

									<p className="text-center text-white m-b10 m-t30">
										Find awesome places, bars, restaurants & activities.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Event Map Section */}
					<div className="event-map">
						<EventMap
							searchQuery={searchData.searchInput}
							categoryFilter={searchData.category}
							dateFilter={searchData.date}
							cityFilter={searchData.city}
						/>
					</div>

					{/* Popular Cities and Other Content */}
					<div className="content-block">
						<div className="section-full bg-white content-inner">
							<div className="container">
								<div className="section-head text-black text-center">
									<h2 className="box-title">Popular Cities</h2>
									<div className="dlab-separator bg-primary"></div>
									<p>
										Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
										nostrud.
									</p>
								</div>
								<Popcity />
							</div>
						</div>

						<Topplacesowl />

						{/* ... other sections ... */}
					</div>
				</div>

				<Footer />
			</div>
		);
	}
}

export default Homepage;
