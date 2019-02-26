<template>
  <div>

    <div class="md-display-2">Job Details</div>

    <div>
      <div class="md-headline job-name">{{this.job.name}}</div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-10 column-left">Status:</div>
      <div class="md-layout-item md-size-30 column-right">{{this.job.status}}</div>
    </div>

    <div class="md-layout" v-for="(value, param) in job.params" v-bind:key="param">
      <div class="md-layout-item md-size-10 column-left">{{param}}:</div>
      <div class="md-layout-item md-size-30 column-right">{{value ? value : "Not defined"}}</div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-10 column-left">Started:</div>
      <div class="md-layout-item md-size-30 column-right">{{this.job.startingTime.toLocaleString()}}</div>
    </div>

    <div class="md-layout" v-if="job.status === 'completed'">
      <div class="md-layout-item md-size-10 column-left">Finished:</div>
      <div class="md-layout-item md-size-30 column-right"> {{this.job.finishingTime.toLocaleString()}}</div>
    </div>

    <div class="md-layout" v-if="job.status === 'completed'">
      <div class="md-layout-item md-size-10 column-left">Duration:</div>
      <div class="md-layout-item md-size-30 column-right"> {{msToTime(this.job.finishingTime - this.job.startingTime)}}</div>
    </div>


    <div class="md-layout" v-if="job.status === 'completed'">
      <div class="md-layout-item md-size-10 column-left">Finished:</div>
      <div class="md-layout-item md-size-30 column-right"> {{this.job.finishingTime.toLocaleString()}}</div>
    </div>


    <div v-if="job.status === 'completed'">
      <div v-if="job.name === 'Histogram'">
        <br>
        <histogram :frequencies="job.result.value.values" type="bar"></histogram>
      </div>

      <div v-else-if="job.name === 'DataType'">
        <br>
        <histogram :frequencies="job.result.value.values" type="pie"></histogram>
      </div>

      <div class="md-layout" v-else>
        <div class="md-layout-item md-size-10 column-left resultcolumn">Result:</div>
        <div class="md-layout-item md-size-30 column-right resultcolumn"> {{this.job.result.value}}</div>
      </div>

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
<style>
  .job-name{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .column-left{
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 4px;
    font-weight: 500;
  }

  .resultcolumn{
    margin-top: 16px;
    font-size: 18px;
    font-weight: 500;
    /*background-color: orange;*/
  }
</style>
