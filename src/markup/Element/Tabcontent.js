// Tabcontent.js

import React from 'react';
import { Nav } from 'react-bootstrap';

const Tabcontent = ({ activeTab, handleTabSelect }) => {
	return (
		<Nav variant="pills" className="nav nav-tabs">
			<Nav.Item className="nav-item mb-sm-0 mb-2">
				<Nav.Link
					eventKey="Place"
					className={`nav-link ${activeTab === 'Place' ? 'active' : ''}`}
					onClick={() => handleTabSelect('Place')}
				>
					<i className="fa fa-map-marker"></i> <span className="title-head">Place</span>
				</Nav.Link>
			</Nav.Item>
			<Nav.Item className="nav-item">
				<Nav.Link
					eventKey="Party"
					className={`nav-link ${activeTab === 'Party' ? 'active' : ''}`}
					onClick={() => handleTabSelect('Party')}
				>
					<i className="fa fa-music"></i> <span className="title-head">Party</span>
				</Nav.Link>
			</Nav.Item>
			<Nav.Item className="nav-item">
				<Nav.Link
					eventKey="Rest"
					className={`nav-link ${activeTab === 'Rest' ? 'active' : ''}`}
					onClick={() => handleTabSelect('Rest')}
				>
					<i className="fa fa-glass"></i> <span className="title-head">Restaurant</span>
				</Nav.Link>
			</Nav.Item>
		</Nav>
	);
};

export default Tabcontent;
