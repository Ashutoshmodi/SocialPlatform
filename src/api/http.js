import axios from 'axios';

const http = axios.create({
    baseURL: '/api', // Base URL for all requests
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // Set a timeout for requests (in milliseconds)
});


http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Add the token to the Authorization header
        }
        return config;
    });

http.interceptors.response.use(
    (response) => response,
    (error) => {
        const sentToken = !!error.config?.headers['Authorization'];
        if (error.response && error.response.status === 401 && sentToken) {
            localStorage.removeItem('token'); // Remove the token from local storage
            localStorage.removeItem('user'); // Remove the user from local storage
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'; // Redirect to the login page
            }
        }
        return Promise.reject(error);
    }
);

export default http;