import React, { useEffect, useState } from 'react';
import './Reminder.css';

function PersonalizedReminder({ name = 'Олеся/Вікторе', intervalMinutes = 5 }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [gif, setGif] = useState('');

  const reminders = [
    {
      text: `, не забудь про перерву!`,
      gif: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHUwc2Fmb2NmZm13ZXNlamN5cnJrN2hyYTAyZmt4ZjQ4eHdnOWxkMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S8DcNuvt1FUy31LUH6/giphy.gif'
    },
    {
      text: `, очі втомлюються — відведи погляд на 5 хвилин.`,
      gif: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHpxaHQ4ZDc3bGMwN2prYnozMXhzejhlNWp0dHhkZWF2cmFnMzZjOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/w29QPkDsiOMxquLJFN/giphy.gif'
    },
    {
      text: `, розімни плечі.`,
      gif: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2FlbjJpZmI0MnhhamlzbTF5M2V6MmZ3cmN1d2hiZnV1ZzRuM2lveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FQaQtdbLnk676/giphy.gif'
    },
    {
      text: `, зроби ковток води.`,
      gif: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3Jsc3I3eGlmMDhzaHozOHc4cWxiZnNxbHQ1bWJsY21jbDNhMjZxdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/93r05rdKx5vDw5hWn5/giphy.gif'
    },
    {
      text: `, ти молодець, але не забудь перепочити.`,
      gif: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWJidWRxdWs3aTFpODFpcDR6NXVvaTVmMTZ2bGZiZGRpdWFtd3lpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fdlcvptCs4qsM/giphy.gif'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * reminders.length);
      const { text, gif } = reminders[random];
      const fullMessage = name + text;

      setMessage(fullMessage);
      setGif(gif);
      setShow(true);

      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      if (Notification.permission === 'granted') {
        new Notification('🔔 Нагадування', { body: fullMessage });
      }

      setTimeout(() => setShow(false), 10000); // 10 сек
    }, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [name, intervalMinutes]);

  return show ? (
    <div className="reminder-toast">
      <img src={gif} alt="reminder" className="reminder-gif" />
      <p>{message}</p>
    </div>
  ) : null;
}

export default PersonalizedReminder;
