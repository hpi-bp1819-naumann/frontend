<template>
  <div>
    <div v-if="runningJobs.length > 0">
      <div class="md-display-2" id="pending">Running Jobs</div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-80">
          <md-list class="custom-md-list">
            <md-list-item v-for="(job, index) in runningJobs" :key="index">
              <span class="md-list-item-text">{{index + 1}}. {{job.name}}</span>
              <span class="md-list-item-text">Started: {{job.startingTime.toLocaleString()}}</span>
              <md-button @click="cancelJob(job.id, index)" class="md-dense md-raised">Cancel</md-button>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </div>
  
  <div v-if="failedJobs.length > 0">
      <div class="md-display-2" id="pending">Failed Jobs</div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-80">
          <md-list class="custom-md-list">
            <md-list-item v-for="(job, index) in failedJobs" :key="index">
              <span class="md-list-item-text">{{index + 1}}. {{job.name}} <i class="fas fa-question" @click="openExplanationPage(job.name)"></i> </span>
              <span class="md-list-item-text">Started: {{job.startingTime.toLocaleString()}}</span>

              <md-button @click="showJobDetails(job)" class="md-dense md-raised">View Details</md-button>
              <md-button class="md-icon-button" @click="deleteFailedJob(job.id, index)">
                <i class="fas fa-trash"></i>
              </md-button>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </div>

    <div v-if="completedJobs.length > 0">
      <div class="md-display-2" id="completed">Completed Jobs</div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-80">
          <md-list class="custom-md-list">
            <md-list-item v-for="(job, index) in completedJobs" :key="index" md-expand>
              <span class="md-list-item-text">{{index + 1}}. {{job.name}}</span>
              <span class="md-list-item-text">Finished: {{job.finishingTime.toLocaleString()}}</span>
              
              <span>
                <md-button class="md-icon-button" @click="showJobDetails(job)">
                  <i class="fas fa-search"></i>
                </md-button>

                <md-button class="md-icon-button" @click="deleteCompletedJob(job.id, index)">
                  <i class="fas fa-trash"></i>
                </md-button>
              </span>

              <md-list slot="md-expand">
                <md-list-item class="md-inset" v-for="(analyzer, index) in job.analyzers" :key="index">
                  <i v-if="analyzer.status === 'completed'" class="fas fa-check"></i>
                  <i v-else class="fas fa-times"></i>
                  &nbsp;
                  <span class="md-list-item-text">
                    {{analyzer.name}} 
                    <i class="fas fa-question" @click="openExplanationPage(analyzer.name)"></i> </span>
                  <div v-if="analyzer.status === 'completed'">
                    <span v-if="analyzer.name === 'Histogram'" class="md-list-item-text">Result: too long</span>
                    <span v-else-if="analyzer.name === 'DataType'" class="md-list-item-text">
                      Result: {{getMaximumAbsoluteValue(analyzer.result)}}
                    </span>
                    <span v-else class="md-list-item-text"> Result: {{analyzer.result}} </span>
                  </div>
                  <md-button class="md-icon-button" @click="showAnalyzerDetails(analyzer)">
                    <i class="fas fa-search"></i>
                  </md-button>
                </md-list-item>
              </md-list>

            </md-list-item>
          </md-list>
        </div>
      </div>
    </div>

    <md-button v-if="completedJobs.length > 0 || failedJobs.length > 0" @click="deleteAllJobs">Delete all finished and failed Jobs</md-button>

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-content>
        <job v-if="showJob === true" :job=toShow></job>
        <analyzer v-else :analyzer=toShow></analyzer>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import axios from "axios";
  import Job from "./Job";
  import Analyzer from "./Analyzer";

export default {
  name: "Jobs",
  data() {
    return {
      jobId: "",
      toShow: {},
      showJob: true,
      runningJobs: [],
      completedJobs: [],
      failedJobs: [],
      showDialog: false
    };
  },
  mounted() {
    this.refresh();
    this.$nextTick(function() {
      window.setInterval(() => {
        this.refreshIfNeccessary();
      }, 500);
    });
  },components: {
    job: Job,
    analyzer: Analyzer
  },
  methods: {
    refresh() {
      axios.get("http://localhost:8080/api/jobs").then(response => {
        const jobs = response.data.jobs;
        this.runningJobs = jobs
          .filter(job => job.status === "running")
          .map(job => {
            job.startingTime = new Date(job.startingTime);
            return job;
          })
          .sort(function(a, b) {
            return b.startingTime - a.startingTime;
          });
        this.completedJobs = jobs
          .filter(job => job.status === "completed")
          .map(job => {
            job.startingTime = new Date(job.startingTime);
            job.finishingTime = new Date(job.finishingTime);
            return job;
          })
          .sort(function(a, b) {
            return b.finishingTime - a.finishingTime;
          });
        this.failedJobs = jobs
          .filter(job => job.status === "error")
          .map(job => {
            job.startingTime = new Date(job.startingTime);
            return job;
          })
          .sort(function(a, b) {
            return b.startingTime - a.startingTime;
          });
       });
    },
    refreshIfNeccessary() {
      if (this.runningJobs.length > 0) {
        this.refresh();
      }
    },
    deleteCompletedJob(jobId, index) {
      axios.delete("http://localhost:8080/api/jobs/" + jobId);
      this.completedJobs.splice(index, 1);
    },
    deleteFailedJob(jobId, index) {
      axios.delete("http://localhost:8080/api/jobs/" + jobId);
      this.failedJobs.splice(index, 1);
    },
    deleteAllJobs() {
      axios.delete("http://localhost:8080/api/jobs");
      this.completedJobs = [];
      this.failedJobs = [];
    },
    cancelJob(jobId, index) {
      axios.post(`http://localhost:8080/api/jobs/${jobId}/cancel`);
      this.runningJobs.splice(index, 1);
    },
    visitToJobDetails(jobId) {
      this.jobId = jobId;
      this.showDialog = true;
    },
    showJobDetails(jobToShow) {
      this.showJob = true;
      this.toShow = jobToShow;
      this.showDialog = true;
    },
    showAnalyzerDetails(analyzer) {
      // workaround for observer on analyzer
      // TODO: find out why it is necessary
      const analyzerToShow = JSON.parse(JSON.stringify(analyzer));
      this.showJob = false;
      this.toShow = analyzerToShow;
      this.showDialog = true;
    },
    getMaximumAbsoluteValue(values) {
      const keys = Object.keys(values);
      return keys.reduce((max, curr) =>
        values[max].absolute > values[curr].absolute ? max : curr
      );
    },
    openExplanationPage(keyword){
      window.open("https://github.com/hpi-bp1819-naumann/deequ/blob/jdbc-analyzers/doc/analyzerDoc.md#" + keyword);
    }
  }
};
</script>

<style scoped>
  .custom-md-list {
    background-color: transparent !important;
  }

  .md-list-item-text{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
  }

  #pending, 
  #completed {
    margin-top: 20px;
  }

  .md-dialog {
    max-height: 98%;
    max-width: 98%;
    min-height: 50%;
    min-width: 70%;
  }

  .fa-question{
    color: #929292;
    font-size: 10px;
    margin-left: 2px;
    cursor: pointer;
  }
</style>
