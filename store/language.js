import { make } from 'vuex-pathify'

const getDefaultState = () => {
  return {
    locales: ['en'],
    locale: 'en'
  }
}

const state = getDefaultState

const mutations = {
  ...make.mutations(state),
  SET_DEFAULT_STATE(state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = make.actions(state)

const getters = make.getters(state)

export default {
  state,
  getters,
  actions,
  mutations
}
