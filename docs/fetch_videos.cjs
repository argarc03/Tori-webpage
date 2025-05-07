const fetch = require('node-fetch');
const fs = require('fs');

const API_KEY = process.env.YOUTUBE_API_KEY; // La clave de la API
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

async function fetchVideos() {
  try {
    // Llamada a la API para obtener videos del canal
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=30`);
    const data = await response.json();

    // Filtramos los videos para obtener solo aquellos que tienen una duración superior a 60 segundos
    const videoDetailsPromises = data.items.map(async (item) => {
      const videoId = item.id.videoId;
      const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=contentDetails&id=${videoId}`);
      const videoData = await videoResponse.json();
      
      const duration = videoData.items[0].contentDetails.duration;
      const durationInSeconds = parseDuration(duration);  // Función para convertir la duración a segundos

      // Solo devolvemos videos largos (más de 60 segundos)
      if (durationInSeconds > 60) {
        return {
          title: item.snippet.title,
          videoId: videoId,
          thumbnail: item.snippet.thumbnails.high.url,
          duration: durationInSeconds
        };
      }
      return null;
    });

    // Esperamos a que todas las promesas se resuelvan y filtramos los nulos
    const videos = (await Promise.all(videoDetailsPromises)).filter(video => video !== null);

    // Guardamos los videos en un archivo JSON
    fs.writeFileSync('videos.json', JSON.stringify(videos, null, 2));

    console.log('Videos actualizados y guardados correctamente.');

  } catch (error) {
    console.error('Error al obtener los videos:', error);
  }
}

// Función para convertir la duración ISO 8601 a segundos
function parseDuration(duration) {
  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const matches = regex.exec(duration);
  
  const hours = parseInt(matches[1]) || 0;
  const minutes = parseInt(matches[2]) || 0;
  const seconds = parseInt(matches[3]) || 0;
  
  return hours * 3600 + minutes * 60 + seconds;
}

fetchVideos();
