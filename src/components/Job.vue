<template>
  <div>
    <div class="md-layout md-gutter">
      <router-link to="/jobs"><md-button class="md-raised md-primary">analyzers</md-button></router-link>
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
      </div>
    </md-list>
  </div>
</template>

<script>
import axios from "axios";
import Histogram from "./Histogram";

export default {
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
        params: {}
      }
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
        .get(`http://localhost:8080/api/jobs/${this.$route.params.jobId}`)
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
    }
  }
};
</script>
