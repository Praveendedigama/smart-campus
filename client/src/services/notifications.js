export const requestPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission !== 'denied') {
    return Notification.requestPermission();
  }
  return Notification.permission;
};

const REMINDER_WINDOW_HOURS = 24;

export const scheduleDeadlineReminders = (assignments) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const now = new Date();
  let fired = 0;

  assignments.forEach(a => {
    if (a.status === 'completed') return;
    const due = new Date(a.dueDate);
    const hoursLeft = (due - now) / (1000 * 60 * 60);

    if (hoursLeft > 0 && hoursLeft <= REMINDER_WINDOW_HOURS) {
      const label = hoursLeft < 1
        ? `${Math.round(hoursLeft * 60)} minutes`
        : `${Math.round(hoursLeft)} hours`;

      new Notification(`Due in ${label}: ${a.title}`, {
        body: `${a.courseCode} — ${due.toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })}`,
        icon: '/icons/icon-192.png',
        tag: a._id
      });
      fired++;
    }
  });

  if (fired === 0) {
    new Notification('Smart Campus', {
      body: `No assignments due in the next ${REMINDER_WINDOW_HOURS} hours. Keep it up!`,
      icon: '/icons/icon-192.png'
    });
  }
};

export const sendTestNotification = () => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification('Smart Campus', {
    body: 'Notifications enabled! You will be reminded of upcoming deadlines.',
    icon: '/icons/icon-192.png'
  });
};
