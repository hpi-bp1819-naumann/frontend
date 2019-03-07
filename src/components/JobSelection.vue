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
            <md-select v-model="selectedTable" @md-selected="clearColumns">
              <md-option v-for="(item, index) in data" :value="item.table" :key="index">
                {{ item.table }}
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
            <a href="https://github.com/hpi-bp1819-naumann/frontend#troubleshooting" target="_blank">
              troubleshooting </a>
            for more information).
          </div>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.options.column">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex][0]}">
            <label>Column</label>
            <md-select v-model="job.columns[0]" @md-selected="validateForm">
              <md-option v-for="(item, index) in columns" :value="item.name" :key="index">
                {{ item.name }}
              </md-option>
            </md-select>
            <span class="md-error" v-if="!areFieldsValid[jobIndex][0]">This field is required</span>
          </md-field>
        </div>

        <!-- Correlation -->
        <div class="md-layout-item md-size-20" v-if="job.options.firstColumn">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex][0]}">
            <label>Column 1</label>
            <md-select v-model="job.columns[0]" @md-selected="validateForm">
              <md-option v-for="(item, index) in columns" :value="item.name" :key="index">
                {{ item.name }}
              </md-option>
            </md-select>
            <span class="md-error" v-if="!areFieldsValid[jobIndex][0]">This field is required</span>
          </md-field>
        </div>
        <div class="md-layout-item md-size-20" v-if="job.options.secondColumn">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex][1]}">
            <label>Column 2</label>
            <md-select v-model="job.columns[1]" @md-selected="validateForm">
              <md-option v-for="(item, index) in columns" :value="item.name" :key="index">
                {{ item.name }}
              </md-option>
            </md-select>
            <span class="md-error" v-if="!areFieldsValid[jobIndex][1]">This field is required</span>
          </md-field>
        </div>

        <div v-if="job.options.columns">
          <div class="md-layout-item md-size-20" v-for="(column, index) in job.columns"
              v-bind:key="index">
            <md-field :class="{'md-invalid': !areFieldsValid[jobIndex][index]}">
              <label>Column {{index+1}}</label>

              <md-select v-model="job.columns[index]" @md-selected="validateForm">
                <md-option v-for="(item, selectindex) in columns" :value="item.name" :key="selectindex">
                  {{ item.name }}
                </md-option>
              </md-select>
              <span class="md-error" v-if="!areFieldsValid[jobIndex][index]">This field is required</span>
            </md-field>
          </div>
        </div>

        <div v-if="job.options.columns" class="md-layout">
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
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex][0]}">
            <label>Instance</label>
            <md-input v-model="job.instance" spellcheck="false" @keyup="validateForm"></md-input>
            <md-tooltip md-direction="right">
              metric instance name, describing what the analysis is being done for <br>
              e.g. "example"
            </md-tooltip>
            <span class="md-error" v-if="!areFieldsValid[jobIndex][0]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.options.predicate">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex][1]}">
            <label>Predicate</label>
            <md-input v-model="job.predicate" spellcheck="false" @keyup="validateForm"></md-input>
            <md-tooltip md-direction="right">SQL-predicate to apply per row
              <br>e.g. "Price > 50"
            </md-tooltip>
            <span class="md-error" v-if="!areFieldsValid[jobIndex][1]">This field is required</span>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20" v-if="job.options.pattern">
          <md-field :class="{'md-invalid': !areFieldsValid[jobIndex][1]}">
            <label>Pattern</label>
            <md-input v-model="job.patternMatch" spellcheck="false" @keyup="validateForm"></md-input>
            <md-tooltip md-direction="right">The regular expression to check for
              <br>e.g. "for | (example)*"
            </md-tooltip>
            <span class="md-error" v-if="!areFieldsValid[jobIndex][1]">This field is required</span>
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
        <md-button @click="openMoreInformationLink" class="md-primary">More information on the analyzers</md-button>
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
        areFieldsValid: [[false]], // ,
        analyzers: [],
        contexts: ["jdbc", "spark"],
        context: "jdbc",
        selectedTable: "",
        jobs: [
          {
            options: {},
            columns: [""],
            key: "",
            name: null
          }
        ],
        data: [],
        columns: []
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
        if (job.options.secondColumn) {
          job.columns.push("");
        }
        this.validateForm();
      },
      startJobs: function () {
        if (this.validateForm() !== true) {
          return;
        }

        const analyzers = this.jobs.map(job => {
          let requestObject = {
            analyzer: job.key,
            instance: job.instance,
            predicate: job.predicate,
            patternMatch: job.patternMatch
          };
          if (job.where) {
            requestObject.where = job.where;
          }
          if (job.options.column) {
            requestObject.column = job.columns[0];
          } else if (job.options.columns) {
            requestObject.columns = job.columns;
          } else if (job.key == "correlation") {
            requestObject.firstColumn = job.columns[0];
            requestObject.secondColumn = job.columns[1];
          }

          return requestObject;
        });
        const postData = {
          analyzers
        };
        
        axios.post(
          `http://localhost:8080/api/jobs/${this.selectedTable}/${this.context}/start`,
          postData
        ).then(function (response) {
          this.$refs.jobsOverview.refresh();
        });   
      },
      validateForm() {
        this.areFieldsValid = [];
        let everythingValid = true;

        // console.log("Jobs:", this.jobs);
        for (let i = 0; i < this.jobs.length; i++) {
          this.areFieldsValid.push([]);

          for (let j = 0; j < this.jobs[i].columns.length; j++) {
            if (this.jobs[i].columns[j] === "") {
              this.areFieldsValid[i].push(false);
              everythingValid = false;
            } else {
              this.areFieldsValid[i].push(true);
            }
          }

          if(this.jobs[i].key === "patternMatch"){
            this.jobs[i].patternMatch
              ? this.areFieldsValid[i].push(true)
              : this.areFieldsValid[i].push(false);
          }
          else if(this.jobs[i].key === "compliance"){
            everythingValid = true;
            this.jobs[i].instance
              ? this.areFieldsValid[i][0] = true
              : this.areFieldsValid[i][0] = false;

            this.jobs[i].predicate
              ? this.areFieldsValid[i].push(true)
              : this.areFieldsValid[i].push(false);
          }
        }
        return everythingValid;
      },
      copyJob: function () {
        this.jobs.push(JSON.parse(JSON.stringify(this.jobs[0])));
        this.validateForm();
      },
      removeJob: function (index) {
        this.jobs.splice(index, 1);
        this.validateForm();
      },
      removeLastColumn(job) {
        if (job.columns.length > 1) {
          job.columns.splice(-1, 1);
        }
        this.validateForm();
      },
      addColumn(job) {
        job.columns.push("");
        this.validateForm();
      },
      clearColumns: function(){
        this.jobs.forEach(function(job){
          job.columns = [];
        });
        this.validateForm();
      },
      openMoreInformationLink: function(){
        window.open("https://github.com/hpi-bp1819-naumann/deequ/blob/jdbc-analyzers/doc/analyzerDoc.md#histogram");
      }
    },
    mounted() {
      axios.get("http://localhost:8080/api/jobs/analyzers").then(response => {
        this.analyzers = response.data.analyzers;
        this.jobs[0].key = this.analyzers[0].key;

      });
      axios.get("http://localhost:8080/api/db/data").then(response => {
        this.data = response.data;
        this.selectedTable = this.data[0].table;
      });
    },
    watch: {
      selectedTable: function () {
        this.data.forEach(tabledata => {
          if (tabledata.table == this.selectedTable) {
            this.columns = tabledata.columns;
          }
        })
      }
    },
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

  .error-message {
    color: #ff1744;
    height: 100%;
    vertical-align: middle;
    line-height: 76px;
  }
</style>
