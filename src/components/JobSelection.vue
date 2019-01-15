<template>
  <div class="job-selection md-elevation-1">
    <div class="md-layout md-gutter">
      <router-link to="/dashboard">
        <md-button class="md-raised md-primary">menu</md-button>
      </router-link>
      <div class="md-display-2">Select Job</div>
    </div>

    <form novalidate @submit.prevent="validateUser">

      <div class="md-layout md-gutter">
        Jobs: {{jobs[0].form}}
        <div class="md-layout-item md-size-20" v-if="jobs[0].form.selectedAnalyzer.options.hasContext">
          <md-field>
            <label>Context</label>
            <md-select v-model="jobs[0].form.selectedAnalyzer.context">
              <md-option
                v-for="(context, index) in contexts"
                :key="index"
                :value="context">{{context}}
              </md-option>
            </md-select>
          </md-field>
        </div>


        <div class="md-layout-item md-size-20" v-if="jobs[0].form.selectedAnalyzer.options.hasTable">
          <md-field :class="getValidationClassForSelectedAnalyzer('table')">
            <label>Tablename</label>
            <md-input v-model="jobs[0].form.selectedAnalyzer.table" spellcheck="false"></md-input>
            <!--<span class="md-error" v-if="!$v.form.selectedAnalyzer.table.required">This field is required</span>-->
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="jobs[0].form.selectedAnalyzer.options.hasColumn">
          <md-field :class="getValidationClassForSelectedAnalyzer('column')">
            <label>Columnname</label>
            <md-input v-model="jobs[0].form.selectedAnalyzer.column" spellcheck="false"></md-input>
            <!--<span class="md-error" v-if="!$v.form.selectedAnalyzer.column.required">This field is required</span>-->
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

        <div class="md-layout-item md-size-20" v-if="job.form.selectedAnalyzer.options.hasInstance">
          <md-field :class="getValidationClassForSelectedAnalyzer('instance')">
            <label>Instance</label>
            <md-input v-model="job.form.selectedAnalyzer.instance" spellcheck="false"></md-input>
            <md-tooltip md-direction="right">metric instance name, describing what the analysis is being done for<br>e.g. "example"</md-tooltip>
            <!--<span class="md-error" v-if="!$v.job.form.selectedAnalyzer.instance.required">This field is required</span>-->
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.form.selectedAnalyzer.options.hasPredicate">
          <md-field :class="getValidationClassForSelectedAnalyzer('predicate')">
            <label>Predicate</label>
            <md-input v-model="job.form.selectedAnalyzer.predicate" spellcheck="false"></md-input>
            <md-tooltip md-direction="right">SQL-predicate to apply per row <br>e.g. "Price > 50"</md-tooltip>
            <!--<span class="md-error" v-if="!$v.job.form.selectedAnalyzer.predicate.required">This field is required</span>-->
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.form.selectedAnalyzer.options.hasPattern">
          <md-field :class="getValidationClassForSelectedAnalyzer('patternMatch')">
            <label>Pattern</label>
            <md-input v-model="job.form.selectedAnalyzer.patternMatch" spellcheck="false"></md-input>
            <md-tooltip md-direction="right">The regular expression to check for <br>e.g. "for | (example)*"</md-tooltip>
            <!--<span class="md-error" v-if="!$v.job.form.selectedAnalyzer.patternMatch.required">This field is required</span>-->
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.form.selectedAnalyzer.options.hasWhere">
          <md-field>
            <label>WHERE</label>
            <md-input v-model="job.form.selectedAnalyzer.where" spellcheck="false"></md-input>
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
  import {validationMixin} from 'vuelidate';
  import {
    required,
    email,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators';

  export default {
    name: "JobSelection",
    mixins: [validationMixin],
    data() {
      return {
        analyzers: [],
        contexts: ["jdbc", "spark"],
        jobs: [
          {
            form: {
              selectedAnalyzer: {
                context: "jdbc",
                table: "food_des",
                column: "fat_factor",
                where: null,
                options: {},
                key: "",
                name: null,
              },
            },
            selectedAnalyzerIndex: 0,
          }
        ],
      };
    },
    // validations() {
    //   let regularValidation = {
    //     form: {
    //       selectedAnalyzer: {
    //         table: {required},
    //         column: {required},
    //         instance: {},
    //         predicate: {},
    //         patternMatch: {},
    //         name: null,
    //       },
    //     }
    //   };
    //   if (this.form.selectedAnalyzer.key === "compliance") {
    //     regularValidation.form.selectedAnalyzer.column = {};
    //     regularValidation.form.selectedAnalyzer.instance = {required};
    //     regularValidation.form.selectedAnalyzer.predicate = {required};
    //   } else if (this.form.selectedAnalyzer.key === "patternMatch") {
    //     regularValidation.form.selectedAnalyzer.patternMatch = {required};
    //     regularValidation.form.selectedAnalyzer.patternMatch = {required};
    //   }
    //   return regularValidation;
    // },
    components: {
      jobs: Jobs
    },
    methods: {
      setParamsForSelectedAnalyzer(jobIndex) {
        let jobAnalyzer = this.jobs[jobIndex].form.selectedAnalyzer;
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

      startJobs: function () {
        let promises = [];
        let that = this;
        this.jobs.forEach(function(job){
          promises.push(that.startSingleJob(job.form.selectedAnalyzer));
        });

        axios.all(promises).then(function(results){
          results.forEach(function(response){
            console.log("response is: ", response);
          })
        }).then(() => {
          console.log("alle responses fertig!");
          this.$refs.jobsOverview.refresh();
        });

        //.then(() => this.$refs.jobsOverview.refresh());

        // for (let i = 0; i < this.jobs.length; i++) {
        //   this.startSingleJob(this.jobs[i].form.selectedAnalyzer);
        // }
      },
      validateUser() {
        this.startJobs();
        // this.$v.form.$touch();
        // if (!this.$v.$invalid) {
        //   console.log("User is valid!");
        //   this.startJob();
        // } else {
        //   console.log("User in invalid")
        // }
      },
      getValidationClassForSelectedAnalyzer(fieldName) {
        // const field = this.$v.form.selectedAnalyzer[fieldName];
        // if (field) {
        //   return {
        //     'md-invalid': field.$invalid && field.$dirty
        //   }
        // }
        return "nix";
      },
      copyJob: function () {
        this.jobs.push(JSON.parse(JSON.stringify(this.jobs[0])));
      },
    },
    mounted() {
      axios.get("http://localhost:8080/api/jobs/analyzers").then(response => {
        this.analyzers = response.data.analyzers;
        this.selectedAnalyzerIndex = 0;
        console.log("analyzers set: ", this.analyzers);
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
