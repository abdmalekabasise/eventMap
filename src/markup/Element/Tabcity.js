import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames'; // Make sure classnames is imported

const Tabcity = (props) => {
	const [activeTab, setActiveTab] = useState('1');

	const toggle = tab => {
		if (activeTab !== tab) setActiveTab(tab);
	}

	return (
		<>
			<div className="section-full bg-gray-1 content-inner about-us">
				<div className="container-fluid">
					<div className="section-head text-black text-left text-center">
						<h2 className="box-title">Best Things to Do in the City</h2>
						<div className="dlab-separator bg-primary"></div>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.</p>
					</div>
					<div className="site-filters clearfix center m-b40 listing-filters">
						<ul className="filters" data-toggle="buttons">
							<li className="btn active">
								<Link className={classnames({ active: activeTab === '1' })}
									onClick={() => { toggle('1'); }}>
									<span><i className=""></i>All</span>
								</Link>
							</li>
							<li>
								<Link className={classnames({ active: activeTab === '2' })}
									onClick={() => { toggle('2'); }}>
									<span><i className="la la-thumb-tack"></i> Latest Listings</span>
								</Link>
							</li>
							<li>
								<Link className={classnames({ active: activeTab === '3' })}
									onClick={() => { toggle('3'); }}>
									<span><i className="la la-star-o"></i> Popular Ratings</span>
								</Link>
							</li>
							<li>
								<Link className={classnames({ active: activeTab === '4' })}
									onClick={() => { toggle('4'); }}>
									<span><i className="la la-heart-o"></i> Near By You</span>
								</Link>
							</li>
						</ul>
					</div>
					<div className="clearfix">
						<ul id="masonry" className="dlab-gallery-listing gallery-grid-4 gallery row">
							<li className="near-by-you design card-container col-lg-3 col-md-6 col-sm-6">
								<div className="listing-bx featured-star-right m-b30 style-2">
									<div className="listing-media">
										<img src="images/listing/list2/pic1.jpg" alt="" />
										<ul className="wish-bx">
											<li><a className="like-btn" href="javascript:void(0)"><i className="fa fa-heart"></i> Like</a></li>
										</ul>
										<ul className="featured-star">
											<li><i className="fa fa-star"></i></li>
											<li><i className="fa fa-star"></i></li>
											<li><i className="fa fa-star"></i></li>
											<li><i className="fa fa-star"></i></li>
											<li><i className="fa fa-star"></i></li>
										</ul>
									</div>
									<div className="listing-info">
										<h3 className="title"><a href="listing-details.html">King Organic Shop</a></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusm.</p>
										<ul className="place-info">
											<li className="place-location"><i className="fa fa-map-marker"></i>12/a, New</li>
											<li className="open"><i className="fa fa-check"></i>Open Now</li>
										</ul>
									</div>
								</div>
							</li>
							{/* Repeat similar blocks for other listings */}
							<li className="popular-ratings photography card-container col-lg-3 col-md-6 col-sm-6">
								<div className="listing-bx featured-star-right m-b30 style-2">
									<div className="listing-media">
										<img src="images/listing/list2/pic2.jpg" alt="" />
										<ul className="wish-bx">
											<li><a className="like-btn" href="javascript:void(0)"><i className="fa fa-heart"></i> Like</a></li>
										</ul>
										<ul className="featured-star">
											<li><i className="fa fa-star"></i></li>
											<li><i className="fa fa-star"></i></li>
											<li><i className="fa fa-star"></i></li>
											<li><i className="fa fa-star"></i></li>
											<li><i className="fa fa-star"></i></li>
										</ul>
									</div>
									<div className="listing-info">
										<h3 className="title"><a href="listing-details.html">Dorado Health Care</a></h3>
										<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusm.</p>
										<ul className="place-info">
											<li className="place-location"><i className="fa fa-map-marker"></i>12/a, New</li>
											<li className="open"><i className="fa fa-check"></i>Open Now</li>
										</ul>
									</div>
								</div>
							</li>
							{/* Add remaining listings */}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

export default Tabcity;
