import React, { Suspense, useState, useEffect } from 'react'; // Import Suspense here
import Index from './markup/Markup';
import { connect, useDispatch } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { checkAutoLogin } from './services/AuthService';
import { isAuthenticated } from './store/selectors/AuthSelectors';
import './css/plugins.css';
import './css/style.css';
import './css/templete.css';
import './css/skin/skin-1.css';
import './plugins/slick/slick.min.css';
import './plugins/slick/slick-theme.min.css';
import Login from './markup/Pages/Login';
import SignUp from './markup/Pages/Register';
import EventMap from './markup/Pages/EventMap'; // Import EventMap
import Addlisting from './markup/Pages/Addlisting';
import Blogstandar from './markup/Pages/Blogstandar';
import Blogstandardetail from './markup/Pages/Blogstandardetail';
import Contact from './markup/Pages/Contact';
import Error from './markup/Pages/Error';
import Gridleftsidebar from './markup/Pages/Gridleftsidebar';
import Gridmapleftsidebar from './markup/Pages/Gridmapleftsidebar';
import Gridmaprightsidebar from './markup/Pages/Gridmaprightsidebar';
import Gridrightsidebar from './markup/Pages/Gridrightsidebar';
import Homepage from './markup/Pages/Homepage';
import Listing from './markup/Pages/Listing';
import Listingdetail from './markup/Pages/Listingdetail';
import Listingdetail2 from './markup/Pages/Listingdetail2';
import Listingdetail3 from './markup/Pages/Listingdetail3';
import Listingleftsidebar from './markup/Pages/Listingleftsidebar';
import Listingrightsidebar from './markup/Pages/Listingridghtsidebar';




function App(props) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const autoLogin = async () => {
            await checkAutoLogin(dispatch, props.history);
            setLoading(false); // Set loading to false when the authentication check is done
        };

        autoLogin();
    }, [dispatch, props.history]);

    // Add logging for authentication state
    useEffect(() => {
        console.log("Is authenticated:", props.isAuthenticated);
    }, [props.isAuthenticated]);

    // If still loading, show a loading screen
    if (loading) {
        return (
            <div id="preloader">
                <div className="sk-three-bounce">
                    <div className="sk-child sk-bounce1"></div>
                    <div className="sk-child sk-bounce2"></div>
                    <div className="sk-child sk-bounce3"></div>
                </div>
            </div>
        );
    }

    // Define routes without depending on authentication status
    let routes = (
        <Switch>
            {/* Specific routes must be listed first */}
            <Route exact path='/events' component={EventMap} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={SignUp} />
            <Route exact path='/add-listing' component={Addlisting} />
            <Route exact path='/blogstandard' component={Blogstandar} />
            <Route exact path='/contact-us' component={Contact} />
            <Route exact path='/blog-details' component={Blogstandardetail} />
            <Route exact path='/error' component={Error} />
            <Route exact path='/Gridleftsidebar' component={Gridleftsidebar} />
            <Route exact path='/listing-grid-map-left-sidebar' component={Gridmapleftsidebar} />
            <Route exact path='/listing-grid-map-right-sidebar' component={Gridmaprightsidebar} />
            <Route exact path='/Gridrightsidebar' component={Gridrightsidebar} />
            <Route exact path='/homepage' component={Homepage} />
            <Route exact path='/listing' component={Listing} />
            <Route exact path='/listing-details' component={Listingdetail} />
            <Route exact path='/listing-details-2' component={Listingdetail2} />
            <Route exact path='/listing-details-3' component={Listingdetail3} />
            <Route exact path='/listing-grid-left-sidebar' component={Listingleftsidebar} />
            <Route exact path='/listing-grid-right-sidebar' component={Listingrightsidebar} />
            <Route exact path='/listing-left-sidebar' component={Listingleftsidebar} />
            <Route exact path='/listing-right-sidebar' component={Listingrightsidebar} />
            <Route exact path='/error-404' component={Error} />



            <Route exact path='/' component={Index} /> {/* Exact match for home route */}
            <Route path='*' render={() => <h1>404 - Page Not Found</h1>} /> {/* Fallback for undefined routes */}
        </Switch>
    );

    return (
        <div className="vh-100">
            <Suspense fallback={
                <div id="preloader">
                    <div className="sk-three-bounce">
                        <div className="sk-child sk-bounce1"></div>
                        <div className="sk-child sk-bounce2"></div>
                        <div className="sk-child sk-bounce3"></div>
                    </div>
                </div>
            }>
                {routes}
            </Suspense>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
    };
};

export default withRouter(connect(mapStateToProps)(App));
