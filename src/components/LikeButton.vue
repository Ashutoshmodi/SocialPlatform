<script setup>
import { ref } from 'vue'
import { postsApi } from '@/api/posts'
import { errorMessage } from '@/utils/errors'

const props = defineProps({
    postId: { type: String, required: true },
})
const liked = defineModel('liked', { type: Boolean, default: false })
const count = defineModel('count', { type: Number, default: 0 })

const busy = ref(false)
const error = ref('')

async function toggle() {
    if (busy.value) return
    busy.value = true
    error.value = ''

    const before = { liked: liked.value, count: count.value }

    // Optimistic update
    liked.value = !before.liked
    count.value = before.count + (before.liked ? -1 : 1)

    try {
        const result = before.liked ? await postsApi.unlike(props.postId) : await postsApi.like(props.postId)
        // The server is the source of truth
        liked.value = result.likedByMe
        count.value = result.likeCount
    } catch (err) {
        liked.value = before.liked
        count.value = before.count
        error.value = errorMessage(err, 'Could not update like')
    } finally {
        busy.value = false
    }
}
</script>

<template>
    <span class="inline-flex items-center gap-2">
        <button @click="toggle" :disabled="busy" :aria-pressed="liked" :aria-label="liked ? 'Unlike' : 'Like'"
            class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition disabled:opacity-60"
            :class="liked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'">
            <span class="text-base leading-none">{{ liked ? '♥' : '♡' }}</span>
            <span>{{ count }}</span>
        </button>
        <span v-if="error" class="text-xs text-red-600">{{ error }}</span>
    </span>
</template>