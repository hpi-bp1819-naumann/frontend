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

    <div v-for="(column, key) in data.jobs[0].result.profiles" :key="key">
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
            <histogram :frequencies="column.histogram.values" type="bar"></histogram>
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
        data: {
            "jobs": [
                {
                    "name": "ColumnProfiler",
                    "result": {
                        "profiles": {
                            "long_desc": {
                                "column": "long_desc",
                                "completeness": 1,
                                "approximateNumDistinctValues": 6894,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": true,
                                "typeCounts": {
                                    "Boolean": 0,
                                    "Fractional": 0,
                                    "Integral": 0,
                                    "Unknown": 0,
                                    "String": 7146
                                }
                            },
                            "n_factor": {
                                "column": "n_factor",
                                "completeness": 0.7935908200391828,
                                "approximateNumDistinctValues": 66,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": false,
                                "typeCounts": {},
                                "mean": 5.935581026274034,
                                "maximum": 6.4,
                                "minimum": 0,
                                "sum": 33660.680000000044,
                                "stdDev": 1.2132412391799505,
                                "approxPercentiles": [
                                    0,
                                    0,
                                    0,
                                    0,
                                    5.3,
                                    5.3,
                                    5.6,
                                    5.6,
                                    5.7,
                                    5.7,
                                    5.78,
                                    5.8,
                                    5.8,
                                    5.9,
                                    5.9,
                                ]
                            },
                            "manufacname": {
                                "column": "manufacname",
                                "completeness": 1,
                                "approximateNumDistinctValues": 57,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": true,
                                "typeCounts": {
                                    "Boolean": 0,
                                    "Fractional": 0,
                                    "Integral": 6422,
                                    "Unknown": 0,
                                    "String": 724
                                },
                                "histogram": {
                                    "values": {
                                        "": {
                                            "absolute": 6422,
                                            "ratio": 0.8986845787853345
                                        },
                                        "Kellogg, Co.": {
                                            "absolute": 108,
                                            "ratio": 0.015113350125944584
                                        },
                                        "Veryfine Products, Inc.": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "M&M/Mars Inc.": {
                                            "absolute": 17,
                                            "ratio": 0.002378953260565351
                                        },
                                        "Tropicana Products, Inc.": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "E.J. Brach's Corp.": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "NAYA Inc.": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "McKee Baking, Co.": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "McIlhenny Co.": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "Quaker Oats Company - The Gatorade Company,  a unit of Pepsi Co.": {
                                            "absolute": 4,
                                            "ratio": 0.000559753708368318
                                        },
                                        "Taco Bell Corp.": {
                                            "absolute": 11,
                                            "ratio": 0.0015393226980128744
                                        }
                                    },
                                    "numberOfBins": 58
                                }
                            },
                            "refuse": {
                                "column": "refuse",
                                "completeness": 0.9921634480828435,
                                "approximateNumDistinctValues": 75,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": false,
                                "typeCounts": {},
                                "mean": 5.294217207334274,
                                "maximum": 81,
                                "minimum": 0,
                                "sum": 37536,
                                "stdDev": 12.324813361152192,
                                "approxPercentiles": [
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                    0,
                                ]
                            },
                            "fdgrp_cd": {
                                "column": "fdgrp_cd",
                                "completeness": 1,
                                "approximateNumDistinctValues": 24,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": true,
                                "typeCounts": {
                                    "Boolean": 0,
                                    "Fractional": 0,
                                    "Integral": 7146,
                                    "Unknown": 0,
                                    "String": 0
                                },
                                "mean": 1225.5247691015952,
                                "maximum": 3500,
                                "minimum": 100,
                                "sum": 8757600,
                                "stdDev": 630.4570643650665,
                                "approxPercentiles": [
                                    100,
                                    100,
                                    100,
                                    300,
                                    300,
                                    300,
                                ]
                            },
                            "ndb_no": {
                                "column": "ndb_no",
                                "completeness": 1,
                                "approximateNumDistinctValues": 7969,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": true,
                                "typeCounts": {
                                    "Boolean": 0,
                                    "Fractional": 0,
                                    "Integral": 7146,
                                    "Unknown": 0,
                                    "String": 0
                                },
                                "mean": 13961.555695493982,
                                "maximum": 93600,
                                "minimum": 1001,
                                "sum": 99769277,
                                "stdDev": 8546.025265990858,
                                "approxPercentiles": [
                                    1001,
                                    1203,
                                    1203,
                                    3131,
                                    3131,
                                    3815,
                                    3815,
                                    4502,
                                    4502,
                                    5005,
                                    5131,
                                    5131,
                                    5254,
                                ]
                            },
                            "ref_desc": {
                                "column": "ref_desc",
                                "completeness": 1,
                                "approximateNumDistinctValues": 681,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": true,
                                "typeCounts": {
                                    "Boolean": 0,
                                    "Fractional": 0,
                                    "Integral": 5539,
                                    "Unknown": 0,
                                    "String": 1607
                                }
                            },
                            "comname": {
                                "column": "comname",
                                "completeness": 1,
                                "approximateNumDistinctValues": 114,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": true,
                                "typeCounts": {
                                    "Boolean": 0,
                                    "Fractional": 0,
                                    "Integral": 6675,
                                    "Unknown": 0,
                                    "String": 471
                                },
                                "histogram": {
                                    "values": {
                                        "sport drink, thirst quencher": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "Cilantro, raw, Chinese parsley, raw": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "Includes USDA commodity food A256, A264": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "Sirloin steak, Sirloin strip": {
                                            "absolute": 15,
                                            "ratio": 0.0020990764063811922
                                        },
                                        "soft drink, pop, white soda": {
                                            "absolute": 2,
                                            "ratio": 0.000279876854184159
                                        },
                                        "Includes USDA Commodity B879": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "Includes USDA Commodity  B877": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "lite mayonnaise": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        },
                                        "Tender Medallions, Teres Major": {
                                            "absolute": 11,
                                            "ratio": 0.0015393226980128744
                                        },
                                        "Includes USDA commodity food A255, A263": {
                                            "absolute": 1,
                                            "ratio": 0.0001399384270920795
                                        }
                                    },
                                    "numberOfBins": 111
                                }
                            },
                            "fat_factor": {
                                "column": "fat_factor",
                                "completeness": 0.7325776658270361,
                                "approximateNumDistinctValues": 48,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": false,
                                "typeCounts": {},
                                "mean": 8.72219102196739,
                                "maximum": 9.04,
                                "minimum": 0,
                                "sum": 45660.669999999285,
                                "stdDev": 0.484954564966414,
                                "approxPercentiles": [
                                    0,
                                    8.37,
                                    8.37,
                                    8.37,
                                    8.37,
                                    8.37,
                                    8.37,
                                    8.37,
                                    8.37,
                                ]
                            },
                            "sciname": {
                                "column": "sciname",
                                "completeness": 1,
                                "approximateNumDistinctValues": 438,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": true,
                                "typeCounts": {
                                    "Boolean": 0,
                                    "Fractional": 0,
                                    "Integral": 6472,
                                    "Unknown": 0,
                                    "String": 674
                                }
                            },
                            "cho_factor": {
                                "column": "cho_factor",
                                "completeness": 0.7177441925552757,
                                "approximateNumDistinctValues": 81,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": false,
                                "typeCounts": {},
                                "mean": 3.851978943263862,
                                "maximum": 4.27,
                                "minimum": 0,
                                "sum": 19756.80000000035,
                                "stdDev": 0.22577567762000286,
                                "approxPercentiles": [
                                    0,
                                    3.48,
                                    3.57,
                                    3.57,
                                    3.57,
                                    3.57,
                                    3.57,
                                ]
                            },
                            "pro_factor": {
                                "column": "pro_factor",
                                "completeness": 0.7191435768261965,
                                "approximateNumDistinctValues": 106,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": false,
                                "typeCounts": {},
                                "mean": 3.7518369332555705,
                                "maximum": 4.36,
                                "minimum": 0,
                                "sum": 19280.690000000377,
                                "stdDev": 0.6535605266585791,
                                "approxPercentiles": [
                                    0,
                                    2.44,
                                    2.44,
                                    2.44,
                                    2.44,
                                    2.44,
                                    2.44,
                                    2.44,
                                    2.44,
                                    2.44,
                                    2.5,
                                    2.5,
                                    2.78,
                                    2.78,
                                    2.78,
                                ]
                            },
                            "survey": {
                                "column": "survey",
                                "completeness": 1,
                                "approximateNumDistinctValues": 2,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": true,
                                "typeCounts": {
                                    "Boolean": 0,
                                    "Fractional": 0,
                                    "Integral": 4468,
                                    "Unknown": 0,
                                    "String": 2678
                                },
                                "histogram": {
                                    "values": {
                                        " ": {
                                            "absolute": 4468,
                                            "ratio": 0.6252448922474111
                                        },
                                        "Y": {
                                            "absolute": 2678,
                                            "ratio": 0.37475510775258886
                                        }
                                    },
                                    "numberOfBins": 2
                                }
                            },
                            "shrt_desc": {
                                "column": "shrt_desc",
                                "completeness": 1,
                                "approximateNumDistinctValues": 7123,
                                "dataType": {
                                    "name": null
                                },
                                "isDataTypeInferred": true,
                                "typeCounts": {
                                    "Boolean": 0,
                                    "Fractional": 0,
                                    "Integral": 0,
                                    "Unknown": 0,
                                    "String": 7146
                                }
                            }
                        },
                        "numRecords": 7146
                    },
                    "id": "4df06c718df04837834dcfa31d7dde3e",
                    "finishingTime": 1551271976435,
                    "status": "completed",
                    "startingTime": 1551271968682
                }
            ]
        }
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
