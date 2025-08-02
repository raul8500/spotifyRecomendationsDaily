<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-400 via-purple-500 to-pink-500 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
      <!-- Logo y título -->
      <div class="text-center mb-8">
        <div
          class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Descubrimiento Musical</h1>
        <p class="text-gray-600">Descubre nueva música basada en tu estado de ánimo</p>
      </div>

      <!-- Características -->
      <div class="space-y-3 mb-8">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              class="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <span class="text-gray-700">Conecta con tu cuenta de Spotify</span>
        </div>
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              class="w-4 h-4 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <span class="text-gray-700">Descubre música por estado de ánimo</span>
        </div>
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
            <svg
              class="w-4 h-4 text-pink-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <span class="text-gray-700">Crea playlists automáticas</span>
        </div>
      </div>

      <!-- Botón de login -->
      <button
        @click="handleLogin"
        :disabled="isLoading"
        class="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-3"
      >
        <svg v-if="!isLoading" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
          />
        </svg>
        <svg v-else class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
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
        <span>{{ isLoading ? 'Conectando...' : 'Conectar con Spotify' }}</span>
      </button>

      <!-- Información adicional -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Al conectar, aceptas los términos de servicio de Spotify
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSpotifyStore } from '@/stores/spotify'

const spotifyStore = useSpotifyStore()
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  try {
    await spotifyStore.login()
  } catch (error) {
    console.error('Error during login:', error)
    isLoading.value = false
  }
}
</script>
