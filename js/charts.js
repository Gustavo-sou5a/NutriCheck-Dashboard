export function createAgeChart(data) {

    console.log(data);

    // Extrair idades
    const ages = data
        .map(row => parseInt(row["Qual a sua idade?"], 10)) // para cada objeto, vai buscar a pergunta da idade e transforma num inteiro (base 10), devolvendo uma lista de inteiros
        .filter(age => !isNaN(age)); // pega na lista dos inteiros obtida anteriormente (as idades) e elimina aquelas que são NaN (que, em princípio, não haverá)

    // Contar frequência de cada idade
    const ageCount = {};

    ages.forEach(age => {
    ageCount[age] = (ageCount[age] || 0) + 1;  // A || B significa: se A for truthy (não nulo, não indefinido, não 0, não ""), então use A; caso contrário, use B
    });

    // Ordenar idades numericamente
    const sortedAges = Object.keys(ageCount)
    .map(Number) // converte as chaves de ageCount para número
    .sort((a, b) => a - b); // a função de comparação é a dada; ao receber dois elementos a e b, se retorna < 0 então a vem antes de b

    const frequencies = sortedAges.map(age => ageCount[age]);

    createChart(sortedAges, frequencies);  
}


function createChart(labels, data) {

    const ctx = document.getElementById("ageChart").getContext("2d"); // o contexto 2d fornece funções para desenhar no canvas (que é o elemento dado por document.getElementById("ageChart"))

    new Chart(ctx, {
        type: "bar", // gráficos de barras
        data: {
            labels: labels, // x axis
            datasets: [{ // y exis
                label: "Número de pessoas",
                data: data
            }]
        },
        options: { // configurações visuais e interativas
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Idade"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Frequência"
                    },
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

export function createGaugeChart(data) {

  const ctx = document.getElementById("gaugeChart");

  const value = 65;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [{
        data: [30, 40, 30],
        backgroundColor: [
          "red",
          "yellow",
          "green"
        ],
        circumference: 180,
        rotation: 270
      }]
    },
    options: {
      plugins: {
        tooltip: { enabled: false }
      }
    }
  });

}

export function createRadarChart(data) {

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