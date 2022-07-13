import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/private-route";

import Home from "../pages/home";
import Login from "../pages/login";


export const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<PrivateRoute />}>
                    <Route path="/home" element={<Home />} />
                </Route>

            </Routes>
        </Router>
    );
};