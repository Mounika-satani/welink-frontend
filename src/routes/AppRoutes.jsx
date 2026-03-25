import React from 'react';
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layouts/PublicLayout";
import FeedLayout from "../components/layouts/FeedLayout";
import NoFooterLayout from "../components/layouts/NoFooterLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Feed from "../pages/Feed";
import Discover from "../pages/Discover";
import Trending from "../pages/Trending";
import Industries from "../pages/Industries";
import About from "../pages/About";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import CookiePolicy from "../pages/CookiePolicy";
import TermsOfService from "../pages/TermsOfService";
import StartupDetails from "../pages/StartupDetails";
import SubmitStartup from "../pages/SubmitStartup";
import ProfileDetails from "../pages/ProfileDetails";
import MyStartupDetails from "../pages/MyStartupDetails";
import Help from "../pages/Help";
import FAQ from "../pages/FAQ";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<FeedLayout />}>
                <Route element={<ProtectedRoute />}>
                    <Route path="/feed" element={<Feed />} />
                </Route>
            </Route>

            {/* Pages with Navbar only, no Footer */}
            <Route element={<NoFooterLayout />}>
                <Route element={<ProtectedRoute />}>
                    <Route path="/startup/:id" element={<StartupDetails />} />
                    <Route path="/my-startup" element={<MyStartupDetails />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/industries" element={<Industries />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/help" element={<Help />} />
                </Route>
            </Route>

            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/trending" element={<Trending />} />
                    <Route path="/submit-startup" element={<SubmitStartup />} />
                    <Route path="/profile" element={<ProfileDetails />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
