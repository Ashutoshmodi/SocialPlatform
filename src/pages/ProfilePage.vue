<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { profilesApi } from '@/api/profiles'
import { postsApi } from '@/api/posts'
import { errorMessage } from '@/utils/errors'
import UserAvatar from '@/components/UserAvatar.vue'
import FollowButton from '@/components/FollowButton.vue'
import EditProfileForm from '@/components/EditProfileForm.vue'
import PostCard from '@/components/PostCard.vue'

const route = useRoute()

const profile = ref(null)
const loading = ref(false)
const error = ref('')
const editing = ref(false)

const posts = ref([])
const postsPage = ref(1)
const postsTotalPages = ref(1)
const postsLoading = ref(false)
const postsError = ref('')

async function loadProfile(id) {
  loading.value = true
  error.value = ''
  profile.value = null
  editing.value = false
  try {
    profile.value = await profilesApi.get(id)
  } catch (err) {
    error.value = err.response?.status === 404 ? 'User not found' : errorMessage(err)
  } finally {
    loading.value = false
  }
}

async function loadPosts(id, page = 1) {
  postsLoading.value = true
  postsError.value = ''
  try {
    const data = await postsApi.getUserPosts(id, page, 10)
    // If we deleted the last post on a later page, step back a page
    if (data.items.length === 0 && page > 1) return loadPosts(id, page - 1)
    posts.value = data.items
    postsPage.value = data.pageNumber
    postsTotalPages.value = Math.max(1, Math.ceil(data.totalCount / data.pageSize))
  } catch (err) {
    postsError.value = errorMessage(err, 'Could not load posts')
  } finally {
    postsLoading.value = false
  }
}

// Reload everything when navigating from one profile to another
watch(
  () => route.params.id,
  (id) => {
    if (!id) return
    loadProfile(id)
    loadPosts(id)
  },
  { immediate: true }
)

function onFollowChanged(delta) {
  profile.value.followersCount += delta
}

function onSaved(updated) {
  profile.value = updated
  editing.value = false
}

function formatJoined(value) {
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
}
</script>

<template>
  <p v-if="loading" class="text-center text-gray-500">Loading…</p>
  <p v-else-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>

  <template v-else-if="profile">
    <section class="mb-6 rounded-lg bg-white p-6 shadow-sm">
      <div class="flex items-start gap-4">
        <UserAvatar :name="profile.username" :url="profile.profilePictureUrl" size="lg" />

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h1 class="truncate text-xl font-bold">@{{ profile.username }}</h1>
              <p v-if="profile.isMe" class="truncate text-sm text-gray-600">{{ profile.email }}</p>
            </div>

            <FollowButton v-if="!profile.isMe" :user-id="profile.id" v-model:following="profile.isFollowing"
              @changed="onFollowChanged" />
            <button v-else-if="!editing" @click="editing = true"
              class="shrink-0 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium hover:bg-gray-50">
              Edit profile
            </button>
          </div>

          <div class="mt-3 flex gap-4 text-sm">
            <RouterLink :to="{ name: 'follow-list', params: { id: profile.id, kind: 'followers' } }"
              class="hover:underline">
              <strong>{{ profile.followersCount }}</strong>
              <span class="text-gray-600"> Followers</span>
            </RouterLink>
            <RouterLink :to="{ name: 'follow-list', params: { id: profile.id, kind: 'following' } }"
              class="hover:underline">
              <strong>{{ profile.followingCount }}</strong>
              <span class="text-gray-600"> Following</span>
            </RouterLink>
          </div>
          <p class="mt-1 text-xs text-gray-500">Joined {{ formatJoined(profile.createdAt) }}</p>
        </div>
      </div>

      <EditProfileForm v-if="editing" :profile="profile" class="mt-5" @saved="onSaved" @cancel="editing = false" />
      <template v-else>
        <p v-if="profile.bio" class="mt-4 whitespace-pre-wrap">{{ profile.bio }}</p>
        <p v-else class="mt-4 text-sm italic text-gray-400">No bio yet.</p>
      </template>
    </section>

    <h2 class="mb-3 font-semibold">Posts</h2>

    <p v-if="postsError" class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{{ postsError }}</p>
    <p v-else-if="postsLoading && !posts.length" class="text-center text-gray-500">Loading posts…</p>
    <p v-else-if="!posts.length" class="text-center text-gray-500">No posts yet.</p>

    <div v-else class="space-y-4">
      <PostCard v-for="post in posts" :key="post.id" :post="post" @deleted="loadPosts(profile.id, postsPage)" />
    </div>

    <div v-if="postsTotalPages > 1" class="mt-6 flex items-center justify-between text-sm">
      <button :disabled="postsPage <= 1 || postsLoading" @click="loadPosts(profile.id, postsPage - 1)"
        class="rounded-md bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">
        ← Newer
      </button>
      <span class="text-gray-600">Page {{ postsPage }} of {{ postsTotalPages }}</span>
      <button :disabled="postsPage >= postsTotalPages || postsLoading" @click="loadPosts(profile.id, postsPage + 1)"
        class="rounded-md bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">
        Older →
      </button>
    </div>
  </template>
</template>