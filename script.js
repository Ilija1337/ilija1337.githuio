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
            if(j==0){
                dataArray[i][j] = parseInt(dataArray[i][j])
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
    Chart.defaults.global.defaultFontColor = 'white';


    /* /Global chart options */

    /* Data */

    let labels = dataMatrix[0];
    labels.splice(0, 3);

    let datasets = [];

    for (let i = 1; i < dataMatrix.length; i++) {
        let label = dataMatrix[i][0];

        let datasetData = dataMatrix[i];
        datasetData.splice(0, 3);
        if(i!=2 && i!=3){
        datasets.push({
            label: label,
            data: datasetData,

            borderColor: '#' + getColor(),
            borderWidth: '1',
            borderDash: [5, 5],

            pointRadius: 0,
        });}
        else{
        datasets.push({
            label: label,
            data: datasetData,

            borderColor: '#' + getColor(),
            borderWidth: '1',

            pointRadius: 0,
        });}

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
            fontColor: 'white'
        },
        legend: {
            position: 'right',
            labels: {
                fontColor: 'white',
            }
        },
        scales: {
            xAxes: [{
              gridLines: {
                display: false
              },
            }],
            yAxes: [{
              gridLines: {
                display: false
              },
            }]
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
        '00cc00',
        '9fff80',
        'ffb366',
        'ff8000',
        'ff3333',

    ]
    return colors[Math.floor(Math.random() * colors.length)]
}
