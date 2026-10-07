import http from './http'

export const postsApi = {
    getFeed(pageNumber = 1, pageSize = 10) {
        // Returns { items, totalCount, pageNumber, pageSize }
        return http.get('/posts/feed', { params: { pageNumber, pageSize } }).then((r) => r.data)
    },

    getPost(id) {
        return http.get(`/posts/${id}`).then((r) => r.data)
    },

    createPost(content) {
        return http.post('/posts', { content }).then((r) => r.data)
    },
}