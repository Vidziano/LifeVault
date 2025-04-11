import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

function HabitChart({ habits, weekDates }) {
  const data = habits.map((habit) => {
    const completedDays = weekDates.filter(date => habit.log[date]).length;
    const percent = Math.round((completedDays / 7) * 100);
    return {
      name: habit.name,
      progress: percent
    };
  });

  const colors = ['#ffb74d', '#81c784', '#4fc3f7', '#ba68c8', '#f48fb1', '#ffd54f'];

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ textAlign: 'center' }}>📈 Прогрес за тиждень</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
          <XAxis type="number" domain={[0, 100]} tickFormatter={(t) => `${t}%`} />
          <YAxis dataKey="name" type="category" width={120} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="progress" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HabitChart;
