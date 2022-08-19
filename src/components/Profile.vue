<template>
  <div v-if="!blankPage">
    <div v-if="isloading" id="loader"></div>

    <div v-if="message" class="alert alert-info" role="alert">
      {{ message }}
    </div>

    <div class="container">

      <div class="card card-container" :class="isOnTheLine ? 'card card-container shiny-border' : 'card card-container'"
        style="position: relative;">

        <div ref="frontVidDiv " class="row"
          style="height:100%;width:100%;margin: auto;-moz-border-radius: 15px;-webkit-border-radius: 15px;border-radius: 15px;overflow: hidden;padding:0;">

          <div ref="frontParticipantDiv" class="col-md-6 frontParticipantDiv"
            style=" height:100%;width:100%;background-color: black;border-right:1px solid white;padding:0;">

          </div>

          <div ref="localParticipantDiv" class="col-md-6 localParticipantDiv"
            style="height:100%;width:100%;background-color: black;padding:0; ">

          </div>

        </div>

      </div>

      <div class="row button-area">
        <div class="col-md-2">

        </div>
        <div class="col-md-3">
          <button ref="exitStreamButton" type="button" class="btn btn-danger btn-md make_center"
            :disabled="!isOnTheLine" @click="handleExitStream">Exit Stream</button>
        </div>
        <div class="col-md-2 ">
          <div class="make_center">
            <div class="text-center" :class="isOnTheLine ? 'text-center reduce-opacity' : 'text-center'">Select Your
              Topic
            </div>
            <div class="make_center">
              <select v-model="topic" class="form-select form-select-sm" aria-label=".form-select-sm example"
                :disabled="isOnTheLine">
                <option value="NoSpecificTopic" selected>No Specific Topic</option>
                <option value="Pets">Pets</option>
                <option value="ComedyJokes">Comedy/Jokes</option> 
                <option value="MusicInstruments">Music/Instruments</option>
                <option value="VideoGames">Video Games</option>
                <option value="JobWork">Job/Work</option>
                <option value="Sports">Sports</option>
                <option value="Movies">Movies</option>
                <option value="Hobbies">Hobbies</option>
                <option value="Technology">Technology</option> 
                <option value="Politics">Politics</option>
                <option value="Fun">Fun</option>
                <option value="LanguagePractise">Language Practise</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <button type="button" class="btn btn-success btn-md make_center" :disabled="isOnTheLine"
            @click="handleConnectUser">Lets Connect</button>
        </div>
        <div class="col-md-2">

        </div>
      </div>
    </div>
  </div>>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Profile',
  computed: {
  },
  data() {
    return {
      blankPage: true,
      isOnTheLine: false,
      isloading: false,
      message: "",
      topic: "NoSpecificTopic",
    };
  },
  mounted() {
    const plugin = document.createElement("script");
    plugin.setAttribute(
      "src",
      "//sdk.twilio.com/js/video/releases/2.22.1/twilio-video.min.js"
    );
    document.head.appendChild(plugin);
  },
  created() {
    this.blankPage = true;
    if (localStorage.getItem('user') == null) {
      console.log("usr not found")
      this.$store.commit('updateLoggedInStatus', false);
      this.$store.commit('updateUserName', "User");
      this.$router.push("/login");
    }
    else {
      axios.get(process.env.VUE_APP_API_URL + '/user/token_validity',
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            'Authorization': JSON.parse(localStorage.getItem('user'))["token"]
          }
        }).then((resp) => {
          if (!(resp && resp.data && resp.data.success)) {
            console.log("token invalid");
            localStorage.removeItem('user')
            this.$store.commit('updateLoggedInStatus', false);
            this.$store.commit('updateUserName', "User");
            this.$router.push("/login");
          }
          else{
            this.blankPage = false;
          }
        }
        )
        .catch((error) => {
          console.log(error);
          console.log("errrrrrrrrrrrr")
          localStorage.removeItem('user');
          this.$store.commit('updateLoggedInStatus', false);
          this.$store.commit('updateUserName', "User");

          this.$router.push("/login");
        });
    }
  },


  methods: {

    // pure twilio function

    async joinVideoRoom(roomName, token) {
      // join the video room with the Access Token and the given room name
      const room = await window.Twilio.Video.connect(token, {
        room: roomName,
      });
      return room;
    },

    handleConnectedParticipant(participant, isLocal) {
      if (isLocal) {
        participant.tracks.forEach((trackPublication) => {
          this.handleTrackPublication(trackPublication, 1);
        });

        // listen for any new track publications
        participant.on("trackPublished", this.handleTrackPublication);
      }
      else {
        participant.tracks.forEach((trackPublication) => {
          this.handleTrackPublication(trackPublication, 0);
        });

        // listen for any new track publications
        participant.on("trackPublished", this.handleTrackPublication);
      }
    },

    handleTrackPublication(trackPublication, isLocal) {
      var thisnew = this;

      function displayTrack(track) {
        let participantDiv;
        if (isLocal == 1) {
          participantDiv = thisnew.$refs.localParticipantDiv;
        }
        else {
          participantDiv = thisnew.$refs.frontParticipantDiv;
        }
        participantDiv.append(track.attach());

        //console.log(participantDiv);
        //console.log(participantDiv.childNodes);
        //console.log(participantDiv.childNodes[0]);
        //console.log(participantDiv.childNodes[1]);
        //console.log(participantDiv.children);
        //console.log(participantDiv.children[0]);
        //console.log(participantDiv.children[1]);

        for (let i = 0; i < participantDiv.childNodes.length; i++) {
          if (participantDiv.childNodes[i].localName == 'video') {
            participantDiv.childNodes[i].style.height = '100%'
            participantDiv.childNodes[i].style.width = '100%'
          }
        }

      }

      // check if the trackPublication contains a `track` attribute. If it does,
      // we are subscribed to this track. If not, we are not subscribed.
      if (trackPublication.track) {
        displayTrack(trackPublication.track);
      }

      // listen for any new subscriptions to this track publication
      trackPublication.on("subscribed", displayTrack);
    },

    // pure twilio function end






    // once user connect with other
    handleConnectUser() {
      this.isloading = true;

      axios.post(process.env.VUE_APP_API_URL + '/user/activate_video', {
        topic: this.topic,
      },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            'Authorization': JSON.parse(localStorage.getItem('user'))["token"]
          }
        }).then((resp) => {
          if (resp.data) {
            if (resp.data.message) {
              this.message = resp.data.message;
            }
            if (resp.data.data.isInConnectionProcess) {
              this.isOnTheLine = true;
            }
            if (resp.data.success) {
              // join the video room with the token
              this.joinVideoRoom(resp.data.data.roomName, resp.data.data.token).then((room) => {

                // render the local and remote participants' video and audio tracks
                this.handleConnectedParticipant(room.localParticipant, 1);
                room.participants.forEach((participant) => {
                  this.handleConnectedParticipant(participant, 0);
                });
                room.on("participantConnected", this.handleConnectedParticipant);
                // handle cleanup when a participant disconnects
                room.on("participantDisconnected", () => {
                  room.localParticipant.removeAllListeners();
                  room.participants.forEach((participant) => {
                    participant.removeAllListeners();
                  });
                  room.disconnect();
                });

                const exitStreamByUser = this.$refs.exitStreamButton;
                exitStreamByUser.onclick = function () {
                  console.log(" exitStreamButton is fired")
                  room.localParticipant.removeAllListeners();
                  room.participants.forEach((participant) => {
                    participant.removeAllListeners();
                  });
                  room.disconnect();
                }
                window.addEventListener("pagehide", () => room.disconnect());
                window.addEventListener("beforeunload", () => room.disconnect());
              });
            }
          }
        }
        )
        .catch((error) => {
          console.log(error);
          this.message = "Some error occured"
        }).then(() => {
          // remove msg after 2s
          var newthis = this;
          setTimeout(function () { newthis.message = "" }, 2000);
          console.log('exited handle connect user function');
          this.isloading = false;
        });
    },



    // once user removes connection
    handleExitStream() {
      this.isloading = true;

      axios.post(process.env.VUE_APP_API_URL + '/user/stop_video',
        {},
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            'Authorization': JSON.parse(localStorage.getItem('user'))["token"]
          }
        }).then((resp) => {
          if (resp.data) {
            if (resp.data.message) {
              this.message = resp.data.message
            }
            if (!resp.data.data.isInConnectionProcess) {
              this.isOnTheLine = false;
            }
          }
        }
        )
        .catch((error) => {
          console.log(error);
          this.message = "Some error occured"
        }).then(() => {
          // remove msg after 2s
          var newthis = this;

          while (newthis.$refs.localParticipantDiv.firstChild) {
            newthis.$refs.localParticipantDiv.removeChild(newthis.$refs.localParticipantDiv.firstChild)
          }
          while (newthis.$refs.frontParticipantDiv.firstChild) {
            newthis.$refs.frontParticipantDiv.removeChild(newthis.$refs.frontParticipantDiv.firstChild)
          }


          setTimeout(function () { newthis.message = "" }, 2000);
          this.isloading = false;
          console.log('exit exitstream function');
        });



    },

  },
};
</script>


<style scoped>
#loader {
  position: absolute;
  left: 0%;
  right: 0%;
  top: 35%;
  z-index: 1;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border: 10px solid #f3f3f3;
  border-radius: 50%;
  border-top: 10px solid #3498db;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.card-container {
  width: 93%;
  max-width: 1000px !important;
  height: 380px;
  margin: 25px auto 25px;
  border: 4px solid #d1d1e0;
}

.card {
  /*top left-right bottom*/
  -moz-border-radius: 15px;
  -webkit-border-radius: 15px;
  border-radius: 15px;
}

.make_center {
  margin: 10px auto 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
}

.reduce-opacity {
  opacity: 0.5;
  color: #292d2c;
}

.shiny-border {
  border: 4px solid red;
}

.show_flex {
  display: flex;
}

.ParticipantDivNew {
  margin: 0;
}
</style>