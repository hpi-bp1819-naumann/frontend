<template>
  <div class="md-elevation-1 column-profiler">

    <div class="md-display-2">Column Profiler</div>

    <div class="md-layout-item " v-if="tables.length === 0 ">
      <div class="error-message">
        No tables shown? Check if you have the backend running and CORS enabled in your browser
        <a href="https://github.com/hpi-bp1819-naumann/frontend#troubleshooting" target="_blank"> troubleshooting </a>
        for more information).
      </div>
    </div>

    <div class="md-layout md-gutter">

      <div class="md-layout-item md-size-30">
          <md-field>
            <label>Table</label>
            <md-select v-model="selectedTable"> 
              <md-option v-for="(item, index) in tables" :value="item" :key="index">
                {{ item }}
              </md-option>
            </md-select>
          </md-field>
        </div>

      <div class="md-layout-item md-size-20">
        <md-button class="md-dense md-raised md-primary" @click="startProfiler">Start Profiler</md-button>
      </div>
    </div>
  </div>

</template>

<script>
  import axios from "axios";

  export default {
    name: "ColumnProfiler",
    data() {
      return {
        tables: [],
        selectedTable: ""
      };
    },
    mounted() {
      axios.get("http://localhost:8080/api/db/tables").then(response => {
        this.tables = response.data.tables;
        this.selectedTable = this.tables[0];
      });
    },
    methods: {
      startProfiler: function () {
        console.log(this.selectedTable);
      }
    },
  };
</script>

<style>
  .column-profiler {
    padding: 20px;
  }

  .md-field {
    max-width: 100%;
  }

  #pending {
    margin-top: 20px;
  }
</style>
