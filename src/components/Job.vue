<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-display-2">Job Details</div>
    </div>
    <md-list>
      <md-list-item>{{this.job.name}}</md-list-item>
      <md-list-item>Status: {{this.job.status}}</md-list-item>
      <md-list-item
        v-for="(value, param) in job.params"
        v-bind:key="param"
      >{{param}}: {{value ? value : "Not defined"}}</md-list-item>
      <md-list-item>Started: {{this.job.startingTime.toLocaleString()}}</md-list-item>
      <md-list-item
        v-if="job.status === 'completed'"
      >Finished: {{this.job.finishingTime.toLocaleString()}}</md-list-item>
      <md-list-item
        v-if="job.status === 'completed'"
      >Duration: {{msToTime(this.job.finishingTime - this.job.startingTime)}}</md-list-item>

      <div v-if="job.status === 'completed'">
        <div v-if="job.name === 'Histogram'">
          <br>
          <histogram :frequencies="job.result.value.values" type="bar"></histogram>
        </div>
        <div v-else-if="job.name === 'DataType'">
          <br>
          <histogram :frequencies="job.result.value.values" type="pie"></histogram>
        </div>
        <md-list-item v-else>Result: {{this.job.result.value}}</md-list-item>
        <md-button v-if="job.query" class="md-dense md-raised md-primary" @click="executeQuery()">
          Execute Query
        </md-button>

        <div v-if="queryResult" class="md-layout-item">
          <md-table md-card>
            <md-table-row>
              <md-table-head>index</md-table-head>
              <md-table-head v-for="(item, index) in queryResult.columns" :value="item" :key="index">
                {{item}}
              </md-table-head>
            </md-table-row>
            <md-table-row v-for="(row, index) in queryResult.data" :value="row" :key="index">
              <md-table-cell>{{index + 1}}</md-table-cell>
              <md-table-cell v-for="(cell, index) in row" :value="cell" :key="index">{{cell}}</md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </div>
    </md-list>
  </div>
</template>

<script>
import axios from "axios";
import Histogram from "./Histogram";

export default {
  props: ["id"],
  name: "Job",
  data() {
    return {
      job: {
        id: "",
        status: "",
        name: "",
        result: {},
        startingTime: "",
        finishingTime: "",
        params: {},
        query: null
      },
      queryResult: null
    };
  },
  components: {
    histogram: Histogram
  },
  created() {
    this.fetchData();
  },

  watch: {
    $route: "fetchData"
  },

  methods: {
    fetchData() {
      axios
        .get(`http://localhost:8080/api/jobs/${this.id}`)
        .then(resp => {
          var job = resp.data.job;
          job.startingTime = new Date(job.startingTime);
          if (job.status === "completed") {
            job.finishingTime = new Date(job.finishingTime);
          }
          this.job = job;
        })
        .catch(err => {
          this.$router.push("/jobs");
        });
    },
    msToTime(duration) {
      var result = "";
      var milliseconds = parseInt(duration % 1000),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

      if (hours > 0) {
        result += hours + " h ";
      }
      if (minutes > 0 || hours > 0) {
        result += minutes + " min ";
      }
      if (seconds > 0 || minutes > 0 || hours > 0) {
        result += seconds + " sec ";
      }
      result += milliseconds + " msec";

      return result;
    },
    executeQuery() {
      const body = {
        query: this.job.query
      };
      axios
        .post("http://localhost:8080/api/db/query", body)
        .then(response => (this.queryResult = response.data.result));
    }
  }
};
</script>
