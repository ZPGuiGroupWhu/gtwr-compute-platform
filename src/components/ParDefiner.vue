<template>
  <div class="par-container">
	<header class="title"><p>计算参数设置</p></header><!-- /header -->
    <div class="GWRtab" >
		<button :class="{active: tab==1}" @click="gtwr">GTWR</button>
		<button :class="{active: tab==2}" @click="gwr">GWR</button>
	</div>
	<div class="par-list">	   
		<div v-if="tab==1">
		    <div v-for="(par,index) in par_list1">
		    	<span class="par-title">{{par.name}}：</span>
				<input placeholder="输入参数" v-model="par.value" >
				<select v-model="par.value">
					<option v-for="item in index == 6 ? par_list1[6].options: index == 7 ? par_list1[7].options:varList">{{item}}</option>
				</select>
		        <p>参数说明：{{par.content}}</p>
	   		</div>
		</div>
			 <div v-else>
						<div v-for="(par,index) in par_list2">
						<span class="par-title">{{par.name}}：</span>
						<input placeholder="输入参数" v-model="par.value" >
						<select v-show="par.name!='bandWidth'" v-model="par.value"><option v-for="item in varList">{{item}}</option></select>
		        <p>参数说明：{{par.content}}</p>
	   	   </div>
	   	 </div>		  
			<div style="background:white;width:100px;height:18px;border:none;margin-left: 206px">
				<div id="proBar" style="height:30px;width:0%;background-color:rgba(0,0,0,0.8);color:rgba(0,0,0,0.8);border-radius: 3px;margin-left: 18px;">
					<span style="display: inline-block;position: relative;"></span>
				</div>
			</div> 
		<button class="submit" style="vertical-align:middle" @click="compute"><span>开始计算</span></button> 		
	</div>  
  </div>
</template>

<script>
require('../style/parDefiner.scss')
import {mapState} from 'vuex'
import messageBus from '../bus/messageBus.js'

