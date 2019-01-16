<template>
  <div class="job-selection md-elevation-1">
    <div class="md-layout md-gutter">
      <router-link to="/dashboard">
        <md-button class="md-raised md-primary">menu</md-button>
      </router-link>
      <div class="md-display-2">Select Job</div>
    </div>

    <form novalidate @submit.prevent="startJobs">

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-20" v-if="jobs[0].selectedAnalyzer.options.hasContext">
          <md-field>
            <label>Context</label>
            <md-select v-model="jobs[0].selectedAnalyzer.context">
              <md-option
                v-for="(context, index) in contexts"
                :key="index"
                :value="context">{{context}}
              </md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="jobs[0].selectedAnalyzer.options.hasTable">
          <md-field :class="{'md-invalid': !areFieldsValid[0]}">
            <label>Tablename</label>
            <md-input ref="tableName" v-model="jobs[0].selectedAnalyzer.table" spellcheck="false" @keyup="validateForm"></md-input>
            <span class="md-error" v-if="!areFieldsValid[0]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="jobs[0].selectedAnalyzer.options.hasColumn">
          <md-field :class="{'md-invalid': !areFieldsValid[1]}">
            <label>Columnname</label>
            <md-input v-model="jobs[0].selectedAnalyzer.column" spellcheck="false" @keyup="validateForm"></md-input>
            <span class="md-error" v-if="!areFieldsValid[1]">This field is required</span>
          </md-field>
        </div>
      </div>

      <div class="md-layout md-gutter" v-for="(job, jobIndex) in jobs">

        <div class="md-layout-item md-size-20">
          <md-field>
            <label>Analyzer</label>
            <md-select v-model="job.selectedAnalyzerIndex" @md-selected="setParamsForSelectedAnalyzer(jobIndex)">
              <md-option v-for="(analyzer, index) in analyzers" :value="index" :key="index">
                {{analyzer.name}}
              </md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.selectedAnalyzer.options.hasInstance">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex+2][0]}">
            <label>Instance</label>
            <md-input v-model="job.selectedAnalyzer.instance" spellcheck="false" @keyup="validateForm"></md-input>
            <md-tooltip md-direction="right">metric instance name, describing what the analysis is being done for<br>e.g. "example"</md-tooltip>
            <span class="md-error" v-if="!areFieldsValid[jobIndex+2][0]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.selectedAnalyzer.options.hasPredicate">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex+2][1]}">
            <label>Predicate</label>
            <md-input v-model="job.selectedAnalyzer.predicate" spellcheck="false" @keyup="validateForm"></md-input>
            <md-tooltip md-direction="right">SQL-predicate to apply per row <br>e.g. "Price > 50"</md-tooltip>
            <span class="md-error" v-if="!areFieldsValid[jobIndex+2][1]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.selectedAnalyzer.options.hasPattern">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex+2][0]}">
            <label>Pattern</label>
            <md-input v-model="job.selectedAnalyzer.patternMatch" spellcheck="false" @keyup="validateForm"></md-input>
            <md-tooltip md-direction="right">The regular expression to check for <br>e.g. "for | (example)*"</md-tooltip>
            <span class="md-error" v-if="!areFieldsValid[jobIndex+2][0]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.selectedAnalyzer.options.hasWhere">
          <md-field>
            <label>WHERE</label>
            <md-input v-model="job.selectedAnalyzer.where" spellcheck="false"></md-input>
            <md-tooltip md-direction="right">Additional filter to apply before the analyzer is run <br>e.g. "Price > 50"</md-tooltip>
          </md-field>
        </div>

      </div>

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-20">
          <md-button @click="copyJob" class="md-dense md-raised ">Copy Job</md-button>
        </div>
      </div>
      <md-button type="submit" class="md-dense md-raised md-primary">Start Job</md-button>
    </form>

    <jobs ref="jobsOverview"></jobs>
  </div>
</template>


