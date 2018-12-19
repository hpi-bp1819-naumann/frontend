<template>
  <div>
    <h1>Job Details</h1>
    <md-list>
      <md-list-item>{{this.job.id}}</md-list-item>
      <md-list-item>Status: {{this.job.status}}</md-list-item>
      <md-list-item>Started: {{this.job.startingTime}}</md-list-item>
      <md-list-item v-if="job.status === 'completed'">Finished: {{this.job.finishingTime}}</md-list-item>
      <md-list-item
        v-if="job.status === 'completed'"
      >Duration: {{msToTime(this.job.finishingTime - this.job.startingTime)}}</md-list-item>
      <div v-if="job.status === 'completed'">
        <!-- hacky way to distingush between Histogram and others -->
        <md-list-item v-if="job.result.value.values">Histogram</md-list-item>
        <md-list-item v-else>Result: {{this.job.result.value}}</md-list-item>
      </div>
    </md-list>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Job",
  data() {
    return {
      job: {
        id: "",
        status: "",
        result: {},
        startingTime: "",
        finishingTime: ""
      }
    };
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
          console.log(this.$route);
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
        result += hours + "h ";
      }
      if (minutes > 0 || hours > 0) {
        result += minutes + "min ";
      }
      if (seconds > 0 || minutes > 0 || hours > 0) {
        result += seconds + "sec ";
      }
      result += milliseconds + "msec";

      return result;
    }
  }
};
</script>
