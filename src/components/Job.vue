<template>
  <div>
    <h1>Job Details</h1>
    {{this.$route.params.jobId}}
    {{this.job.result}}
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Job",
  data() {
    return {
      job: {}
    };
  },

  created() {
    this.fetchData();
  },

  watch: {
    $route: "fetchData"
  },

  methods: {
    fetchData() {
      axios
        .get(
          `http://localhost:8080/api/jobs/${this.$route.params.jobId}/result`
        )
        .then(resp => {
          this.job = resp.data;
        })
        .catch(err => {
          console.log(this.$route);
          this.$router.push("/jobs");
        });
    }
  }
};
</script>
