import React from 'react';

// --- BUTTONS ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const PixelButton: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', className = '', ...props 
}) => {
  const baseStyle = "font-pixel-title font-bold relative active:top-[4px] active:shadow-none transition-all pixel-border tracking-wider";
  
  let colors = "";
  switch(variant) {
    case 'primary': colors = "bg-[#FF69B4] text-white hover:bg-[#ff85c2]"; break; // Hot Pink
    case 'secondary': colors = "bg-white text-black hover:bg-gray-100"; break;
    case 'accent': colors = "bg-[#00FFFF] text-black hover:bg-[#ccffff]"; break; // Cyber Blue
    case 'danger': colors = "bg-[#ff4d4d] text-white"; break;
  }

  let sizes = "";
  switch(size) {
    case 'sm': sizes = "px-2 py-1 text-xs pixel-shadow-sm"; break;
    case 'md': sizes = "px-4 py-2 text-sm pixel-shadow"; break;
    case 'lg': sizes = "px-6 py-4 text-lg pixel-shadow"; break;
  }

  return (
    <button className={`${baseStyle} ${colors} ${sizes} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- CARDS ---

export const PixelCard: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ 
  children, className = '', title 
}) => {
  return (
    <div className={`bg-white pixel-border pixel-shadow p-4 relative ${className}`}>
      {title && (
        <div className="absolute -top-4 left-2 bg-[#CCFF00] pixel-border px-2 py-0.5 z-10">
          <span className="font-pixel-title text-xs font-bold tracking-wide">{title}</span>
        </div>
      )}
      {children}
    </div>
  );
};

// --- PROGRESS BAR ---

export const HealthBar: React.FC<{ max: number, current: number, label?: string, color?: string }> = ({ 
  max, current, label, color = '#FF69B4' 
}) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  return (
    <div className="w-full">
      {label && <div className="font-pixel-text font-bold mb-1 text-sm flex justify-between">
        <span>{label}</span>
        <span>{current}/{max}</span>
      </div>}
      <div className="h-6 w-full pixel-border bg-gray-200 relative p-0.5">
        <div 
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
        {/* Shine effect on bar */}
        <div className="absolute top-1 left-1 right-1 h-1 bg-white opacity-30 pointer-events-none"></div>
      </div>
    </div>
  );
};

// --- AVATAR (Pure CSS/SVG Pixel Art) ---

export const PixelAvatar: React.FC<{ mood?: 'happy' | 'strict' }> = ({ mood = 'happy' }) => {
  return (
    <div className="w-32 h-32 mx-auto relative animate-bounce" style={{ animationDuration: '2s' }}>
       <svg viewBox="0 0 16 16" className="w-full h-full drop-shadow-md">
        {/* Hair Back */}
        <rect x="3" y="2" width="10" height="12" fill="#E8C768" />
        <rect x="2" y="4" width="12" height="10" fill="#E8C768" />
        
        {/* Face */}
        <rect x="4" y="4" width="8" height="7" fill="#FFDAB9" />
        
        {/* Hair Bangs */}
        <rect x="4" y="2" width="8" height="3" fill="#E8C768" />
        <rect x="11" y="4" width="2" height="6" fill="#E8C768" /> 
        <rect x="3" y="4" width="2" height="6" fill="#E8C768" /> 

        {/* Eyes */}
        {mood === 'happy' ? (
           <>
             <rect x="5" y="6" width="2" height="2" fill="#1a1a1a" />
             <rect x="9" y="6" width="2" height="2" fill="#1a1a1a" />
             <rect x="6" y="6" width="1" height="1" fill="#fff" />
             <rect x="10" y="6" width="1" height="1" fill="#fff" />
           </>
        ) : (
           <>
             {/* Angry Eyes */}
             <rect x="5" y="6" width="2" height="1" fill="#1a1a1a" />
             <rect x="9" y="6" width="2" height="1" fill="#1a1a1a" />
           </>
        )}

        {/* Blush */}
        <rect x="4" y="8" width="2" height="1" fill="#FF69B4" opacity="0.6" />
        <rect x="10" y="8" width="2" height="1" fill="#FF69B4" opacity="0.6" />

        {/* Mouth */}
        {mood === 'happy' ? (
            <rect x="7" y="9" width="2" height="1" fill="#D2691E" />
        ) : (
            <rect x="7" y="9" width="2" height="1" fill="#D2691E" />
        )}
        
        {/* Decoration (Bow) */}
        <rect x="10" y="1" width="3" height="2" fill="#FF69B4" />
        <rect x="11" y="2" width="1" height="1" fill="#fff" />
      </svg>
    </div>
  );
}