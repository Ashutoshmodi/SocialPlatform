<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { postsApi } from '@/api/posts'
import { errorMessage } from '@/utils/errors'
import UserAvatar from './UserAvatar.vue'

const props = defineProps({
    post: { type: Object, required: true },
})
const emit = defineEmits(['deleted'])

const auth = useAuthStore()
const deleting = ref(false)
const error = ref('')

const isMine = computed(() => props.post.authorId === auth.user?.id)
// Posts from Week 1 have no stored username; fall back to a short id
const authorName = computed(() => props.post.authorUsername || 'user-' + props.post.authorId.slice(0, 8))

function formatDate(value) {
    return new Date(value).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
}

async function remove() {
    if (!confirm('Delete this post?')) return
    deleting.value = true
    error.value = ''
    try {
        await postsApi.deletePost(props.post.id)
        emit('deleted', props.post.id)
    } catch (err) {
        error.value = errorMessage(err, 'Could not delete post')
        deleting.value = false
    }
}
</script>

<template>
    <article class="rounded-lg bg-white p-4 shadow-sm">
        <header class="mb-2 flex items-center gap-3">
            <UserAvatar :name="authorName" size="sm" />
            <div class="min-w-0 flex-1">
                <RouterLink :to="{ name: 'profile', params: { id: post.authorId } }"
                    class="font-semibold hover:underline">
                    @{{ authorName }}
                </RouterLink>
                <p class="text-xs text-gray-500">{{ formatDate(post.createdAt) }}</p>
            </div>
            <button v-if="isMine" @click="remove" :disabled="deleting"
                class="text-sm text-gray-400 hover:text-red-600 disabled:opacity-50">
                {{ deleting ? 'Deleting…' : 'Delete' }}
            </button>
        </header>

        <p class="whitespace-pre-wrap break-words">{{ post.content }}</p>
        <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>

        <footer class="mt-3 flex gap-4 text-sm text-gray-500">
            <span>♥ {{ post.likeCount }}</span>
            <span>💬 {{ post.commentCount }}</span>
        </footer>
    </article>
</template>