# 🎵 Descubrimiento Musical

Una aplicación web moderna para descubrir música basada en tu estado de ánimo usando la API de Spotify.

## ✨ Características

- 🔐 **Login con Spotify** - Autenticación segura con OAuth 2.0
- 📱 **Interfaz moderna** - Diseño responsive y atractivo
- 🎯 **Descubrimiento por estado de ánimo** - Recomendaciones personalizadas
- 📋 **Gestión de playlists** - Ver y crear playlists automáticas
- ⭐ **Canciones favoritas** - Análisis de tu música más escuchada
- 🎨 **UI/UX moderna** - Interfaz intuitiva con Tailwind CSS

## 🚀 Tecnologías

- **Frontend**: Vue 3 + TypeScript
- **Estado**: Pinia
- **Rutas**: Vue Router
- **Estilos**: Tailwind CSS
- **API**: Spotify Web API
- **Build**: Vite

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de desarrollador de Spotify

## 🛠️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd webDescubrimiento
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar Spotify API**

   a. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   b. Crea una nueva aplicación
   c. Copia el **Client ID**
   d. En la configuración de la app, agrega `http://127.0.0.1:5173/callback` como Redirect URI

4. **Configurar variables de entorno**

   ```bash
   cp env.example .env
   ```

   Edita el archivo `.env` y agrega tu Client ID de Spotify:

   ```
   VITE_SPOTIFY_CLIENT_ID=tu_client_id_aqui
   VITE_REDIRECT_URI=http://127.0.0.1:5173/callback
   ```

5. **Ejecutar en desarrollo**

   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://127.0.0.1:5173
   ```

## 🎯 Funcionalidades

### Login con Spotify

- Autenticación segura usando OAuth 2.0
- Permisos para acceder a playlists, canciones favoritas y crear playlists

### Dashboard Principal

- **Playlists**: Ver todas tus playlists de Spotify
- **Descubrimiento**: Obtener recomendaciones basadas en estado de ánimo
- **Favoritas**: Ver tus canciones más escuchadas por período

### Estados de Ánimo Disponibles

- 😊 **Feliz** - Música alegre y energética
- 😢 **Triste** - Música melancólica y suave
- ⚡ **Energético** - Música rápida y motivadora
- 😌 **Relajado** - Música tranquila y calmante
- 🌅 **Nostálgico** - Música evocadora y sentimental

### Creación de Playlists

- Generación automática de playlists basadas en estado de ánimo
- Integración directa con tu cuenta de Spotify
- Playlists privadas por defecto

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes Vue
│   ├── SpotifyLogin.vue
│   ├── SpotifyCallback.vue
│   └── MusicDashboard.vue
├── stores/             # Stores de Pinia
│   └── spotify.ts
├── router/             # Configuración de rutas
│   └── index.ts
├── assets/             # Recursos estáticos
│   └── main.css
└── App.vue            # Componente principal
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Formateo de código
npm run format
```


## 🔒 Seguridad

- Los tokens de acceso se almacenan en localStorage
- No se almacenan credenciales sensibles
- Uso de OAuth 2.0 para autenticación segura
- Permisos mínimos necesarios para la funcionalidad


## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de la [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
2. Verifica que tu Client ID y Redirect URI estén configurados correctamente
3. Asegúrate de que tu aplicación de Spotify tenga los permisos necesarios

## 🎵 Créditos

- Diseño inspirado en la interfaz de Spotify
- Iconos de [Heroicons](https://heroicons.com/)
- Fuente [Inter](https://rsms.me/inter/) de Google Fonts
