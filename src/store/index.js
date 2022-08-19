import { createStore } from "vuex";

export default createStore({
  state: {
    isLoggedIn:false,
    userName:"User"
  },
  mutations: {
    updateLoggedInStatus(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn
    },
    updateUserName(state, name) {
      state.userName = name
    },
  },
  getters: {
  
  }
  })