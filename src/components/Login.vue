<template>
  <div v-if="!blankPage">
    <div v-if="loading" id="loader"></div>
    <div class="col-md-12">
      <div class="card card-container">
        <img id="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" class="profile-img-card" />

        <div v-if="!isOtpSend">
          <Form @submit="handleOtpSend" :validation-schema="schema1">
            <div class="form-group">
              <label for="email">Email</label>
              <Field name="email" type="text" class="form-control" />
              <ErrorMessage name="email" class="error-feedback" />
            </div>
            <div class="form-group">
              <label for="users_name">Name</label>
              <Field name="users_name" type="text" class="form-control" />
              <ErrorMessage name="users_name" class="error-feedback" />
            </div>
            <div class="form-group">
              <button class="btn btn-primary btn-block" :disabled="loading">
                <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                <span>Receive OTP</span>
              </button>
            </div>
            <div class="form-group">
              <div v-if="message" class="alert alert-danger" role="alert">
                {{ message }}
              </div>
            </div>
          </Form>
        </div>

        <div v-if="isOtpSend">
          <Form @submit="handleLogin" :validation-schema="schema2">
            <div class="form-group">
              <label for="otp">OTP</label>
              <Field name="otp" type="text" class="form-control" />
              <ErrorMessage name="otp" class="error-feedback" />
            </div>
            <div class="form-group">
              <button class="btn btn-primary btn-block" :disabled="loading">
                <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                <span>Login</span>
              </button>
            </div>
            <div class="form-group">
              <div v-if="message" class="alert alert-danger" role="alert">
                {{ message }}
              </div>
            </div>
          </Form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import axios from 'axios';

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema1 = yup.object().shape({
      email: yup.string().required("Email is required!"),
      users_name: yup.string().required("Name is required!"),
    });

    const schema2 = yup.object().shape({
      otp: yup.string().required("OTP is required!"),
    });

    return {
      loading: false,
      blankPage: true,
      message: "",
      schema1,
      schema2,
      users_name: "",
      email: "",
      otp: "",
      isOtpSend: false
    };
  },
  computed: {

  },
  created() {
    this.blankPage = true;
    if (localStorage.getItem('user') == null) {
      console.log("usr not found");
      this.$store.commit('updateLoggedInStatus', false);
      this.$store.commit('updateUserName', "User");
      this.blankPage = false;
    }
    else {
      axios.get(process.env.VUE_APP_API_URL + '/user/token_validity',
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            'Authorization': JSON.parse(localStorage.getItem('user'))["token"]
          }
        }).then((resp) => {
          if (resp && resp.data && resp.data.success) {
            console.log("token valid");
            this.$store.commit('updateLoggedInStatus', true);
            this.$store.commit('updateUserName', JSON.parse(localStorage.getItem('user'))["user"]["name"]);
            this.$router.push("/profile");
          }
          else{
            this.blankPage = false;
          }
        }
        )
        .catch((error) => {
          localStorage.removeItem('user');
          this.$store.commit('updateLoggedInStatus', false);
          this.$store.commit('updateUserName', "User");
          console.log(error);
          this.blankPage = false;
        });
    }
  },
  methods: {
    async handleOtpSend(user) {
      this.message = ""
      this.loading = true;
      this.email = user.email;
      this.users_name = user.users_name;


      axios.post(`${process.env.VUE_APP_API_URL}/user/register`, {
        email: user.email,
        name: user.users_name
      },
      ).then((resp) => {
        if (resp && resp.data && resp.data.success) {
          this.loading = false;
          this.isOtpSend = true;
        }
        else {
          this.message = resp.data.message
        }
      }
      )
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // this.message = "a " + error.response.data + " " + error.response.status + " " + error.response.headers;
            this.message = "a : some error occured"
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            // this.message = "b" + error
            this.message = "b : some error occured"
          } else {
            // Something happened in setting up the request that triggered an Error
            //this.message = "c " + error.message
            this.message = "c : some error occured"
          }

        }).then(() => {
          this.loading = false;
        });

    },


    async handleLogin(user) {
      this.message = ""
      this.loading = true;

      axios.post(process.env.VUE_APP_API_URL + '/user/otp', {
        email: this.email,
        otp: user.otp
      },
        {
          headers: { "Access-Control-Allow-Origin": "*" }
        }).then((resp) => {
          if (resp && resp.data && resp.data.success) {
            console.log("success")
            localStorage.setItem('user', JSON.stringify(resp.data));
            this.$store.commit('updateLoggedInStatus', true);
            this.$store.commit('updateUserName', JSON.parse(localStorage.getItem('user'))["user"]["name"]);
            this.loading = false;
            this.$router.push("/profile");
          }
          else {
            this.message = resp.data.message
          }
        }
        )
        .catch((error) => {
          console.log(error);
          this.message = "Error in validating OTP"
        }).then(() => {
          this.loading = false;
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
  top: 50%;
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

label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.error-feedback {
  color: red;
}
</style>