var $ = require("jquery")
export default {
  name: 'ParDefiner',
  data () {
    return {
			tab:1,
			par_list1:[
				{name:'因变量', value:'', content:'GTWR模型的dependent variable'},
				{name:'解释变量', value:'', content:'GTWR模型的explanatory variable'},
				{name:'X - 坐标', value:'', content:'点或面板数据的x坐标，表示空间信息'},
				{name:'Y - 坐标', value:'', content:'点或面板数据的y坐标，表示空间信息'},
				{name:'时间维度', value:'', content:'点或面板数据的时间戳，表示时态信息'},
				{name:'时空距比', value:'', content:'可自定义，也可自动优化生成'},
				{name:'带宽方法', value:'', content:'选择计算带宽的方法，如AICc等',options:['交叉验证法','AIC准则','贝叶斯信息准则']},
				{name:'核方法', value:'', content:'内核类型决定是固定距离还是可变的',options:['固定常量','可变函数']},
			],
			par_list2:[
				{name:'X - 坐标',node:'X', value:'',content:'点或面板数据的x坐标，表示空间信息'},
				{name:'Y - 坐标',node:'Y',  value:'',content:'点或面板数据的y坐标，表示空间信息'},
				{name:'pctRural',node:'PctRural',  value:'',content:'暂无该参数的相关描述'},
				{name:'pctbach',node:'PctBach',  value:'',content:'暂无该参数的相关描述'},
				{name:'totPop90',node:'TotPop90',  value:'',content:'暂无该参数的相关描述'},
				{name:'bandWidth', node:'bandWidth', value:0, content:'输入带宽'},
			]
    }
  },
	computed:{
			...mapState({
				parentNodeIndex: state => state.parent_node_index,
				childNodeIndex: state => state.child_node_index,
				computeLogRecord: state => state.computeLogRecord
			}),
			computeData(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].url;},
			viewZoom(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].zoom;},//当前数据适宜的缩放尺度
			centerPosition(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].centerPosition;},//当前数据适宜的中心		
			varList(){return Object.keys(this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].url[0].features[0].properties);},//数据属性列表
  },
  methods:{
		//整合计算数据，判断参数是否设置完全和正确，整合初始计算数据
		organizeComputeData: function(parArray){
				let data = [],dataObj = {},originData = this.computeData[0].features;
				for(let ind=0;ind<parArray.length;ind++){if(!parArray[ind].value) {return {errCode:1000};break;}}//判断参数是否设置完全
				try{
						for(let i=0;i<originData.length;i++){
							let obj = {}; obj.properties = {};
							for(let j=0;j<parArray.length-1;j++){
								obj.properties[parArray[j].node] = originData[i].properties[parArray[j].value];
							}
							data.push(obj)
						}
						dataObj.features = data;
						return dataObj;
				}catch(e){return {errCode:1001};}
		},
		//判断计算参数是否设置正确，或者设置完整
		judgeParSetting: function(data){
			return data.hasOwnProperty('errCode')? false:true;
		},
		//处理开始计算后的路由切换、按钮动画等内容
		handleComputeProcessing:function(){
				this.$store.dispatch('computeSuccessAction' , [false,this.parentNodeIndex,this.childNodeIndex]);//清空“查看计算结果按钮”
				$("#proBar").addClass('btn-animation');//按钮动画
				this.$router.push({path:'/computeresult/computeLog'});//切换路由到计算日志面板
				messageBus.$emit('judge-right-container-tab','log');
				messageBus.$emit('compute-again',true);
		},
		//"开始计算"按钮响应函数
  	compute:function(){
			let parArray = this.tab == 1 ? this.par_list1: this.par_list2,
			computeOriginData = this.organizeComputeData(parArray),
			computeParSetting = this.judgeParSetting(computeOriginData),
			bandWidth = this.tab == 2 ? this.par_list2[this.par_list2.length-1].value:0,
			requestUrl = this.tab == 1 ? 'http://localhost:8080/GWR_war/GTWRService':'http://localhost:8080/GWR_war/GWRService',
			requestPar = this.tab == 2 ? {computeData: JSON.stringify(computeOriginData),bandWidth:bandWidth} : {computeData: JSON.stringify(computeOriginData)},
			result = {data: {"type": "FeatureCollection" ,"features":[]},minVal: null,maxVal: null,centerPosition: this.centerPosition,zoom: this.viewZoom,};
			(window.sessionStorage.getItem('computeLog') || window.sessionStorage.getItem('computeLog') == '') && window.sessionStorage.removeItem('computeLog');
			(window.sessionStorage.getItem('computeResultForChart') || window.sessionStorage.getItem('computeResultForChart') == '') && window.sessionStorage.removeItem('computeResultForChart');
			this.$store.dispatch('computeLogRecordAction', null);
			this.handleComputeProcessing();
			messageBus.$emit('compute-again-compute-result-reflesh',true);
			if(computeParSetting){			
				this.tab == 2 ? this.gwrComputeRequest(requestUrl,requestPar,result):this.gtwrComputeRequest(result);
			}else{
				this.$store.dispatch('computeLogRecordAction', computeOriginData.errCode == 1000 ? [{result:"Parameters setting is not completed，computing failed"},{result:'Please set the blank parameters'}]:computeOriginData.errCode == 1001?[{result:"Parameters are wrong，computing failed"},{result:'Please check every parameter'}]:'');
			}
		},
		//gtwr计算
		gtwrComputeRequest:function(result){
			if(this.computeData[0].features[0].properties.hasOwnProperty('Pprice')){
				try{
					let response = this.computeData[0].features, arr = [];
					for(let i=0;i<response.length;i++){
						arr.push(response[i].properties.Pprice);
						let obj = {
							"type": "Feature",
							"properties": response[i].properties,
							"geometry": {
								"type": "Point",
								"coordinates": [response[i].properties.Longtitude, response[i].properties.Latitude]
							}
						};
						obj.properties.yhat = response[i].properties.Pprice;
						result.data.features.push(obj);
					}
					result.minVal = Math.min.apply(null,arr);
					result.maxVal = Math.max.apply(null,arr);
					this.$store.dispatch('computeResultAction' , result);
					let logMsg = [{number:"Step 1",line:"Parsing data and parsing parameter settings",result:''},{number:"Step 2",line:"Parsing coordinates of spatial points",result:''},{number:"Step 3",line:"Calculating GTWR predicted result",result:''},{number:"",line:"",result:'computing success'}];
					logMsg.push({tip:'点击右侧“图表展示”按钮查看计算结果'})
					this.$store.dispatch('computeLogRecordAction', logMsg); //计算成功，计算日志显示
				}catch(e){
					this.$store.dispatch('computeLogRecordAction', [{result:"GTWR computing failed"}]); //计算失败，计算日志显示
				}
			}else{
				this.$store.dispatch('computeLogRecordAction', [{result:"GTWR computing failed"}]); //计算失败，计算日志显示
			}	
		},
		/** 
		 * gwr计算请求
		 * @param requestUrl  请求链接
		 * @param requestPar  请求参数
		 * @param result      支持图表展示的计算结果初始化
		*/
		gwrComputeRequest: function(requestUrl,requestPar,result){
			let self = this, arr=[];
			try{
				$.ajax({
						url: requestUrl,type: "GET",dataType: "json",data: requestPar,
						success: function(response){  
							if(self.computeLogRecord!=null){self.$store.dispatch('computeLogRecordAction', null);}
							if(response && response[0].hasOwnProperty('log') && !response[0].log ){
								for(let i=0;i<response.length-1;i++){
									arr.push(response[i].yhat);
									let obj = {
										"type": "Feature",
										"properties": Object.assign(response[i],self.computeData[0].features[i].properties),
										"geometry": {
											"type": "Point",
											"coordinates": [response[i].x, response[i].y]
										}
									};
									result.data.features.push(obj);
								}
								result.minVal = Math.min.apply(null,arr);
								result.maxVal = Math.max.apply(null,arr);
								self.$store.dispatch('computeResultAction' , result);
								let logMsg = JSON.parse(response[response.length-1].log);
								logMsg.push({tip:'点击右侧“图表展示”按钮查看计算结果'})
								self.$store.dispatch('computeLogRecordAction', logMsg); //计算成功，计算日志显示
							}else{
								self.$store.dispatch('computeLogRecordAction', response); //计算失败，计算日志显示
							}			
						},
						error: function(xhr,status,error){
							self.$store.dispatch('computeLogRecordAction', [{result:xhr.statusText}]);//gwr后台程序调用错误，计算日志显示
						}
				});
			}catch(e){
				this.$store.dispatch('computeLogRecordAction',[{result:"This data can't be used to do gwr computing，computing failed"},{result:'Please change other data'}]);
			}
		},
  	gtwr:function(){
        this.tab=1
		},
		gwr:function(){
				this.tab=2
		}
  }
}
</script>
