import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import SimpleReactLightbox from "simple-react-lightbox";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <SimpleReactLightbox>
                {/* Remove basename for local development */}
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </SimpleReactLightbox>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

window.addEventListener("error", (e) => {
    console.error("Global error caught:", e.error);
});

window.addEventListener("unhandledrejection", (e) => {
    console.error("Unhandled promise rejection:", e.reason);
});


// reportWebVitals();
