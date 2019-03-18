<template>
  <div>
    <div class="md-display-2">Job Details</div>
    <div>
      <div class="md-headline job-name">{{this.job.name}}</div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-15 column-left">Status:</div>
      <div class="md-layout-item md-size-30 column-right">{{this.job.status}}</div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-15 column-left">Table:</div>
      <div class="md-layout-item md-size-30 column-right">{{this.job.table}}</div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-15 column-left">Context:</div>
      <div class="md-layout-item md-size-30 column-right">{{this.job.context}}</div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-15 column-left">Started:</div>
      <div class="md-layout-item md-size-30 column-right">{{this.job.startingTime.toLocaleString()}}</div>
    </div>

    <div class="md-layout" v-if="job.status === 'completed'">
      <div class="md-layout-item md-size-15 column-left">Finished:</div>
      <div class="md-layout-item md-size-30 column-right"> {{this.job.finishingTime.toLocaleString()}}</div>
    </div>

    <div class="md-layout" v-if="job.status === 'completed'">
      <div class="md-layout-item md-size-15 column-left">Duration:</div>
      <div class="md-layout-item md-size-30 column-right"> {{msToTime(this.job.finishingTime - this.job.startingTime)}}</div>
    </div>

    <div v-else-if="job.status === 'error'">
      <div class="md-layout" >
        <div class="md-layout-item md-size-10 column-left resultcolumn">Error:</div>
        <div class="md-layout-item md-size-30 column-right resultcolumn"> {{this.job.errorMessage}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import Histogram from "./Histogram";

  export default {
    props: ["job"],
    name: "Job",
    data() {
      return {
      };
    },
    components: {
      histogram: Histogram
    },
    methods: {
      msToTime(duration) {
        console.log(typeof this.job.startingTime);
        console.log(this.job.finishingTime);
        console.log(duration)
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
