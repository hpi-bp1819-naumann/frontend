<template>
  <div>
    <div class="md-display-2" id="pending">Pending Jobs</div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-80">
        <md-list>
          <md-list-item v-for="(job, index) in runningJobs" :key="index">
            <span class="md-list-item-text">{{index + 1}}. {{job.id}}</span>
            <md-button @click="checkResult(job.id, index)" class="md-dense md-raised">Get Result</md-button>Result:
            <span v-if="job.result">{{job.result}}</span>
          </md-list-item>
        </md-list>
      </div>
    </div>

    <div class="md-display-2" id="pending">Finished Jobs</div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-80">
        <md-list>
          <md-list-item v-for="(job, index) in completedJobs" :key="index">
            <span class="md-list-item-text">{{index + 1}}. {{job.id}}</span>
            <span v-if="job.result">Result: {{job.result.value}}</span>
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
        this.runningJobs = jobs.filter(job => job.status === "running");
        this.completedJobs = jobs.filter(job => job.status === "completed");
      });
    }
  }
};
</script>
