import React from 'react';

interface VectorProps {
  className?: string;
  active?: boolean;
}

// Estación 1: El Esclavo Rescatado (Fondo oscuro, cadenas rotas, luz divina emergiendo)
export const ChainIllustration: React.FC<VectorProps> = ({ className = '', active = true }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-40 h-40 mx-auto transition-all duration-1000 ${className} ${active ? 'scale-100' : 'scale-95 opacity-80'}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background radial soft aura */}
      <circle cx="100" cy="100" r="75" fill="url(#graceAura)" opacity="0.15" />
      
      {/* Divine light ray */}
      <path
        d="M100 0 L140 200 L60 200 Z"
        fill="url(#lightRay)"
        opacity="0.3"
      />

      <g transform="translate(10, 0)">
        {/* Left Chain half */}
        <rect
          x="30"
          y="105"
          width="40"
          height="15"
          rx="7.5"
          transform="rotate(-25 50 112.5)"
          stroke="#94a3b8"
          strokeWidth="6"
          fill="none"
        />
        <rect
          x="65"
          y="85"
          width="40"
          height="15"
          rx="7.5"
          transform="rotate(-45 85 92.5)"
          stroke="#64748b"
          strokeWidth="6"
          fill="none"
        />
        
        {/* Broken links flying apart */}
        <path
          d="M 104 88 C 108 92, 114 96, 120 95"
          stroke="#d4a359"
          strokeWidth="6"
          strokeLinecap="round"
          className="animate-pulse"
        />
        
        {/* Right Chain half */}
        <rect
          x="125"
          y="110"
          width="40"
          height="15"
          rx="7.5"
          transform="rotate(25 145 117.5)"
          stroke="#94a3b8"
          strokeWidth="6"
          fill="none"
        />
        <rect
          x="95"
          y="125"
          width="40"
          height="15"
          rx="7.5"
          transform="rotate(45 115 132.5)"
          stroke="#64748b"
          strokeWidth="6"
          fill="none"
        />
      </g>

      {/* Sparkling Grace center */}
      <circle cx="100" cy="100" r="12" fill="#e2e8f0" />
      <circle cx="100" cy="100" r="6" fill="#d4a359" />
      
      {/* Star bursts */}
      <path d="M100 75 V125 M75 100 H125" stroke="#d4a359" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M82 82 L118 118 M118 82 L82 118" stroke="#d4a359" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      <defs>
        <radialGradient id="graceAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a359" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lightRay" x1="100" y1="0" x2="100" y2="200">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#fef08a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Estación 2: El Heredero Restaurado (Mesa familiar, hogar iluminado, brazos/corazón abierto)
export const HearthIllustration: React.FC<VectorProps> = ({ className = '', active = true }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-40 h-40 mx-auto transition-all duration-1000 ${className} ${active ? 'scale-100' : 'scale-95 opacity-80'}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Warm ambient radial glow from the house hearth */}
      <circle cx="100" cy="95" r="75" fill="url(#warmGlow)" opacity="0.25" />
      
      {/* Warm rays of acceptance streaming downwards */}
      <g opacity="0.2" className="animate-pulse-slow">
        <path d="M100 25 L50 180 H150 Z" fill="url(#hearthBeams)" />
      </g>

      {/* Styled Open House / Family Table silhouette */}
      {/* House roof outline representing home/adoption */}
      <path
        d="M40 90 L100 45 L160 90"
        stroke="#d4a359"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Welcoming dining table with a golden chalice / light bread */}
      <path
        d="M60 135 H140 M75 135 L70 160 M125 135 L130 160"
        stroke="#e2e8f0"
        strokeWidth="5"
        strokeLinecap="round"
      />
      
      {/* Golden Goblet / Chalice representing covenant inheritance */}
      <path
        d="M93 115 H107 L105 125 H95 Z"
        fill="#d4a359"
        stroke="#fef08a"
        strokeWidth="1"
      />
      <line x1="100" y1="125" x2="100" y2="133" stroke="#d4a359" strokeWidth="2.5" />
      <line x1="96" y1="133" x2="104" y2="133" stroke="#d4a359" strokeWidth="2.5" />
      
      {/* Bread shape beside Chalice */}
      <path
        d="M112 127 C112 122, 124 122, 124 127 Z"
        fill="#a78bfa"
        opacity="0.15"
      />
      <path
        d="M112 127 C112 122, 124 122, 124 127 Z"
        stroke="#9333ea"
        strokeWidth="2.5"
      />
      
      {/* Love/Acceptance glowing symbol floating above the table */}
      <path
        d="M100 78 C94 72, 85 75, 85 82 C85 91, 100 101, 100 101 C100 101, 115 91, 115 82 C115 75, 106 72, 100 78 Z"
        fill="url(#heartGradient)"
        className="animate-bounce"
        style={{ animationDuration: '3s' }}
      />

      <defs>
        <radialGradient id="warmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="60%" stopColor="#d4a359" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hearthBeams" x1="100" y1="20" x2="100" y2="180">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="heartGradient" x1="85" y1="72" x2="115" y2="101">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Estación 3: El Prisionero Liberado (Celda abierta, luz entrando, puerta abierta)
