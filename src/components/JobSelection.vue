<template>
  <div class="job-selection md-elevation-1">
    <div class="md-display-2">Select Job</div>

    <div id="analyzer" class="md-layout md-gutter">
      <div class="md-layout-item md-size-20">
        <md-field>
          <label>Analyzer</label>
          <md-select v-model="selectedAnalyzerIndex">
            <md-option v-for="(analyzer, index) in analyzers" :value="index">{{analyzer.name}}</md-option>
          </md-select>
        </md-field>
      </div>
    </div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.options.hasContext">
        <md-field>
          <label>Context</label>
          <md-select v-model="selectedAnalyzer.context">
            <md-option
              v-for="(context, index) in contexts"
              :key="index"
              :value="context"
            >{{context}}</md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.options.hasTable">
        <md-field>
          <label>Tablename</label>
          <md-input v-model="selectedAnalyzer.table" spellcheck="false"></md-input>
        </md-field>
      </div>

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.options.hasColumn">
        <md-field>
          <label>Columnname</label>
          <md-input v-model="selectedAnalyzer.column" spellcheck="false"></md-input>
        </md-field>
      </div>
    </div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.options.hasWhere">
        <md-field>
          <label>WHERE</label>
          <md-input v-model="selectedAnalyzer.where" spellcheck="false"></md-input>
        </md-field>
      </div>

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.options.hasInstance">
        <md-field>
          <label>Instance</label>
          <md-input v-model="selectedAnalyzer.instance" spellcheck="false"></md-input>
        </md-field>
      </div>

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.options.hasPredicate">
        <md-field>
          <label>Predicate</label>
          <md-input v-model="selectedAnalyzer.predicate" spellcheck="false"></md-input>
        </md-field>
      </div>

      <div class="md-layout-item md-size-20" v-if="selectedAnalyzer.options.hasPattern">
        <md-field>
          <label>Pattern</label>
          <md-input v-model="selectedAnalyzer.pattern" spellcheck="false"></md-input>
        </md-field>
      </div>
    </div>

    <md-button class="md-dense md-raised md-primary" @click="startJob">Start Job</md-button>

    <jobs ref="jobsOverview"></jobs>
  </div>
</template>


<script>
import axios from "axios";
import Jobs from "./Jobs";

export default {
  name: "JobSelection",
  data() {
    return {
      analyzers: [],
      contexts: ["jdbc", "spark"],
      selectedAnalyzer: {
        context: "jdbc",
        table: "food_des",
        column: "fat_factor",
        where: null,
        options: {}
      },
      selectedAnalyzerIndex: null
    };
  },
  components: {
    jobs: Jobs
  },
  watch: {
    selectedAnalyzerIndex: function() {
      this.selectedAnalyzer.name = this.analyzers[
        this.selectedAnalyzerIndex
      ].name;
      this.selectedAnalyzer.key = this.analyzers[
        this.selectedAnalyzerIndex
      ].key;

      this.selectedAnalyzer.options = {};
      for (let option of this.analyzers[this.selectedAnalyzerIndex]
        .parameters) {
        let hasString =
          "has" +
          String(option.name)[0].toUpperCase() +
          String(option.name).slice(1);
        this.selectedAnalyzer.options[hasString] = true;
      }
      console.log("selected Analyzer: ", this.selectedAnalyzer);
    }
  },

  methods: {
    startJob: function() {
      console.log("starting job");
      console.log(this.selectedAnalyzer);

      axios
        .post(
          `http://localhost:8080/api/jobs/${this.selectedAnalyzer.key}/start`,
          {
            context: this.selectedAnalyzer.context,
            table: this.selectedAnalyzer.table,
            column: this.selectedAnalyzer.column,
            where: this.selectedAnalyzer.where,
            instance: this.selectedAnalyzer.instance,
            predicate: this.selectedAnalyzer.predicate,
            pattern: this.selectedAnalyzer.pattern
          }
        )
        .then(() => this.$refs.jobsOverview.refresh());
    }
  },
  mounted() {
    axios.get("http://localhost:8080/api/jobs/analyzers").then(response => {
      this.analyzers = response.data.analyzers;
      this.selectedAnalyzerIndex = 0;
    });
  }
};
</script>

<style>
.job-selection {
  padding: 20px;
}

#pending {
  margin-top: 20px;
}
</style>
