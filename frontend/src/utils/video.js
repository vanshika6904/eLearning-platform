export const getYoutubeVideoId = (url = "") => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

export const toYoutubeEmbedUrl = (url = "", autoplay = false) => {
  const id = getYoutubeVideoId(url);
  if (!id) return null;
  const autoplayParam = autoplay ? "?autoplay=1&rel=0" : "?rel=0";
  return `https://www.youtube.com/embed/${id}${autoplayParam}`;
};

export const getVideoThumbnail = (videoUrl = "", fallback = "") => {
  const youtubeId = getYoutubeVideoId(videoUrl);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  return fallback;
};
