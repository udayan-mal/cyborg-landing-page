/* Hand drawn vector cyborg art. Nothing is imported from a 3D pipeline. */

type P = { fill?: string; className?: string };

/* ---------------- face with live augmentation sockets ---------------- */
export function CyborgFace({
  eyes = '#6ee8ff',
  jaw = '#8a7dff',
  core = '#ff4dd2',
  arm = '#ffb547',
}: {
  eyes?: string; jaw?: string; core?: string; arm?: string;
}) {
  return (
    <svg viewBox="-170 -210 340 420" className="h-full w-full">
      <defs>
        <linearGradient id="skull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2a5e" />
          <stop offset="100%" stopColor="#07091a" />
        </linearGradient>
        <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fb0d8" />
          <stop offset="50%" stopColor="#3a4868" />
          <stop offset="100%" stopColor="#1a2452" />
        </linearGradient>
        <linearGradient id="trace" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={eyes} stopOpacity="0.15" />
          <stop offset="50%" stopColor={eyes} stopOpacity="0.95" />
          <stop offset="100%" stopColor={eyes} stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* cranium */}
      <path d="M -132 -158 C -142 -58, -130 62, -88 144 L 88 144 C 130 62, 142 -58, 132 -158 Z"
        fill="url(#skull)" stroke="url(#plate)" strokeWidth="2" />
      <path d="M -112 -128 L 112 -128" stroke="#2a3a66" strokeWidth="0.8" opacity="0.6" />
      <path d="M -98 -98 L -58 -98 L -48 -78 L -88 -78 Z" fill="none" stroke="#3a4868" strokeWidth="0.6" />
      <path d="M 48 -78 L 88 -78 L 98 -98 L 58 -98 Z" fill="none" stroke="#3a4868" strokeWidth="0.6" />

      {/* temple traces */}
      <g stroke="url(#trace)" strokeWidth="0.9" fill="none">
        <path d="M -122 -48 L -100 -48 L -90 -28 L -100 -8 L -90 12 L -100 32" />
        <circle cx="-100" cy="-48" r="2" fill={eyes} />
        <circle cx="-90" cy="-28" r="1.5" fill={eyes} className="blink" />
        <path d="M 122 -48 L 100 -48 L 90 -28 L 100 -8 L 90 12 L 100 32" />
        <circle cx="100" cy="-48" r="2" fill={arm} />
        <circle cx="90" cy="12" r="1.5" fill={arm} className="blink" />
      </g>

      {/* cheek plating */}
      <path d="M -88 -8 L -68 32 L -54 70 L -74 90 L -88 90 Z" fill="url(#plate)" opacity="0.42" stroke="#2a3a66" strokeWidth="0.6" />
      <path d="M 88 -8 L 68 32 L 54 70 L 74 90 L 88 90 Z" fill="url(#plate)" opacity="0.42" stroke="#2a3a66" strokeWidth="0.6" />

      {/* eyes */}
      {[-50, 50].map(x => (
        <g key={x} transform={`translate(${x} -50)`}>
          <ellipse rx="45" ry="27" fill="#0a1230" stroke={eyes} strokeWidth="1.4" />
          <ellipse rx="45" ry="27" fill="none" stroke={eyes} strokeWidth="0.4" strokeDasharray="2 4" opacity="0.4" />
          <line x1="-52" y1="0" x2="-60" y2="0" stroke={eyes} strokeWidth="1.2" />
          <line x1="52" y1="0" x2="60" y2="0" stroke={eyes} strokeWidth="1.2" />
          <line x1="0" y1="-33" x2="0" y2="-41" stroke={eyes} strokeWidth="1.2" />
          <line x1="0" y1="33" x2="0" y2="41" stroke={eyes} strokeWidth="1.2" />
          <circle r="13" fill={eyes} opacity="0.35" />
          <circle r="5" fill="#fff" />
          <line x1="-40" y1="0" x2="40" y2="0" stroke={eyes} strokeWidth="0.6" opacity="0.5" className="sweep" />
        </g>
      ))}

      {/* brows */}
      <path d="M -100 -80 L -10 -90" stroke={eyes} strokeWidth="1.4" fill="none" opacity="0.7" />
      <path d="M 100 -80 L 10 -90" stroke={eyes} strokeWidth="1.4" fill="none" opacity="0.7" />

      {/* nose */}
      <path d="M -8 -10 L 8 -10 L 12 20 L 0 30 L -12 20 Z" fill="url(#plate)" opacity="0.5" stroke="#2a3a66" strokeWidth="0.5" />
      <line x1="0" y1="-10" x2="0" y2="30" stroke={eyes} strokeWidth="0.4" opacity="0.4" />

      {/* vocal grille */}
      <rect x="-27" y="80" width="54" height="15" rx="2" fill="#07091a" stroke={jaw} strokeWidth="1" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={-22 + i * 6} y1="84" x2={-22 + i * 6} y2="91" stroke={jaw} strokeWidth="0.8" opacity={0.55 + (i % 3) * 0.15} />
      ))}

      {/* chin core */}
      <circle cx="0" cy="106" r="3" fill={core} className="pulse" />

      {/* hud text */}
      <g fontFamily="JetBrains Mono" fontSize="6.5" fill={eyes} opacity="0.72">
        <text x="-142" y="-162">SENSOR·7</text>
        <text x="96" y="-162">CPU·A10</text>
        <text x="-142" y="172">LINK·OK</text>
        <text x="118" y="172" textAnchor="end">v4.02</text>
      </g>
      <g stroke={eyes} strokeWidth="1" fill="none">
        <path d="M -152 -182 L -152 -160 M -152 -182 L -130 -182" />
        <path d="M 152 -182 L 152 -160 M 152 -182 L 130 -182" />
        <path d="M -152 182 L -152 160 M -152 182 L -130 182" />
        <path d="M 152 182 L 152 160 M 152 182 L 130 182" />
      </g>
    </svg>
  );
}

