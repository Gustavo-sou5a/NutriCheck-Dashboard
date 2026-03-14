export default function createRiskHistogram(data) {

  const bins = {
    "0-2": 0,
    "2-4": 0,
    "4-7": 0,
    "8+": 0
  };

  data.forEach(submission => {

    const riskCount = countRiskFactors(submission);

    if (riskCount <= 2) {
      bins["0-2"]++;

    } else if (riskCount <= 4) {
      bins["2-4"]++;

    } else if (riskCount <= 7) {
      bins["4-7"]++;

    } else {
      bins["8+"]++;
    }

  });

  const chartData = {
    labels: Object.keys(bins),
    datasets: [{
      label: "Número de colaboradores",
      data: Object.values(bins)
    }],
    backgroundColor: [
      "#4CAF50",
      "#FFC107",
      "#FF9800",
      "#F44336"
    ]
  };

  const ctx = document.getElementById("riskHistogram").getContext("2d");

  const valueLabelPlugin = {
  id: "valueLabels",
  afterDatasetsDraw(chart) {

    const { ctx } = chart;

    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);

      meta.data.forEach((bar, index) => {

        const value = dataset.data[index];

        ctx.save();
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "#222";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        ctx.fillText(value, bar.x, bar.y);

        ctx.restore();
      });

    });
  }
};

  new Chart(ctx, {
  type: "bar",
  data: chartData,
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Número de fatores de risco"
        }
      },
      y: {
        title: {
          display: true,
          text: "Número de colaboradores"
        },
        beginAtZero: true
      }
    }
  },
  plugins: [valueLabelPlugin]
  });
}

function countRiskFactors(submission) {

  let count = 0;

  for (let chave in submission) {
    if (chave.startsWith("weight") && chave !== "weight1_age" && chave !== "weight3_imc") {
      const val = parseFloat(submission[chave]) || 0;
      if (val > 0) {
        count++;
      }
    }
    if (count >= 8) {
      console.log(submission["Submitted at"])
    }
  }
  return count;
}