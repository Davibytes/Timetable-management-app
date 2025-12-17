import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        const response = await authAPI.login(credentials);
        const { token, user } = response.data.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        // Small delay to ensure state updates before navigation
        await new Promise(resolve => setTimeout(resolve, 100));

        return response.data;
    };

    const register = async (userData) => {
        const response = await authAPI.register(userData);
        return response.data;
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};