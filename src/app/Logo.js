export default function Logo({ className = "w-10 h-10" }) {
  return (
    <div className={`relative flex items-center justify-center ${className} group cursor-pointer`}>
      {/* Dynamic FPS Aura Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-cyan-500/25 to-blue-500/20 rounded-2xl blur-lg group-hover:blur-xl transition duration-500 -z-10" />

      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]"
      >
        <defs>
          <linearGradient id="tmg-frame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="tmg-fps-gauge" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="85%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          <linearGradient id="tmg-monogram" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* Chassis: Modern Gaming GPU / Display Frame */}
        <rect
          x="6"
          y="6"
          width="52"
          height="52"
          rx="14"
          fill="#060913"
          stroke="url(#tmg-frame)"
          strokeWidth="2.5"
        />

        {/* 144+ FPS Tachometer Arc (The universal gamer speed dial) */}
        <path
          d="M 16 46 A 20 20 0 1 1 48 46"
          stroke="url(#tmg-fps-gauge)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="5 3"
        />

        {/* Telemetry Precision Crosshair Marks */}
        <line x1="32" y1="11" x2="32" y2="16" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
        <line x1="11" y1="32" x2="16" y2="32" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
        <line x1="48" y1="32" x2="53" y2="32" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />

        {/* Stylized Monogram / Performance Crest: "TMG" */}
        {/* 'T' Bar */}
        <path
          d="M 22 25 L 42 25"
          stroke="url(#tmg-monogram)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Central Spine */}
        <path
          d="M 32 25 L 32 43"
          stroke="url(#tmg-monogram)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Dynamic 'M' Acceleration Chevron */}
        <path
          d="M 23 35 L 32 42 L 41 35"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Unlocked FPS Max Indicator Dot */}
        <circle cx="46" cy="44" r="2.5" fill="#10b981" className="animate-ping origin-center" />
        <circle cx="46" cy="44" r="2" fill="#10b981" />
      </svg>
    </div>
  );
}