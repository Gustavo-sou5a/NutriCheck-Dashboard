document.addEventListener("DOMContentLoaded", function () {

    Papa.parse("dados.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {

            const data = results.data;

            // Extrair idades
            const ages = data
                .map(row => parseInt(row["Qual a sua idade?"], 10))
                .filter(age => !isNaN(age));

            // Contar frequência de cada idade
            const ageCount = {};

            ages.forEach(age => {
                ageCount[age] = (ageCount[age] || 0) + 1;
            });

            // Ordenar idades numericamente
            const sortedAges = Object.keys(ageCount)
                .map(Number)
                .sort((a, b) => a - b);

            const frequencies = sortedAges.map(age => ageCount[age]);

            createChart(sortedAges, frequencies);
        }
    });

});

function createChart(labels, data) {

    const ctx = document.getElementById("ageChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Número de pessoas",
                data: data
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
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