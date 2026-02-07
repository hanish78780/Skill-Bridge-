import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configure axios defaults
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    axios.defaults.withCredentials = true; // For cookies

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const { data } = await axios.get('/auth/me');
            setUser(data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const { data } = await axios.post('/auth/login', { email, password });
            setUser(data);
            if (data.token) {
                // Store token in localStorage if not using cookies only? 
                // Plan said: "I will default to HttpOnly cookies". 
                // But my backend return token in JSON too.
                // For simplicity, let's just stick to axios default (cookie handling) or manual header if needed.
                // But wait, if I use a Bearer token, I need to set header.
                // My backend `authMiddleware` checks `req.headers.authorization`.
                // So I MUST set the header.
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                localStorage.setItem('token', data.token); // Persist for reload
            }
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const { data } = await axios.post('/auth/register', userData);
            setUser(data);
            if (data.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = async () => {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        // window.location.href = '/login'; // Or use router navigate
    };

    // Token restoration moved to initial effect

    const value = {
        user,
        loading,
        error,
        checkUserLoggedIn,
        login,
        register,
        logout,
        setUser, // Expose setter for updates
        refreshUser: checkUserLoggedIn // Alias for re-fetching user data
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
