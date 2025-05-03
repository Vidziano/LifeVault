import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function DreamChart({ dreams }) {
  const spheres = ['здоров’я', 'кар’єра', 'особисте', 'соціальне'];
  const data = spheres.map(s => dreams.filter(d => d.sphere === s).length);

  const chartData = {
    labels: spheres,
    datasets: [
      {
        data,
        backgroundColor: ['#81c784', '#64b5f6', '#ffb74d', '#ce93d8']
      }
    ]
  };

  return (
    <div style={{ width: '300px', margin: '20px auto' }}>
      <h4>📊 Баланс сфер мрій</h4>
      <Doughnut data={chartData} />
    </div>
  );
}

export default DreamChart;
