import React from "react";
import ChatApp from "components/ChatApp";
import Login from "./pages/Login";
import {Route, Routes} from "react-router-dom";


function App() {
    return (
        <Routes>
            <Route path={'/login'} element={<Login/>}/>
            <Route path={'*'} element={<ChatApp/>}/>
        </Routes>
    );
}

export default App;
