<template>
  <div class="job-selection md-elevation-1">

    <div class="md-display-2">Select Job</div>

    <div class="md-layout md-gutter">

      <div class="md-layout-item md-size-15">
        <md-field>
          <label>Analyzer</label>
          <md-select v-model="selectedAnalyzer">
            <md-option v-for="(analyzer, index) in analyzers"
                       :value="analyzer.key"
                       :key="index">
              {{analyzer.name}}
            </md-option>
            <md-option value="corellation">Verdana</md-option>
          </md-select>
        </md-field>
      </div>


      <div class="md-layout-item md-size-15">
        <md-field>
          <label>Context</label>
          <md-select v-model="selectedContext">
            <md-option v-for="(context, index) in contexts" v-bind:key="index" :value="context">{{context}}</md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item md-size-15">
        <md-field>
          <label>Tablename</label>
          <md-input v-model="table" spellcheck="false"></md-input>
        </md-field>
      </div>

      <div class="md-layout-item md-size-15">
        <md-field>
          <label>Columnname</label>
          <md-input v-model="column" spellcheck="false"></md-input>
        </md-field>
      </div>

    </div>

    <md-button class="md-dense md-raised md-primary" @click="startJob">Start Job</md-button>

    <div class="md-display-2" id="pending">Pending Jobs</div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-80">

        <md-list>
          <md-list-item v-for="(job, index) in jobs" :key="index">
            <span class="md-list-item-text">{{index + 1}}. {{job.analyzer.charAt(0).toUpperCase() + job.analyzer.slice(1)}} -  {{job.jobId}}</span>
            <md-button @click="checkResult(job.jobId, index)" class="md-dense md-raised">
              Get Result
            </md-button>

            Result: <span  v-if="results[index]"> {{results[index]}} </span>
          </md-list-item>
        </md-list>

      </div>
    </div>


    <!--<div v-for="(job, index) in jobs" v-bind:key="index">-->
      <!--<label>{{index + 1}}: {{job.analyzer}} {{job.jobId}}</label>-->
      <!--<md-button @click="checkResult(job.jobId)" class="md-dense md-raised">-->
        <!--Get Result-->
      <!--</md-button>-->
    <!--</div>-->
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
        column: "fat_factor",
        results: [],
      };
    },
    watch: {
      results: function(){},
    },
    methods: {
      startJob: function () {

        console.log("selectedAnalyzer: ", this.selectedAnalyzer.toLowerCase());
        console.log("context: ", this.selectedContext);
        console.log("table: ", this.table);
        console.log("column: ", this.column);

        axios
          .post(`http://localhost:8080/api/jobs/${this.selectedAnalyzer}/start`, {
            context: this.selectedContext,
            table: this.table,
            column: this.column
          })
          .then(response => this.jobs.push(response.data));
      },
      checkResult: function (jobId, jobIndex) {
        axios
          .get(`http://localhost:8080/api/jobs/${jobId}/result`)
          .then(response => {
            // console.log(response, response.data);
            let resultsCopy = JSON.parse(JSON.stringify(this.results));
            resultsCopy[jobIndex] = response.data.result;
            this.results = resultsCopy;
            console.log(this.results);
            // alert(response.data.result);
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

<style>
  .job-selection {
    padding: 20px;
  }

  .md-field {
    max-width: 300px;
  }

  #pending {
    margin-top: 20px;
  }

</style>
