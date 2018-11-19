<template>
  <div style="width:100%;height:100%" class="slides">
    <div class="slides_container" v-for="cur in [0,1,2,3]" v-show="slideShow[cur]" >
      <div class="slides_container_top">
        <div class="slides_container_top_img"><img :src="slidesContent[cur].imgSrc" class="slides_container_top_img_img"></div>
        <div class="slides_container_top_chartContainertop">
          <div :id="ChartId[cur][0]" class="slides_container_top_chartContainertop_chart"></div>
          <div :id="ChartId[cur][1]" class="slides_container_top_chartContainertop_chart"></div>
        </div>
      </div>
      <div class="slides_container_bottom">
        <div class="slides_container_bottom_left">
          <div class="slides_container_bottom_left_paper"><img :src="slidesContent[cur].paperSrc" class="slides_container_bottom_left_paper_img"></div>
          <div class="slides_container_bottom_left_abstract">{{(slidesContent[cur].abstract).slice(0,700)}}...<a target="_blank" :href="slidesContent[cur].paperLink">more</a></div>
        </div>
        <div class="slides_container_bottom_chart" :id="ChartId[cur][2]"></div> 
      </div>
    </div>
    <div class="playBtn">
      <button v-for="n in [0,1,2,3]" class="circle" @click="carousel(n)" :class="{on: index === n}"></button>
    </div>  
  </div> 
</template>

<script>
import echarts from 'echarts'
require('../../style/firstPage.scss')

