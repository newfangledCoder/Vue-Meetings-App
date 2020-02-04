<template>
  <div id="app">
    <Navigation v-bind:user="user" @logout="logout" />
    <router-view
      class="container"
      v-bind:user="user"
      v-bind:meetings="meetings"
      v-bind:error="error"
      @logout="logout"
      @addMeeting="addMeeting"
      @deleteMeeting="deleteMeeting"
      @checkin="checkin"
    />
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";

import firebase from "firebase";

import db from "../src/db";

const firestore = db.firestore();

export default {
  name: "app",
  data: function() {
    return {
      user: null,
      error: null,
      meetings: []
    };
  },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.user = null;
          this.$router.push("login");
        });
    },
    addMeeting: function(payload) {
      firestore
        .collection("users")
        .doc(this.user.uid)
        .collection("meetings")
        .add({
          name: payload,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    },
    deleteMeeting: function(payload) {
      firestore
        .collection("users")
        .doc(this.user.uid)
        .collection("meetings")
        .doc(payload)
        .delete();
    },
    checkin: function(payload) {
      firestore.collection("users")
        .doc(payload.userID)
        .collection("meetings")
        .doc(payload.meetingID)
        .get()
        .then(doc => {
          if(doc.exists) {
            firestore.collection("users")
              .doc(payload.userID)
              .collection("meetings")
              .doc(payload.meetingID)
              .collection("attendies")
              .add({
                displayName: payload.displayName,
                email: payload.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
              })
              .then(() => {
                this.$router.push("/");
              });
          } else {
            this.error = "Sorry, No such meeting exists!";
          }
        });
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;

        firestore
          .collection("users")
          .doc(this.user.uid)
          .collection("meetings")
          .onSnapshot(snapshot => {
            const snapData = [];
            snapshot.forEach(doc => {
              snapData.push({
                id: doc.id,
                name: doc.data().name
              });
            });
            this.meetings = snapData.sort((a, b) => {
              if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return -1;
              } else {
                return 1;
              }
            });
          });
      }
    });
  },
  components: {
    Navigation
  }
};
</script>

<style lang="scss">
$primary: #05b2dd;
@import "../node_modules/bootstrap/scss/bootstrap";
</style>
