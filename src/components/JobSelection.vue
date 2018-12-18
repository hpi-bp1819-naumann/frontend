<template>
  <div class="job-selection md-elevation-1">

    <div class="md-display-2">Select Job</div>

    <div id="analyzer" class="md-layout md-gutter">
      <div class="md-layout-item md-size-20">
        <md-field>
          <label>Analyzer</label>
          <md-select v-model="selectedAnalyzerIndex">
            <md-option v-for="(analyzer, index) in analyzers"
                       :value="index">
              {{analyzer.name}}
            </md-option>
          </md-select>
        </md-field>
      </div>
    </div >

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.context">
        <md-field>
          <label>Context</label>
          <md-select v-model="selectedContext">
            <md-option v-for="(context, index) in contexts" :key="index" :value="context">{{context}}</md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.table">
        <md-field>
          <label>Tablename</label>
          <md-input v-model="table" spellcheck="false"></md-input>
        </md-field>
      </div>

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.column">
        <md-field>
          <label>Columnname</label>
          <md-input v-model="column" spellcheck="false"></md-input>
        </md-field>
      </div>
    </div>

    <div class="md-layout md-gutter">

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.where">
        <md-field>
          <label>WHERE</label>
          <!--<md-input v-model="column" spellcheck="false"></md-input>-->
        </md-field>
      </div>

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.instance">
        <md-field>
          <label>Instance</label>
          <!--<md-input v-model="column" spellcheck="false"></md-input>-->
        </md-field>
      </div>

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.predicate">
        <md-field>
          <label>Predicate</label>
          <!--<md-input v-model="column" spellcheck="false"></md-input>-->
        </md-field>
      </div>

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.pattern">
        <md-field>
          <label>Pattern</label>
          <!--<md-input v-model="column" spellcheck="false"></md-input>-->
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

            Result:  <span v-if="results[index]">  {{results[index]}} </span>
          </md-list-item>
        </md-list>

      </div>
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
        selectedAnalyzer: {},
        selectedAnalyzerIndex: null,
        selectedContext: "jdbc",
        table: "food_des",
        column: "fat_factor",
        results: [],
      };
    },

    watch: {
      selectedAnalyzerIndex: function () {
        this.selectedAnalyzer = {
          name: this.analyzers[this.selectedAnalyzerIndex].name,
          key: this.analyzers[this.selectedAnalyzerIndex].key,
        };
        for (let option of this.analyzers[this.selectedAnalyzerIndex].parameters) {
          this.selectedAnalyzer[option.name] = true;
        }
        console.log(this.selectedAnalyzer);
      }
    },

    methods: {
      startJob: function () {

        console.log("selectedAnalyzer: ", this.selectedAnalyzer.name);
        console.log("context: ", this.selectedContext);
        console.log("table: ", this.table);
        console.log("column: ", this.column);

        axios
          .post(`http://localhost:8080/api/jobs/${this.selectedAnalyzer.key}/start`, {
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
            this.results[jobIndex] = response.data.result;
            this.results = JSON.parse(JSON.stringify(this.results));
          });
      }
    },
    mounted() {
      axios.get("http://localhost:8080/api/jobs/analyzers").then(response => {
        this.analyzers = response.data.analyzers;
        this.selectedAnalyzer.name = response.data.analyzers[0];
      });
    }
  };
</script>

<style>
  .job-selection {
    padding: 20px;
  }


  #pending {
    margin-top: 20px;
  }

</style>
