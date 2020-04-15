Chart.defaults.global.legend.display = false;
var ctx = document.getElementById('myChart').getContext('2d');

  var chart = new Chart(ctx, {
      
      // The type of chart we want to create
      type: 'doughnut',

      // The data for our dataset
      data: {
          labels:["Data Remaining","Data Used"],
          datasets: [{
              label: "My First dataset",
              backgroundColor: ["red","grey"],
              borderColor: '#fff',
              data: [rem,used],
          }]
      },

      // Configuration options go here
      options: {
          circumference: 1 * Math.PI,
          rotation: 1 * Math.PI,
          cutoutPercentage: 90
      }
  });

  Chart.pluginService.register({
  beforeDraw: function(chart) {
    var width = chart.chart.width,
        height = chart.chart.height,
        ctx = chart.chart.ctx;

    ctx.restore();
    var fontSize = (height / 114).toFixed(2);
    ctx.font = fontSize + "em sans-serif";
    ctx.textBaseline = "middle";

    var text = rem + "GB/"+data + "GB"
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
    var text = plan,
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height /1.4;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
});