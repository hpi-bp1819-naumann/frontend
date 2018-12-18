<template>
  <div>
    {{json}}
  </div>
</template>


<script>
  import axios from "axios";

  export default {
    name: "DatabaseView",
    data() {
      return {
        json: {}
      };
    },
    mounted() {
      axios.get("http://localhost:8080/api/db/tables").then(response => {
        this.json = response.data;
      });
    }
  };
</script>

<style>
  .job-selection {
    padding: 20px;
  }

  .md-field {
    max-width: 300px;
  }

  #pending {
    margin-top: 20px;
  }

</style>
