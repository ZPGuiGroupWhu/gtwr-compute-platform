import Vue from 'vue'
import Vuex from 'vuex'
import demoLogo from '../assets/img/demo_data_aa.png'
import privateLogo from '../assets/img/private_data.png'
Vue.use(Vuex);

//计算分层设色的最大值和最小值；设置当前数据的中心位置
var dataTreeNodeName = require('../assets/data/dataTreeNodeName.json');//要获取的json文件
for(let i=0;i<dataTreeNodeName.length;i++){
	let lonArr = [],latArr=[];
	if(dataTreeNodeName[i].dataContent){
		const demo = require('../assets/data/demoData/'+dataTreeNodeName[i].dataContent+'.json');
		dataTreeNodeName[i].url = demo;
		for(let j=0;j<dataTreeNodeName[i].children.length;j++){
			const pro = dataTreeNodeName[i].children[j].name;
			let arr = [],xArr=[],yArr=[];
			for(let m=0;m<demo[0].features.length;m++){
				arr.push(demo[0].features[m].properties[pro]);
				lonArr.push(demo[0].features[m].geometry.coordinates[0]);
				latArr.push(demo[0].features[m].geometry.coordinates[1]);
			}
			dataTreeNodeName[i].children[j].max=Math.max.apply(null,arr);
			dataTreeNodeName[i].children[j].min=Math.min.apply(null,arr);
			dataTreeNodeName[i].children[j].latitude=[Math.min.apply(null,latArr),Math.max.apply(null,latArr)];
			dataTreeNodeName[i].children[j].Logitude=[Math.min.apply(null,lonArr),Math.max.apply(null,lonArr)];
		}
	}
	dataTreeNodeName[i].centerPosition[0] = (Math.max.apply(null,latArr)+Math.min.apply(null,latArr))/2;
	dataTreeNodeName[i].centerPosition[1] = (Math.max.apply(null,lonArr)+Math.min.apply(null,lonArr))/2;
}

//公共状态
const state = {
	username:'', //登录用户名
	parent_node_index:0, //选中数据父节点，示例数据/本地数据
	child_node_index:0, //选中的数据节点，house price/fake data
	grandson_node_index:0, //选中的数据属性，price/living
	//数据内容
	data_list:[
	  	{
	      	name:'示例数据',
	      	data_type:dataTreeNodeName,
		    src:demoLogo,
	    },
		{
	      	name:'私有数据',
	      	data_type:[],
		    src:privateLogo,	
		    children:[
		    ]		
		}
	],
	computeResult:null, //GWR/GTWR计算结果
	ComputeResultBtnShow:{   //数据节点中查看计算结果图表展示的按钮
		computeSuccess:false,
		computeParentIndex:null,
		computeChildIndex:null
	},
	computeLogRecord:null, //计算日志
}

const mutations = {
	parentIndexMutation:function(state,msg){
		state.parent_node_index = msg;
	},
	childIndexMutation:function(state,msg){
		state.child_node_index = msg;
	},
	grandSonIndexMutation:function(state,msg){
		state.grandson_node_index = msg;
	},
	username:function(state,msg){
		state.username=msg;
	},
	computeResultMutation:function(state,msg){
		state.computeResult = msg;
	},
	computeSuccessMutation: function(state,msg){
		state.ComputeResultBtnShow.computeSuccess = msg[0];
		state.ComputeResultBtnShow.computeParentIndex = msg[1];
		state.ComputeResultBtnShow.computeChildIndex = msg[2];
	},
	computeLogRecordMutation: function(state,msg){
		state.computeLogRecord = msg;
	}
}

const actions = {
	parentIndexAction:function({commit},msg){
		commit('parentIndexMutation',msg)
	},
	childIndexAction:function({commit},msg){
		commit('childIndexMutation',msg)
	},
	grandSonIndexAction:function({commit},msg){
		commit('grandSonIndexMutation',msg)
	},
	computeResultAction:function({commit},msg){
		commit('computeResultMutation',msg)
	},
	computeSuccessAction:function({commit},msg){
		commit('computeSuccessMutation',msg)
	},
	computeLogRecordAction:function({commit},msg){
		commit('computeLogRecordMutation',msg)
	}
}

export default new Vuex.Store({
    state,
    mutations,
    actions
});