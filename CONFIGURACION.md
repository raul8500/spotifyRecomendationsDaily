# 🛠️ Configuración de la Aplicación

## Configuración de Spotify API

### 1. Crear aplicación en Spotify Developer Dashboard

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en "Create App"
4. Completa la información:
   - **App name**: Descubrimiento Musical (o el nombre que prefieras)
   - **App description**: Aplicación para descubrir música por estado de ánimo
   - **Website**: http://127.0.0.1:5173
   - **Redirect URI**: http://127.0.0.1:5173/callback
   - **API/SDKs**: Web API
   - **What are you building?**: Web app

### 2. Configurar Redirect URIs

En la configuración de tu aplicación:

1. Ve a "Edit Settings"
2. En "Redirect URIs", agrega:
   - `http://127.0.0.1:5173/callback` (para desarrollo)
   - `https://tu-dominio.com/callback` (para producción)

### 3. Obtener Client ID

1. En el dashboard de tu aplicación, copia el **Client ID**
2. Este ID se usará en las variables de entorno

## Variables de Entorno

### Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Spotify API Configuration
VITE_SPOTIFY_CLIENT_ID=tu_client_id_aqui
VITE_REDIRECT_URI=http://127.0.0.1:5173/callback

# Development
VITE_APP_TITLE=Descubrimiento Musical
```

### Variables disponibles

- `VITE_SPOTIFY_CLIENT_ID`: Tu Client ID de Spotify (requerido)
- `VITE_REDIRECT_URI`: URL de redirección (opcional, por defecto: http://127.0.0.1:5173/callback)
- `VITE_APP_TITLE`: Título de la aplicación (opcional)

## Permisos de la API

La aplicación solicita los siguientes permisos:

- `user-read-private`: Leer información privada del usuario
- `user-read-email`: Leer email del usuario
- `playlist-read-private`: Leer playlists privadas
- `playlist-read-collaborative`: Leer playlists colaborativas
- `user-top-read`: Leer canciones favoritas
- `user-read-recently-played`: Leer canciones recientes
- `playlist-modify-public`: Crear playlists públicas
- `playlist-modify-private`: Crear playlists privadas

## Desarrollo

### Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://127.0.0.1:5173

### Build para producción

```bash
npm run build
```

### Preview del build

```bash
npm run preview
```

## Solución de Problemas

### Error: "Invalid client_id"

- Verifica que el `VITE_SPOTIFY_CLIENT_ID` esté correctamente configurado
- Asegúrate de que la aplicación esté creada en Spotify Developer Dashboard

### Error: "Invalid redirect_uri"

- Verifica que la URL de redirección esté configurada en Spotify Developer Dashboard
- Asegúrate de que coincida exactamente con `VITE_REDIRECT_URI`

### Error: "Insufficient client scope"

- Verifica que todos los permisos necesarios estén habilitados en la aplicación de Spotify

### La aplicación no carga estilos

- Verifica que Tailwind CSS esté instalado correctamente
- Ejecuta `npm install` para asegurar que todas las dependencias estén instaladas

## Despliegue

### Vercel

1. Conecta tu repositorio a Vercel
2. En las variables de entorno, configura:
   - `VITE_SPOTIFY_CLIENT_ID`
   - `VITE_REDIRECT_URI` (con tu dominio de Vercel)
3. Actualiza la URL de redirección en Spotify Developer Dashboard

### Netlify

1. Conecta tu repositorio a Netlify
2. En las variables de entorno, configura:
   - `VITE_SPOTIFY_CLIENT_ID`
   - `VITE_REDIRECT_URI` (con tu dominio de Netlify)
3. Actualiza la URL de redirección en Spotify Developer Dashboard

## Seguridad

- Nunca compartas tu Client ID en repositorios públicos
- Usa variables de entorno para configuraciones sensibles
- Los tokens de acceso se almacenan localmente en el navegador
- No se almacenan credenciales permanentes en el servidor
