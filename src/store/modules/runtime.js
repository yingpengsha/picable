import deepcopy from 'deepcopy'
import { isObjectLike } from 'lodash'

import config from '@/config'

export default {
  namespaced: true,
  state: {
    diversionUrlList: [config.baseURL],
    keywordList: [],
    categoryList: [],
    windowTitle: '',
    sortList: [
      { code: 'ua', name: '默认' },
      { code: 'dd', name: '最新' },
      { code: 'da', name: '最旧' },
      { code: 'ld', name: '最爱' },
      { code: 'vd', name: '最多' }
    ],
    ttList: [
      { code: 'H24', name: '日排' },
      { code: 'D7', name: '周排' },
      { code: 'D30', name: '月排' }
    ],
    searchKeyword: '',
    savedScrollPositions: {}
  },
  mutations: {
    setDiversionUrlList (state, { nextDiversionUrlList }) {
      state.diversionUrlList = deepcopy(nextDiversionUrlList)
    },
    setKeywordList (state, { nextKeywordList }) {
      state.keywordList = deepcopy(nextKeywordList)
    },
    setCategoryList (state, { nextCategoryList }) {
      state.categoryList = deepcopy(nextCategoryList)
    },
    setWindowTitle (state, { nextTitle }) {
      state.windowTitle = deepcopy(nextTitle)
    },
    setSearchKeyword (state, { nextSearchKeyword }) {
      state.searchKeyword = '' + nextSearchKeyword
    },
    setSavedScrollPosition (state, { routeName, nextX = 0, nextY = 0 }) {
      if (!isObjectLike(state.savedScrollPositions[routeName])) {
        state.savedScrollPositions[routeName] = {}
      }
      state.savedScrollPositions[routeName].x = nextX
      state.savedScrollPositions[routeName].y = nextY
    }
  },
  actions: {}
}
