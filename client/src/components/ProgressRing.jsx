export default function ProgressRing({ completed, total, size = 140 }) {
  const pct = total > 0 ? Math.min(completed / total, 1) : 0;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const cx = size / 2;

  return (
    <div
      className="progress-ring"
      role="img"
      aria-label={`${completed} of ${total} credits completed, ${Math.round(pct * 100)}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={cx} cy={cx} r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={cx} cy={cx} r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="progress-ring__label">
        <span className="progress-ring__value">{completed}</span>
        <span className="progress-ring__total">/ {total}</span>
        <span className="progress-ring__unit">credits</span>
      </div>
    </div>
  );
}
