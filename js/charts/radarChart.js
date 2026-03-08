export default function createRadarChart(data) {

  const ctx = document.getElementById("radarChart");

  const values = [70, 60, 80, 55, 90]; // exemplo

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Saúde", "Energia", "Sono", "Atividade", "Nutrição"],
      datasets: [{
        label: "Perfil",
        data: values,
        fill: true
      }]
    },
    options: {
      scales: {
        r: {
          min: 0,
          max: 100
        }
      }
    }
  });
}