<script>
  import axios from "axios";
  import Jobs from "./Jobs";
  export default {
    name: "JobSelection",
    data() {
      return {
        areFieldsValid: [true, true, []], // 0 tableName, 1 columnName, 2+ [] Array of Values for field
        analyzers: [],
        contexts: ["jdbc", "spark"],
        jobs: [
          {
            selectedAnalyzer: {
              context: "jdbc",
              table: "food_des",
              column: "fat_factor",
              where: null,
              options: {},
              key: "",
              name: null,
            },
            selectedAnalyzerIndex: 0,
          }
        ],
      };
    },
    components: {
      jobs: Jobs
    },
    methods: {
      setParamsForSelectedAnalyzer(jobIndex) {
        if (this.analyzers.length === 0) { //at initial loading
          return;
        }
        let jobAnalyzer = this.jobs[jobIndex].selectedAnalyzer;
        let selectedAnalyzer = this.analyzers[this.jobs[jobIndex].selectedAnalyzerIndex];
        jobAnalyzer.name = selectedAnalyzer.name;
        jobAnalyzer.key = selectedAnalyzer.key;

        jobAnalyzer.options = {};
        for (let option of selectedAnalyzer.parameters) {
          let hasString =
            "has" +
            String(option.name)[0].toUpperCase() +
            String(option.name).slice(1);
          jobAnalyzer.options[hasString] = true;
        }
      },
      startSingleJob: function (jobAnalyzer) {
        let requestObject = {
          context: jobAnalyzer.context,
          table: jobAnalyzer.table,
          where: jobAnalyzer.where,
          instance: jobAnalyzer.instance,
          predicate: jobAnalyzer.predicate,
          patternMatch: jobAnalyzer.patternMatch
        };

        if (jobAnalyzer.options.hasColumn) {
          requestObject.column = jobAnalyzer.column;
        }
        console.log("requestObject: ", requestObject);
        return axios.post(
          `http://localhost:8080/api/jobs/${jobAnalyzer.key}/start`,
          requestObject
        );
      },
      startJob: function (startIndex, endIndex) {
        if (startIndex === endIndex) {
          this.$refs.jobsOverview.refresh();
          return;
        } else {
          this.startSingleJob(this.jobs[startIndex].selectedAnalyzer).then(() => {
            this.startJob(startIndex + 1, endIndex);
          });
        }
      },
      startJobs: function () {
        if(this.validateForm() === true){
          this.startJob(0, this.jobs.length);
        } else{
          console.log("Form is invalid!");
        }
      },
      validateForm() {
        this.areFieldsValid = [true, true];
        this.jobs[0].selectedAnalyzer.table === "" ?  this.areFieldsValid[0] = false :  this.areFieldsValid[0] = true;
        this.jobs[0].selectedAnalyzer.column === "" ?  this.areFieldsValid[1] = false :  this.areFieldsValid[1] = true;

        for(let i = 0; i<this.jobs.length; i++) {
          this.areFieldsValid.push([]);
          if (this.jobs[i].selectedAnalyzer.key === "compliance") {
            this.jobs[i].selectedAnalyzer.instance ? this.areFieldsValid[i+2].push(true) : this.areFieldsValid[i+2].push(false);
            this.jobs[i].selectedAnalyzer.predicate  ? this.areFieldsValid[i+2].push(true) : this.areFieldsValid[i+2].push(false);
          } else if(this.jobs[i].selectedAnalyzer.key === "patternMatch"){
            this.jobs[i].selectedAnalyzer.patternMatch ? this.areFieldsValid[i+2].push(true) : this.areFieldsValid[i+2].push(false);
          }
        }
        if(this.areFieldsValid[0] === false || this.areFieldsValid[1] === false){
          return false;
        }
        for(let i = 2; i<this.areFieldsValid.length; i++){
          for(let j = 0; j<this.areFieldsValid[i].length; j++){
            if(this.areFieldsValid[i][j] === false)
              return false;
          }
        }
        return true;
      },
      copyJob: function () {
        this.jobs.push(JSON.parse(JSON.stringify(this.jobs[0])));
        this.areFieldsValid.push([]);
      },
    },
    mounted() {
      axios.get("http://localhost:8080/api/jobs/analyzers").then(response => {
        this.analyzers = response.data.analyzers;
        this.selectedAnalyzerIndex = 0;
      }).then(() => {
        this.setParamsForSelectedAnalyzer(0);
      });
    }
  };
</script>

<style>

  .job-selection {
    padding: 20px;
  }

  .md-tooltip {
    height: auto;
}

</style>
