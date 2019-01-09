<template>
  <div>
    <div class="histogram-options">
      <div class="md-layout-item md-size-20">
        <md-field>
          <label>Minimum Bucket Size</label>
          <md-input v-model="minimumBucketSize" type="number" min="1"></md-input>
        </md-field>
      </div>
    </div>
    <div :ref="id" style="width:90%;height:400px;"></div>
  </div>
</template>

<script>
export default {
  props: ["frequencies"],
  data() {
    return {
      id: "histogramPlot",
      minimumBucketSize: 1
    };
  },
  mounted() {
    this.plot();
  },
  watch: {
    minimumBucketSize: function() {
      this.plot();
    }
  },
  methods: {
    plot: function() {
      const frequencies = this.frequencies;
      const filteredKeys = Object.keys(frequencies).filter(
        key => frequencies[key].absolute >= this.minimumBucketSize
      );
      const absolute = filteredKeys.map(key => frequencies[key].absolute);
      const keys = filteredKeys;
      const trace = {
        x: keys,
        y: absolute,
        text: absolute.map(String),
        type: "bar",
        textposition: "auto",
        hoverinfo: "x+y"
      };
      const layout = {
        xaxis: {
          type: "category"
        }
      };
      const data = [trace];
      Plotly.newPlot(this.$refs[this.id], data, layout);
    }
  }
};
</script>

<style>
.histogram-options {
  padding: 20px;
}
</style>
