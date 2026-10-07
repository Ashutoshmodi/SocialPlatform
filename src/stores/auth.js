import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '../api/user.js'
import { isTokenExpired } from '@/utils/jwt'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null);
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);

    const isAuthenticated = computed(() => !!token.value && !isTokenExpired(token.value));

    function setSession(data) {
        token.value = data.token;
        user.value = { id: data.id, username: data.username };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ id: data.id, username: data.username }));
    }


    async function login(email, password) {
        const response = await userApi.login(email, password);
        setSession(response.data);
    }

    async function register(username, email, password) {
        await userApi.register(username, email, password);
        await login(email, password); // Automatically log in after registration
    }

    function logout() {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    return {
        token,
        user,
        isAuthenticated,
        login,
        register,
        logout
    };
});
