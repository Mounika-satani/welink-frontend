import React from 'react';
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layouts/PublicLayout";
import FeedLayout from "../components/layouts/FeedLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Feed from "../pages/Feed";
import Discover from "../pages/Discover";
import Trending from "../pages/Trending";
import Industries from "../pages/Industries";
import About from "../pages/About";
import StartupDetails from "../pages/StartupDetails";
import SubmitStartup from "../pages/SubmitStartup";
import ProfileDetails from "../pages/ProfileDetails";
import MyStartupDetails from "../pages/MyStartupDetails";
import Help from "../pages/Help";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<FeedLayout />}>
                <Route element={<ProtectedRoute />}>
                    <Route path="/feed" element={<Feed />} />
                </Route>
            </Route>

            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/trending" element={<Trending />} />
                    <Route path="/industries" element={<Industries />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/startup/:id" element={<StartupDetails />} />
                    <Route path="/submit-startup" element={<SubmitStartup />} />
                    <Route path="/profile" element={<ProfileDetails />} />
                    <Route path="/my-startup" element={<MyStartupDetails />} />
                    <Route path="/help" element={<Help />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;

