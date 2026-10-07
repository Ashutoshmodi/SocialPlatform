<script setup>
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <NavBar v-if="authStore.isAuthenticated" />
  <main class="mx-auto max-w-2xl px-4 py-8">
    <router-view />
  </main>
</template>
