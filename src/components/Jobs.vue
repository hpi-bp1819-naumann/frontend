<template>
  <div>
    <div class="md-display-2" id="pending">Pending Jobs</div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-80">
        <md-list>
          <md-list-item v-for="(job, index) in runningJobs" :key="index">
            <span class="md-list-item-text">{{index + 1}}.</span>
            <span class="md-list-item-text">Started: {{job.startingTime.toLocaleString()}}</span>
          </md-list-item>
        </md-list>
      </div>
    </div>

    <div class="md-display-2" id="pending">Finished Jobs</div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-80">
        <md-list>
          <md-list-item v-for="(job, index) in completedJobs" :key="index">
            <span class="md-list-item-text">{{index + 1}}.</span>
            <span class="md-list-item-text">Finished: {{job.finishingTime.toLocaleString()}}</span>
            <span class="md-list-item-text" v-if="job.result">Result: {{job.result.value}}</span>
            <md-button
              @click="$router.push(`/jobs/${job.id}`)"
              class="md-dense md-raised"
            >View Details</md-button>
          </md-list-item>
        </md-list>
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
      completedJobs: []
    };
  },
  mounted() {
    this.refresh();
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
    }
  }
};
</script>
