import loadCSV from "./data.js";
import { createAgeChart, createGaugeChart, createRadarChart } from "./charts.js";

document.addEventListener("DOMContentLoaded", async function () {

    const results = await loadCSV();
    console.log(results.data);

    createAgeChart(results.data);
    createGaugeChart(results.data);
    createRadarChart(results.data)
});