function mostrarChamada() {
    let presence = document.getElementById("presence")
    presence.hidden = false;
    let notes = document.getElementById("notes")
    notes.hidden = true
}

function mostrarNota() {
    let presence = document.getElementById("presence")
    presence.hidden = true;
    let notes = document.getElementById("notes")
    notes.hidden = false;
}

anychart.onDocumentReady(function () {
    // create data set on our data
    var dataSet = anychart.data.set([
        ['', 40, 10, 20, 10, 20],
    ]);

    // map data for the first series, take x from the zero column and value from the first column of data set
    var seriesData_1 = dataSet.mapAs({ 'x': 0, 'value': 1 });

    // map data for the second series, take x from the zero column and value from the second column of data set
    var seriesData_2 = dataSet.mapAs({ 'x': 0, 'value': 2 });

    // map data for the second series, take x from the zero column and value from the third column of data set
    var seriesData_3 = dataSet.mapAs({ 'x': 0, 'value': 3 });

    // map data for the fourth series, take x from the zero column and value from the fourth column of data set
    var seriesData_4 = dataSet.mapAs({ 'x': 0, 'value': 4 });

    // create bar chart
    var chart = anychart.bar();

    // turn on chart animation
    chart.animation(true);

    // force chart to stack values by Y scale.
    chart.yScale().stackMode('percent');

    // set chart title text settings
    chart.title('Composição da média');

    // set yAxis labels formatting, force it to add % to values
    chart.yAxis(0).labels().format('{%Value}%');

    // helper function to setup label settings for all series
    var setupSeriesLabels = function (series, name) {
        series.name(name)
            .stroke('3 #fff 1');
        series.hovered().stroke('3 #fff 1');
    };

    // temp variable to store series instance
    var series;

    // create first series with mapped data
    series = chart.bar(seriesData_1);
    setupSeriesLabels(series, '1° Nota');

    // create second series with mapped data
    series = chart.bar(seriesData_2);
    setupSeriesLabels(series, '2° Nota');

    // create third series with mapped data
    series = chart.bar(seriesData_3);
    setupSeriesLabels(series, '3° Nota');

    // create fourth series with mapped data
    series = chart.bar(seriesData_4);
    setupSeriesLabels(series, '4° Nota');

    // turn on legend
    chart.legend()
        .enabled(true)
        .fontSize(14)
        .padding([0, 0, 5, 0]);

    chart.interactivity().hoverMode('by-x');

    chart.tooltip()
        .displayMode('union')
        .valuePrefix('%');

    // set container id for the chart
    chart.container('container');
    // initiate chart drawing
    chart.draw();
});