export const PrisonIllustration: React.FC<VectorProps> = ({ className = '', active = true }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-40 h-40 mx-auto transition-all duration-1000 ${className} ${active ? 'scale-100' : 'scale-95 opacity-80'}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dark background inside prison */}
      <circle cx="100" cy="100" r="75" fill="#020617" />
      <circle cx="100" cy="100" r="75" stroke="#334155" strokeWidth="2" opacity="0.3" />

      {/* Radiant golden light beaming out of the opened cell door */}
      <path
        d="M60 150 L160 50 L195 90 L80 160 Z"
        fill="url(#freedomLight)"
        opacity="0.4"
      />
      
      {/* Prison window high above (casting light rays) */}
      <rect x="85" y="45" width="30" height="20" rx="3" fill="#1e293b" />
      <line x1="95" y1="45" x2="95" y2="65" stroke="#475569" strokeWidth="2" />
      <line x1="105" y1="45" x2="105" y2="65" stroke="#475569" strokeWidth="2" />

      {/* Prison Bars - background frame */}
      <rect x="55" y="75" width="90" height="80" rx="4" stroke="#475569" strokeWidth="4" fill="none" />
      
      {/* The door swung WIDE OPEN! */}
      <g transform="translate(-10, 0)">
        {/* Opened door leaf projecting outwards */}
        <rect
          x="35"
          y="75"
          width="40"
          height="80"
          rx="2"
          fill="#1e293b"
          fillOpacity="0.8"
          stroke="#94a3b8"
          strokeWidth="4"
          transform="skewY(-15) translate(10, 20)"
        />
        {/* Door bars */}
        <g transform="skewY(-15) translate(10, 20)">
          <line x1="45" y1="75" x2="45" y2="155" stroke="#475569" strokeWidth="2" />
          <line x1="55" y1="75" x2="55" y2="155" stroke="#475569" strokeWidth="2" />
          <line x1="65" y1="75" x2="65" y2="155" stroke="#475569" strokeWidth="2" />
        </g>
      </g>
      
      {/* Keys representing Christ who has the keys of death and Hades / liberation */}
      <g transform="translate(130, 130) scale(0.8)">
        {/* Two golden keys crossed or lying on the floor outside */}
        <circle cx="20" cy="20" r="8" stroke="#d4a359" strokeWidth="3.5" fill="none" />
        <line x1="20" y1="28" x2="20" y2="50" stroke="#d4a359" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="15" y1="42" x2="25" y2="42" stroke="#d4a359" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="15" y1="48" x2="25" y2="48" stroke="#d4a359" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Small floating specs of light (dust motes in light beams) */}
      <circle cx="110" cy="110" r="2.5" fill="#fef08a" opacity="0.6" className="animate-pulse" />
      <circle cx="130" cy="90" r="1.5" fill="#fef08a" opacity="0.8" />
      <circle cx="140" cy="115" r="3" fill="#fef08a" opacity="0.4" className="animate-pulse" />

      <defs>
        <linearGradient id="freedomLight" x1="60" y1="140" x2="190" y2="60">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#d4a359" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Core Cross icon for central spiritual hope and beauty
export const GraceCrossIllustration: React.FC<VectorProps> = ({ className = '', active = true }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-48 h-48 mx-auto transition-all duration-1000 ${className} ${active ? 'scale-100' : 'scale-95'}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="85" fill="url(#centralDivinity)" opacity="0.25" />
      
      {/* Pulsing rings of Grace */}
      <circle cx="100" cy="90" r="55" stroke="#d4a359" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" className="animate-spin" style={{ animationDuration: '40s' }} />
      <circle cx="100" cy="90" r="45" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.2" />

      {/* Divine light beams radiating */}
      <g opacity="0.15" className="animate-pulse-slow">
        <circle cx="100" cy="90" r="75" fill="url(#goldenSuns)" />
      </g>

      {/* The Cross: slender, elegant, highlighted in gold/amber */}
      {/* Light glow behind cross */}
      <path
        d="M100 25 V155 M65 65 H135"
        stroke="#d4a359"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.2"
      />
      {/* Safe silver/gold main core */}
      <path
        d="M100 30 V150 M70 70 H130"
        stroke="url(#crossGradient)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Beautiful central sparkle */}
      <circle cx="100" cy="70" r="5" fill="#fafafa" />
      <circle cx="100" cy="70" r="10" stroke="#fef08a" strokeWidth="1" opacity="0.75" className="animate-pulse" />

      <defs>
        <radialGradient id="centralDivinity" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4a359" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#312e81" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="goldenSuns" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d4a359" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="crossGradient" x1="100" y1="30" x2="100" y2="150">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#e2e8f0" />
          <stop offset="70%" stopColor="#d4a359" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
    </svg>
  );
};
