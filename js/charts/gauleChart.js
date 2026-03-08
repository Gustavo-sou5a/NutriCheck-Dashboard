export default function createGaugeChart(data) {

  // calculate overall average for all submissions, weight wise
  const overallAverage = finalWeightAverage(data);

  // rule of 3 (0-100)
  const gaugeValue = Math.min((overallAverage * 100) / 11.82, 100);

  const ctx = document.getElementById("gaugeChart").getContext("2d");

  const zones = [34, 23, 43]; // verde, amarelo, vermelho (total 100)

  const needlePlugin = {
    id: "needle",
    afterDatasetDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0).data[0];
      const cx = meta.x;
      const cy = meta.y;

      const angle = Math.PI + (gaugeValue / 100) * Math.PI;
      const needleLength = meta.outerRadius * 0.9;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // ponteiro
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(needleLength, 0);
      ctx.lineTo(-6, 6);
      ctx.fillStyle = "#222";
      ctx.fill();

      // círculo central
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#222";
      ctx.fill();

      ctx.restore();
    }
  };

  const textPlugin = {
    id: "centerText",
    afterDraw(chart) {
      const { ctx, chartArea: { width, height } } = chart;

      ctx.save();
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "#222";
      ctx.textAlign = "center";
      ctx.fillText(gaugeValue.toFixed(0), width / 2, height * 0.75);

      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#666";
      ctx.fillText("Risk Score", width / 2, height * 0.85);
      ctx.restore();
    }
  };

  new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [{
        data: zones,
        backgroundColor: ["#66BB6A", "#FFCA28", "#EF5350"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      rotation: -90,
      circumference: 180,
      cutout: "82%",
      animation: {
        animateRotate: true,
        duration: 1200
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    },
    plugins: [needlePlugin, textPlugin]
  });
}

/**
 * Calculates the sum of weights for each submission and averages the sums
 * @returns Average of all sums
 */
function finalWeightAverage(data) {
  let sums = 0;

  for (let i = 0; i < data.length; i++) {
    let soma = 0;
    let submission = data[i];

    for (let chave in submission) {
      if (chave.includes("weight")) {
        soma += parseFloat(submission[chave]) || 0;
  
      }
    }
    console.log(submission["Submission ID"], soma);
    sums += soma;
  }
  console.log(sums / data.length);
  return sums / data.length;
}
