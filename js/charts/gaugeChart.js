export default function createGaugeChart(data) {

  const overallAverage = finalWeightAverage(data);
  const gaugeValue = Math.min((overallAverage * 100) / 11.82, 100);

  const ctx = document.getElementById("gaugeChart").getContext("2d");

  const NUM_SEGMENTS = 50;
  const zones = [34, 23, 43];
  const backgroundColor = ["#66BB6A", "#FFCA28", "#EF5350"];

 const needlePlugin = {
    id: "needle",
    afterDatasetDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0).data[0];
      const cx = meta.x;
      const cy = meta.y;

      const angle = Math.PI + (gaugeValue / 100) * Math.PI;
      const needleLength = meta.outerRadius * 0.45;
      const outerRing = 30;
      const innerRing = 15;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // crista
      ctx.beginPath();
      ctx.moveTo(-innerRing, -20);
      ctx.lineTo(needleLength, 0);
      ctx.lineTo(-innerRing, 20);
      ctx.closePath();
      ctx.fillStyle = "#2a2a2a";
      ctx.fill();

      // aro exterior
      ctx.beginPath();
      ctx.arc(0, 0, outerRing, 0, Math.PI * 2);
      ctx.fillStyle = "#2a2a2a";
      ctx.fill();

      // buraco interior
      ctx.beginPath();
      ctx.arc(0, 0, innerRing, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();
    }
  };

  const textPlugin = {
    id: "centerText",
    afterDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0).data[0];

      const cx = meta.x;
      const cy = meta.y;

      ctx.save();

      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "#222";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(gaugeValue.toFixed(0), cx, cy + 70);

      ctx.font = "bold 18px sans-serif";
      ctx.fillStyle = "#666";
      ctx.fillText("Risk Score", cx, cy + 100);

      ctx.restore();
    }
  };

  const scalePlugin = {
    id: "scaleLabels",
    afterDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0).data[0];

      const cx = meta.x;
      const cy = meta.y;
      const r = meta.innerRadius - 30;

      ctx.save();
      ctx.font = "bold 20px sans-serif";
      ctx.fillStyle = "#444";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const labels = [
        { value: 0,   angle: Math.PI },
        { value: 34,  angle: Math.PI + 0.34 * Math.PI },
        { value: 57,  angle: Math.PI + 0.57 * Math.PI },
        { value: 100, angle: 2 * Math.PI }
      ];

      labels.forEach(l => {
        const x = cx + Math.cos(l.angle) * r;
        const y = cy + Math.sin(l.angle) * r;
        ctx.fillText(l.value, x, y);
      });

      ctx.restore();
    }
  };

  new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [{
        data: zones,
        backgroundColor,
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 5,
        hoverOffset: 0
      }]
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          left: 60,
          right: 60,
          top: 10,
          bottom: 0
        }
      },
      rotation: -90,
      circumference: 180,
      cutout: "65%",
      animation: {
        animateRotate: true,
        duration: 1200
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    },
    plugins: [needlePlugin, textPlugin, scalePlugin]
  });
}

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