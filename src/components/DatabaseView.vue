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

        <div class="md-layout-item md-size-15">
          <ul class="mdc-list">
            <div v-for="(item, index) in columns[selectedTable]"
                          :value="item"
                          :key="index">
                <span>{{ item }}</span>
            </div>
          </ul>
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
        json: { tables: [
            { table: "firsttable", 
              columns: [ "firstcolumn1", "firstcolumn2", "firstcolumn3" ] }, 
            { table: "secondtable", 
              columns: [ "secondcolumn1", "secondcolumn2", "secondcolumn3", "secondcolumn4" ] }, 
            { table: "thirdtable",
              columns: [ "thirdcolumn1" ] } 
          ] },
        tables: [],
        selectedTable: "",
        columns: {},
        selectedColumn: "",
      };
    },
    mounted() {
        this.tables = this.json.tables;
        this.json.tables.forEach(currTable =>{
          this.columns[currTable.table] = currTable.columns;
        })
        this.selectedTable = this.tables[0].table;
        this.selectedColumn = this.columns[selectedTable][0];
      /*axios.get("http://localhost:8080/api/db/tables").then(response => {
        
      });*/
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
