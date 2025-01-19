import React, { useState } from "react";
import { Box, Button, ButtonGroup } from "@mui/material";
import { Chart as ChartJS, CategoryScale,LinearScale,PointElement,LineElement,BarElement,Tooltip, Legend,Title, } from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register( CategoryScale,LinearScale,PointElement,LineElement,BarElement,Tooltip,Legend,Title );

export default function ChartComponent({ data }) {
  const [chartType, setChartType] = useState("line");

  const labels = data.map((item) => item["Name"]);
  const priceChanges = data.map((item) => item["Price Change"]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Price Change",
        data: priceChanges,
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 300, sm: 400, md: 500 },
        padding: 2,
      }}
    >
      <ButtonGroup
        variant="outlined"
        sx={{ mb: 2, display: "flex",justifyContent:"center"}}
      >
        <Button
          variant={chartType === "line" ? "contained" : "outlined"}
          onClick={() => setChartType("line")}
        >
          Line Chart
        </Button>
        <Button
          variant={chartType === "bar" ? "contained" : "outlined"}
          onClick={() => setChartType("bar")}
        >
          Bar Chart
        </Button>
      </ButtonGroup>

      <Box
        sx={{
          position: "relative", width: "100%", height: "100%",
        }}
      >
        {chartType === "line" ? (
          <Line data={chartData} options={options} /> ) : (<Bar data={chartData} options={options} />
        )}
      </Box>
    </Box>
  );
}