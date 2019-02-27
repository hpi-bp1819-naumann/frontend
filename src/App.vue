<template>

  <div id="app">
    <div>
      <md-tabs router-link>
        <md-tab md-label="Job Selection" to="/jobs">
          <JobSelection></JobSelection>
        </md-tab>

        <md-tab md-label="Column Profiler" to="/connection">
          <ColumnProfiler></ColumnProfiler>
        </md-tab>

        <md-tab md-label="Data Exploration" to="/dbview">
          <Databaseview></Databaseview>
        </md-tab>

        <md-tab md-label="Settings" to="/connection">
          <Dashboard></Dashboard>
        </md-tab>
      </md-tabs>
    </div>
    <!--<div>-->
      <!--<md-tabs router-link>-->
        <!--<md-tab md-label="Foo" to="/foo">foo</md-tab>-->
        <!--<md-tab md-label="Bar" to="/bar">bar</md-tab>-->
      <!--</md-tabs>-->
    <!--</div>-->
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
import JobSelection from './components/JobSelection'
import Dashboard from './components/DashBoard'
import Databaseview from './components/DatabaseView'
import ColumnProfiler from './components/ColumnProfiler'

export default {
  name: "app",
  components: {JobSelection, Dashboard, Databaseview, ColumnProfiler}
};
</script>
