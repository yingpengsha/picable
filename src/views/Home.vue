<template>
<div class="home-container">
  <!-- `partName` is 'normalMei'|'normalMu'|'rankH24'|'rankD7'|'rankD30' -->
  <div v-for="partName in homePageModulePartList" :key="partName">
    <div v-if="isRequestingCollections[partName]">
      <div class="unit-group">
        <h2 class="loading-unit-group-title">
          <div class="cover"></div>
        </h2>
        <div class="comic-list">
          <loading-item-small v-for="index in 4" :key="'loading' + partName + index" />
        </div>
      </div>
    </div>
    <div v-else-if="!isEmpty(collectionsList[partName])">
      <div class="unit-group">
        <h2>
          <span>{{ collectionsList[partName].title }}</span>
          <router-link :to="{ name: 'Rank' }" custom v-slot="{ navigate }" v-if="partName.startsWith('rank')">
            <div class="nav-btn" @click="navToRank(navigate, partName)">查看全部</div>
          </router-link>
        </h2>
        <div class="comic-list" v-if="collectionsList[partName].comics.length">
          <item-small v-for="item in collectionsList[partName].comics" :key="collectionsList[partName].title + item._id" :item="item"
            :link="{ name: 'ComicDetail', params: { comicId: item._id } }"
          />
        </div>
        <div class="tip-layer" v-else-if="/^normal(Mu|Mei)$/.test(partName)">
          <common-tip-block>哔咔娘还不知道你的喜好哦，先去看点喜欢的本子吧</common-tip-block>
        </div>
      </div>
    </div>
  </div>
  <div class="tip-layer" v-if="!homePageModulePartList.length">
    <common-tip-block>你没有订阅主页模块，请前往<code>「设置」-「主页模块」</code>进行设置</common-tip-block>
  </div>
  <small class="small-tip" v-else>主页模块支持自定义，请前往<code>「设置」-「主页模块」</code>进行设置</small>
</div>
</template>

<script>
import LoadingItemSmall from '../components/LoadingItemSmall.vue'
import ItemSmall from '../components/ItemSmall.vue'
import CommonTipBlock from '../components/CommonTipBlock.vue'
import { mapState } from 'vuex'
import { isEmpty } from 'lodash'

export default {
  name: 'Home',
  components: {
    LoadingItemSmall,
    ItemSmall,
    CommonTipBlock
  },
  data () {
    return {
      isRequestingCollections: { normalMei: true, normalMu: true, rankH24: true, rankD7: true, rankD30: true },
      collectionsList: {
        normalMei: {},
        normalMu: {},
        rankH24: {},
        rankD7: {},
        rankD30: {}
      }
    }
  },
  computed: {
    ...mapState({
      homePageModule: state => state.storage.homePageModule
    }),
    homePageModulePartList () {
      return this.homePageModule.order.filter(p => this.homePageModule.part[p])
    }
  },
  methods: {
    isEmpty,
    async getList (partName) {
      // ! NOTICE: partName 'normal' stands for both normalMei and normalMu
      if (partName === 'normal') {
        // change state.
        this.isRequestingCollections.normalMei = true
        this.isRequestingCollections.normalMu = true
        // call api.
        const shenMoTuiJianList = await this.$api.shenMoCollections({
          diversionUrl: this.diversionUrl, token: this.token
        })
        let mei = {}
        let mu = {}
        shenMoTuiJianList.forEach(item => {
          if (/妹推薦/.test(item.title)) {
            mei = item
          }
          if (/母推薦/.test(item.title)) {
            mu = item
          }
        })
        this.collectionsList.normalMei = mei
        this.collectionsList.normalMu = mu
        // change state.
        this.isRequestingCollections.normalMei = false
        this.isRequestingCollections.normalMu = false
      } else {
        // change state.
        this.isRequestingCollections[partName] = true
        // call api.
        const referTt = { rankH24: 'H24', rankD7: 'D7', rankD30: 'D30' }
        const referTitle = { rankH24: '每日排行榜', rankD7: '每周排行榜', rankD30: '每月排行榜' }
        const rankList = await this.$api.rank({
          diversionUrl: this.diversionUrl, token: this.token, tt: referTt[partName]
        })
        this.collectionsList[partName] = {
          title: referTitle[partName], comics: rankList.slice(0, 4)
        }
        // change state.
        this.isRequestingCollections[partName] = false
      }
    },
    async navToRank (navigate, partName) {
      const tt = partName.match(/(?<=rank).+/)[0]
      console.log(tt)
      this.$store.commit('runtime/setCurrentTt', { nextCurrentTt: tt })
      navigate()
    }
  },
  watch: {
    homePageModule: {
      deep: true,
      immediate: true,
      handler (newVal) {
        // `part` change
        let isNormalXXRequesting = false
        for (const partName in newVal.part) {
          if (newVal.part[partName] && isEmpty(this.collectionsList[partName])) {
            if (/^normal(Mu|Mei)$/.test(partName)) {
              if (isNormalXXRequesting) { continue }
              isNormalXXRequesting = true
              this.getList('normal')
            } else {
              this.getList(partName)
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config';
@import '~@/assets/themes/@{theme-name}/theme';
.home-container {
  .unit-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
    h2 {
      display: flex;
      align-items: baseline;
      margin: 0;
      .nav-btn {
        font-size: .7em;
        color: @color-font-default-highlight;
        margin-left:  1em;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .loading-unit-group-title {
      width: 8em;
      background: #eee;
      padding: 0;
      .cover {
        width: 100%;
        height: 1.4em;
        animation: loading 5s linear infinite;
        background-image: linear-gradient(50deg, transparent, transparent, #fafafa 55%, transparent, transparent);
        background-size: 400% 100%;
        z-index: 3;
      }
    }
    .comic-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
  .tip-layer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
  }
  .small-tip {
    color: @color-font-default-sub;
  }
}
@keyframes loading {
  0% {
    background-position: 400% 50%
  }
  to {
    background-position: 0% 50%
  }
}
</style>
