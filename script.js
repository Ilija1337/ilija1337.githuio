$(document).ready(function () {
    $.get('https://ilija1337.github.io/csv_pressure_temperature_light_sound.CSV', function (data) { createChart(data) }, 'text');
});

function createChart(rawData) {
    let parsedData = Papa.parse(rawData);
    let dataArray = parsedData.data;
    let dataMatrix = [];

    let headingArray = [];

    for (let i = 0; i < dataArray[0].length; i++) {
        dataMatrix[i] = [];

        headingArray.push({
            title: dataArray[0][i],
            unit: dataArray[1][i],
        })
    }

    for (let i = 0; i < dataArray.length; i++) {
        for (let j = 0; j < dataArray[i].length; j++) {
            if (!dataArray[i][j]) {
                dataArray[i][j] = null;
            }
            dataMatrix[j][i] = dataArray[i][j];
        }
    }

    let commentIndex = headingArray.findIndex(element => {
        if (element.title === 'Comment') {
            return true;
        }
    });
    if (commentIndex !== -1) {
        dataMatrix.splice(commentIndex, 1);
        headingArray.splice(commentIndex, 1);
    }

    console.log(parsedData);
    console.log(dataMatrix);
    console.log(headingArray);

    /* Global chart options */

    Chart.defaults.global.defaultFontFamily = 'Consolas';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = 'black';

    Chart.defaults.global.elements.line.backgroundColor = 'transparent';

    /* /Global chart options */

    /* Data */

    let labels = dataMatrix[0];
    labels.splice(0, 3);

    let datasets = [];

    for (let i = 1; i < dataMatrix.length; i++) {
        let label = dataMatrix[i][0];

        let datasetData = dataMatrix[i];
        datasetData.splice(0, 3);

        datasets.push({
            label: label,
            data: datasetData,

            //borderColor: '#' + getColor(),
            borderWidth: '1',

            pointRadius: 0,
        });
    }

    /* /Data */

    let myChart = document.getElementById('myChart').getContext('2d');
    let type = 'line';
    let data = {
        labels,
        datasets,
    };
    let options = {
        title: {
            display: true,
            text: ['Rezultati merenja'],
            fontSize: 23,
        },
        legend: {
            position: 'right',
            labels: {
                fontColor: 'green',
            }
        },
        tooltips: {
            intersect: false,
            callbacks: {
                title: (toolTipItem) => {
                    return headingArray[0].title + ": " + toolTipItem[0].label + " " + headingArray[0].unit;
                },
                label: (toolTipItem) => {
                    return toolTipItem.yLabel + " " + headingArray[toolTipItem.datasetIndex + 1].unit;

                },
            },
        },
    };

    chart = new Chart(myChart, { type, data, options });
}

function getColor() {
    colors = [
        'FF0000',
        'FF4500',
        'C71585',
        'FF8C00',
        'FF00FF',
        '1E90FF',
        '0000FF',
        'D2691E',
        'CD5C5C',
        '6A5ACD',
        '32CD32',
        '008080',
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}
