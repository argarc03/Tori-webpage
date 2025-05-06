const axios = require('axios');
const fs = require('fs');

const apiKey = process.env.YOUTUBE_API_KEY; // La clave de la API
const channelId = process.env.YOUTUBE_CHANNEL_ID;
const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6`;

axios.get(apiUrl)
  .then(response => {
    const videos = response.data.items.map(item => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.medium.url
    }));

    const videosData = { videos };

    fs.writeFileSync('videos.json', JSON.stringify(videosData, null, 2));
    console.log('videos.json actualizado');
  })
  .catch(error => {
    console.error('Error al obtener los vídeos:', error);
  });
