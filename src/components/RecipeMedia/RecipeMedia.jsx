import { useState } from 'react';
import { RECIPE_IMAGE_FALLBACK } from '@/data/recipes';

export default function RecipeMedia({
  recipe,
  alt,
  className = '',
  preferVideo = false,
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const rawImage = recipe?.image || recipe?.image_url || recipe?.imageUrl;
  const initialImage = rawImage || RECIPE_IMAGE_FALLBACK;
  const [imageSrc, setImageSrc] = useState(initialImage);
  const shouldRenderVideo = preferVideo && recipe?.video && !videoFailed;

  if (shouldRenderVideo) {
    return (
      <video
        className={className}
        poster={initialImage}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        aria-label={alt || `${recipe.name} recipe video`}
        onError={() => setVideoFailed(true)}
      >
        <source src={recipe.video} type="video/mp4" />
      </video>
    );
  }

  return (
    <img
      className={className}
      src={imageSrc}
      alt={alt || recipe.name}
      loading="lazy"
      onError={() => setImageSrc(RECIPE_IMAGE_FALLBACK)}
    />
  );
}
