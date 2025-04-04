import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function HabitChart({ habits, weekDates }) {
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id || null);

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  const data = {
    labels: weekDates.map(date => new Date(date).toLocaleDateString('uk-UA', { weekday: 'short' })),
    datasets: [
      {
        label: selectedHabit?.name || '',
        data: weekDates.map(date => selectedHabit?.log[date] ? 1 : 0),
        backgroundColor: '#4e4eeb',
        borderRadius: 6,
      }
    ]
  };

  const options = {
    scales: {
      y: {
        min: 0,
        max: 1,
        ticks: {
          callback: (value) => (value === 1 ? '✔️' : '')
        },
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ctx.raw === 1 ? 'Виконано' : 'Пропущено'
        }
      }
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>📈 Графік виконання звички</h3>

      <select
        value={selectedHabitId || ''}
        onChange={(e) => setSelectedHabitId(Number(e.target.value))}
        style={{ padding: '8px', borderRadius: '6px', marginBottom: '20px' }}
      >
        {habits.map(h => (
          <option key={h.id} value={h.id}>{h.name}</option>
        ))}
      </select>

      {selectedHabit && <Bar data={data} options={options} />}
    </div>
  );
}

export default HabitChart;
