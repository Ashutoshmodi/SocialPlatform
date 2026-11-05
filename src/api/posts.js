import http from './http'

export const postsApi = {
    getFeed(pageNumber = 1, pageSize = 10) {
        return http.get('/posts/feed', { params: { pageNumber, pageSize } }).then((r) => r.data)
    },

    getFollowingFeed(pageNumber = 1, pageSize = 10) {
        return http.get('/posts/feed/following', { params: { pageNumber, pageSize } }).then((r) => r.data)
    },

    getUserPosts(userId, pageNumber = 1, pageSize = 10) {
        return http.get(`/posts/user/${userId}`, { params: { pageNumber, pageSize } }).then((r) => r.data)
    },

    getPost(id) {
        return http.get(`/posts/${id}`).then((r) => r.data)
    },

    createPost(content) {
        return http.post('/posts', { content }).then((r) => r.data)
    },

    deletePost(id) {
        return http.delete(`/posts/${id}`)
    },

    like(id) {
        // Returns { postId, likeCount, likedByMe }
        return http.post(`/posts/${id}/like`).then((r) => r.data)
    },

    unlike(id) {
        return http.delete(`/posts/${id}/like`).then((r) => r.data)
    },
}