import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postsApi } from '@/api/posts'
import { errorMessage } from '@/utils/errors'

export const usePostsStore = defineStore('posts', () => {

    const items = ref([]);
    const totalCount = ref(0);
    const pageNumber = ref(1);
    const pageSize = ref(10);
    const isLoading = ref(false);
    const error = ref(null);
    const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

    async function fetchFeed(page = 1) {
        isLoading.value = true;
        error.value = null;
        try {
            const data = await postsApi.getFeed(page, pageSize.value);
            items.value = data.items;
            totalCount.value = data.totalCount;
            pageNumber.value = data.pageNumber;
            pageSize.value = data.pageSize;
        } catch (err) {
            error.value = errorMessage(err);
        } finally {
            isLoading.value = false;
        }
    }

    async function createPost(content) {
        await postsApi.createPost(content);
        await fetchFeed(1); // Refresh the feed after creating a post
    }

    return { items, totalCount, pageNumber, pageSize, isLoading, error, totalPages, fetchFeed, createPost };
})

export default usePostsStore