export default {
  name: 'slides', 
  data () {
    return {
      imgs:null,
      slide:null,
      index:0,
      show:true,
      inv:5000,
      slideShow:[true,false,false,false],
      ChartId:[['chart0','chart1','chart2'],['chart3','chart4','chart5'],['chart6','chart7','chart8'],['chart9','chart10','chart11']],
      slidesContent:[
        {
          paperLink:"https://ac.els-cdn.com/S003442571730593X/1-s2.0-S003442571730593X-main.pdf?_tid=ceb21736-eb82-4109-8210-58ad341e6587&acdnat=1542623829_06e159cf1c08654469fa0ed06b43565e",
          imgSrc:require('../../assets/img/test1.jpg'),
          paperSrc:require('../../assets/img/test1_paper.png'),
          abstract:"The use of satellite-retrieved aerosol optical depth (AOD) data and statistical modeling provides a promising approach to estimating PM2.5 concentrations for a large region. However, few studies have conducted high spatial resolution assessments of ground-level PM2.5 for China at the national scale, due to the limitations of high-resolution AOD products. To generate high-resolution PM2.5 for the entirety of mainland China, a combined 3 km AOD dataset was produced by blending the newly released 3 km-resolution Moderate Resolution Imaging Spectroradiometer (MODIS) Dark Target AOD data with the 10 km-resolution MODIS Deep Blue AOD data. Using this dataset, surface PM2.5 measurements, and ancillary information, a space-time regression model that is an improved geographically and temporally weighted regression (GTWR) with an interior point algorithm (IPA)-based efficient mechanism for selecting optimal parameter values,was developed to estimate a large set of daily PM2.5 concentrations. Comparisons with the popular spatiotemporal models (daily geographically weighted regression and two-stage model) indicated that the proposed GTWR model, with an R2 of 0.80 in cross-validation (CV), performs notably better than the two other models, which have an R2 in CV of 0.71 and 0.72, respectively. The use of the combined 3-km high resolution AOD data was found not only to present detailed particle gradients, but also to enhance model performance (CV R2 is only 0.32 for the non-combined AOD data). Furthermore, the GTWR’s ability to predict PM2.5 for days without PM2.5-AOD paired samples and to generate historical PM2.5 estimates was demonstrated. As a result, fine-scale PM2.5 maps over China were generated, and several PM2.5 hotspots were identified. Therefore, it becomes possible to generate daily high-resolution PM2.5 estimates over a large area using GTWR, due to its synergy of spatial and temporal dimensions in the data and its ability to extend the temporal coverage of PM2.5 observations",
        },
        {
          paperLink:"https://ac.els-cdn.com/S0269749118303567/1-s2.0-S0269749118303567-main.pdf?_tid=e7274526-2e98-4d4f-9dee-d986cb2feec2&acdnat=1542623896_035f6bd60cd498d92a930a0315995485",
          imgSrc:require('../../assets/img/test2.jpg'),
          paperSrc:require('../../assets/img/test2_paper.png'),
          abstract:"Air pollution, being especially severe in the fast-growing developing world, continues to post a threat to public health. Yet, few studies are capable of quantifying well how different groups of people in different places experience different levels of air pollution at the global scale. In this paper, we use worldwide Chinese as a lens to quantify the spatiotemporal variations and geographic differences in PM2.5 exposures using unprecedented mobile phone big data and air pollution records. The results show that Chinese in South and East Asia suffer relatively serious PM2.5 exposures, where the Chinese in China have the highest PM2.5 exposures (52.8 mg/m3/year), which is fourfold higher than the exposures in the United States (10.7mg/m3/year). Overall, the Chinese in Asian cities (35.5mg/m3/year) experienced the most serious PM2.5 exposures when compared with the Chinese in the cities of other continents. These results, partly presented as a spatiotemporally explicit map of PM2.5 exposures for worldwide Chinese, help researchers and governments to consider how to address the effects of air pollution on public health with respect to different population groups and geographic locations",
        },
        {
          paperLink:"http://europepmc.org/backend/ptpmcrender.fcgi?accid=PMC5923615&blobtype=pdf",
          imgSrc:require('../../assets/img/test3.png'),
          paperSrc:require('../../assets/img/test3_paper.png'),
          abstract:"Extremely high fine particulate matter (PM2.5) concentration has been a topic of special concern in recent years because of its important and sensitive relation with health risks. However, many previous PM2.5 exposure assessments have practical limitations, due to the assumption that population distribution or air pollution levels are spatially stationary and temporally constant and people move within regions of generally the same air quality throughout a day or other time periods. To deal with this challenge, we propose a novel method to achieve the real-time estimation of population exposure to PM2.5 in China by integrating mobile-phone locating-request (MPL) big data and station-based PM2.5 observations. Nationwide experiments show that the proposed method can yield the estimation of population exposure to PM2.5 concentrations and cumulative inhaled PM2.5 masses with a 3-h updating frequency. Compared with the census-based method, it introduced the dynamics of population distribution into the exposure estimation, thereby providing an improved way to better assess the population exposure to PM2.5 at different temporal scales. Additionally, the proposed method and dataset can be easily extended to estimate other ambient pollutant exposures such as PM10, O3, SO2, and NO2, and may hold potential utilities in supporting the environmental exposure assessment and related policy-driven environmental actions",
        },
        {
          paperLink:"https://ac.els-cdn.com/S0048969718312257/1-s2.0-S0048969718312257-main.pdf?_tid=31cd4f0d-f60c-4e2a-8582-62b8905f8316&acdnat=1542624148_686a7ec5f28e79cb0cbdaf85d6795609",
          imgSrc:require('../../assets/img/test4.jpg'),
          paperSrc:require('../../assets/img/test4_paper.png'),
          abstract:"A growing body of evidence has proven that urban greenspace is beneficial to improve peoples physical and mental health. However, knowledge of population exposure to urban greenspace across different spatiotemporal scales remains unclear. Moreover, the majority of existing environmental assessments are unable to quantify how residents enjoy their ambient greenspace during their daily life. To deal with this challenge, we proposed a dynamic method to assess urban greenspace exposure with the integration of mobile-phone locating-request (MPL) data and high-spatial-resolution remote sensing images. This method was further applied to 30 major cit- ies in China by assessing cities' dynamic greenspace exposure levels based on residents' surrounding areas with different buffer scales (0.5 km, 1 km, and 1.5 km). Results showed that regarding residents' 0.5-km surrounding environment, Wenzhou and Hangzhou were found to be with the greenest exposure experience, whereas Zheng- zhou and Tangshan were the least ones. The obvious diurnal and daily variations of population exposure to their surrounding greenspace were also identified to be highly correlated with the distribution pattern of urban greenspace and the dynamics of human mobility. Compared with two common measurements of urban greenspace (green coverage rate and green area per capita), the developed method integrated the dynamics of population distribution and geographic locations of urban greenspace into the exposure assessment, thereby pre- senting a more reasonable way to assess population exposure to urban greenspace. Additionally, this dynamic framework could hold potential utilities in supporting urban planning studies and environmental health studies and advancing our understanding of the magnitude of population exposure to greenspace at different spatiotem- poral scales",
        }
      ],
    }
  },
  mounted(){
    this.run();
    this.drawChart();
    this.slide = document.getElementsByClassName('slides')[0];
    this.imgs = document.getElementsByTagName('table');
  },
  methods:{
    carousel:function(n){
      this.slideShow.splice(this.index,1,false);
      this.index = n;
      this.slideShow.splice(this.index,1,true);
    },
    run:function(){
      let self = this;
      this.invId = setInterval(()=>{
        self.slideShow.splice(self.index,1,false);
        self.index+=1;
        if (self.index == self.slidesContent.length) {
          self.index = 0
        }
        self.slideShow.splice(self.index,1,true);
      }, this.inv);     
    },
    drawChart:function(){
      let height = $('.slides_container_top_chartContainertop').css('height');
      height = parseInt(height.slice(0,height.length-2));
      $('#chart3').css('height',height/2);
      $('#chart4').css('height',height/2);
      $('#chart6').css('height',height/2);
      $('#chart7').css('height',height/2);
      $('#chart9').css('height',height/2);
      $('#chart10').css('height',height/2);
      for(let index = 0;index<12;index++){
        let string  = 'chart'+index,
            scatterChart = document.getElementById(string),
            myChart = echarts.init(scatterChart);
        let option = {
            xAxis: {scale: true},
            yAxis: {scale: true},
            tooltip : {trigger: 'item'},
            series: [{
                type: 'scatter',
                data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
                    [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
                    [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
                    [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
                    [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
                    [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
                    [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
                    [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
                    [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
                    [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
                    [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
                    [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
                    [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
                    [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
                    [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
                    [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
                    [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
                    [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
                    [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
                    [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
                    [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
                    [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
                    [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
                    [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
                    [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
                    [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
                    [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
                    [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
                    [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
                    [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
                    [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
                    [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
                    [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
                    [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
                    [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
                    [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
                    [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
                    [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
                    [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
                    [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
                    [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
                    [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
                    [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
                    [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
                    [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
                    [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
                    [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
                    [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                    [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
                    [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
                    [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
                    [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]
                ],
            }]
        };
        myChart.setOption(option, true);
      }
    }
  }
}
</script>