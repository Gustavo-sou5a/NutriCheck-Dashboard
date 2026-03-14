export function loadCSV() {
    return new Promise((resolve, reject) => {
        Papa.parse("../data/dados.csv", {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) { // a opção de configuração "complete" serve para dizer que o processamento dentro da função (o que se segue a "complete") vai ser feito com todos os dados
                results.data = update_imc_weight(results.data);
                results.data = delete_old_submissions(results.data);
                results.data = create_sections_scores(results.data);
                results.data = add_total_weights(results.data);
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

function delete_old_submissions(data) {
  const limite = new Date("2026-02-25T12:00:00");
  return data.filter(row => { // elimina as rows que não têm valores nos weights, que estão antes do dia 25 de fev às 12h00
      const dataSubmissao = new Date(row["Submitted at"].replace(" ", "T"));
      return dataSubmissao >= limite;
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
    let imc = parseFloat(row["imc"]);
    if (imc > 10000) { imc = imc / 10000 } // erro no cálculo (pessoa colocou a altura em metros)
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

/**
 * Adds new columns to each submission that informs their score on each section
 * specified on the dictionary "dicSectionsScore"
 * @param {Object} data - the original data
 * @return {Object} the updated data
 */
function create_sections_scores(data) {
  data.forEach(row => {
    for (const section in sections) {
      const columns = sections[section];
      const soma = columns.reduce((total, key) => total + (parseFloat(row[key]) || 0), 0);
      const maxScoreInSection = dicSectionsScore[section]
      row[`${section}_percentage`] = (soma / maxScoreInSection) * 100;
      row[section] = soma;
    }
  });
  console.log(data);
  return data;
}

/**
 * Adds 2 new columns to each submission, one for the total score regarding all
 * weights and another for the total score except the age's and imc's weights.
 * @param {Object} data - the original data
 * @returns {Object} the updated data
 */
function add_total_weights(data) {
  data.forEach(row => {
    // Soma total de todos os pesos (já calculado no dicWeightScore)
    row.total_weight = Object.keys(row)
      .filter(k => k.startsWith("weight"))
      .reduce((sum, k) => sum + (parseFloat(row[k]) || 0), 0);

    // Soma total exceto weight1_age e weight3_imc
    row.total_weight_except_age_imc = Object.keys(row)
      .filter(k => k.startsWith("weight") && k !== "weight1_age" && k !== "weight3_imc")
      .reduce((sum, k) => sum + (parseFloat(row[k]) || 0), 0);
  });

  return data;
}

export const dicWeightScore = {
  weight1_age: 2.52,
  weight2_gender: 0.14,
  weight3_imc: 1.89,
  weight4_waist: 0.52,
  weight5_meds: 2.21,
  weight6_diabetes: 0.75, 
  weight7_pregnant: 0.84,
  weight8_1_walk: 0.22, 
  weight8_2_sitting: 0.37, 
  weight9_sleep: 0.19,
  weight10_refri: 0.3, 
  weight11_upf: 0.44, 
  weight12_fruits: 0.22, 
  weight13_alcool: 0.63,
  weight14_smoke: 0.35, 
  weight15_schedule: 0.23,
}

dicWeightScore.total_weight =
  Object.values(dicWeightScore)
    .reduce((a, b) => a + b, 0);

dicWeightScore.total_weight_except_age_imc = 
  dicWeightScore.total_weight - dicWeightScore.weight1_age - dicWeightScore.weight3_imc;

const dicSectionsScore = {
  section_fatores_metS: dicWeightScore.weight2_gender + dicWeightScore.weight4_waist + dicWeightScore.weight5_meds,
  section_historial_medico: dicWeightScore.weight6_diabetes + dicWeightScore.weight7_pregnant,
  section_ativ_sono: dicWeightScore.weight8_1_walk + dicWeightScore.weight8_2_sitting + dicWeightScore.weight9_sleep,
  section_alimentacao: dicWeightScore.weight10_refri + dicWeightScore.weight11_upf + dicWeightScore.weight12_fruits + dicWeightScore.weight14_smoke,
  section_lifestyle: dicWeightScore.weight14_smoke + dicWeightScore.weight15_schedule
}

export const sections = {
  section_fatores_metS: ["weight2_gender", "weight4_waist", "weight5_meds"],
  section_historial_medico: ["weight6_diabetes", "weights7_pregnant"],
  section_ativ_sono: ["weight8_1_walk", "weight8_2_sitting", "weight9_sleep"],
  section_alimentacao: ["weight10_refri", "weight11_upf", "weight12_fruits", "weight13_alcool"],
  section_lifestyle: ["weight14_smoke", "weight15_schedule"]
}

