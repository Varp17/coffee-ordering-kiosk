import { forwardRef } from 'react';
import { WHY_CHILLD_ITEMS } from '@/data/whyChilldItems';

export { WHY_CHILLD_ITEMS };

const WhyChilldCup = forwardRef(function WhyChilldCup({
  item,
  className,
  cupWrapClassName,
  cupClassName,
  style,
}, ref) {
  const patternId = `cup-pattern-${item.id}`;
  const vb = item.viewBox.split(' ').map(Number);
  const [vbx, vby, vw, vh] = vb;
  const s = item.patternScale || 1.0;
  
  const px = item.patternX !== undefined ? item.patternX : vbx;
  const py = item.patternY !== undefined ? item.patternY : vby;
  
  const tx = px - (vw * (s - 1)) / 2;
  const ty = py - (vh * (s - 1)) / 2 + (item.patternYShift || 0);
  const rot = item.transform ? item.transform.replace('deg', '') : '';

  return (
    <article
      ref={ref}
      className={className}
      style={{
        '--why-cup-rotation': item.rotation,
        '--why-text-x': item.textXOffset || '0px',
        ...style
      }}
    >
      <div className="why-chilld-cup-inner">
        <div className={cupWrapClassName}>
          <svg
            viewBox={item.viewBox}
            className={cupClassName}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <pattern
                id={patternId}
                patternUnits="userSpaceOnUse"
                width={vw * 4}
                height={vh * 4}
                patternTransform={`translate(${tx}, ${ty}) scale(${s / 4}) ${rot}`}
              >
                <image
                  href={item.image}
                  width={vw * 4}
                  height={vh * 4}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            </defs>
            {/* Render body filled with image */}
            <path d={item.bodyPath} fill={`url(#${patternId})`} />

            {/* Render solid lid cover so background image doesn't leak into lid */}
            <path d={item.lidPath} fill={item.lidColor || '#1F2A44'} />
          </svg>
        </div>
        <div className="why-chilld-cup-text">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </div>
    </article>
  );
});

export default WhyChilldCup;
