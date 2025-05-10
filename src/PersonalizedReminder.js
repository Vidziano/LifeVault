import React, { useEffect, useState } from 'react';
import './PersonalizedReminder.css';

function PersonalizedReminder({ intervalMinutes = 5 }) {
  const stored = localStorage.getItem('userProfile');
  const parsed = stored ? JSON.parse(stored) : null;
  const name = parsed?.name?.trim() || '';

  const reminders = [
    { text: ' не забудь про перерву!', gif: 'https://media0.giphy.com/media/S8DcNuvt1FUy31LUH6/giphy.gif' },
    { text: ' очі втомлюються — відведи погляд на 5 хвилин.', gif: 'https://media2.giphy.com/media/w29QPkDsiOMxquLJFN/giphy.gif' },
    { text: ' розімни плечі.', gif: 'https://media0.giphy.com/media/FQaQtdbLnk676/giphy.gif' },
    { text: ' зроби ковток води.', gif: 'https://media2.giphy.com/media/93r05rdKx5vDw5hWn5/giphy.gif' },
    { text: ' ти молодець, але не забудь перепочити.', gif: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWJidWRxdWs3aTFpODFpcDR6NXVvaTVmMTZ2bGZiZGRpdWFtd3lpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fdlcvptCs4qsM/giphy.gif' },
    { text: ' перевір поставу!', gif: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWU2azZ4dGd1ejYybHN0eHAybnV1MmtrZm5odWxvY3c2YmVkNzVwZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3vRaWAPakjiEUQow/giphy.gif' },
    { text: ' зроби глибокий вдих і повільний видих.', gif: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmNvdmI1NXlleTBncmIzdzFjMDBmcHZwbG0wOXc4OXh3czF3eWpnYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RT3S8fkHUxECJJpwvT/giphy.gif' },
    { text: ' зроби легку зарядку або пройдися по кімнаті', gif: 'https://i.giphy.com/4KkSbPnZ5Skec.webp' }
  ];
  

  const [message, setMessage] = useState('');
  const [gif, setGif] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const notifAllowed = localStorage.getItem('notifications') !== 'false';
      if (!notifAllowed) return;

      const random = Math.floor(Math.random() * reminders.length);
      const { text, gif } = reminders[random];
      const fullMessage = name ? `${name},${text}` : text;

      setMessage(fullMessage);
      setGif(gif);
      setShow(true);

      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      if (Notification.permission === 'granted') {
        new Notification('🔔 Нагадування', { body: fullMessage });
      }

    }, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [name, intervalMinutes]);

  return show ? (
    <div className="reminder-toast">
      <button className="close-button" onClick={() => setShow(false)}>×</button>
      <img src={gif} alt="reminder" className="reminder-gif" />
      <p>{message}</p>
    </div>
  ) : null;
}

export default PersonalizedReminder;
