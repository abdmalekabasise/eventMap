import React from 'react'
import { Route, Switch } from 'react-router-dom';

import Homepage from './Pages/Homepage';

import Error from './Pages/Error';
import Register from './Pages/Register';

import Addlisting from './Pages/Addlisting';
import Listing from './Pages/Listing';
import Listingleftsidebar from './Pages/Listingleftsidebar';
import Listingrightsidebar from './Pages/Listingridghtsidebar';

import Gridleftsidebar from './Pages/Gridleftsidebar';
import Gridrightsidebar from './Pages/Gridrightsidebar';

import Gridmapleftsidebar from './Pages/Gridmapleftsidebar';
import Gridmaprightsidebar from './Pages/Gridmaprightsidebar';

import Listingdetail from './Pages/Listingdetail';
import Listingdetail2 from './Pages/Listingdetail2';
import Listingdetail3 from './Pages/Listingdetail3';


import Blogstandar from './Pages/Blogstandar';
import Blogstandardetail from './Pages/Blogstandardetail';

import Contact from './Pages/Contact';
import ScrollToTop from './Element/ScrollToTop';

const Markup = () => {
	return (
		<>

			<div className="page-wraper">
				<Switch>
					<Route path='/' exact component={Homepage} />
					<Route path='/home' exact component={Homepage} />
					<Route path='/error-404' exact component={Error} />
					<Route path='/contact-us' exact component={Contact} />
					<Route path='/register' exact component={Register} />
					<Route path='/add-listing' exact component={Addlisting} />
					<Route path='/listing' exact component={Listing} />
					<Route path='/listing-left-sidebar' exact component={Listingleftsidebar} />
					<Route path='/listing-right-sidebar' exact component={Listingrightsidebar} />

					<Route path='/listing-grid-left-sidebar' exact component={Gridleftsidebar} />
					<Route path='/listing-grid-right-sidebar' exact component={Gridrightsidebar} />

					<Route path='/listing-grid-map-left-sidebar' exact component={Gridmapleftsidebar} />
					<Route path='/listing-grid-map-right-sidebar' exact component={Gridmaprightsidebar} />

					<Route path='/listing-details' exact component={Listingdetail} />
					<Route path='/listing-details-2' exact component={Listingdetail2} />
					<Route path='/listing-details-3' exact component={Listingdetail3} />

					<Route path='/blogstandard' exact component={Blogstandar} />
					<Route path='/blog-details' exact component={Blogstandardetail} />

					<Route exact path='/Gridrightsidebar' component={Gridrightsidebar} />
				</Switch>
			</div>
			<ScrollToTop />
		</>

	)
}

export default Markup;