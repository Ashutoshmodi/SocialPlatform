<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { errorMessage } from '@/utils/errors'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(route.query.expired ? 'Your session expired. Please log in again.' : '')

async function submit() {
    loading.value = true
    error.value = ''
    try {
        await auth.login(email.value, password.value)
        router.push(route.query.redirect || '/')
    } catch (err) {
        error.value = err.response?.status === 401 ? 'Invalid email or password' : errorMessage(err)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="fixed inset-0 -z-10 bg-[url('/login-bg.jpg')] bg-cover bg-center"></div>
    <div class="mx-auto mt-16 max-w-sm">
        <h1 class="mb-6 text-center text-2xl font-bold">Log in</h1>
        <form @submit.prevent="submit" class="space-y-4 rounded-lg bg-white/90 p-6 shadow-lg backdrop-blur-sm">
            <p v-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>
            <input v-model="email" type="email" required placeholder="Email" autocomplete="email"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
            <input v-model="password" type="password" required placeholder="Password" autocomplete="current-password"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
            <button type="submit" :disabled="loading"
                class="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {{ loading ? 'Logging in…' : 'Log in' }}
            </button>
            <p class="text-center text-sm text-gray-600">
                No account?
                <RouterLink to="/register" class="font-medium text-blue-600 hover:underline">Register</RouterLink>
            </p>
        </form>
    </div>
</template>