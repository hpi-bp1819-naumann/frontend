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

    <div v-if="completedJobs.length > 0">
      <div class="md-display-2" id="completed">Completed Jobs</div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-80">
          <md-list class="custom-md-list">
            <md-list-item v-for="(job, index) in completedJobs" :key="index">
              <span class="md-list-item-text">{{index + 1}}. {{job.name}}</span>
              <span class="md-list-item-text">Finished: {{job.finishingTime.toLocaleString()}}</span>
              
              <span v-if="job.result.hasOwnProperty('exception')" class="md-list-item-text">Error</span>
              <span v-else-if="job.name === 'Histogram'" class="md-list-item-text">Result: too long</span>
              <span
                v-else-if="job.name === 'DataType'"
                class="md-list-item-text"
              >Result: {{getMaximumAbsoluteValue(job.result.value.values)}}</span>
              <span v-else class="md-list-item-text">Result: {{job.result.value}}</span>

              <md-button @click="visitToJobDetails(job.id)" class="md-dense md-raised">View Details</md-button>
              <md-button class="md-icon-button" @click="deleteJob(job.id, index)">
                <i class="fas fa-trash"></i>
              </md-button>
            </md-list-item>
          </md-list>
          <md-button v-if="completedJobs.length > 0" @click="deleteAllJobs">Delete all finished Jobs</md-button>
        </div>
      </div>
    </div>

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-content>
        <job :id=jobId></job>
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

export default {
  name: "Jobs",
  data() {
    return {
      jobId: "",
      runningJobs: [],
      completedJobs: [],
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
    job: Job
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
            job.finishingTime = new Date(job.finishingTime);
            return job;
          })
          .sort(function(a, b) {
            return b.finishingTime - a.finishingTime;
          });
      });
    },
    refreshIfNeccessary() {
      if (this.runningJobs.length > 0) {
        this.refresh();
      }
    },
    deleteJob(jobId, index) {
      axios.delete("http://localhost:8080/api/jobs/" + jobId);
      this.completedJobs.splice(index, 1);
    },
    deleteAllJobs() {
      axios.delete("http://localhost:8080/api/jobs");
      this.completedJobs = [];
    },
    cancelJob(jobId, index) {
      axios.post(`http://localhost:8080/api/jobs/${jobId}/cancel`);
      this.runningJobs.splice(index, 1);
    },
    visitToJobDetails(jobId) {
      this.jobId = jobId;
      this.showDialog = true;
    },
    getMaximumAbsoluteValue(values) {
      const keys = Object.keys(values);
      return keys.reduce((max, curr) =>
        values[max].absolute > values[curr].absolute ? max : curr
      );
    }
  }
};
</script>

<style>
.custom-md-list {
  background-color: transparent !important;
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
</style>
