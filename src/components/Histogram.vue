<template>
  <div>
    <!-- <div id="histogramPlot" style="width:90%;height:250px;"></div> -->
    <div :ref="id" style="width:90%;height:250px;"></div>
  </div>
</template>

<script>
export default {
  props: ["frequencies"],
  data() {
    return {
      id: "histogramPlot2"
    };
  },
  mounted() {
    var data = [];
    const frequencies = this.frequencies;
    Object.keys(frequencies).map(function(key) {
      const absolute = frequencies[key].absolute;
      var yarray = new Array(absolute).fill(absolute);
      var trace = { x: yarray, name: key };
      data.push(trace);
    });

    Plotly.plot(this.$refs[this.id], data, {
      margin: { t: 0 }
    });

    new Chartist.Bar(
      "#histogramPlot",
      {
        labels: [Object.keys(this.frequencies)],
        series: [[Object.values(this.frequencies).map(d => d.absolute)]]
      },
      {
        low: 0,
        showArea: true
      }
    );
  }
};
</script>
