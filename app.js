document.addEventListener("DOMContentLoaded", function () {

    Papa.parse("dados.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) { // a opção de configuração "complete" serve para dizer que o processamento dentro da função vai ser feito com todos os dados

          // os dados estão organizados da seguinte forma em results.data, um array de objetos: 
          /**
           * [
              {"Qual a sua idade?": "22", "Sexo": "Masculino"}, // cada linha é um objeto que corresponde a apenas uma submissão (uma pessoa), onde temos pares chave-valor entre pergunta-resposta (ou variável-valor, no caso dos pesos por ex)
              {"Qual a sua idade?": "23", "Sexo": "Feminino"},
              {"Qual a sua idade?": "24", "Sexo": "Masculino"}
             ]

             e em results: results = {
                data: [...],      // array com todas as linhas do CSV, cada linha é um objeto
                errors: [...],    // array com erros de parsing (se houver)
                meta: {...}       // informações sobre o CSV (colunas, delimitador, etc.)
              }
          */

          const data = update_imc_weight(results.data);

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
    });

});

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

/**
 * Calculate the weight associated to this imc.
 * @param {number} imc - Body Mass Index
 * @returns {number} Weight adjustment based on IMC
 */
function calculate_imc_weight(imc) { 
  if (imc >= 25)
    return (Math.floor(imc) - 25) * 0.09 + 0.09;
  
  return 0;
}

/**
 * Updates the right weight for the corresponding imc in the data object
 * @param {array of objects} data - all the data in the csv
 * @returns {array of objetcs} Updated data 
 */
function update_imc_weight(data) {
  data.forEach(row => {
    // parseFloat para garantir que o imc é número
    const imc = parseFloat(row["imc"]);
    row["weight3_imc"] = calculate_imc_weight(imc);
  });
  return data;
}