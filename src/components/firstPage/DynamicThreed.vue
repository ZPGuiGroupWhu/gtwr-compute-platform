<template>
    <div id="hello">
      <div id="dynamic"></div>
    </div>
</template>

<script>
require('../../style/firstPage.scss')
import echarts from 'echarts'
import 'echarts-gl'
import linedata from '../../assets/data/dataForDynamicThreeD.json'

export default {
  name: 'DynamicThreed', 
  data () {
    return {
      myChart:null,
      linedata: null
    }
  },
  mounted(){
    let self = this;
    this.dynamicThreeD();
    //适应屏幕大小绘图
    window.onresize = function(){
        setTimeout(function(){
            self.myChart.resize();
        },200)
    }
  },
  beforeDestroy(){
    this.myChart.clear();
  },
  methods:{
    //投影转换，经纬度计算
    coltowgs:function(LONCOL, LATCOL) {
        let lat1 = 30.6666667,
            lat2 = 31.8833333,
            lon1 = 120.866667,
            lon2 = 122.2,
            accuracy = 500,
            latStart = Math.min(lat1, lat2),
            lonStart = Math.min(lon1, lon2),
            deltaLon = accuracy * 360 / (2 * Math.PI * 6371004 * Math.cos((lat1 + lat2) * Math.PI / 360)),
            deltaLat = accuracy * 360 / (2 * Math.PI * 6371004),
            HBLON = LONCOL * deltaLon + (lonStart - deltaLon / 2),
            HBLAT = LATCOL * deltaLat + (latStart - deltaLat / 2)
        return [HBLON, HBLAT]
    },
    //绘制三维动态可视化效果
    dynamicThreeD:function(){
        let dom = document.getElementById("dynamic"),app = {},option;
        this.myChart = echarts.init(dom);
        mapboxgl.accessToken ='pk.eyJ1IjoiZ2VtbWFhYWEiLCJhIjoiY2o2a2N5dzB1MWd1ZTMzcnlqMDhkM3ZjYyJ9.0vVVkY9k7t8z0e3uqMgQnQ';
        option = {
            baseOption: {
                timeline: {
                    axisType: 'category',
                    orient: 'vertical',
                    autoPlay: true,
                    inverse: true,
                    playInterval: 300,
                    left: null,
                    right: 0,
                    top: null,
                    bottom: 50,
                    width: 55,
                    height: null,
                    show:false,
                    label: {
                        normal: {
                            textStyle: {color: '#fff'}
                        },
                        emphasis: {
                            textStyle: {color: '#aaa'}
                        }
                    },
                    symbol: 'circle',
                    lineStyle: {color: '#555'},
                    checkpointStyle: {
                        color: '#bbb',
                        borderColor: '#777',
                        borderWidth: 2
                    },
                    controlStyle: {
                        normal: {
                            color: '#666',
                            borderColor: '#666'
                        },
                        emphasis: {
                            color: '#aaa',
                            borderColor: '#aaa'
                        }
                    },
                    data: []
                },
                visualMap: {
                    show: false,
                    calculable: true,
                    realtime: false,
                    inRange: {color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']},
                    outOfRange: {colorAlpha: 0}
                },
                mapbox: {
                    center: [120.5393, 31.323070],
                    zoom: 9,
                    minZoom:8,
                    maxZoom:11,
                    pitch: 45,
                    bearing: -0,
                    style: 'mapbox://styles/mapbox/satellite-v9',
                    boxHeight: 25,
                    postEffect: {
                        enable: true,
                        SSAO: {
                            enable: true,
                            radius: 2,
                            intensity: 1.5
                        }
                    },
                    shading:'color',
                },
                series: [{
                    type: 'bar3D',
                    shading: 'realistic',
                    coordinateSystem: 'mapbox',
                    barSize: 0.16,
                    silent: true
                }]
            },
            options: []
        }
        for (let n = 0; n < linedata[2].length; n++) {
            option.baseOption.timeline.data.push(linedata[2][n]);
            let timedata = linedata[0][n],data = [];
            for (let i = 0; i < timedata.length; i += 1) {
                let loncol = linedata[0][n][i][0],
                    latcol = linedata[0][n][i][1],
                    count = linedata[0][n][i][2],
                    coor = this.coltowgs(loncol, latcol);
                data.push({
                    'value': [coor[0], coor[1], count]
                })
            }
            data.push({
                'value': [120, 30, linedata[1]]
            })
            option.options.push({
                visualMap: {max: linedata[1]},
                series: [{data: data}]
            });
        }
        if (option && typeof option === "object") {
            this.myChart.setOption(option, true);
        }
    }
  }
}
</script>