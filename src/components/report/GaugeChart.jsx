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
// 세그먼트는 서로 붙어 있다. 사이의 경계선은 모서리 라운딩(CORNER)이 만든다
const GAP = 0;
const DEPTH = 4;
const NEEDLE_LENGTH = 60;
const NEEDLE_HALF = 11;
const HUB_OUTER = 24;
const HUB_INNER = 17;

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

        {/* 빛은 오른쪽에서 든다. 링은 오른쪽이 밝고 왼쪽이 어둡다 */}
        <radialGradient id="gauge-hub" cx="75%" cy="45%" r="80%">
          <stop offset="0%" stopColor="#6ab5fd" />
          <stop offset="100%" stopColor="#2e5099" />
        </radialGradient>

        {/* 안쪽 원은 파여 있어서 링 그림자가 오른쪽에 진다 (링과 반대 방향).
            대부분은 밝고 오른쪽 테두리에서만 어두워진다 */}
        <radialGradient id="gauge-hub-inner" cx="28%" cy="45%" r="88%">
          <stop offset="0%" stopColor="#f4f4f4" />
          <stop offset="55%" stopColor="#ebeae9" />
          <stop offset="100%" stopColor="#c2c0be" />
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

      {/* 윗면은 그라데이션 없이 단색이다 */}
      {arcs.map(({ id, color, d }) => (
        <path
          key={`face-${id}`}
          d={d}
          fill={color}
          stroke={color}
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
