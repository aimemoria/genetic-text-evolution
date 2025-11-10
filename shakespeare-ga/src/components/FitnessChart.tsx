import React, { useEffect, useRef } from 'react';

export interface DataPoint {
  generation: number;
  bestFitness: number;
  averageFitness: number;
}

interface FitnessChartProps {
  data: DataPoint[];
}

const FitnessChart: React.FC<FitnessChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up dimensions and padding
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw chart background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(padding, padding, chartWidth, chartHeight);

    // Calculate scales
    const maxGeneration = Math.max(...data.map(d => d.generation), 1);
    const xScale = chartWidth / maxGeneration;
    const yScale = chartHeight / 100; // Fitness is 0-100%

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Horizontal grid lines (fitness)
    for (let i = 0; i <= 10; i++) {
      const y = padding + chartHeight - (i * 10 * yScale);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${i * 10}%`, padding - 10, y + 4);
    }

    // Vertical grid lines (generations)
    const gridInterval = Math.ceil(maxGeneration / 10);
    for (let i = 0; i <= 10; i++) {
      const gen = i * gridInterval;
      const x = padding + (gen * xScale);
      if (x <= padding + chartWidth) {
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();

        // X-axis labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(gen.toString(), x, padding + chartHeight + 20);
      }
    }

    // Draw best fitness line
    if (data.length > 1) {
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 2;
      ctx.beginPath();

      data.forEach((point, index) => {
        const x = padding + (point.generation * xScale);
        const y = padding + chartHeight - (point.bestFitness * yScale);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Draw average fitness line
    if (data.length > 1) {
      ctx.strokeStyle = '#2196F3';
      ctx.lineWidth = 2;
      ctx.beginPath();

      data.forEach((point, index) => {
        const x = padding + (point.generation * xScale);
        const y = padding + chartHeight - (point.averageFitness * yScale);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Draw legend
    const legendX = padding + chartWidth - 150;
    const legendY = padding + 20;

    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(legendX, legendY, 20, 2);
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Best Fitness', legendX + 30, legendY + 5);

    ctx.fillStyle = '#2196F3';
    ctx.fillRect(legendX, legendY + 20, 20, 2);
    ctx.fillStyle = '#333';
    ctx.fillText('Average Fitness', legendX + 30, legendY + 25);

    // Draw axis labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Generation', canvas.width / 2, canvas.height - 10);

    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Fitness (%)', 0, 0);
    ctx.restore();

  }, [data]);

  return (
    <div className="fitness-chart">
      <h3>Fitness Over Time</h3>
      <canvas ref={canvasRef} width={800} height={400} />
    </div>
  );
};

export default FitnessChart;
