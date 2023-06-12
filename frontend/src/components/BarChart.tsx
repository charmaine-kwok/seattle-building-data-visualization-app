import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartOptions, Chart, CategoryScale } from "chart.js";

import "chart.js/auto";

Chart.register(CategoryScale);

const options: ChartOptions<"bar"> = {
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Average EUI by Primary Property Type",
      font: {
        size: 24,
        style: "italic",
      },
    },
  },
  scales: {
    x: {
      min: 0,
      ticks: {
        autoSkip: false,
        padding: 10,
      },
      title: {
        display: true,
        text: "Primary Property Type",
        font: {
          size: 18,
        },
      },
    },
    y: {
      min: 0,
      ticks: {
        autoSkip: false,
        padding: 10,
        stepSize: 40,
      },
      title: {
        display: true,
        text: "Average EUI",
        font: {
          size: 18,
        },
      },
    },
  },
  maintainAspectRatio: false,
  responsive: true,
};

type BarProps = {
  data: any;
};

const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

const BarChart: React.FC<BarProps> = ({ data }) => {
  const labels = Object.keys(data);
  const backgroundColors = labels.map(
    () => "#" + Math.floor(Math.random() * 16777215).toString(16)
  );

  const dataIn = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "",
        backgroundColor: backgroundColors,
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: Object.values(data),
      },
    ],
  };

  return <Bar data={dataIn} options={options} />;
};

export default BarChart;
