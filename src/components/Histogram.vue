<template>
  <div>
    <div class="histogram-options">
      <div class="md-layout-item md-size-20">
        <md-field>
          <label>Minimum Bucket Size</label>
          <md-input v-model="minimumBucketSize" type="number" min="1"></md-input>
        </md-field>
      </div>

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-20">
          <md-field>
            <label>Sort by Bucket Name</label>
            <md-select v-model="sortByBucketName">
              <md-option value="none" key="none">None</md-option>
              <md-option value="asc" key="asc">Ascending</md-option>
              <md-option value="desc" key="desc">Descending</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20">
          <md-field>
            <label>Sort by Bucket Size</label>
            <md-select v-model="sortByBucketSize">
              <md-option value="none" key="none">None</md-option>
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
  props: ["frequencies"],
  data() {
    return {
      id: "histogramPlot",
      minimumBucketSize: 1,
      sortByBucketSize: "none",
      sortByBucketName: "none"
    };
  },
  mounted() {
    this.plot();
  },
  watch: {
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
      const frequencies = this.frequencies;
      const keys = this.prepareKeys();
      const absolute = keys.map(key => frequencies[key].absolute);

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
    },
    prepareKeys: function() {
      const frequencies = this.frequencies;
      const keys = Object.keys(frequencies).filter(
        key => frequencies[key].absolute >= this.minimumBucketSize
      );
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
    }
  }
};
</script>

<style>
.histogram-options {
  padding: 20px;
}
</style>
