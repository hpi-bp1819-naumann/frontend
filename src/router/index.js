import Vue from "vue";
import Router from "vue-router";
import DashBoard from "../components/DashBoard";
import JobSelection from "../components/JobSelection";
import Job from "../components/Job";
import DatabaseView from "../components/DatabaseView";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/dashboard",
      component: DashBoard
    },
    {
      path: "/dbview",
      component: DatabaseView
    },
    {
      path: "/jobs",
      component: JobSelection
    },
    {
      path: "/jobs/:jobId",
      component: Job
    },
    {
      path: "*",
      redirect: "/dashboard"
    }
  ]
});
