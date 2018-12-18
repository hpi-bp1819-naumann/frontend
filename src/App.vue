<template>
  <div id="app" >
    <JobSelection/>
    <DatabaseView/>
  </div>
</template>

<script>
import JobSelection from "./components/JobSelection";
import DatabaseView from "./components/DatabaseView";

export default {
  name: "app",
  components: {
    JobSelection,
    DatabaseView
  }
};
</script>


<style>
#app {
  /*color: #2c3e50;*/
  margin: 20px;
}

</style>
