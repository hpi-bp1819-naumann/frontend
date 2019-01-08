<template>
  <div class="db-view md-elevation-1">

    <div class="md-display-2">Database View</div>

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
        <md-table v-model="firstRows.metaData.columns" md-card>
          <md-table-row slot="md-table-row" slot-scope="{ item }">
            <md-table-cell md-label="Column">{{item.name}}</md-table-cell>
            <md-table-cell md-label="Datatype">{{item.dataType}}</md-table-cell>
        </md-table-row>
      </md-table>
      </div>

      <div class="md-layout-item md-size-80">
        <md-table md-card>
          <md-table-row>
            <md-table-head v-for="(item, index) in firstRows.metaData.columns"
                    :value="item.name"
                    :key="index">
                    {{item.name}}
            </md-table-head>
          </md-table-row>
          <md-table-row v-for="(row, index) in firstRows.rows"
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
        firstRows: {}
      };
    },
    watch: {
      selectedTable: function () {
        console.log("test:" + this.selectedTable + ".");
        axios.get("http://localhost:8080/api/db/data/" + this.selectedTable).then(response =>{
            this.firstRows = response.data;
            console.log("got it");
        })
      }
    },
    mounted() {
      axios.get("http://localhost:8080/api/db/tables").then(response => {
        this.tables = response.data.tables;
        this.selectedTable = this.tables[4];
      });
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

</style>
