const SEGMENTS = [
  { id: "error", color: "var(--color-report-gauge-error)", to: 30 },
  { id: "caution", color: "var(--color-report-gauge-caution)", to: 70 },
  { id: "info", color: "var(--color-report-gauge-info)", to: 100 },
];

const CX = 100;
const CY = 99;
const OUTER = 96;
const INNER = 42;
const CORNER = 3;
const GAP = 1.5;
const DEPTH = 4;
const NEEDLE_LENGTH = 60;
const NEEDLE_HALF = 11;
const HUB_OUTER = 22;
const HUB_INNER = 14;

const lighten = (color, amount) =>
  `color-mix(in srgb, ${color} ${100 - amount}%, white)`;
const darken = (color, amount) =>
  `color-mix(in srgb, ${color} ${100 - amount}%, black)`;

const toDeg = (rad) => (rad * 180) / Math.PI;

const angleOf = (score) => 180 + score * 1.8;

const polar = (r, deg) => {
  const rad = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
};

const wedgePath = (from, to) => {
  const ro = OUTER - CORNER;
  const ri = INNER + CORNER;
  const insetO = toDeg(CORNER / ro);
  const insetI = toDeg(CORNER / ri);
  const [x1, y1] = polar(ro, from + insetO);
  const [x2, y2] = polar(ro, to - insetO);
  const [x3, y3] = polar(ri, to - insetI);
  const [x4, y4] = polar(ri, from + insetI);
  return `M ${x1} ${y1} A ${ro} ${ro} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${ri} ${ri} 0 0 0 ${x4} ${y4} Z`;
};

export default function GaugeChart({ value = 0, className = "" }) {
  const score = Math.min(100, Math.max(0, value));
  const arcs = SEGMENTS.map((segment, i) => {
    const from =
      angleOf(i === 0 ? 0 : SEGMENTS[i - 1].to) + (i === 0 ? 0 : GAP / 2);
    const last = i === SEGMENTS.length - 1;
    const to = angleOf(segment.to) - (last ? 0 : GAP / 2);
    return { ...segment, d: wedgePath(from, to) };
  });

  return (
    <svg
      viewBox="0 0 200 126"
      className={`w-50 ${className}`}
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
            y1={CY - OUTER}
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
      </defs>

      {/* 아래로 밀어 그린 어두운 복제본 = 입체 옆면 */}
      {arcs.map(({ id, color, d }) => (
        <path
          key={`depth-${id}`}
          d={d}
          transform={`translate(0 ${DEPTH})`}
          fill={darken(color, 32)}
          stroke={darken(color, 32)}
          strokeWidth={CORNER * 2}
          strokeLinejoin="round"
        />
      ))}

      {arcs.map(({ id, d }) => (
        <path
          key={`face-${id}`}
          d={d}
          fill={`url(#gauge-face-${id})`}
          stroke={`url(#gauge-face-${id})`}
          strokeWidth={CORNER * 2}
          strokeLinejoin="round"
        />
      ))}

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
        />
      </g>

      <circle cx={CX} cy={CY} r={HUB_OUTER} fill="url(#gauge-hub)" />
      <circle cx={CX} cy={CY} r={HUB_INNER} fill="url(#gauge-hub-inner)" />
    </svg>
  );
}
