<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { profilesApi } from '@/api/profiles'
import { errorMessage } from '@/utils/errors'
import UserListItem from '@/components/UserListItem.vue'

const route = useRoute()
const router = useRouter()

const q = ref(typeof route.query.q === 'string' ? route.query.q : '')
const results = ref([])
const loading = ref(false)
const searched = ref(false)
const error = ref('')

let timer = null
let latestRequest = 0

async function run(term) {
    const requestId = ++latestRequest
    term = term.trim()

    if (term.length < 2) {
        results.value = []
        searched.value = false
        loading.value = false
        return
    }

    loading.value = true
    error.value = ''
    try {
        const data = await profilesApi.search(term)
        if (requestId === latestRequest) {
            results.value = data
            searched.value = true
        }
    } catch (err) {
        if (requestId === latestRequest) error.value = errorMessage(err, 'Search failed')
    } finally {
        if (requestId === latestRequest) loading.value = false
    }
}

watch(
    q,
    (term) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            router.replace({ query: term ? { q: term } : {} }) // keeps the search in the URL
            run(term)
        }, 300)
    },
    { immediate: true }
)

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
    <h1 class="mb-4 text-xl font-bold">Find people</h1>

    <input v-model="q" type="search" autofocus placeholder="Search by username (at least 2 characters)"
        class="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />

    <p v-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>
    <p v-else-if="loading" class="text-center text-gray-500">Searching…</p>
    <p v-else-if="searched && !results.length" class="text-center text-gray-500">No users found.</p>

    <div class="space-y-2">
        <UserListItem v-for="user in results" :key="user.id" :user="user" />
    </div>
</template>