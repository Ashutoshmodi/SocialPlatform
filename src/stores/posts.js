import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postsApi } from '@/api/posts'

export const usePostsStore = defineStore('posts', () => {
    const feedType = ref('following') // 'following' | 'everyone'
    const items = ref([])
    const totalCount = ref(0)
    const pageNumber = ref(1)
    const pageSize = ref(10)
    const loading = ref(false)

    const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)))

    let latestRequest = 0

    async function fetchFeed(page = 1) {
        const requestId = ++latestRequest
        const type = feedType.value
        loading.value = true

        try {
            const data =
                type === 'following'
                    ? await postsApi.getFollowingFeed(page, pageSize.value)
                    : await postsApi.getFeed(page, pageSize.value)

            if (requestId !== latestRequest) return // a newer request replaced this one

            items.value = data.items
            totalCount.value = data.totalCount
            pageNumber.value = data.pageNumber
        } catch (err) {
            if (requestId !== latestRequest) return
            items.value = []
            totalCount.value = 0
            throw err
        } finally {
            if (requestId === latestRequest) loading.value = false
        }
    }

    function setFeedType(type) {
        feedType.value = type
        items.value = []
        totalCount.value = 0
        pageNumber.value = 1
    }

    async function createPost(content) {
        await postsApi.createPost(content)
        await fetchFeed(1) // your own posts appear in both feeds
    }

    return {
        feedType, items, totalCount, pageNumber, pageSize, loading, totalPages,
        fetchFeed, setFeedType, createPost,
    }
})