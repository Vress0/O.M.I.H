import React from 'react';

interface Props {
  children: React.ReactNode;
  image?: string; // path under public, e.g. '/cherry-border.png'
  className?: string;
  imgOpacity?: number;
  imgObjectFit?: 'cover' | 'contain';
}

export const DecoratedWrapper: React.FC<Props> = ({ children, image = '/cherry-border.png', className = '', imgOpacity = 0.12, imgObjectFit = 'cover' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {image && (
        // decorative image placed absolutely
        <img
          src={image}
          alt="decorative"
          className={`pointer-events-none absolute inset-0 w-full h-full ${imgObjectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
          style={{ opacity: imgOpacity }}
        />
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DecoratedWrapper;
