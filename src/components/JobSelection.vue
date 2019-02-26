<template>
  <div class="job-selection md-elevation-1">

    <div class="md-display-2">Select Job</div>

    <form novalidate @submit.prevent="startJobs">
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-20">
          <md-field>
            <label>Context</label>
            <md-select v-model="context">
              <md-option v-for="(context, index) in contexts" :key="index" :value="context">
                {{context}}
              </md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20">
          <md-field>
            <label>Table</label>
            <md-select v-model="selectedTable">
              <md-option v-for="(item, index) in tables" :value="item" :key="index">
                {{ item }}
              </md-option>
            </md-select>
          </md-field>
        </div>
      </div>

      <div class="md-layout md-gutter" v-for="(job, jobIndex) in jobs" v-bind:key="jobIndex">
        <div v-if="jobs.length > 1" class="add-column">
          <md-button class="md-icon-button" @click="removeJob(jobIndex)">
            <i class="fas fa-times"></i>
          </md-button>
        </div>

        <div class="md-layout-item md-size-20">
          <md-field>
            <label>Analyzer</label>
            <md-select v-model="job.key" @md-selected="setParamsForSelectedAnalyzer(job)">
              <md-option v-for="(analyzer, index) in analyzers" :value="analyzer.key" :key="index">
              {{analyzer.name}}
                <md-tooltip md-direction="right">
                  {{analyzer.description}}
                </md-tooltip>
              </md-option>
            </md-select>
          </md-field>
        </div>

        <div class="md-layout-item " v-if="analyzers.length == 0">
          <div class="error-message">
            No analyzers shown? Check if you have the backend running and CORS enabled in your browser (see
            <a href="https://github.com/hpi-bp1819-naumann/frontend#troubleshooting" target="_blank"> troubleshooting </a>
            for more information).
          </div>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.options.column">
          <md-field :class="{'md-invalid': !areFieldsValid[1]}">
            <label>Columnname</label>
            <md-input v-model="job.columns[0]" spellcheck="false" @keyup="validateForm"></md-input>
            <span class="md-error" v-if="!areFieldsValid[1]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.options.firstColumn">
          <md-field :class="{'md-invalid': !areFieldsValid[1]}">
            <label>Column 1</label>
            <md-input v-model="job.columns[0]" spellcheck="false" @keyup="validateForm"></md-input>
            <span class="md-error" v-if="!areFieldsValid[1]">This field is required</span>
          </md-field>
        </div>
        <div class="md-layout-item md-size-20" v-if="job.options.secondColumn">
          <md-field :class="{'md-invalid': !areFieldsValid[1]}">
            <label>Column 2</label>
            <md-input v-model="job.columns[1]" spellcheck="false" @keyup="validateForm"></md-input>
            <span class="md-error" v-if="!areFieldsValid[1]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout md-gutter" v-if="job.options.columns">
          <div
            class="md-layout-item md-size-20"
            v-for="(column, index) in job.columns"
            v-bind:key="index">
            <md-field :class="{'md-invalid': !areFieldsValid[1]}">
              <label>Column {{index+1}}</label>
              <md-input v-model="job.columns[index]" spellcheck="false" @keyup="validateForm"></md-input>
              <span class="md-error" v-if="!areFieldsValid[1]">This field is required</span>
            </md-field>
          </div>
          <div v-if="job.columns.length > 1" class="add-column">
            <md-button class="md-icon-button" @click="removeLastColumn(job)">
              <i class="fas fa-minus"></i>
            </md-button>
          </div>
          <div class="add-column">
            <md-button class="md-icon-button" @click="addColumn(job)">
              <i class="fas fa-plus"></i>
            </md-button>
          </div>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.options.instance">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex+2][0]}">
            <label>Instance</label>
            <md-input v-model="job.instance" spellcheck="false" @keyup="validateForm"></md-input>
            <md-tooltip md-direction="right">
                metric instance name, describing what the analysis is being done for <br>
                e.g. "example"
            </md-tooltip>
            <span class="md-error" v-if="!areFieldsValid[jobIndex+2][0]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.options.predicate">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex+2][1]}">
            <label>Predicate</label>
            <md-input v-model="job.predicate" spellcheck="false" @keyup="validateForm"></md-input>
            <md-tooltip md-direction="right">SQL-predicate to apply per row
              <br>e.g. "Price > 50"
            </md-tooltip>
            <span class="md-error" v-if="!areFieldsValid[jobIndex+2][1]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.options.pattern">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex+2][0]}">
            <label>Pattern</label>
            <md-input v-model="job.patternMatch" spellcheck="false" @keyup="validateForm"></md-input>
            <md-tooltip md-direction="right">The regular expression to check for
              <br>e.g. "for | (example)*"
            </md-tooltip>
            <span class="md-error" v-if="!areFieldsValid[jobIndex+2][0]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.options.where">
          <md-field>
            <label>WHERE</label>
            <md-input v-model="job.where" spellcheck="false"></md-input>
            <md-tooltip md-direction="right">
              Additional filter to apply before the analyzer is run <br>
              e.g. "Price > 50"
            </md-tooltip>
          </md-field>
        </div>
      </div>

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-20">
          <md-button @click="copyJob" class="md-dense md-raised">
            <i class="fas fa-plus"></i> Add Job
          </md-button>
        </div>
        <md-button type="submit" class="md-dense md-raised md-primary">Start Job</md-button>
      </div>

      <div>
        <md-button :href="pageUrl" class="md-primary">More information on the analyzers</md-button>
      </div>
      
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
      context: "jdbc",
      selectedTable: "",
      jobs: [
        {
          options: {},
          columns: ["fat_factor"],
          key: "",
          name: null
        }
      ],
      tables: []
    };
  },
  components: {
    jobs: Jobs
  },
  methods: {
    setParamsForSelectedAnalyzer(job) {
      if (this.analyzers.length === 0 || !job.key) {
        return;
      }
      const selectedAnalyzer = this.analyzers.find(
        analyzer => analyzer.key === job.key
      );
      job.name = selectedAnalyzer.name;
      job.key = selectedAnalyzer.key;

      job.options = selectedAnalyzer.parameters.reduce((a, b) => {
        const name = b.name;
        a[name] = true;
        return a;
      }, {});
      
      if (job.options.column) {
        job.columns = [job.columns[0]];
      }
      if (job.options.secondColumn){
        job.columns.push("pro_factor");
      }
    },
    startSingleJob: function(jobAnalyzer) {
      let requestObject = {
        context: this.context,
        table: this.selectedTable,
        where: jobAnalyzer.where,
        instance: jobAnalyzer.instance,
        predicate: jobAnalyzer.predicate,
        patternMatch: jobAnalyzer.patternMatch
      };

      if (jobAnalyzer.options.column) {
        requestObject.column = jobAnalyzer.columns[0];
      } else if (jobAnalyzer.options.columns) {
        requestObject.columns = jobAnalyzer.columns;
      } else if (jobAnalyzer.key = "correlation") {
        console.log("in");
        requestObject.firstColumn = jobAnalyzer.columns[0];
        requestObject.secondColumn = jobAnalyzer.columns[1];
        console.log(requestObject);
      }
      console.log("requestObject: ", requestObject);
      return axios.post(
        `http://localhost:8080/api/jobs/${jobAnalyzer.key}/start`,
        requestObject
      );
    },
    startJob: function(startIndex, endIndex) {
      if (startIndex === endIndex) {
        this.$refs.jobsOverview.refresh();
        return;
      } else {
        this.startSingleJob(this.jobs[startIndex]).then(() => {
          this.startJob(startIndex + 1, endIndex);
        });
      }
    },
    startJobs: function() {
      if (this.validateForm() === true) {
        this.startJob(0, this.jobs.length);
      } else {
        console.log("Form is invalid!");
      }
    },
    validateForm() {
      // this.areFieldsValid = [true, true];
      // this.jobs[0].selectedAnalyzer.table === ""
      //   ? (this.areFieldsValid[0] = false)
      //   : (this.areFieldsValid[0] = true);
      // this.jobs[0].selectedAnalyzer.column === ""
      //   ? (this.areFieldsValid[1] = false)
      //   : (this.areFieldsValid[1] = true);
      // for (let i = 0; i < this.jobs.length; i++) {
      //   this.areFieldsValid.push([]);
      //   if (this.jobs[i].selectedAnalyzer.key === "compliance") {
      //     this.jobs[i].selectedAnalyzer.instance
      //       ? this.areFieldsValid[i + 2].push(true)
      //       : this.areFieldsValid[i + 2].push(false);
      //     this.jobs[i].selectedAnalyzer.predicate
      //       ? this.areFieldsValid[i + 2].push(true)
      //       : this.areFieldsValid[i + 2].push(false);
      //   } else if (this.jobs[i].selectedAnalyzer.key === "patternMatch") {
      //     this.jobs[i].selectedAnalyzer.patternMatch
      //       ? this.areFieldsValid[i + 2].push(true)
      //       : this.areFieldsValid[i + 2].push(false);
      //   }
      // }
      // if (
      //   this.areFieldsValid[0] === false ||
      //   this.areFieldsValid[1] === false
      // ) {
      //   return false;
      // }
      // for (let i = 2; i < this.areFieldsValid.length; i++) {
      //   for (let j = 0; j < this.areFieldsValid[i].length; j++) {
      //     if (this.areFieldsValid[i][j] === false) return false;
      //   }
      // }
      return true;
    },
    copyJob: function() {
      this.jobs.push(JSON.parse(JSON.stringify(this.jobs[0])));
      this.areFieldsValid.push([]);
    },
    removeJob: function(index) {
      this.jobs.splice(index, 1);
    },
    removeLastColumn(job) {
      if (job.columns.length > 1) {
        job.columns.splice(-1, 1);
      }
    },
    addColumn(job) {
      job.columns.push("");
    }
  },
  mounted() {
    axios.get("http://localhost:8080/api/jobs/analyzers").then(response => {
      this.analyzers = response.data.analyzers;
    });
    axios.get("http://localhost:8080/api/db/tables").then(response => {
      this.tables = response.data.tables;
      this.selectedTable = this.tables[0];
    });
  },
    computed: {
      pageUrl () {
        return "https://github.com/hpi-bp1819-naumann/deequ/wiki/Analyzers";
      }
    }
};
</script>

<style>
.job-selection {
  padding: 20px;
}

.add-column {
  padding-top: 13px;
}

.md-tooltip {
  height: auto;
}

.error-message{
  color: #ff1744;
  height: 100%;
  vertical-align: middle;
  line-height: 76px;
}
</style>
