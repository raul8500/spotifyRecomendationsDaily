<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-400 via-purple-500 to-pink-500 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
      <!-- Loading state -->
      <div v-if="isProcessing" class="space-y-6">
        <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Conectando con Spotify</h2>
          <p class="text-gray-600">Estamos configurando tu cuenta...</p>
        </div>
      </div>

      <!-- Success state -->
      <div v-else-if="isSuccess" class="space-y-6">
        <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">¡Conectado exitosamente!</h2>
          <p class="text-gray-600">Tu cuenta de Spotify ha sido conectada correctamente.</p>
        </div>
        <button
          @click="goToDashboard"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Ir al Dashboard
        </button>
      </div>

      <!-- Error state -->
      <div v-else class="space-y-6">
        <div class="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Error de conexión</h2>
          <p class="text-gray-600">{{ errorMessage }}</p>
        </div>
        <div class="space-y-3">
          <button
            @click="retryLogin"
            class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Intentar de nuevo
          </button>
          <button
            @click="goToLogin"
            class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Volver al login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSpotifyStore } from '@/stores/spotify'

const router = useRouter()
const spotifyStore = useSpotifyStore()

const isProcessing = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

const handleCallback = async () => {
  try {
    const success = await spotifyStore.handleCallback()

    if (success) {
      // Obtener datos del usuario
      await spotifyStore.fetchUserProfile()
      await spotifyStore.fetchUserPlaylists()
      await spotifyStore.fetchTopTracks()

      isSuccess.value = true
    } else {
      errorMessage.value = 'No se pudo obtener el token de acceso. Intenta de nuevo.'
    }
  } catch (error) {
    console.error('Error during callback:', error)
    errorMessage.value = 'Ocurrió un error durante la conexión. Intenta de nuevo.'
  } finally {
    isProcessing.value = false
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToLogin = () => {
  router.push('/')
}

const retryLogin = async () => {
  isProcessing.value = true
  isSuccess.value = false
  errorMessage.value = ''
  await spotifyStore.login()
}

onMounted(() => {
  handleCallback()
})
</script>
