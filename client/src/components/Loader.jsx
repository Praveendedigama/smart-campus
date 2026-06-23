export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__spinner" aria-hidden="true" />
      <span className="loader__text">{text}</span>
    </div>
  );
}
