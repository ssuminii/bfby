const SEGMENTS = [
  { id: "error", color: "#DD4821" },
  { id: "caution", color: "#DEB040" },
  { id: "info", color: "#558EEA" },
];

const CX = 100;
const CY = 100;
const R = 71;
const STROKE = 50;
const GAP = 5;
const DEPTH = 4;
const NEEDLE_LENGTH = 60;
const NEEDLE_HALF = 11;
const HUB_OUTER = 22;
const HUB_INNER = 14;

const lighten = (color, amount) =>
  `color-mix(in srgb, ${color} ${100 - amount}%, white)`;
const darken = (color, amount) =>
  `color-mix(in srgb, ${color} ${100 - amount}%, black)`;

const polar = (r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
};

const arcPath = (from, to) => {
  const [x1, y1] = polar(R, from);
  const [x2, y2] = polar(R, to);
  return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`;
};

export default function GaugeChart({ value = 0, className = "" }) {
  const score = Math.min(100, Math.max(0, value));
  const span = (180 - GAP * (SEGMENTS.length - 1)) / SEGMENTS.length;
  const arcs = SEGMENTS.map((segment, i) => {
    const from = 180 + i * (span + GAP);
    return { ...segment, d: arcPath(from, from + span) };
  });

  return (
    <svg
      viewBox="0 0 200 126"
      className={`w-[200px] ${className}`}
      role="img"
      aria-label={`게이지 ${score}점`}
    >
      <defs>
        {arcs.map(({ id, color }) => (
          <linearGradient
            key={id}
            id={`gauge-face-${id}`}
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={CY - 96}
            x2={0}
            y2={CY}
          >
            <stop offset="0%" stopColor={lighten(color, 22)} />
            <stop offset="55%" stopColor={color} />
            <stop offset="100%" stopColor={darken(color, 10)} />
          </linearGradient>
        ))}

        <linearGradient
          id="gauge-needle"
          gradientUnits="userSpaceOnUse"
          x1={CX - NEEDLE_HALF}
          y1={CY}
          x2={CX + NEEDLE_HALF}
          y2={CY}
        >
          <stop offset="0%" stopColor={darken("var(--color-blue-500)", 12)} />
          <stop
            offset="100%"
            stopColor={lighten("var(--color-blue-500)", 35)}
          />
        </linearGradient>

        <radialGradient id="gauge-hub" cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor={lighten("var(--color-blue-500)", 30)} />
          <stop offset="100%" stopColor={darken("var(--color-blue-500)", 18)} />
        </radialGradient>

        <radialGradient id="gauge-hub-inner" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="var(--color-gray-100)" />
        </radialGradient>

        {/* stroke 는 objectBoundingBox 계산에서 빠지므로 필터 영역을 뷰박스 전체로 고정 */}
        <filter
          id="gauge-shadow"
          filterUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="200"
          height="126"
        >
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter="url(#gauge-shadow)">
        {arcs.map(({ id, color, d }) => (
          <path
            key={`depth-${id}`}
            d={d}
            transform={`translate(0 ${DEPTH})`}
            stroke={darken(color, 32)}
            strokeWidth={STROKE}
            fill="none"
          />
        ))}

        {arcs.map(({ id, d }) => (
          <path
            key={`face-${id}`}
            d={d}
            stroke={`url(#gauge-face-${id})`}
            strokeWidth={STROKE}
            fill="none"
          />
        ))}
      </g>

      <g
        className="transition-transform duration-700 ease-out"
        style={{
          transform: `rotate(${-90 + score * 1.8}deg)`,
          transformOrigin: `${CX}px ${CY}px`,
        }}
      >
        <path
          d={`M ${CX - NEEDLE_HALF} ${CY} L ${CX} ${CY - NEEDLE_LENGTH} L ${CX + NEEDLE_HALF} ${CY} Z`}
          fill="url(#gauge-needle)"
          stroke="url(#gauge-needle)"
          strokeWidth={6}
          strokeLinejoin="round"
          filter="url(#gauge-shadow)"
        />
      </g>

      <circle
        cx={CX}
        cy={CY}
        r={HUB_OUTER}
        fill="url(#gauge-hub)"
        filter="url(#gauge-shadow)"
      />
      <circle cx={CX} cy={CY} r={HUB_INNER} fill="url(#gauge-hub-inner)" />
    </svg>
  );
}
