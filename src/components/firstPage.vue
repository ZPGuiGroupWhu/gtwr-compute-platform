<template>
  <div class="container">
    <div id="hello">
      <dynamic></dynamic>
    </div>
    <div class="intro-text">
      <p class="title">GTWR云计算平台</p>
      <router-link to="/demo" class="link">点击此处可浏览更多GTWR应用案例</router-link>
    </div>
  </div>
</template>
    
<script>
require('../style/firstPage.scss')
import dynamic from '../components/firstPage/DynamicThreed.vue'

export default {
  name: 'firstPage', 
  data () {
    return {  
    }
  },
  components: {
    dynamic
  }
}
</script>