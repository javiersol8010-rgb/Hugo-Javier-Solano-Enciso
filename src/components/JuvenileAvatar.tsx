import React from 'react';

interface JuvenileAvatarProps {
  imagePath: string;
  className?: string;
}

export const JuvenileAvatar: React.FC<JuvenileAvatarProps> = ({ imagePath, className = '' }) => {
  return (
    <div className={`rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 ${className}`}>
      <img
        src={imagePath}
        alt="Avatar juvenil"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
