<template>
  <div>
    <div class="md-display-2">Analyzer Details</div>
    <div>
      <div class="md-headline job-name">{{this.analyzer.name}}</div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-15 column-left">Status:</div>
      <div class="md-layout-item md-size-30 column-right">{{this.analyzer.status}}</div>
    </div>

    <div class="md-layout" v-for="(value, param) in analyzer.params" v-bind:key="param">
      <div class="md-layout-item md-size-15 column-left">{{param}}:</div>
      <div class="md-layout-item md-size-30 column-right">{{value ? value : "Not defined"}}</div>
    </div>

    <div v-if="analyzer.status === 'completed'">
      <div v-if="analyzer.name === 'Histogram'">
        <br>
        <histogram :frequencies="analyzer.result" type="bar"></histogram>
      </div>

      <div v-else-if="analyzer.name === 'DataType'">
        <br>
        <histogram :frequencies="analyzer.result" type="pie"></histogram>
      </div>

      <div class="md-layout" v-else>
        <div class="md-layout-item md-size-15 column-left resultcolumn">Result:</div>
        <div class="md-layout-item md-size-30 column-right resultcolumn"> {{this.analyzer.result}}</div>
      </div>
      <md-button v-if="analyzer.query" class="md-dense md-raised md-primary" @click="executeQuery()">
        Execute Query
      </md-button>

      <div v-if="queryResult" class="md-layout-item">
        <md-table md-card>
          <md-table-row>
            <md-table-head>index</md-table-head>
            <md-table-head v-for="(item, index) in queryResult.columns" :value="item" :key="index">
              {{item}}
            </md-table-head>
          </md-table-row>
          <md-table-row v-for="(row, index) in queryResult.data" :value="row" :key="index">
            <md-table-cell>{{index + 1}}</md-table-cell>
            <md-table-cell v-for="(cell, index) in row" :value="cell" :key="index">{{cell}}</md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </div>
    <div v-else-if="analyzer.status === 'error'">
      <div class="md-layout" >
        <div class="md-layout-item md-size-10 column-left resultcolumn">Error:</div>
        <div class="md-layout-item md-size-30 column-right resultcolumn"> {{this.analyzer.result}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import Histogram from "./Histogram";

  export default {
    props: ["analyzer"],
    name: "Analyzer",
    data() {
      return {
        queryResult: null
      };
    },
    components: {
      histogram: Histogram
    },
    methods: {
      executeQuery() {
        const body = {
          query: this.analyzer.query
        };
        axios
          .post("http://localhost:8080/api/db/query", body)
          .then(response => (this.queryResult = response.data.result));
      }
    }
  };
</script>
