<script setup>
import { ref, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { errorMessage } from '@/utils/errors'
import CreatePost from '@/components/CreatePost.vue'
import PostCard from '@/components/PostCard.vue'

const posts = usePostsStore();
const error = ref('');
const errorStatus = ref(null);

const tabs = [
  { value: 'following', label: 'Following' },
  { value: 'everyone', label: 'Everyone' },
];

async function load(page) {
  error.value = '';
  errorStatus.value = null;
  try {
    await posts.fetchFeed(page);
    window.scrollTo({ top: 0 });
  } catch (err) {
    errorStatus.value = err.response?.status ?? null;
    error.value = errorMessage(err, 'Could not load the feed');
  }
};

function switchTo(type) {
  if (type === posts.feedType) return
  posts.setFeedType(type);
  load(1);
};

onMounted(() => load(1));
</script>

<template>
  <CreatePost />

  <div class="mb-4 flex border-b border-gray-200" role="tablist">
    <button v-for="tab in tabs" :key="tab.value" role="tab" :aria-selected="posts.feedType === tab.value"
      @click="switchTo(tab.value)" class="-mb-px border-b-2 px-4 py-2 text-sm font-medium transition" :class="posts.feedType === tab.value
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-800'
        ">
      {{ tab.label }}
    </button>
  </div>

  <div v-if="error" class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
    <p>{{ error }}</p>
    <button v-if="errorStatus === 503 && posts.feedType === 'following'" @click="switchTo('everyone')"
      class="mt-2 font-medium underline">
      Show everyone's posts instead
    </button>
  </div>

  <p v-else-if="posts.loading && !posts.items.length" class="text-center text-gray-500">Loading…</p>

  <div v-else-if="!posts.items.length" class="py-8 text-center text-gray-500">
    <template v-if="posts.feedType === 'following'">
      <p>Your feed is empty.</p>
      <p class="mt-1 text-sm">
        <RouterLink :to="{ name: 'search' }" class="font-medium text-blue-600 hover:underline">Find people to follow
        </RouterLink>
        or check out the
        <button @click="switchTo('everyone')" class="font-medium text-blue-600 hover:underline">Everyone</button>
        tab.
      </p>
    </template>
    <p v-else>No posts yet. Be the first!</p>
  </div>

  <div v-else class="space-y-4">
    <PostCard v-for="post in posts.items" :key="post.id" :post="post" @deleted="load(posts.pageNumber)" />
  </div>

  <div v-if="posts.totalPages > 1 && !error" class="mt-6 flex items-center justify-between text-sm">
    <button :disabled="posts.pageNumber <= 1 || posts.loading" @click="load(posts.pageNumber - 1)"
      class="rounded-md bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">
      ← Newer
    </button>
    <span class="text-gray-600">Page {{ posts.pageNumber }} of {{ posts.totalPages }}</span>
    <button :disabled="posts.pageNumber >= posts.totalPages || posts.loading" @click="load(posts.pageNumber + 1)"
      class="rounded-md bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">
      Older →
    </button>
  </div>
</template>