export default function loadCSV() {
    return new Promise((resolve, reject) => {
        Papa.parse("../data/dados.csv", {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) { // a opção de configuração "complete" serve para dizer que o processamento dentro da função (o que se segue a "complete") vai ser feito com todos os dados
                results.data = update_imc_weight(results.data);
                resolve(results); // devolve results atualizado
            },

            
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

            error: function(error) {
                reject(error);
            }
        });
    });
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

