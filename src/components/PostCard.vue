<script setup>
const props = defineProps({
    post: { type: Object, required: true },
})

function formatDate(value) {
    return new Date(value).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
}
</script>

<template>
    <article class="rounded-lg bg-white p-4 shadow-sm">
        <header class="mb-2 flex items-center justify-between text-sm">
            <RouterLink :to="{ name: 'profile', params: { id: props.post.authorId } }"
                class="font-semibold hover:underline">
                {{ props.post.authorUsername || 'User ' + props.post.authorId.slice(0, 8) }}
            </RouterLink>
            <time class="text-gray-500">{{ formatDate(props.post.createdAt) }}</time>
        </header>
        <p class="whitespace-pre-wrap break-words">{{ props.post.content }}</p>
        <footer class="mt-3 flex gap-4 text-sm text-gray-500">
            <span>♥ {{ props.post.likeCount }}</span>
            <span>💬 {{ props.post.commentCount }}</span>
        </footer>
    </article>
</template>