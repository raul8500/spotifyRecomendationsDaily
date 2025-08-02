<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900">Descubrimiento Musical</h1>
          </div>

          <!-- User menu -->
          <div class="flex items-center space-x-4">
            <div v-if="user" class="flex items-center space-x-3">
              <img
                v-if="user.images && user.images[0]"
                :src="user.images[0].url"
                :alt="user.display_name"
                class="w-8 h-8 rounded-full"
              />
              <div v-else class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-700">{{ user.display_name }}</span>
            </div>
            <button
              @click="handleLogout"
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>

      <!-- Dashboard content -->
      <div v-else>
        <!-- Playlists tab -->
        <div v-if="activeTab === 'playlists'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">Tus Playlists</h2>
            <button
              @click="fetchUserPlaylists"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Actualizar
            </button>
          </div>

          <div v-if="playlists.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay playlists</h3>
            <p class="mt-1 text-sm text-gray-500">Conecta con Spotify para ver tus playlists.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="playlist in playlists"
              :key="playlist.id"
              class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
            >
              <div class="p-4">
                <img
                  v-if="playlist.images && playlist.images[0]"
                  :src="playlist.images[0].url"
                  :alt="playlist.name"
                  class="w-full h-32 object-cover rounded-lg mb-3"
                />
                <div
                  v-else
                  class="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center"
                >
                  <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"
                    />
                  </svg>
                </div>
                <h3 class="font-semibold text-gray-900 truncate">{{ playlist.name }}</h3>
                <p class="text-sm text-gray-500">{{ playlist.tracks.total }} canciones</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Discovery tab -->
        <div v-if="activeTab === 'discovery'" class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900">Descubrimiento Musical</h2>

          <!-- Mood selection -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">¿Cómo te sientes hoy?</h3>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <button
                v-for="mood in moods"
                :key="mood.id"
                @click="selectMood(mood.id)"
                :class="[
                  'p-4 rounded-lg border-2 transition-all duration-200 text-center',
                  selectedMood === mood.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                ]"
              >
                <div class="text-2xl mb-2">{{ mood.emoji }}</div>
                <div class="font-medium">{{ mood.name }}</div>
              </button>
            </div>
          </div>

          <!-- Recommendations -->
          <div v-if="recommendations.length > 0" class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Recomendaciones para ti</h3>
              <button
                @click="createPlaylist"
                :disabled="isLoading"
                class="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Crear Playlist
              </button>
            </div>

            <div class="space-y-3">
              <div
                v-for="track in recommendations"
                :key="track.id"
                class="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50"
              >
                <img
                  v-if="track.album.images && track.album.images[0]"
                  :src="track.album.images[0].url"
                  :alt="track.name"
                  class="w-12 h-12 rounded-lg"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-900 truncate">{{ track.name }}</h4>
                  <p class="text-sm text-gray-500 truncate">
                    {{ track.artists.map((a: any) => a.name).join(', ') }}
                  </p>
                </div>
                <div class="text-sm text-gray-400">
                  {{ formatDuration(track.duration_ms) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Tracks tab -->
        <div v-if="activeTab === 'top-tracks'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">Tus Canciones Favoritas</h2>
            <div class="flex space-x-2">
              <button
                v-for="range in timeRanges"
                :key="range.value"
                @click="fetchTopTracks(range.value as 'short_term' | 'medium_term' | 'long_term')"
                :class="[
                  'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                  selectedTimeRange === range.value
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                ]"
              >
                {{ range.label }}
              </button>
            </div>
          </div>

          <div v-if="topTracks.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay canciones favoritas</h3>
            <p class="mt-1 text-sm text-gray-500">Escucha música para generar tus favoritas.</p>
          </div>

          <div v-else class="bg-white rounded-lg shadow-sm border">
            <div class="space-y-1">
              <div
                v-for="(track, index) in topTracks"
                :key="track.id"
                class="flex items-center space-x-4 p-4 hover:bg-gray-50"
              >
                <div class="w-8 text-center font-bold text-gray-400">{{ index + 1 }}</div>
                <img
                  v-if="track.album.images && track.album.images[0]"
                  :src="track.album.images[0].url"
                  :alt="track.name"
                  class="w-12 h-12 rounded-lg"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-gray-900 truncate">{{ track.name }}</h4>
                  <p class="text-sm text-gray-500 truncate">
                    {{ track.artists.map((a: any) => a.name).join(', ') }}
                  </p>
                </div>
                <div class="text-sm text-gray-400">
                  {{ formatDuration(track.duration_ms) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSpotifyStore } from '@/stores/spotify'

const router = useRouter()

const spotifyStore = useSpotifyStore()

// Reactive data
const activeTab = ref('playlists')
const selectedMood = ref('')
const selectedTimeRange = ref<'short_term' | 'medium_term' | 'long_term'>('medium_term')

// Computed properties
const user = computed(() => spotifyStore.user)
const playlists = computed(() => spotifyStore.playlists)
const topTracks = computed(() => spotifyStore.topTracks)
const recommendations = computed(() => spotifyStore.recommendations)
const isLoading = computed(() => spotifyStore.isLoading)

// Navigation tabs
const tabs = [
  { id: 'playlists', name: 'Playlists' },
  { id: 'discovery', name: 'Descubrimiento' },
  { id: 'top-tracks', name: 'Favoritas' },
]

// Mood options
const moods = [
  { id: 'feliz', name: 'Feliz', emoji: '😊' },
  { id: 'triste', name: 'Triste', emoji: '😢' },
  { id: 'energético', name: 'Energético', emoji: '⚡' },
  { id: 'relajado', name: 'Relajado', emoji: '😌' },
  { id: 'nostálgico', name: 'Nostálgico', emoji: '🌅' },
]

// Time range options
const timeRanges = [
  { value: 'short_term', label: '4 semanas' },
  { value: 'medium_term', label: '6 meses' },
  { value: 'long_term', label: 'Todo el tiempo' },
]

// Methods
const handleLogout = () => {
  spotifyStore.logout()
  router.push('/')
}

const fetchUserPlaylists = async () => {
  await spotifyStore.fetchUserPlaylists()
}

const fetchTopTracks = async (timeRange: 'short_term' | 'medium_term' | 'long_term') => {
  selectedTimeRange.value = timeRange
  await spotifyStore.fetchTopTracks(timeRange)
}

const selectMood = async (mood: string) => {
  selectedMood.value = mood
  await spotifyStore.getMoodBasedRecommendations(mood)
}

const createPlaylist = async () => {
  if (!selectedMood.value) return

  const moodName = moods.find((m) => m.id === selectedMood.value)?.name || selectedMood.value
  const playlistName = `Descubrimiento - ${moodName}`

  await spotifyStore.createMoodPlaylist(selectedMood.value, playlistName)
}

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Lifecycle
onMounted(async () => {
  spotifyStore.initToken()
  if (spotifyStore.isAuthenticated) {
    await spotifyStore.fetchUserProfile()
    await spotifyStore.fetchUserPlaylists()
    await spotifyStore.fetchTopTracks('medium_term')
  }
})
</script>