/* ---------------- full body chassis ---------------- */
export function CyborgBody({ eyes = '#6ee8ff', core = '#ff4dd2', arm = '#ffb547' }: { eyes?: string; core?: string; arm?: string }) {
  return (
    <svg viewBox="0 0 250 500" className="h-full w-full">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2a5e" />
          <stop offset="100%" stopColor="#07091a" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a4b1cf" />
          <stop offset="50%" stopColor="#3a4868" />
          <stop offset="100%" stopColor="#1a2452" />
        </linearGradient>
      </defs>

      {/* head */}
      <path d="M 96 20 C 80 52, 80 92, 96 122 L 146 122 C 162 92, 162 52, 146 20 Z" fill="url(#body)" stroke="url(#metal)" strokeWidth="1.4" />
      <ellipse cx="112" cy="70" rx="10" ry="6" fill="#0a1230" stroke={eyes} strokeWidth="0.8" />
      <ellipse cx="132" cy="70" rx="10" ry="6" fill="#0a1230" stroke={eyes} strokeWidth="0.8" />
      <circle cx="112" cy="70" r="3" fill={eyes} className="pulse" />
      <circle cx="132" cy="70" r="3" fill={eyes} className="pulse" />
      <rect x="106" y="100" width="32" height="6" fill="#07091a" stroke={eyes} strokeWidth="0.6" />
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i} x1={109 + i * 7} y1="102" x2={109 + i * 7} y2="104" stroke={eyes} strokeWidth="0.4" opacity="0.7" />
      ))}

      {/* neck + torso */}
      <rect x="109" y="122" width="24" height="14" fill="url(#metal)" opacity="0.6" />
      <path d="M 76 136 L 71 244 L 171 244 L 166 136 Z" fill="url(#body)" stroke="url(#metal)" strokeWidth="1.4" />

      {/* chest core */}
      <circle cx="121" cy="184" r="15" fill="#0a1230" stroke={core} strokeWidth="1" />
      <circle cx="121" cy="184" r="6" fill={core} className="pulse" />
      <circle cx="121" cy="184" r="24" fill="none" stroke={core} strokeWidth="0.4" strokeDasharray="2 3" className="spin" />

      {/* panel lines */}
      <line x1="82" y1="152" x2="116" y2="152" stroke={eyes} strokeWidth="0.5" opacity="0.5" />
      <line x1="126" y1="152" x2="160" y2="152" stroke={eyes} strokeWidth="0.5" opacity="0.5" />
      <line x1="82" y1="224" x2="116" y2="224" stroke={eyes} strokeWidth="0.5" opacity="0.5" />
      <line x1="126" y1="224" x2="160" y2="224" stroke={eyes} strokeWidth="0.5" opacity="0.5" />

      {/* arms */}
      <path d="M 71 142 L 46 224 L 36 326" fill="none" stroke="url(#metal)" strokeWidth="15" strokeLinecap="round" />
      <path d="M 171 142 L 196 224 L 206 326" fill="none" stroke="url(#metal)" strokeWidth="15" strokeLinecap="round" />
      <line x1="71" y1="142" x2="36" y2="326" stroke={arm} strokeWidth="0.8" opacity="0.5" />
      <line x1="171" y1="142" x2="206" y2="326" stroke={arm} strokeWidth="0.8" opacity="0.5" />
      <circle cx="46" cy="224" r="6" fill="url(#metal)" stroke={eyes} strokeWidth="0.5" />
      <circle cx="196" cy="224" r="6" fill="url(#metal)" stroke={eyes} strokeWidth="0.5" />
      <circle cx="36" cy="326" r="5" fill="url(#metal)" stroke={eyes} strokeWidth="0.5" />
      <circle cx="206" cy="326" r="5" fill="url(#metal)" stroke={eyes} strokeWidth="0.5" />

      {/* legs */}
      <path d="M 96 244 L 86 476" stroke="url(#metal)" strokeWidth="21" strokeLinecap="round" />
      <path d="M 146 244 L 156 476" stroke="url(#metal)" strokeWidth="21" strokeLinecap="round" />
      <line x1="96" y1="244" x2="86" y2="476" stroke={eyes} strokeWidth="0.6" opacity="0.5" />
      <line x1="146" y1="244" x2="156" y2="476" stroke={eyes} strokeWidth="0.6" opacity="0.5" />
      <circle cx="93" cy="356" r="6" fill="url(#metal)" stroke={eyes} strokeWidth="0.5" />
      <circle cx="149" cy="356" r="6" fill="url(#metal)" stroke={eyes} strokeWidth="0.5" />

      {/* callouts */}
      <g fontFamily="JetBrains Mono" fontSize="6.5" fill={eyes} opacity="0.72">
        <text x="182" y="70">EYE·x2</text>
        <text x="172" y="104">VOX·GR</text>
        <text x="164" y="184">A10·14B</text>
        <text x="158" y="356">JOINT·7</text>
        <text x="46" y="70">SCAN·OK</text>
        <text x="34" y="356">KNEE·OK</text>
      </g>
      <g stroke={eyes} strokeWidth="0.4" strokeDasharray="2 3" opacity="0.4">
        <line x1="22" y1="20" x2="22" y2="476" />
        <line x1="22" y1="20" x2="32" y2="20" />
        <line x1="22" y1="476" x2="32" y2="476" />
      </g>
    </svg>
  );
}

