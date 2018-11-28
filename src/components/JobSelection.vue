<template>
  <div class="JobSelection">
    <div>
      <label>Job:</label>
      <select v-model="selectedAnalyzer">
        <option
          v-for="(analyzer, index) in analyzers"
          v-bind:key="index"
          :value="analyzer"
        >{{analyzer}}</option>
      </select>
    </div>
    <div>
      <label>Context:</label>
      <select v-model="selectedContext">
        <option v-for="(context, index) in contexts" v-bind:key="index" :value="context">{{context}}</option>
      </select>
    </div>
    <div>
      <label>Table:</label>
      <input v-model="table">
    </div>
    <div>
      <label>Column:</label>
      <input v-model="column">
    </div>

    <button @click="startJob">Start Job</button>
    <h2>Pending Jobs:</h2>
    <div v-for="(job, index) in jobs" v-bind:key="index">
      <label>{{index + 1}}: {{job.analyzer}} {{job.jobId}}</label>
      <button @click="checkResult(job.jobId)">Get Result</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "JobSelection",
  data() {
    return {
      analyzers: [],
      contexts: ["jdbc", "spark"],
      jobs: [],
      selectedAnalyzer: "",
      selectedContext: "jdbc",
      table: "food_des",
      column: "fat_factor"
    };
  },
  methods: {
    startJob: function() {
      axios
        .post(`http://localhost:8080/api/jobs/${this.selectedAnalyzer}/start`, {
          context: this.selectedContext,
          table: this.table,
          column: this.column
        })
        .then(response => this.jobs.push(response.data));
    },
    checkResult: function(jobId) {
      axios
        .get(`http://localhost:8080/api/jobs/${jobId}/result`)
        .then(response => {
          console.log(response, response.data);
          alert(response.data.result);
        });
    }
  },
  mounted() {
    axios.get("http://localhost:8080/api/jobs/analyzers").then(response => {
      this.analyzers = response.data.analyzers;
      this.selectedAnalyzer = response.data.analyzers[0];
    });
  }
};
</script>
