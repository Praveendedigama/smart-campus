export default function AssignmentItem({ assignment, onToggle, onDelete }) {
  const { _id, title, courseCode, dueDate, priority, status } = assignment;
  const due = new Date(dueDate);
  const isOverdue = status === 'pending' && due < new Date();

  const formattedDate = due.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article
      className={[
        'assignment-item',
        `assignment-item--${priority}`,
        status === 'completed' ? 'assignment-item--done' : '',
        isOverdue ? 'assignment-item--overdue' : ''
      ].join(' ').trim()}
    >
      <button
        className="assignment-item__check"
        onClick={() => onToggle(_id, status)}
        aria-label={`Mark "${title}" as ${status === 'completed' ? 'pending' : 'complete'}`}
      >
        {status === 'completed' ? '✅' : '⬜'}
      </button>

      <div className="assignment-item__body">
        <h3 className="assignment-item__title">{title}</h3>
        <p className="assignment-item__meta">
          <span className="chip">{courseCode}</span>
          <span className={`chip chip--${isOverdue ? 'danger' : priority}`}>
            {isOverdue ? 'Overdue' : priority}
          </span>
        </p>
        <p className="assignment-item__due">
          {isOverdue ? '⚠️' : '📅'} Due {formattedDate}
        </p>
      </div>

      <button
        className="assignment-item__delete"
        onClick={() => onDelete(_id)}
        aria-label={`Delete "${title}"`}
      >
        🗑️
      </button>
    </article>
  );
}
