<template>
  <div class="precision_container">
    <div class="precision_container_chart">
      <header class="title"><p>计算精度图表</p></header><!-- /header -->
    </div>
    <div class="precision_container_description">
      <header class="title"><p>计算精度描述</p></header><!-- /header -->
    </div>
  </div>
</template>

<script>
require('../../style/rightSideForResult.scss')
import messageBus from '../../bus/messageBus.js'
import {mapState} from 'vuex'

export default {
  name: 'computeLog',
  data () {
    return {
      
    }
  },
  computed:{
    ...mapState({
      
    })
  },
  mounted(){
    
  },
  watch:{
	  
  },
  methods:{

  }
}
</script>