<template>



  <div id="app">
    <!--<div>-->
      <!--<md-tabs router-link>-->
        <!--<md-tab md-label="Foo" to="/foo">foo</md-tab>-->
        <!--<md-tab md-label="Bar" to="/bar">bar</md-tab>-->
      <!--</md-tabs>-->
    <!--</div>-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>


<style>
#app {
  /*color: #2c3e50;*/
  margin: 20px;
}
</style>
