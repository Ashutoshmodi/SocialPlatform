<script setup>
import { ref, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { errorMessage } from '@/utils/errors'
import CreatePost from '@/components/CreatePost.vue'
import PostCard from '@/components/PostCard.vue'

const posts = usePostsStore()
const error = ref('')

async function load(page) {
  error.value = ''
  try {
    await posts.fetchFeed(page)
    window.scrollTo({ top: 0 })
  } catch (err) {
    error.value = errorMessage(err, 'Could not load the feed')
  }
}

onMounted(() => load(1))
</script>

<template>
  <CreatePost />

  <p v-if="error" class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>

  <p v-if="posts.loading && !posts.items.length" class="text-center text-gray-500">Loading…</p>

  <p v-else-if="!posts.items.length && !error" class="text-center text-gray-500">
    No posts yet. Be the first!
  </p>

  <div v-else class="space-y-4">
    <PostCard v-for="post in posts.items" :key="post.id" :post="post" />
  </div>

  <div v-if="posts.totalPages > 1" class="mt-6 flex items-center justify-between text-sm">
    <button :disabled="posts.pageNumber <= 1 || posts.loading" @click="load(posts.pageNumber - 1)"
      class="rounded-md bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">← Newer</button>
    <span class="text-gray-600">Page {{ posts.pageNumber }} of {{ posts.totalPages }}</span>
    <button :disabled="posts.pageNumber >= posts.totalPages || posts.loading" @click="load(posts.pageNumber + 1)"
      class="rounded-md bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">Older →</button>
  </div>
</template>