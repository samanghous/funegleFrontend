<template>
  <div id="app" >
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a href="/" class="navbar-brand">FunOmegle - Connect on a common topic</a>

      <div v-if="!isLoggedInStatus" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Login
          </router-link>
        </li>
      </div>

      <div v-if="isLoggedInStatus" class="navbar-nav ml-auto">
        <li class="nav-item">
          <a class="navbar-brand">
            Hi {{userName}}
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> LogOut
          </a>
        </li>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
 
export default {
  data(){
  },
  computed: {
    isLoggedInStatus() {
      return  this.$store.state.isLoggedIn;
    },
    userName() {
      return  this.$store.state.userName;
    },
  },
  methods: {
    logOut() {
      localStorage.removeItem("user");
      this.$store.commit('updateLoggedInStatus',false);
      this.$store.commit('updateUserName',"User");
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.users-name {
  color: rgb(5, 43, 4);
  background-color: rgb(229, 221, 221);
}
</style>
