<template>
  <div class="home">
    <div class="left-side">
        <data-selector></data-selector>
        <par-definer></par-definer>
    </div>
    <div class="right-side">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import dataSelector from './DataSelector'
import parDefiner from './ParDefiner'
require('../style/home.scss')

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  mounted(){
    this.$router.push({path:'/home'})
  },
  components:{
    dataSelector,
    parDefiner
  }
}
</script>
