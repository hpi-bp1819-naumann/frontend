<template>
  <div class="job-selection md-elevation-1">
    <div class="md-layout md-gutter">
      <router-link to="/dashboard"><md-button class="md-raised md-primary">menu</md-button></router-link>
      <div class="md-display-2">Select Job</div>
    </div>

    <form novalidate @submit.prevent="validateUser">

      <div id="analyzer" class="md-layout md-gutter">
        <div class="md-layout-item md-size-20">
          <md-field>
            <label>Analyzer</label>
            <md-select v-model="selectedAnalyzerIndex">
              <md-option v-for="(analyzer, index) in analyzers" :value="index" :key="index">
                {{analyzer.name}}
              </md-option>
            </md-select>
          </md-field>
        </div>
      </div>


      <div  class="md-layout md-gutter" >
        <div class="md-layout-item md-size-20" v-if="form.selectedAnalyzer.options.hasContext">
          <md-field>
            <label>Context</label>
            <md-select v-model="form.selectedAnalyzer.context">
              <md-option
                v-for="(context, index) in contexts"
                :key="index"
                :value="context">{{context}}
              </md-option>
            </md-select>
          </md-field>
        </div>


        <div class="md-layout-item md-size-20" v-if="form.selectedAnalyzer.options.hasTable">
          <md-field :class="getValidationClassForSelectedAnalyzer('table')">
            <label>Tablename</label>
            <md-input v-model="form.selectedAnalyzer.table" spellcheck="false"></md-input>
            <span class="md-error" v-if="!$v.form.selectedAnalyzer.table.required">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="form.selectedAnalyzer.options.hasColumn">
          <md-field :class="getValidationClassForSelectedAnalyzer('column')">
            <label>Columnname</label>
            <md-input v-model="form.selectedAnalyzer.column" spellcheck="false"></md-input>
            <span class="md-error" v-if="!$v.form.selectedAnalyzer.column.required">This field is required</span>
          </md-field>
        </div>
      </div>

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-20" v-if="form.selectedAnalyzer.options.hasInstance">
          <md-field :class="getValidationClassForSelectedAnalyzer('instance')">
            <label>Instance</label>
            <md-input v-model="form.selectedAnalyzer.instance" spellcheck="false"></md-input>
            <span class="md-error" v-if="!$v.form.selectedAnalyzer.instance.required">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="form.selectedAnalyzer.options.hasPredicate">
          <md-field :class="getValidationClassForSelectedAnalyzer('predicate')">
            <label>Predicate</label>
            <md-input v-model="form.selectedAnalyzer.predicate" spellcheck="false"></md-input>
            <span class="md-error" v-if="!$v.form.selectedAnalyzer.predicate.required">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="form.selectedAnalyzer.options.hasPattern">
          <md-field :class="getValidationClassForSelectedAnalyzer('patternMatch')">
            <label>Pattern</label>
            <md-input v-model="form.selectedAnalyzer.patternMatch" spellcheck="false"></md-input>
            <span class="md-error" v-if="!$v.form.selectedAnalyzer.patternMatch.required">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="form.selectedAnalyzer.options.hasWhere">
          <md-field>
            <label>WHERE</label>
            <md-input v-model="form.selectedAnalyzer.where" spellcheck="false"></md-input>
          </md-field>
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
        form: {
          selectedAnalyzer: {
            context: "jdbc",
            table: "food_des",
            column: "fat_factor",
            where: null,
            options: {},
            key: "",
          },
        },
        selectedAnalyzerIndex: null,
      };
    },
    validations() {
      let regularValidation = {
        form: {
          selectedAnalyzer: {
            table: {required},
            column: {required},
            instance: {},
            predicate: {},
            patternMatch: {},
          },
        }
      };
      if(this.form.selectedAnalyzer.key === "compliance"){
        regularValidation.form.selectedAnalyzer.column = {};
        regularValidation.form.selectedAnalyzer.instance = {required};
        regularValidation.form.selectedAnalyzer.predicate = {required};
      } else if(this.form.selectedAnalyzer.key === "patternMatch"){
        console.log("jawoll. Pattern!");
        regularValidation.form.selectedAnalyzer.patternMatch = {required};
        regularValidation.form.selectedAnalyzer.patternMatch = {required};
      }
      return regularValidation;
    },
    components: {
      jobs: Jobs
    },
    watch: {
      selectedAnalyzerIndex: function () {
        this.form.selectedAnalyzer.name = this.analyzers[
          this.selectedAnalyzerIndex
          ].name;
        this.form.selectedAnalyzer.key = this.analyzers[
          this.selectedAnalyzerIndex
          ].key;

        this.form.selectedAnalyzer.options = {};
        for (let option of this.analyzers[this.selectedAnalyzerIndex]
          .parameters) {
          let hasString =
            "has" +
            String(option.name)[0].toUpperCase() +
            String(option.name).slice(1);
          this.form.selectedAnalyzer.options[hasString] = true;
        }
        console.log("selected Analyzer: ", this.form.selectedAnalyzer);
      }
    },

    methods: {
      startJob: function () {
        let requestObject = {
          context: this.form.selectedAnalyzer.context,
          table:  this.form.selectedAnalyzer.table,
          where: this.form.selectedAnalyzer.where,
          instance: this.form.selectedAnalyzer.instance,
          predicate: this.form.selectedAnalyzer.predicate,
          patternMatch: this.form.selectedAnalyzer.patternMatch
        };

        if(this.form.selectedAnalyzer.options.hasColumn){
          requestObject.column =  this.form.selectedAnalyzer.column;
        }
        console.log("requestObject: ", requestObject);
        axios
          .post(
            `http://localhost:8080/api/jobs/${this.form.selectedAnalyzer.key}/start`,
            requestObject
          )
          .then(() => this.$refs.jobsOverview.refresh());
      },
      validateUser() {

        this.$v.form.$touch();
        if (!this.$v.$invalid) {
          console.log("User is valid!");
          this.startJob();
        } else{
          console.log("User in invalid")
        }
      },
      getValidationClassForSelectedAnalyzer(fieldName) {
        const field = this.$v.form.selectedAnalyzer[fieldName];
        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
    },
    mounted() {
      axios.get("http://localhost:8080/api/jobs/analyzers").then(response => {
        this.analyzers = response.data.analyzers;
        this.selectedAnalyzerIndex = 0;
      });
    }
  };
</script>

<style>

.job-selection {
  padding: 20px;
}
</style>
