import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function DreamChart({ dreams }) {
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const spheres = ['здоров’я', 'кар’єра', 'особисте', 'соціальне'];
  const data = spheres.map(s => dreams.filter(d => d.sphere === s).length);
  const backgroundColors = ['#81c784', '#64b5f6', '#ffb74d', '#ce93d8'];

  const options = {
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#eee' : '#111',
          font: { size: 14, weight: '500' }
        }
      }
    }
  };

  const chartData = {
    labels: spheres,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: isDark ? '#2b2b3d' : '#fff'
      }
    ]
  };

  return (
    <div className="dream-chart-container">
      <h4 style={{
        textAlign: 'center',
        marginBottom: '15px',
        color: isDark ? '#fff' : '#222',
        fontSize: '1.5rem'
      }}>
        📊 Баланс сфер мрій
      </h4>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default DreamChart;