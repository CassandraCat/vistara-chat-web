import React from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {BrowserRouter as Router} from "react-router-dom";
import {ThemeProvider} from "styled-components";
import theme from "./theme"
import {AuthProvider} from "./guard/AuthProvider";
import {SdkProvider} from "./sdk/SdkContext";
import {Provider} from "react-redux";
import {store, persistor} from "./store";
import {PersistGate} from "redux-persist/integration/react";
import {AliveScope} from "react-activation";


createRoot(document.getElementById("root")).render(
    <Router>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <SdkProvider>
                    <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <AliveScope>
                                <App/>
                            </AliveScope>
                        </PersistGate>
                    </Provider>
                </SdkProvider>
            </AuthProvider>
        </ThemeProvider>
    </Router>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
