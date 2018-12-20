<template>
  <div class="db-view md-elevation-1">

    <div class="md-display-2">Database View</div>

    <div class="md-layout md-gutter">

      <div class="md-layout-item md-size-15">
        <md-field>
          <label>Tables</label>
          <md-select v-model="selectedTable">
            <md-option v-for="(item, index) in tables"
                      :value="item.table"
                      :key="index">
              {{ item.table }}
            </md-option>
          </md-select>
        </md-field>
      </div>

      <md-table v-model="columns[selectedTable]" md-card>>
              <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Column">{{item.name}}</md-table-cell>
          <md-table-cell md-label="Datatype">{{item.datatype}}</md-table-cell>
        </md-table-row>
      </md-table>

      <md-table v-model="firstRows" md-card>>
              <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Column">{{item.name}}</md-table-cell>
          <md-table-cell md-label="Datatype">{{item.datatype}}</md-table-cell>
        </md-table-row>
      </md-table>

    </div>


  </div>
</template>


<script>
  import axios from "axios";

  export default {
    name: "DatabaseView",
    data() {
      return {
        json: { tables: [
            { table: "food_des", 
              columns: [ 
                {name: "firstcolumn1", datatype: "int"}, 
                {name: "firstcolumn2", datatype: "string"},
                {name: "firstcolumn3", datatype: "int"} ] }, 
            { table: "testdata", 
              columns: [
                {name: "secondcolumn1", datatype: "int"}, 
                {name: "secondcolumn2", datatype: "string"},
                {name: "secondcolumn3", datatype: "int"},
                {name: "secondcolumn4", datatype: "int"} ] },
            { table: "testcorrelation",
              columns: [ 
                {name: "thirdcolumn4", datatype: "int"} ] }
          ] },
        tables: [],
        selectedTable: "",
        columns: {},
        firstRows: {}
      };
    },
    watch: {
      selectedTable: function () {
        console.log(this.selectedTable);
        axios.get("http://localhost:8080/api/db/" + this.selectedTable + "/data").then(response =>{
            this.firstRows = response.data;
        })
      }
    },
    mounted() {
      //api/<tablename>/data
      //axios.get("http://localhost:8080/api/db/tables").then(response => {
        //this.json = response.data;
        this.tables = this.json.tables;
        this.json.tables.forEach(currTable =>{
          this.columns[currTable.table] = currTable.columns;
        })
        this.selectedTable = this.tables[0].table;
        axios.get("http://localhost:8080/api/db/" + this.selectedTable + "/data").then(response =>{
            this.firstRows = response.data;
        })
      //});
    }
  };
</script>

<style>
  .db-view {
    padding: 20px;
  }

  .md-field {
    max-width: 300px;
  }

  #pending {
    margin-top: 20px;
  }

  .md-table {
    max-width: 40%;
  }

</style>
