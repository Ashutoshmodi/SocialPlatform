<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { userApi } from '../api/user'
import { errorMessage } from '@/utils/errors'

const route = useRoute()
const auth = useAuthStore()

const user = ref(null)
const loading = ref(false)
const error = ref('')

const isMe = computed(() => user.value?.id === auth.user?.id)

async function load(id) {
  loading.value = true
  error.value = ''
  user.value = null
  try {
    user.value = await userApi.getUser(id)
  } catch (err) {
    error.value = err.response?.status === 404 ? 'User not found' : errorMessage(err)
  } finally {
    loading.value = false
  }
}

// Reload when navigating from one profile to another
watch(() => route.params.id, (id) => id && load(id), { immediate: true })
</script>

<template>
  <p v-if="loading" class="text-center text-gray-500">Loading…</p>
  <p v-else-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>

  <section v-else-if="user" class="rounded-lg bg-white p-6 shadow-sm">
    <div class="flex items-center gap-4">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
        {{ user.username.charAt(0).toUpperCase() }}
      </div>
      <div>
        <h1 class="text-xl font-bold">@{{ user.username }}</h1>
        <p v-if="isMe" class="text-sm text-gray-600">{{ user.email }}</p>
        <p class="text-sm text-gray-500">
          Joined {{ new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </div>
    </div>
    <p v-if="user.bio" class="mt-4">{{ user.bio }}</p>
    <p v-else class="mt-4 text-sm italic text-gray-400">No bio yet.</p>
  </section>
</template>