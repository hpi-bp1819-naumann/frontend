<template>
  <div class="db-view md-elevation-1">
    <div class="md-layout md-gutter">
      <router-link to="/dashboard"><md-button class="md-raised md-primary">menu</md-button></router-link>
      <div class="md-display-2">Database View</div>
    </div>

    <div class="md-layout md-gutter">

      <div class="md-layout-item md-size-20">
        <md-field>
          <label>Tables</label>
          <md-select v-model="selectedTable">
            <md-option v-for="(item, index) in tables"
                      :value="item"
                      :key="index">
              {{ item }}
            </md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item md-size-80">
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label>Number of Rows</label>
              <md-input v-model="numberOfRows" spellcheck="false"></md-input>
            <md-button class="md-dense md-raised md-primary" @click="ShowNumberOfRows">show rows</md-button>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field>
              Database: {{database.db}} <br>
              JDBC-Version: {{jdbcversion.jdbc}}
            </md-field>
          </div>
        </div>
      </div>

    </div>

    <div class="md-layout md-gutter">

      <div class="md-layout-item md-size-20">
        <md-table v-model="data.columns" md-card>
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Column">{{item.name}}</md-table-cell>
            <md-table-cell md-label="Datatype">{{item.dataType}}</md-table-cell>
          </md-table-row>
        </md-table>
      </div>

      <div class="md-layout-item md-size-80">
        <md-table md-card>
          <md-table-row>
            <md-table-head v-for="(item, index) in data.columns"
                    :value="item.name"
                    :key="index">
                    {{item.name}}
            </md-table-head>
          </md-table-row>
          <md-table-row v-for="(row, index) in data.rows"
                    :value="row"
                    :key="index">
              <md-table-cell v-for="(cell, index) in row"
                      :value="cell"
                      :key="index">
                      {{cell}}
              </md-table-cell>
            </md-table-row>
        </md-table>
      </div>

    </div>

  </div>
</template>


<script>
  import axios from "axios";

  export default {
    name: "DatabaseView",
    data() {
      return {
        tables: [],
        selectedTable: "",
        data: {},
        database: "",
        jdbcversion: "",
        numberOfRows: 10
      };
    },
    watch: {
      selectedTable: function () {
        axios.get(`http://localhost:8080/api/db/data/${this.selectedTable}`).then(response =>{
            this.data = response.data;
            this.numberOfRows = 10;
        })
      }
    },
    methods: {
      ShowNumberOfRows: function (){
        axios.get(`http://localhost:8080/api/db/rows/${this.selectedTable}/${this.numberOfRows}`).then(response =>{
            this.data.rows = response.data;
        })
      }
    },
    mounted() {
      axios.get("http://localhost:8080/api/db/tables").then(response => {
        this.tables = response.data.tables;
        this.selectedTable = this.tables[4];
      });
      axios.get("http://localhost:8080/api/db/version/db").then(response => {
        this.database = response.data;
      });
      axios.get("http://localhost:8080/api/db/version/jdbc").then(response => {
        this.jdbcversion = response.data;
      });
    }
  };
</script>

<style>
  .db-view {
    padding: 20px;
  }

  .md-field {
    max-width: 100%;
  }

  #pending {
    margin-top: 20px;
  }

</style>
