<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function logout() {
    auth.logout()
    router.push({ name: 'login' })
}
</script>

<template>
    <header class="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
        <nav class="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3">
            <RouterLink to="/" class="text-lg font-bold text-blue-600">SocialPlatform</RouterLink>
            <div class="flex items-center gap-4 text-sm">
                <RouterLink to="/" class="hover:underline" exact-active-class="font-semibold">Feed</RouterLink>
                <RouterLink :to="{ name: 'search' }" class="hover:underline" active-class="font-semibold">Search
                </RouterLink>
                <RouterLink :to="{ name: 'profile', params: { id: auth.user.id } }" class="hover:underline"
                    active-class="font-semibold">
                    @{{ auth.user.username }}
                </RouterLink>
                <button @click="logout" class="rounded-md bg-gray-100 px-3 py-1.5 hover:bg-gray-200">Log out</button>
            </div>
        </nav>
    </header>
</template>