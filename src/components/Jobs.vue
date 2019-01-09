<template>
  <div>

    <div class="md-display-2" id="pending">Pending Jobs</div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-80">
        <md-list class="custom-md-list">
          <md-list-item v-for="(job, index) in runningJobs" :key="index">
            <!--<span class="md-list-item-text">{{index + 1}}.</span>-->
            <span class="md-list-item-text">Started: {{job.startingTime.toLocaleString()}}</span>
            <span class="md-list-item-text">{{index + 1}}. {{job.id}}</span>

            <span v-if="job.result">{{job.result}}</span>
          </md-list-item>
        </md-list>
      </div>
    </div>

    <div class="md-display-2" id="finished">Finished Jobs</div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-80">
        <md-list class="custom-md-list">
          <md-list-item v-for="(job, index) in completedJobs" :key="index">
            <!--<span class="md-list-item-text">{{index + 1}}.</span>-->
            <span class="md-list-item-text">Finished: {{job.finishingTime.toLocaleString()}}</span>

            <span v-if="job.result.hasOwnProperty('exception')" class="md-list-item-text">Error</span>
            <span v-else-if="job.result" class="md-list-item-text">Result: {{job.result.value}}</span>
            <md-button @click="visitToJobDetails(job.id)" class="md-dense md-raised">View Details</md-button>
            <md-button class="md-icon-button" @click="deleteJob(job.id, index)">
              <i class="fas fa-trash"></i>
            </md-button>
          </md-list-item>
        </md-list>

        <md-button v-if="completedJobs.length > 0" @click="deleteAllJobs">
          Delete all finished Jobs
        </md-button>
      </div>


    </div>
  </div>

</template>

<script>
  import axios from "axios";

  export default {
    name: "Jobs",
    data() {
      return {
        runningJobs: [],
        completedJobs: [],
      };
    },
    mounted() {
      this.refresh();
      this.$nextTick(function () {
        window.setInterval(() => {
          this.refreshIfNeccessary();
        }, 3000);
      })
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
            .sort(function (a, b) {
              return b.startingTime - a.startingTime;
            });
          this.completedJobs = jobs
            .filter(job => job.status === "completed")
            .map(job => {
              job.finishingTime = new Date(job.finishingTime);
              return job;
            })
            .sort(function (a, b) {
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
        axios.delete('http://localhost:8080/api/jobs/' + jobId);
        this.completedJobs.splice(index, 1);
      },
      deleteAllJobs() {
        console.log("completedJobs.length: " + this.completedJobs.length);
        for (let i = 0; i < this.completedJobs.length; i++) {
          axios.delete(
            "http://localhost:8080/api/jobs/" + this.completedJobs[i].id
          );
        }
        this.completedJobs = [];
      },
      getValidationClass(fieldName) {
        const field = this.$v.form[fieldName]
        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      validateUser () {
        this.$v.$touch();
        console.log(this.$v);
        if (!this.$v.$invalid) {
          console.log("User is valid!");
        } else{
          console.log("User is invalid :(");
        }
      },

      visitToJobDetails(jobId) {
        this.$router.push('/jobs/' + jobId);
      },
    },
  };

</script>

<style>
  .custom-md-list {
    background-color: transparent !important;
  }
</style>
