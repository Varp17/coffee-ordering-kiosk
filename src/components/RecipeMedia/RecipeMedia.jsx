import { useState } from 'react';
import { RECIPE_IMAGE_FALLBACK } from '@/data/recipes';

export default function RecipeMedia({
  recipe,
  alt,
  className = '',
  preferVideo = false,
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageSrc, setImageSrc] = useState(recipe.image || RECIPE_IMAGE_FALLBACK);
  const shouldRenderVideo = preferVideo && recipe.video && !videoFailed;

  if (shouldRenderVideo) {
    return (
      <video
        className={className}
        poster={recipe.image || RECIPE_IMAGE_FALLBACK}
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
