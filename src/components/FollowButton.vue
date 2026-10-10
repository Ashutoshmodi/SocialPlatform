<script setup>
import { ref } from 'vue'
import { profilesApi } from '@/api/profiles'
import { errorMessage } from '@/utils/errors'

const props = defineProps({
    userId: { type: String, required: true },
})

const following = defineModel('following', { type: Boolean, default: false })
const emit = defineEmits(['changed']) // +1 / -1 for the follower count

const busy = ref(false)
const hover = ref(false)
const error = ref('')

async function toggle() {
    if (busy.value) return
    busy.value = true
    error.value = ''

    const wasFollowing = following.value
    following.value = !wasFollowing // optimistic
    emit('changed', wasFollowing ? -1 : 1)

    try {
        if (wasFollowing) await profilesApi.unfollow(props.userId)
        else await profilesApi.follow(props.userId)
    } catch (err) {
        following.value = wasFollowing // roll back
        emit('changed', wasFollowing ? 1 : -1)
        error.value = errorMessage(err, 'Could not update follow')
    } finally {
        busy.value = false
    }
}
</script>

<template>
    <div class="flex flex-col items-end">
        <button @click="toggle" @mouseenter="hover = true" @mouseleave="hover = false" :disabled="busy"
            class="min-w-28 rounded-full px-4 py-1.5 text-sm font-medium transition disabled:opacity-60" :class="following
                ? hover
                    ? 'border border-red-300 bg-red-50 text-red-700'
                    : 'border border-gray-300 bg-white text-gray-900'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                ">
            {{ following ? (hover ? 'Unfollow' : 'Following') : 'Follow' }}
        </button>
        <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
    </div>
</template>