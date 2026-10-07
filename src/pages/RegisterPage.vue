<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { errorMessage } from '@/utils/errors'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
    if (password.value.length < 8) {
        error.value = 'Password must be at least 8 characters'
        return
    }
    loading.value = true
    error.value = ''
    try {
        await auth.register(username.value.trim(), email.value.trim(), password.value)
        router.push('/')
    } catch (err) {
        error.value = errorMessage(err, 'Registration failed')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="mx-auto mt-16 max-w-sm">
        <h1 class="mb-6 text-center text-2xl font-bold">Create account</h1>
        <form @submit.prevent="submit" class="space-y-4 rounded-lg bg-white p-6 shadow-sm">
            <p v-if="error" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>
            <input v-model="username" required maxlength="50" placeholder="Username" autocomplete="username"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
            <input v-model="email" type="email" required maxlength="100" placeholder="Email" autocomplete="email"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
            <input v-model="password" type="password" required placeholder="Password (min 8 characters)"
                autocomplete="new-password"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
            <button type="submit" :disabled="loading"
                class="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {{ loading ? 'Creating account…' : 'Register' }}
            </button>
            <p class="text-center text-sm text-gray-600">
                Already have an account?
                <RouterLink to="/login" class="font-medium text-blue-600 hover:underline">Log in</RouterLink>
            </p>
        </form>
    </div>
</template>