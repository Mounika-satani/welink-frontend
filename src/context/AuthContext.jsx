
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebase';
import { loginUser } from '../service/authuser';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);       // Firebase user object
    const [dbUser, setDbUser] = useState(null);   // Backend DB user (has photo_url from S3)
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    const idToken = await currentUser.getIdToken();
                    setToken(idToken);

                    // Sync with backend — get DB user with signed S3 photo_url
                    const data = await loginUser(idToken);
                    if (data?.user) {
                        // Normalize: ensure photo_url always has a value (null → undefined fallback handled in UI)
                        setDbUser(data.user);
                    }

                } catch (error) {
                    console.error("Error syncing with backend:", error);
                }
                setShowLoginModal(false);
            } else {
                setToken(null);
                setDbUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    const logout = async () => {
        await signOut(auth);
        setToken(null);
        setUser(null);
        setDbUser(null);
    };

    const triggerLogin = () => {
        setShowLoginModal(true);
    };

    return (
        <AuthContext.Provider value={{ user, dbUser, token, loading, logout, showLoginModal, setShowLoginModal, triggerLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
