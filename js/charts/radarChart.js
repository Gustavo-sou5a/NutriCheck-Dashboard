import { dicWeightScore, sections } from "../data.js";

const AT_RISK_SCORE = 57;

export default function createRadarChart(data) {

  const riskPercentage = risk_factor_percentage(data);
  const riskDiv = document.getElementById("riskFactor");
  riskDiv.innerText = `Em risco: ${riskPercentage.toFixed(2)}%`;


  const ctx = document.getElementById("radarChart");

  const labels = ["Fatores MetS", "História Médica", "Atividade Física e Sono", "Hábitos Alimentares", "Estilo de Vida"]
  const values = Object.keys(sections).map(section => 
    average_percentege_per_section(data, `${section}_percentage`)
  );

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: labels,
      datasets: [{
        label: "% Média de Risco Para Cada Eixo",
        data: values,
        fill: true
      }]
    },
    options: {
      scales: {
        r: {
          min: 0,
          max: 100,
          pointLabels: {
            font: {
              size: 20  // aumenta o tamanho da fonte das labels
            }
          }
        }
      }
    }
  });
}

function average_percentege_per_section(data, section) {
  const sum = data.reduce((acc, row) => acc + (row[section] || 0), 0);
  return sum / data.length;
}
  
function risk_factor_percentage(data) {
  let peopleAtRisk = 0;
  data.forEach(row => {
    let score = row.total_weight_except_age_imc / dicWeightScore.total_weight_except_age_imc * 100;
    if (score >= AT_RISK_SCORE)
      peopleAtRisk++;
  });
  return peopleAtRisk/data.length * 100;
}