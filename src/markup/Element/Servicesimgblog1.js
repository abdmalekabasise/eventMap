import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import img1 from './../../images/listing/list2/pic1.jpg';
import img2 from './../../images/listing/list2/pic2.jpg';
import img3 from './../../images/listing/list2/pic3.jpg';
import img4 from './../../images/listing/list2/pic4.jpg';
import img5 from './../../images/listing/list2/pic5.jpg';
import img6 from './../../images/listing/list2/pic6.jpg';
import img7 from './../../images/listing/list2/pic1.jpg'; // Assuming this is intended
import img8 from './../../images/listing/list2/pic2.jpg'; // Assuming this is intended

const imgBlog1 = [
	{
		image: img1,
		title: 'King Organic Shop',
	},
	{
		image: img2,
		title: 'Dorado Health Care',
	},
	{
		image: img3,
		title: 'Tam Farfhume Shop',
	},
	{
		image: img4,
		title: 'King Organic Shop',
	},
	{
		image: img5,
		title: 'Venzil Hingo Zoo',
	},
	{
		image: img6,
		title: 'KFC Pijja Shop',
	},
	{
		image: img7,
		title: 'Venzil Hingo Zoo',
	},
	{
		image: img8,
		title: 'KFC Pijja Shop',
	},
];

class OverservicesBlog1 extends Component {
	render() {
		return (
			<ul id="masonry" className="dlab-gallery-listing gallery-grid-4 gallery row sp10">
				{imgBlog1.map((item, index) => (
					<li className="near-by-you design card-container col-lg-3 col-md-6 col-sm-6" key={index}>
						<div className="listing-bx featured-star-right m-b10 style-2">
							<div className="listing-media">
								<img src={item.image} alt={item.title} />
								<ul className="wish-bx">
									<li>
										<Link to={"#"} className="like-btn"><i className="fa fa-heart"></i> Like</Link>
									</li>
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
								<h3 className="title">
									<Link to={"/listing-details"}>{item.title}</Link>
								</h3>
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusm.</p>
								<ul className="place-info">
									<li className="place-location"><i className="fa fa-map-marker"></i>12/a, New</li>
									<li className="open"><i className="fa fa-check"></i>Open Now</li>
								</ul>
							</div>
						</div>
					</li>
				))}
			</ul>
		);
	}
}

export default OverservicesBlog1;
