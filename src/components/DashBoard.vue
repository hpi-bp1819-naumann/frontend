<template>
  <div>
    <h1>This is the DashBoard</h1>
    <div> 
      <b> Go to </b> <br>
      <router-link to="/jobs"><md-button class="md-raised md-primary" >Jobs Selection</md-button></router-link> <br>
      <router-link to="/dbview"><md-button class="md-raised md-primary" >Database View</md-button></router-link>
    </div>
    <br>
    <div>
      <h3> Change Database </h3>
      <div class="md-layout md-gutter">

        <div class="md-layout-item md-size-50">
          <md-field>
            <label>URL</label>
            <md-input v-model="url" spellcheck="false"></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20">
          <md-field>
            <label>username</label>
            <md-input v-model="username" spellcheck="false"></md-input>
          </md-field>
          <md-field>
            <label>password</label>
            <md-input v-model="password" spellcheck="false"></md-input>
          </md-field>
        </div>

        <div class="md-layout-item md-size-20">
          <md-button class="md-dense md-raised md-primary" @click="changeDB">change</md-button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  import axios from "axios";
export default {
  name: "DashBoard",
  data() {
    return {
      url: "",
      username: "",
      password: ""
    };
  },
  mounted() {
    axios.get("http://localhost:8080/api/settings/uri").then(response => {
      this.url = response.data.uri;
    });
    axios.get("http://localhost:8080/api/settings/user").then(response => {
      this.username = response.data.user;
    });
  },
  methods: {
    changeDB: function (){
      axios.post("http://localhost:8080/api/settings/uri", {"uri": this.url}).then(response => {
        console.log(response);
      });
      axios.post("http://localhost:8080/api/settings/user", {"user": this.username}).then(response => {
        console.log(response);
      });
      axios.post("http://localhost:8080/api/settings/password", {"password": this.password}).then(response => {
        console.log(response);
      });
    }
  },
};
</script>

<style>
</style>
