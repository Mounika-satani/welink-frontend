
import React, { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading, triggerLogin } = useAuth();
    const location = useLocation();
    const alertShown = useRef(false);

    useEffect(() => {
        if (!loading && !user && !alertShown.current) {
            alert("This content is protected. Please login to continue.");
            triggerLogin();
            alertShown.current = true; // Prevent double alerts
        }
    }, [loading, user, triggerLogin]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading...</div>;
    }

    if (!user) {
        // Redirect to home, but keep the modal open (handled by triggerLogin)
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
