const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Done' },
  { key: 'overdue', label: 'Overdue' }
];

export default function FilterTabs({ active, onChange, counts = {} }) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Assignment filters">
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          aria-selected={active === key}
          className={`filter-tab${active === key ? ' filter-tab--active' : ''}`}
          onClick={() => onChange(key)}
        >
          {label}
          {counts[key] !== undefined && (
            <span className="filter-tab__count">{counts[key]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
