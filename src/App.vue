<template>
  <div id="app" >
    <JobSelection/>
  </div>
</template>

<script>
import JobSelection from "./components/JobSelection";

export default {
  name: "app",
  components: {
    JobSelection
  }
};
</script>


<style>
#app {
  /*color: #2c3e50;*/
  margin: 20px;
}

</style>
