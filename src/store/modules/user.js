import { delToken, getToken, setToken } from "@/utils/storage"

export default {
  namespaced: true,
  state() {
    return{
      token:getToken(),
    }
  },
  mutations: {
    setUserToken(state, token) {
      state.token = token
      setToken(token)
    },
    logout(state) {
      // state.token = ''
      // setToken('')
      state.token = null;
      delToken();
    }
  },
  actions: {

  },
  getters: {}
}
