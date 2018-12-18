<template>
  <div class="db-view md-elevation-1">

    <div class="md-display-2">Database View</div>

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-15">
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
      </div>
  </div>
</template>


<script>
  import axios from "axios";

  export default {
    name: "DatabaseView",
    data() {
      return {
        json: {},
        tables: [],
        selectedTable: "",
      };
    },
    mounted() {
      axios.get("http://localhost:8080/api/db/tables").then(response => {
        this.json = response.data;
        this.tables = response.data.tables;
        this.selectedTable = response.data.tables[0];
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
