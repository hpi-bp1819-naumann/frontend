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

    <div v-for="column in columns" :key="column.name">

        <div class="md-layout md-gutter">

            <div class="md-layout-item md-size-40">
                        
                <div class="md-title heading"> {{column.column}} </div>
                <br>
                <md-table>
                    <md-table-row>
                        <md-table-cell>Datatype:</md-table-cell>
                        <md-table-cell>{{column.dataType}}</md-table-cell>
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

            <div class="md-layout-item md-size-60">

            <div v-if="column.histogram">
            <histogram :frequencies="column.histogram" type="bar"></histogram>
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
        columns: [
            {
            "column": "name",
            "dataType": "String",
            "isDataTypeInferred": "true",
            "completeness": 1.0,
            "approximateNumDistinctValues": 5,
            "histogram": [
                {
                "value": "thingD",
                "count": 1,
                "ratio": 0.125
                },
                {
                "value": "thingA",
                "count": 2,
                "ratio": 0.25
                },
                {
                "value": "thingE",
                "count": 1,
                "ratio": 0.125
                },
                {
                "value": "thingB",
                "count": 1,
                "ratio": 0.125
                },
                {
                "value": "thingC",
                "count": 3,
                "ratio": 0.375
                }
            ]
            },
            {
            "column": "count",
            "dataType": "Fractional",
            "isDataTypeInferred": "true",
            "completeness": 0.75,
            "approximateNumDistinctValues": 5,
            "mean": 8.25,
            "maximum": 20.0,
            "minimum": 1.0,
            "sum": 66.0,
            "stdDev": 7.280109889280518,
            "approxPercentiles": [
                1.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                5.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                7.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                13.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0,
                20.0
            ]
            },
            {
            "column": "status",
            "dataType": "String",
            "isDataTypeInferred": "true",
            "completeness": 1.0,
            "approximateNumDistinctValues": 3,
            "histogram": [
                {
                "value": "IN_TRANSIT",
                "count": 2,
                "ratio": 0.25
                },
                {
                "value": "UNKNOWN",
                "count": 2,
                "ratio": 0.25
                },
                {
                "value": "DELAYED",
                "count": 4,
                "ratio": 0.5
                }
            ]
            },
            {
            "column": "valuable",
            "dataType": "Boolean",
            "isDataTypeInferred": "true",
            "completeness": 0.625,
            "approximateNumDistinctValues": 2,
            "histogram": [
                {
                "value": "false",
                "count": 3,
                "ratio": 0.375
                },
                {
                "value": "NullValue",
                "count": 3,
                "ratio": 0.375
                },
                {
                "value": "true",
                "count": 2,
                "ratio": 0.25
                }
            ]
            }
        ]
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
