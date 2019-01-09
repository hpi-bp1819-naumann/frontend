<template>
  <div>
    <div class="histogram-options">
      <div class="md-layout-item md-size-20">
        <md-field>
          <label>Chart Type</label>
          <md-select v-model="chartType">
            <md-option value="bar" key="bar">Bar</md-option>
            <md-option value="pie" key="pie">Pie</md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-20">
          <md-field>
            <label>Minimum Bucket Size</label>
            <md-input v-model="minimumBucketSize" type="number" min="0"></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-20">
          <md-field>
            <label>Sort by Bucket Size</label>
            <md-select v-model="sortByBucketSize">
              <md-option value="unsorted" key="unsorted">Unsorted</md-option>
              <md-option value="asc" key="asc">Ascending</md-option>
              <md-option value="desc" key="desc">Descending</md-option>
            </md-select>
          </md-field>
        </div>
        <div class="md-layout-item md-size-20">
          <md-field>
            <label>Sort by Bucket Name</label>
            <md-select v-model="sortByBucketName">
              <md-option value="unsorted" key="unsorted">Unsorted</md-option>
              <md-option value="asc" key="asc">Ascending</md-option>
              <md-option value="desc" key="desc">Descending</md-option>
            </md-select>
          </md-field>
        </div>
      </div>
    </div>
    <div :ref="id" style="width:90%;height:400px;"></div>
  </div>
</template>

<script>
export default {
  props: ["frequencies", "type"],
  data() {
    return {
      id: "histogramPlot",
      chartType: "bar",
      minimumBucketSize: 0,
      sortByBucketSize: "unsorted",
      sortByBucketName: "unsorted"
    };
  },
  mounted() {
    if (this.type) {
      this.chartType = this.type;
    }
    this.plot();
  },
  watch: {
    chartType: function() {
      this.plot();
    },
    minimumBucketSize: function() {
      this.plot();
    },
    sortByBucketSize: function() {
      this.plot();
    },
    sortByBucketName: function() {
      this.plot();
    }
  },
  methods: {
    plot: function() {
      const frequencies = { ...this.frequencies };
      const keys = this.prepareKeys(frequencies);
      const absolute = keys.map(key => frequencies[key].absolute);

      var data = [],
        layout = {};
      if (this.chartType === "bar") {
        const trace = {
          x: keys,
          y: absolute,
          text: absolute.map(String),
          type: "bar",
          textposition: "auto",
          hoverinfo: "x+y"
        };
        data = [trace];
        layout = {
          xaxis: {
            title: "Bucket Name",
            type: "category"
          },
          yaxis: {
            title: "Bucket Size"
          }
        };
      } else {
        const trace = {
          labels: keys,
          values: absolute,
          type: "pie",
          hoverinfo: "label+percent+value",
          sort: false
        };
        data = [trace];
      }

      Plotly.newPlot(this.$refs[this.id], data, layout);
    },
    prepareKeys: function(frequencies) {
      const keys =
        this.chartType === "pie"
          ? this.prepareKeysForPieChart(frequencies)
          : this.prepareKeysForBarChart(frequencies);

      if (this.sortByBucketName === "asc") {
        keys.sort();
      } else if (this.sortByBucketName === "desc") {
        keys.sort();
        keys.reverse();
      }

      if (this.sortByBucketSize === "asc") {
        keys.sort(function(a, b) {
          return frequencies[a].absolute - frequencies[b].absolute;
        });
      } else if (this.sortByBucketSize === "desc") {
        keys.sort(function(a, b) {
          return frequencies[b].absolute - frequencies[a].absolute;
        });
      }

      return keys;
    },
    prepareKeysForBarChart: function(frequencies) {
      const keys = Object.keys(frequencies).filter(
        key => frequencies[key].absolute >= this.minimumBucketSize
      );

      return keys;
    },
    prepareKeysForPieChart: function(frequencies) {
      const keys = Object.keys(frequencies);
      const tooSmall = keys.filter(
        key => frequencies[key].absolute < this.minimumBucketSize
      );

      if (tooSmall.length > 0) {
        var filteredKeys = keys.filter(
          key => frequencies[key].absolute >= this.minimumBucketSize
        );
        const bucketNameTooSmall = "Smaller than Minimum Bucket Size";
        const totalTooSmall = tooSmall
          .map(key => frequencies[key].absolute)
          .reduce((res, curr) => res + curr, 0);

        filteredKeys.push(bucketNameTooSmall);
        frequencies[bucketNameTooSmall] = {
          absolute: totalTooSmall
        };
        return filteredKeys;
      }
      return keys;
    }
  }
};
</script>

<style>
.histogram-options {
  padding: 20px;
}
</style>
