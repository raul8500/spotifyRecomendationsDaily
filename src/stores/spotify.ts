import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import SpotifyWebApi from 'spotify-web-api-js'

// Configuración de Spotify
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://127.0.0.1:5173/callback'

// Función para generar PKCE
const generateCodeVerifier = (length: number) => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export const useSpotifyStore = defineStore('spotify', () => {
  const spotifyApi = new SpotifyWebApi()
  const accessToken = ref<string | null>(null)
  const user = ref<SpotifyApi.CurrentUsersProfileResponse | null>(null)
  const playlists = ref<SpotifyApi.PlaylistObjectSimplified[]>([])
  const topTracks = ref<SpotifyApi.TrackObjectFull[]>([])
  const recommendations = ref<SpotifyApi.TrackObjectFull[]>([])
  const isLoading = ref(false)

  // Computed properties
  const isAuthenticated = computed(() => !!accessToken.value)
  const hasUserData = computed(() => !!user.value)

  // Inicializar token desde localStorage
  const initToken = () => {
    const token = localStorage.getItem('spotify_access_token')
    if (token) {
      accessToken.value = token
      spotifyApi.setAccessToken(token)
    }
  }

  // Login con Spotify
  const login = async () => {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-top-read',
      'user-read-recently-played',
      'playlist-modify-public',
      'playlist-modify-private',
    ]

    // Generar PKCE
    const codeVerifier = generateCodeVerifier(128)
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    // Guardar code_verifier en localStorage
    localStorage.setItem('spotify_code_verifier', codeVerifier)

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes.join(' '))}&code_challenge=${codeChallenge}&code_challenge_method=S256&show_dialog=true`

    window.location.href = authUrl
  }

  // Manejar callback de autenticación
  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    if (error) {
      console.error('Error en autenticación:', error)
      return false
    }

    if (code) {
      try {
        const codeVerifier = localStorage.getItem('spotify_code_verifier')
        if (!codeVerifier) {
          console.error('No se encontró code_verifier')
          return false
        }

        // Intercambiar código por token
        console.log('Intercambiando código por token...')
        console.log('Code:', code)
        console.log('Code verifier:', codeVerifier)
        console.log('Redirect URI:', REDIRECT_URI)
        console.log('Client ID:', CLIENT_ID)

        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,
            client_id: CLIENT_ID,
          }),
        })

        console.log('Response status:', response.status)
        const data = await response.json()
        console.log('Response data:', data)

        if (data.access_token) {
          accessToken.value = data.access_token
          spotifyApi.setAccessToken(data.access_token)
          localStorage.setItem('spotify_access_token', data.access_token)
          localStorage.removeItem('spotify_code_verifier')
          console.log('Token obtenido exitosamente')
          return true
        } else {
          console.error('Error al obtener token:', data)
          return false
        }
      } catch (error) {
        console.error('Error en el intercambio de código:', error)
        return false
      }
    }
    return false
  }

  // Logout
  const logout = () => {
    accessToken.value = null
    user.value = null
    playlists.value = []
    topTracks.value = []
    recommendations.value = []
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_code_verifier')
    spotifyApi.setAccessToken('')
  }

  // Obtener información del usuario
  const fetchUserProfile = async () => {
    if (!accessToken.value) return

    try {
      isLoading.value = true
      const userData = await spotifyApi.getMe()
      user.value = userData
    } catch (error) {
      console.error('Error fetching user profile:', error)
      logout()
    } finally {
      isLoading.value = false
    }
  }

  // Obtener playlists del usuario
  const fetchUserPlaylists = async () => {
    if (!accessToken.value) return

    try {
      isLoading.value = true
      const response = await spotifyApi.getUserPlaylists()
      playlists.value = response.items
    } catch (error) {
      console.error('Error fetching playlists:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Obtener canciones favoritas
  const fetchTopTracks = async (
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  ) => {
    if (!accessToken.value) return

    try {
      isLoading.value = true
      const response = await spotifyApi.getMyTopTracks({ limit: 20, time_range: timeRange })
      // Los tracks ya vienen como TrackObjectFull desde getMyTopTracks
      topTracks.value = response.items
    } catch (error) {
      console.error('Error fetching top tracks:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Forzar nuevo login para obtener scopes completos
  const forceNewLogin = () => {
    logout()
    login()
  }

  // Funciones auxiliares para variaciones dinámicas
  const getRandomYear = (): string => {
    const years = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']
    return years[Math.floor(Math.random() * years.length)]
  }

  const getRandomGenre = (): string => {
    const genres = [
      'pop',
      'rock',
      'electronic',
      'hip hop',
      'r&b',
      'indie',
      'alternative',
      'folk',
      'jazz',
      'classical',
    ]
    return genres[Math.floor(Math.random() * genres.length)]
  }

  // Obtener recomendaciones basadas en estado de ánimo (usando búsqueda como alternativa)
  const getMoodBasedRecommendations = async (mood: string, limit: number = 20) => {
    if (!accessToken.value) return

    try {
      isLoading.value = true

      // Si no tenemos canciones favoritas, obtenerlas primero
      if (topTracks.value.length === 0) {
        await fetchTopTracks()
      }

      // Verificar que tenemos canciones para usar como base
      if (topTracks.value.length === 0) {
        console.error('No hay canciones favoritas disponibles para recomendaciones')
        return
      }

      // Mapear estados de ánimo a términos de búsqueda
      const moodSearchTerms = getMoodSearchTerms(mood)

      // Obtener recomendaciones usando búsqueda con variaciones
      const searchPromises = moodSearchTerms.map(async (searchTerm: string) => {
        // Agregar variaciones de búsqueda
        const variations = [
          searchTerm,
          `${searchTerm} ${getRandomYear()}`,
          `${searchTerm} ${getRandomGenre()}`,
        ]

        const variationPromises = variations.map(async (variation) => {
          const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(variation)}&type=track&limit=${Math.ceil(limit / (moodSearchTerms.length * 3))}&market=MX`,
            {
              headers: {
                Authorization: `Bearer ${accessToken.value}`,
              },
            },
          )

          if (response.ok) {
            const data = await response.json()
            return data.tracks?.items || []
          }
          return []
        })

        const variationResults = await Promise.all(variationPromises)
        return variationResults.flat()
      })

      const searchResults = await Promise.all(searchPromises)
      const allTracks = searchResults.flat()

      // Filtrar tracks duplicados y mezclar
      const uniqueTracks = allTracks.filter(
        (track: SpotifyApi.TrackObjectFull, index: number, self: SpotifyApi.TrackObjectFull[]) =>
          index === self.findIndex((t: SpotifyApi.TrackObjectFull) => t.id === track.id),
      )

      recommendations.value = uniqueTracks.slice(0, limit)
      console.log('Recommendations received:', recommendations.value.length)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Términos de búsqueda para estados de ánimo (con variaciones dinámicas)
  const getMoodSearchTerms = (mood: string): string[] => {
    const baseTerms: Record<string, string[]> = {
      feliz: [
        'happy music',
        'upbeat songs',
        'energetic music',
        'feel good songs',
        'positive vibes',
        'joyful music',
      ],
      triste: [
        'sad music',
        'melancholic songs',
        'emotional music',
        'slow songs',
        'heartbreak songs',
        'blue music',
      ],
      energético: [
        'energetic music',
        'high energy songs',
        'upbeat music',
        'dance music',
        'pump up songs',
        'motivational music',
      ],
      relajado: [
        'relaxing music',
        'calm songs',
        'chill music',
        'peaceful music',
        'ambient music',
        'soothing songs',
      ],
      nostálgico: [
        'nostalgic music',
        'retro songs',
        'vintage music',
        'classic songs',
        'throwback music',
        'oldies',
      ],
    }

    const terms = baseTerms[mood] || baseTerms.feliz

    // Agregar variaciones dinámicas basadas en la hora del día
    const hour = new Date().getHours()
    const timeBasedTerms: string[] = []

    if (hour >= 6 && hour < 12) {
      timeBasedTerms.push('morning music', 'wake up songs')
    } else if (hour >= 12 && hour < 18) {
      timeBasedTerms.push('afternoon vibes', 'daytime music')
    } else if (hour >= 18 && hour < 22) {
      timeBasedTerms.push('evening music', 'sunset vibes')
    } else {
      timeBasedTerms.push('night music', 'late night vibes')
    }

    // Mezclar términos base con términos basados en tiempo
    const allTerms = [...terms, ...timeBasedTerms]

    // Seleccionar aleatoriamente 4 términos para variar las búsquedas
    const shuffled = allTerms.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4)
  }

  // Crear playlist automática
  const createMoodPlaylist = async (mood: string, name: string) => {
    if (!accessToken.value || !user.value) return

    try {
      isLoading.value = true

      // Obtener recomendaciones
      await getMoodBasedRecommendations(mood, 30)

      if (recommendations.value.length === 0) return

      // Crear playlist
      const playlist = await spotifyApi.createPlaylist(name, {
        description: `Playlist automática para estado de ánimo: ${mood}`,
        public: false,
      })

      // Agregar canciones a la playlist
      const trackUris = recommendations.value.map((track) => track.uri)
      await spotifyApi.addTracksToPlaylist(playlist.id, trackUris)

      // Actualizar playlists
      await fetchUserPlaylists()

      return playlist
    } catch (error) {
      console.error('Error creating playlist:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    accessToken,
    user,
    playlists,
    topTracks,
    recommendations,
    isLoading,

    // Computed
    isAuthenticated,
    hasUserData,

    // Methods
    initToken,
    login,
    handleCallback,
    logout,
    forceNewLogin,
    fetchUserProfile,
    fetchUserPlaylists,
    fetchTopTracks,
    getMoodBasedRecommendations,
    createMoodPlaylist,
  }
})
