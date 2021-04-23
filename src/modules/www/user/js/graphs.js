google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses'],
        ['2004', 1000, 400],
        ['2005', 1170, 460],
        ['2006', 660, 1120],
        ['2007', 1030, 540]
    ]);

    var options = {
        curveType: 'none',
        backgroundColor: 'rgb(42, 9, 9)',
        legend: {
            position: 'bottom',
            textStyle: {
                color: 'white',
                fontSize: 14,
                fontName: 'fira-code',
            },
        },
        hAxis: {
            textStyle: {
                color: 'white',
                fontSize: 14,
                fontName: 'fira-code',
            },
        },
        vAxis: {
            textStyle: {
                color: 'white',
                fontName: 'fira-code',
                fontSize: 14,
            },
        },

    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}