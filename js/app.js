import loadCSV from "./data.js";
import createAgeChart from "./charts/ageChart.js";
import createGaugeChart from "./charts/gaugeChart.js";
import createRadarChart from "./charts/radarChart.js";
import createRiskHistogram from "./charts/histogram.js";

document.addEventListener("DOMContentLoaded", async function () {

    const results = await loadCSV();
    //console.log(results.data);

    createAgeChart(results.data);
    createGaugeChart(results.data);
    createRadarChart(results.data);
    createRiskHistogram(results.data);
});

