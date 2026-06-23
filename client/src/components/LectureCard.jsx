export default function LectureCard({ lecture }) {
  const { courseCode, courseName, startTime, endTime, location, lecturer } = lecture;

  const now = new Date();
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const isNow = currentMin >= startMin && currentMin < endMin;
  const isPast = currentMin >= endMin;

  return (
    <article
      className={`lecture-card${isNow ? ' lecture-card--active' : ''}${isPast ? ' lecture-card--past' : ''}`}
      aria-label={`${courseCode} from ${startTime} to ${endTime}`}
    >
      <div className="lecture-card__time">
        <span className="lecture-card__start">{startTime}</span>
        <span className="lecture-card__divider">–</span>
        <span className="lecture-card__end">{endTime}</span>
      </div>
      <div className="lecture-card__body">
        <div className="lecture-card__header">
          <span className="lecture-card__code">{courseCode}</span>
          {isNow && <span className="badge badge--live">LIVE</span>}
        </div>
        <h3 className="lecture-card__name">{courseName}</h3>
        <p className="lecture-card__meta">📍 {location}</p>
        <p className="lecture-card__meta">👨‍🏫 {lecturer}</p>
      </div>
    </article>
  );
}
