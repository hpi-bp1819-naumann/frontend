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
    <div v-if="running">
      Column Profiler is running.
    </div>
    <div v-if="data.columns">
        <div v-for="(column, key) in data.columns" :key="key">
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                    <div class="md-title heading"> {{column.column}} </div>
                    <br>
                    <md-table>
                        <md-table-row v-if="column.dataType">
                            <md-table-cell>Datatype:</md-table-cell>
                            <md-table-cell>
                                {{column.dataType}}
                            </md-table-cell>
                        </md-table-row>
                        <md-table-row v-if="column.typeCounts && column.typeCounts.Boolean != nil">
                            <md-table-cell>Datatype counts:</md-table-cell>
                            <md-table-cell>
                                Boolean: {{column.typeCounts.Boolean}} <br>
                                Fractional: {{column.typeCounts.Fractional}} <br>
                                Integral: {{column.typeCounts.Integral}} <br>
                                Unknown: {{column.typeCounts.Unknown}} <br>
                                String: {{column.typeCounts.String}}
                            </md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell>Is DataType inferred:</md-table-cell>
                            <md-table-cell>{{column.isDataTypeInferred}}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell>Completeness:</md-table-cell>
                            <md-table-cell>{{column.completeness}}</md-table-cell>
                        </md-table-row>
                        <md-table-row>
                            <md-table-cell>Approximate number of distinct values:</md-table-cell>
                            <md-table-cell>{{column.approximateNumDistinctValues}}</md-table-cell>
                        </md-table-row>
                        <md-table-row v-if="column.mean">
                            <md-table-cell>Mean:</md-table-cell>
                            <md-table-cell>{{column.mean}}</md-table-cell>
                        </md-table-row>
                        <md-table-row v-if="column.maximum">
                            <md-table-cell>Maximum:</md-table-cell>
                            <md-table-cell>{{column.maximum}}</md-table-cell>
                        </md-table-row>
                        <md-table-row v-if="column.minimum">
                            <md-table-cell>Minimum:</md-table-cell>
                            <md-table-cell>{{column.minimum}}</md-table-cell>
                        </md-table-row>
                        <md-table-row v-if="column.sum">
                            <md-table-cell>Sum:</md-table-cell>
                            <md-table-cell>{{column.sum}}</md-table-cell>
                        </md-table-row>
                        <md-table-row v-if="column.stdDev">
                            <md-table-cell>Standard deviation:</md-table-cell>
                            <md-table-cell>{{column.stdDev}}</md-table-cell>
                        </md-table-row>
                    </md-table>
                </div>

                <div class="md-layout-item md-size-50">

                <div v-if="column.histogram">
                <histogram :frequencies="column.histogram.values" type="bar"></histogram>
                </div>

                </div>

            </div>

        </div>
    </div>
  </div>

</template>

<script>
  import axios from "axios";
    import Histogram from "./Histogram";

  export default {
    name: "ColumnProfiler",
    data() {
      return {
        tables: [],
        selectedTable: "",
        context: "spark",
        jobId: "",
        running: false,
        data: {}
      };
    },
    mounted() {
      axios.get("http://localhost:8080/api/db/tables").then(response => {
        this.tables = response.data.tables;
        this.selectedTable = this.tables[0];
      });
      this.$nextTick(function() {
      window.setInterval(() => {
        if (this.running){
            this.refresh();
        }
      }, 500);
    });
    },
    methods: {
      startProfiler: function () {
        if(this.running){
            alert("already running!")
        }
        else{
            console.log(this.selectedTable);
            axios.post(
                `http://localhost:8080/api/jobs/columnProfiler/start`,
                {"context": this.context, "table": this.selectedTable}
            ).then(result => {
                if (result.data.jobId){
                    this.jobId = result.data.jobId;
                    this.running = true;
                }
            });
        }
      },
      refresh () {
          axios.get(`http://localhost:8080/api/jobs/${this.jobId}`).then(response => {
              console.log("Response:");
              console.log(response.data.job.status);
              if (response.data.job.status == "completed"){
                  this.data = response.data.job.result;
                  console.log(this.data);
                  this.running = false;
              }
              else if (response.data.job.status != "running"){
                  this.running = false;
              }
          });
      }
    },
    components: {
      histogram: Histogram
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
