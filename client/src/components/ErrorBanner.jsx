export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="error-banner" role="alert">
      <span aria-hidden="true">⚠️</span>
      <p className="error-banner__message">{message}</p>
      {onRetry && (
        <button className="btn btn--ghost error-banner__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
