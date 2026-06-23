import { useState, useRef, useEffect } from 'react';
import { useAssignments } from '../hooks/useAssignments.js';
import { useToast } from '../context/ToastContext.jsx';
import AssignmentItem from '../components/AssignmentItem.jsx';
import FilterTabs from '../components/FilterTabs.jsx';

export default function Assignments() {
  const {
    assignments,
    filtered,
    filter,
    setFilter,
    addAssignment,
    toggleAssignment,
    deleteAssignment
  } = useAssignments();
  const addToast = useToast();
  const titleInputRef = useRef(null);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (showForm) {
      setTimeout(() => titleInputRef.current?.focus(), 60);
    }
  }, [showForm]);
  const [form, setForm] = useState({
    title: '',
    courseCode: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();

  const counts = {
    all: assignments.length,
    pending: assignments.filter(a => a.status === 'pending' && new Date(a.dueDate) >= now).length,
    completed: assignments.filter(a => a.status === 'completed').length,
    overdue: assignments.filter(a => a.status === 'pending' && new Date(a.dueDate) < now).length
  };

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.courseCode.trim()) errors.courseCode = 'Course code is required';
    if (!form.dueDate) {
      errors.dueDate = 'Due date is required';
    } else if (new Date(form.dueDate) < new Date(today)) {
      errors.dueDate = 'Due date cannot be in the past';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      await addAssignment(form);
      addToast('Assignment added!', 'success');
      setForm({ title: '', courseCode: '', description: '', dueDate: '', priority: 'medium' });
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleField = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-header__title">Assignments</h1>
        <button
          className="btn btn--primary btn--icon"
          onClick={() => setShowForm(v => !v)}
          aria-expanded={showForm}
          aria-controls="add-form"
        >
          {showForm ? '✕ Close' : '+ Add'}
        </button>
      </header>

      {showForm && (
        <form id="add-form" className="card form" onSubmit={handleSubmit} noValidate>
          <h2 className="form__title">New Assignment</h2>

          <div className="field">
            <label className="field__label" htmlFor="asgn-title">Title *</label>
            <input
              id="asgn-title"
              ref={titleInputRef}
              type="text"
              className={`field__input${fieldErrors.title ? ' field__input--error' : ''}`}
              value={form.title}
              placeholder="e.g. Final Project Report"
              onChange={handleField('title')}
            />
            {fieldErrors.title && <span className="field__error" role="alert">{fieldErrors.title}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="asgn-code">Course Code *</label>
            <input
              id="asgn-code"
              type="text"
              className={`field__input${fieldErrors.courseCode ? ' field__input--error' : ''}`}
              value={form.courseCode}
              placeholder="e.g. SENG 41293"
              onChange={handleField('courseCode')}
            />
            {fieldErrors.courseCode && <span className="field__error" role="alert">{fieldErrors.courseCode}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="asgn-desc">Description</label>
            <textarea
              id="asgn-desc"
              className="field__input field__textarea"
              value={form.description}
              placeholder="Optional details…"
              rows={2}
              onChange={handleField('description')}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="asgn-due">Due Date *</label>
            <input
              id="asgn-due"
              type="date"
              className={`field__input${fieldErrors.dueDate ? ' field__input--error' : ''}`}
              value={form.dueDate}
              min={today}
              onChange={handleField('dueDate')}
            />
            {fieldErrors.dueDate && <span className="field__error" role="alert">{fieldErrors.dueDate}</span>}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="asgn-priority">Priority</label>
            <select
              id="asgn-priority"
              className="field__input field__select"
              value={form.priority}
              onChange={handleField('priority')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {formError && <p className="form__error" role="alert">{formError}</p>}

          <div className="form__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <FilterTabs active={filter} onChange={setFilter} counts={counts} />

      <div className="assignment-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__icon">✅</p>
            <p className="empty-state__text">
              No {filter !== 'all' ? filter : ''} assignments
            </p>
            {filter === 'all' && (
              <p className="empty-state__sub">Tap "+ Add" to create one</p>
            )}
          </div>
        ) : (
          filtered.map(a => (
            <AssignmentItem
              key={a._id}
              assignment={a}
              onToggle={toggleAssignment}
              onDelete={deleteAssignment}
            />
          ))
        )}
      </div>
    </div>
  );
}
