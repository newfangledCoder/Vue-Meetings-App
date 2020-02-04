import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Meetings from "../views/Meetings.vue";
import CheckIn from "../views/CheckIn.vue";
import Attendees from "../views/Attendees.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/meetings",
    name: "meetings",
    component: Meetings
  },
  {
    path: "/checkin/:userID/:meetingID",
    name: "checkin",
    component: CheckIn
  },
  {
    path: "/attendees/:userID/:meetingID",
    name: "attendees",
    component: Attendees
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  routes
});

export default router;
