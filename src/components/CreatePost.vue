<script setup>

import { ref, computed } from 'vue'
import { usePostsStore } from '../stores/posts'
import { errorMessage } from '../utils/errors'

const MAX = 500 // matches HasMaxLength(500) in PostDbContext

const posts = usePostsStore()
const content = ref('')
const submitting = ref(false)
const error = ref('')

const remaining = computed(() => MAX - content.value.length)
const canSubmit = computed(() => content.value.trim().length > 0 && remaining.value >= 0 && !submitting.value)

async function submit() {
    if (!canSubmit.value) return
    submitting.value = true
    error.value = ''
    try {
        await posts.createPost(content.value.trim())
        content.value = ''
    } catch (err) {
        error.value = errorMessage(err, 'Could not create post')
    } finally {
        submitting.value = false
    }
}

</script>

<template>
    <form @submit.prevent="submit" class="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <textarea v-model="content" rows="3" placeholder="What's on your mind?"
            class="w-full resize-none rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none" />
        <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
        <div class="mt-2 flex items-center justify-between">
            <span class="text-xs" :class="remaining < 0 ? 'text-red-600' : 'text-gray-500'">{{ remaining }}</span>
            <button type="submit" :disabled="!canSubmit"
                class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {{ submitting ? 'Posting…' : 'Post' }}
            </button>
        </div>
    </form>
</template>