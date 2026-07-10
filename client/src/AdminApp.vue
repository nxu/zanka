<script setup>
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth.js'
import LoginView from './views/LoginView.vue'
import AdminShell from './components/AdminShell.vue'

const { isAdmin, checked, checkSession } = useAuth()

onMounted(checkSession)
</script>

<template>
  <div v-if="!checked"></div>
  <LoginView v-else-if="!isAdmin" />
  <AdminShell v-else />
</template>
