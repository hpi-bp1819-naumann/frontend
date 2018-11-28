<template>
  <div class="hello">
    <h1>{{msg}}</h1>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "hello",
  data() {
    return {
      msg: "Miaauuu"
    };
  },
  mounted() {
    axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then(response => (this.msg = response));
  }
};
</script>
