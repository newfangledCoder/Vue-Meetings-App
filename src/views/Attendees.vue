<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="font-weight-light text-center">Attendees</h1>

        <div class="card bg-light mb-4">
          <div class="card-body text-center">
            <div class="input-group input-group-lg">
              <input
                type="text"
                placeholder="Search Attendees"
                class="form-control"
                v-model="searchQuery"
                ref="searchQuery"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-sm btn-outline-info"
                  title="Pick a random attendee"
                  @click="chooseRandom"
                >
                  <font-awesome-icon icon="random"></font-awesome-icon>
                </button>
                <button
                  class="btn btn-sm btn-outline-info"
                  title="Reset Search"
                  @click="resetQuery"
                >
                  <font-awesome-icon icon="undo"></font-awesome-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-8 col-sm-6 col-md-4 col-lg-3 mb-2 p-0 px-1"
        v-for="item in filteredAttendees"
        :key="item.id"
      >
        <div class="card">
          <div class="card-body px-3 py-2 d-flex align-items-center justify-content-center">
            <div class="btn-group pr-2"
              v-if="user != null && user.uid === userID"
            >
              <button class="btn btn-sm"
                :class="[
                  item.star ? 'text-danger': '', 'btn-outline-secondary'
                ]"
                title="Give us a star"
                @click="toggleStar(item.id)"
              >
                <font-awesome-icon icon="star"></font-awesome-icon>
              </button>
              <a class="btn btn-sm btn-outline-secondary"
                title="Send user an email"
                :href="'mailto:' + item.email"
              >
                <font-awesome-icon icon="envelope"></font-awesome-icon>
              </a>
              <button class="btn btn-sm btn-outline-secondary"
                title="Delete Attendee"
                @click="deleteAttendee(item.id)"
              >
                <font-awesome-icon icon="trash"></font-awesome-icon>
              </button>
            </div>
            <div>{{ item.displayName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import firebaseApp from "../db";

const db = firebaseApp.firestore();

export default {
  name: "attendees",
  props: ["user"],
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      attendees: [],
      userID: this.$route.params.userID,
      meetingID: this.$route.params.meetingID,
      searchQuery: "",
      displayAttendees: []
    };
  },
  computed: {
    filteredAttendees: function() {
      if (this.searchQuery === "") {
        return this.displayAttendees;
      } else {
        const filteredData = item => {
          return item.displayName
            .toLowerCase()
            .match(this.searchQuery.toLowerCase());
        };
        return this.displayAttendees.filter(filteredData);
      }
    }
  },
  methods: {
    deleteAttendee: function(attendeeID) {
      if (this.user !== null && this.userID === this.user.uid) {
        db.collection("users")
          .doc(this.userID)
          .collection("meetings")
          .doc(this.meetingID)
          .collection("attendies")
          .doc(attendeeID)
          .delete();
      }
    },
    toggleStar: function(attendeeID) {
      if (this.user !== null && this.userID === this.user.uid) {
        const ref = db.collection("users")
          .doc(this.userID)
          .collection("meetings")
          .doc(this.meetingID)
          .collection("attendies")
          .doc(attendeeID);
        ref.get().then(doc => {
          const star = doc.data().star;
          if (star) {
            ref.update({
              star: !star
            });
          } else {
            ref.update({
              star: true
            });
          }
        });
      }
    },
    chooseRandom: function() {
      const randomAttendee = Math.floor(Math.random() * this.attendees.length);
      this.displayAttendees = [this.attendees[randomAttendee]];
    },
    resetQuery: function() {
      this.displayAttendees = this.attendees;
      this.searchQuery = "";
      this.$refs.searchQuery.focus();
    }
  },
  mounted() {
    db.collection("users")
      .doc(this.userID)
      .collection("meetings")
      .doc(this.meetingID)
      .collection("attendies")
      .onSnapshot(snapshot => {
        const snapData = [];
        snapshot.forEach(doc => {
          snapData.push({
            id: doc.id,
            email: doc.data().email,
            displayName: doc.data().displayName,
            star: doc.data().star
          });
        });
        this.attendees = snapData;
        this.displayAttendees = this.attendees;
      });
  }
};
</script>
