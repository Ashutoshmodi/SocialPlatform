<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

<template>
    <header class="border-b border-gray-200 bg-white">
        <nav class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <RouterLink to="/" class="text-lg font-bold text-blue-600">SocialPlatform</RouterLink>
            <div class="flex items-center gap-4 text-sm">
                <RouterLink :to="{ name: 'profile', params: { id: auth.user.id } }" class="hover:underline">
                    @{{ auth.user.username }}
                </RouterLink>
                <button @click="logout" class="rounded-md bg-gray-100 px-3 py-1.5 hover:bg-gray-200">
                    Log out
                </button>
            </div>
        </nav>
    </header>
</template>