/* ---------------- small parts ---------------- */
export const Ridge = ({ fill = '#1b2440', className = '' }: P) => (
  <svg viewBox="0 0 1440 420" preserveAspectRatio="none" className={`h-full w-full ${className}`}>
    <path fill={fill} d="M0 420V268l96-52 74 40 88-72 96 56 110-96 92 60 104-44 118 84 96-56 110 72 92-48 104 64 110-76v420z" />
  </svg>
);
export const Ridge2 = ({ fill = '#141c33', className = '' }: P) => (
  <svg viewBox="0 0 1440 420" preserveAspectRatio="none" className={`h-full w-full ${className}`}>
    <path fill={fill} d="M0 420V318l120 26 96-78 110 62 122-96 108 74 116-52 128 88 104-64 120 78 116-56v220z" />
  </svg>
);
export const Ridge3 = ({ fill = '#0b1122', className = '' }: P) => (
  <svg viewBox="0 0 1440 420" preserveAspectRatio="none" className={`h-full w-full ${className}`}>
    <path fill={fill} d="M0 420V372l140-44 130 52 128-72 140 68 132-56 140 76 128-64 142 70 130-40v158z" />
  </svg>
);
export const Cityline = ({ fill = '#0a1024', className = '' }: P) => (
  <svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" className={`h-full w-full ${className}`}>
    {Array.from({ length: 30 }).map((_, i) => {
      const x = i * 48 + 6;
      const h = 60 + ((i * 53) % 190);
      const w = 26 + ((i * 17) % 16);
      return (
        <g key={i} fill={fill}>
          <rect x={x} y={300 - h} width={w} height={h} />
          {h > 120 && <rect x={x + w / 2 - 2} y={300 - h - 22} width="4" height="22" />}
        </g>
      );
    })}
  </svg>
);
export const Cloud = ({ fill = '#ffffff', className = '' }: P) => (
  <svg viewBox="0 0 600 200" preserveAspectRatio="none" className={`h-full w-full ${className}`}>
    <path fill={fill} d="M120 190c-46 0-84-30-84-68 0-34 26-62 60-67 8-42 48-73 94-73 30 0 57 14 73 36 12-6 26-10 41-10 45 0 82 30 90 70 2 0 4-1 6-1 45 0 81 30 81 67s-36 66-81 66z" />
  </svg>
);
export const Mist = ({ fill = '#cfe6e4', className = '' }: P) => (
  <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className={`h-full w-full ${className}`}>
    <path fill={fill} d="M0 120c180-60 320 40 520 10s300-90 480-40 280 70 440 30v80H0z" />
  </svg>
);
export const Fish = ({ fill = '#0a2530', className = '' }: P) => (
  <svg viewBox="0 0 120 60" className={`h-full w-full ${className}`}>
    <path fill={fill} d="M6 30c14-20 40-26 62-20 10 3 18 8 24 14 8-8 18-12 28-12-8 8-12 12-12 18 0 6 4 10 12 18-10 0-20-4-28-12-6 6-14 11-24 14-22 6-48 0-62-20z" />
    <circle cx="76" cy="26" r="3" fill="#8ff0ff" />
  </svg>
);
export const Jelly = ({ fill = '#c4b5fd', className = '' }: P) => (
  <svg viewBox="0 0 200 320" className={`h-full w-full ${className}`}>
    <path fill={fill} opacity="0.9" d="M100 20c56 0 92 40 92 88 0 26-12 44-24 56H32c-12-12-24-30-24-56C8 60 44 20 100 20z" />
    <path fill={fill} opacity="0.45" d="M100 20c56 0 92 40 92 88 0 26-12 44-24 56h-24c14-14 24-32 24-56 0-48-30-80-68-88z" />
    {[40, 68, 96, 124, 152].map((x, i) => (
      <path key={x} fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" opacity={0.55 - i * 0.06}
        d={`M${x} 168 q${i % 2 ? 16 : -16} 60 0 120`} />
    ))}
    <ellipse cx="100" cy="108" rx="46" ry="16" fill="#fff" opacity="0.25" />
  </svg>
);
export const Sub = ({ fill = '#0f1626', className = '' }: P) => (
  <svg viewBox="0 0 420 200" className={`h-full w-full ${className}`}>
    <ellipse cx="210" cy="110" rx="150" ry="62" fill={fill} />
    <rect x="150" y="24" width="86" height="52" rx="18" fill={fill} />
    <rect x="176" y="0" width="34" height="30" rx="8" fill={fill} />
    <rect x="360" y="88" width="40" height="44" rx="12" fill={fill} />
    <circle cx="392" cy="110" r="18" fill="#1f2937" />
    <circle cx="392" cy="110" r="7" fill="#7dd3fc" opacity="0.8" />
    <rect x="70" y="80" width="52" height="16" rx="8" fill="#0b1220" />
    <rect x="70" y="124" width="52" height="16" rx="8" fill="#0b1220" />
    <circle cx="120" cy="92" r="16" fill="#0b1220" />
    <circle cx="120" cy="92" r="6" fill="#fde68a" opacity="0.85" />
  </svg>
);
export const Planet = ({ fill = '#3b2f6b', ring = '#a78bfa', className = '' }: P & { ring?: string }) => (
  <svg viewBox="0 0 600 600" className={`h-full w-full ${className}`}>
    <defs>
      <radialGradient id="pg2" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0%" stopColor="#8b7cf6" />
        <stop offset="55%" stopColor={fill} />
        <stop offset="100%" stopColor="#0a0a18" />
      </radialGradient>
    </defs>
    <circle cx="300" cy="300" r="210" fill="url(#pg2)" />
    <g opacity="0.35" fill="#0a0a18">
      <ellipse cx="240" cy="230" rx="70" ry="30" />
      <ellipse cx="330" cy="330" rx="90" ry="26" />
      <ellipse cx="270" cy="400" rx="60" ry="20" />
    </g>
    <g transform="rotate(-18 300 300)">
      <ellipse cx="300" cy="300" rx="290" ry="72" fill="none" stroke={ring} strokeWidth="14" opacity="0.75" />
      <ellipse cx="300" cy="300" rx="290" ry="72" fill="none" stroke="#f0abfc" strokeWidth="3" opacity="0.5" />
    </g>
  </svg>
);
export const Satellite = ({ fill = '#cbd5e1', className = '' }: P) => (
  <svg viewBox="0 0 300 160" className={`h-full w-full ${className}`}>
    <rect x="120" y="52" width="60" height="56" rx="10" fill={fill} />
    <rect x="0" y="40" width="70" height="80" rx="4" fill="#3b82f6" opacity="0.8" />
    <rect x="230" y="40" width="70" height="80" rx="4" fill="#3b82f6" opacity="0.8" />
    <g stroke="#94a3b8" strokeWidth="3">
      <path d="M70 60h50M70 100h50M180 60h50M180 100h50" />
    </g>
    <rect x="146" y="108" width="8" height="30" fill={fill} />
    <circle cx="150" cy="146" r="14" fill="#64748b" />
    <circle cx="150" cy="146" r="5" fill="#fde68a" />
  </svg>
);
export const Rocket = ({ fill = '#e2e8f0', className = '' }: P) => (
  <svg viewBox="0 0 160 320" className={`h-full w-full ${className}`}>
    <path fill={fill} d="M80 8c34 30 52 76 52 122v56H28V130C28 84 46 38 80 8z" />
    <path fill="#f43f5e" d="M28 150L4l24 24zM132 150l24 24-24 24z" />
    <circle cx="80" cy="108" r="18" fill="#0ea5e9" />
    <circle cx="80" cy="108" r="9" fill="#e0f2fe" />
    <path fill="#fb923c" d="M56 190h48l-24 60z" opacity="0.9" />
    <path fill="#fde68a" d="M66 190h28l-14 40z" />
  </svg>
);
