<script setup>
import { ref, computed } from 'vue'
import { profilesApi } from '@/api/profiles'
import { errorMessage } from '@/utils/errors'

const MAX_BIO = 500;

const props = defineProps({
    profile: { type: Object, required: true },
});

const emit = defineEmits(['saved', 'cancel']);

const bio = ref(props.profile.bio || '');
const pictureUrl = ref(props.profile.profilePictureUrl || '');
const saving = ref(false);
const error = ref('');

const remaining = computed(() => MAX_BIO - bio.value.length);

async function save() {
    if (remaining.value < 0) return
    saving.value = true
    error.value = ''
    try {
        const updated = await profilesApi.updateMe({
            bio: bio.value.trim() || null,
            profilePictureUrl: pictureUrl.value.trim() || null,
        })
        emit('saved', updated)
    } catch (err) {
        error.value = errorMessage(err, 'Could not save profile')
    } finally {
        saving.value = false
    }
};
</script>

<template>
    <form @submit.prevent="save" class="space-y-3">
        <div>
            <label class="mb-1 block text-sm font-medium" for="bio">Bio</label>
            <textarea id="bio" v-model="bio" rows="3"
                class="w-full resize-none rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" />
            <p class="text-right text-xs" :class="remaining < 0 ? 'text-red-600' : 'text-gray-500'">{{ remaining }}</p>
        </div>

        <div>
            <label class="mb-1 block text-sm font-medium" for="pic">Profile picture URL</label>
            <input id="pic" v-model="pictureUrl" type="url" placeholder="https://..."
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
        </div>

        <p v-if="error" class="rounded-md bg-red-50 p-2 text-sm text-red-700">{{ error }}</p>

        <div class="flex justify-end gap-2">
            <button type="button" @click="emit('cancel')" class="rounded-md px-4 py-2 text-sm hover:bg-gray-100">
                Cancel
            </button>
            <button type="submit" :disabled="saving || remaining < 0"
                class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {{ saving ? 'Saving…' : 'Save' }}
            </button>
        </div>
    </form>
</template>