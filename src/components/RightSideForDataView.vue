<template>
  <div class="right-container">
    <div class="map-container">  
      <map-viewer></map-viewer>
    </div>
    <data-viewer></data-viewer>
    <div style="clear:both"></div>
  </div>
</template>

<script>
import mapViewer from './MapViewer'
import dataViewer from './DataViewer'
import messageBus from '../bus/messageBus';
require('../style/main_style.scss')

export default {
  name: 'RightSideForDataView',
  data () {
    return {
    }
  },
  components:{
    dataViewer,
    mapViewer
  }
}
</script>
