import http from './http'

// Gateway: /api/users/{everything} -> UserService /api/{everything}
const base = '/users/profiles'

export const profilesApi = {
    me: () => http.get(`${base}/me`).then((r) => r.data),

    updateMe: (data) => http.put(`${base}/me`, data).then((r) => r.data),

    get: (id) => http.get(`${base}/${id}`).then((r) => r.data),

    follow: (id) => http.post(`${base}/${id}/follow`),

    unfollow: (id) => http.delete(`${base}/${id}/follow`),

    followers: (id, pageNumber = 1, pageSize = 20) =>
        http.get(`${base}/${id}/followers`, { params: { pageNumber, pageSize } }).then((r) => r.data),

    following: (id, pageNumber = 1, pageSize = 20) =>
        http.get(`${base}/${id}/following`, { params: { pageNumber, pageSize } }).then((r) => r.data),

    search: (q, limit = 10) =>
        http.get(`${base}/search`, { params: { q, limit } }).then((r) => r.data),
}