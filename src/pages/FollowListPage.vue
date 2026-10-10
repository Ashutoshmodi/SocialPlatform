<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { profilesApi } from '@/api/profiles'
import { errorMessage } from '@/utils/errors'
import UserListItem from '@/components/UserListItem.vue'

const route = useRoute()

const items = ref([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')

const isFollowers = computed(() => route.params.kind === 'followers')
const title = computed(() => (isFollowers.value ? 'Followers' : 'Following'))

async function load(p = 1) {
    loading.value = true
    error.value = ''
    try {
        const fetchList = isFollowers.value ? profilesApi.followers : profilesApi.following
        const data = await fetchList(route.params.id, p, 20)
        items.value = data.items
        page.value = data.pageNumber
        totalPages.value = Math.max(1, Math.ceil(data.totalCount / data.pageSize))
    } catch (err) {
        error.value = errorMessage(err)
    } finally {
        loading.value = false
    }
}

watch(() => [route.params.id, route.params.kind], () => load(1), { immediate: true })
</script>

<template>
    <RouterLink :to="{ name: 'profile', params: { id: route.params.id } }"
        class="text-sm text-blue-600 hover:underline">
        ← Back to profile
    </RouterLink>
    <h1 class="mb-4 mt-2 text-xl font-bold">{{ title }}</h1>

    <p v-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>
    <p v-else-if="loading && !items.length" class="text-center text-gray-500">Loading…</p>
    <p v-else-if="!items.length" class="text-center text-gray-500">
        {{ isFollowers ? 'No followers yet.' : 'Not following anyone yet.' }}
    </p>

    <div v-else class="space-y-2">
        <UserListItem v-for="user in items" :key="user.id" :user="user" />
    </div>

    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between text-sm">
        <button :disabled="page <= 1 || loading" @click="load(page - 1)"
            class="rounded-md bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">
            ← Previous
        </button>
        <span class="text-gray-600">Page {{ page }} of {{ totalPages }}</span>
        <button :disabled="page >= totalPages || loading" @click="load(page + 1)"
            class="rounded-md bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">
            Next →
        </button>
    </div>
</template>