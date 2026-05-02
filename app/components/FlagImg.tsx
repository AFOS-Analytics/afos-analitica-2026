/**
 * FlagImg, Renders country flag as SVG image.
 * Works on all platforms (Windows, Mac, mobile).
 *
 * Usage: <FlagImg code="br" /> or <FlagImg code="br" size={24} />
 * The code is ISO 3166-1 alpha-2 (lowercase).
 */

interface FlagImgProps {
  code: string;
  size?: number;
  className?: string;
}

export function FlagImg({ code, size = 20, className = '' }: FlagImgProps) {
  const src = `/flags/${code.toLowerCase()}.svg`;
  const h = Math.round(size * 0.67); // 3:2 aspect ratio
  return (
    <img
      src={src}
      alt={code.toUpperCase()}
      width={size}
      height={h}
      className={`rounded-sm object-cover inline-block ${className}`}
      style={{ width: size, height: h }}
    />
  );
}
