import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    type: '',
    orgName:''
  },
  mutations: {
    changeType(state,type){
      state.type = type;
    },
    changeOrgName(state,orgName){
      state.orgName = orgName;
    }
  }
})
