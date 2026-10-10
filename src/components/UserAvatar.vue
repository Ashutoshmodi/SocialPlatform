<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    name: { type: String, default: '?' },
    url: { type: String, default: null },
    size: { type: String, default: 'md' }, // sm | md | lg
})

const failed = ref(false)
watch(() => props.url, () => (failed.value = false))

const sizeClass = computed(
    () => ({ sm: 'h-9 w-9 text-sm', md: 'h-11 w-11 text-base', lg: 'h-20 w-20 text-3xl' })[props.size]
)
const initial = computed(() => (props.name || '?').charAt(0).toUpperCase())
</script>

<template>
    <img v-if="url && !failed" :src="url" :alt="name" @error="failed = true" class="shrink-0 rounded-full object-cover"
        :class="sizeClass" />
    <div v-else class="flex shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white"
        :class="sizeClass">
        {{ initial }}
    </div>
</template>