<script setup>
import UserAvatar from './UserAvatar.vue'

defineProps({
    user: { type: Object, required: true },
})
</script>

<template>
    <RouterLink :to="{ name: 'profile', params: { id: user.id } }"
        class="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm hover:bg-gray-50">
        <UserAvatar :name="user.username" :url="user.profilePictureUrl" />
        <div class="min-w-0">
            <p class="font-semibold">@{{ user.username }}</p>
            <p v-if="user.bio" class="truncate text-sm text-gray-600">{{ user.bio }}</p>
        </div>
    </RouterLink>
</template>