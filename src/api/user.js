import http from './http';

export const userApi = {
    register(username, email, password) {
        return http.post('/users/auth/register', { username, email, password });
    },

    login(email, password) {
        return http.post('/users/auth/login', { email, password });
    },

    getUser(id) {
        return http.get(`/users/auth/${id}`).then(response => response.data);
    },
}
export default userApi;