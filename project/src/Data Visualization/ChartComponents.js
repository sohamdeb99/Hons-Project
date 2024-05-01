import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

export const BarChartComponent = ({ data }) => (
    <div className="chart-container">
        <Bar data={data} options={{ responsive: true }} />
    </div>
);

export const LineChartComponent = ({ data }) => (
    <div className="chart-container">
        <Line data={data} options={{ responsive: true }} />
    </div>
);

export const PieChartComponent = ({ data }) => (
    <div className="chart-container">
        <Pie data={data} options={{ responsive: true }} />
    </div>
);
