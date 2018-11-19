<template>
<div class="chartAnalysis">
    <div class="chartAnalysis_map"><map-result></map-result></div>
    <table style="width:100%" id="chart-table">
        <tr v-for="trInd in containerRow">
            <td v-for="index in containerCol[trInd]">
                <!-- 图块显示文字，点击文字可以设置图表参数  trInd==0?[0,1,2]:trInd==1?[3,4,5]:[]-->
                <div class="add-chart-container" @click="addChartContainer(index)" v-show="addChartContainerShow[index]" v-tip="addChartContainerMsg">+</div>
                <!-- 设置图表参数 -->
                <div class="chart-par-setting" v-show="chartParSetShow[index]">
                    <p>选择数据图表横纵坐标</p>
                    <a>图表标题: </a>
                    <input v-model="par['chart'+index]['title']" placeholder="图表标题，选填"><br/>
                    <a>图表类型: </a>
                    <select v-model="par['chart'+index]['chartType']"><option v-for="item in chartType">{{item}}</option></select><br/>
                    <a>横坐标: </a>
                    <select v-model="par['chart'+index]['heng']"><option v-for="item in Object.keys(computeResult[0].properties)">{{item}}</option></select><br/>
                    <a>纵坐标1: </a>
                    <select v-model="par['chart'+index]['zong1']"><option v-for="item in Object.keys(computeResult[0].properties)">{{item}}</option></select><br/>
                    <a>纵坐标2: </a>
                    <select v-model="par['chart'+index]['zong2']"><option v-for="item in Object.keys(computeResult[0].properties)">{{item}}</option></select><br/>
                    <button @click="parSettingSubmit(index,par['chart'+index]['title'],par['chart'+index]['heng'],par['chart'+index]['zong1'],par['chart'+index]['zong2'],par['chart'+index]['chartType'])">完成</button>
                </div>
                <!-- 显示，绘制图表 -->
                <div :id="chartPanelId(index)" class="chart" v-show="chartPanelShow[index]"></div>
            </td>
        </tr>
    </table>    
</div> 
</template>

<script>
import echarts from 'echarts'
import mapResult from './MapForResult'
import {mapState} from 'vuex'
import messageBus from '../../bus/messageBus.js'
require('../../style/rightSideForResult.scss')

export default {
    name: 'chartAnalysis',
    data () {
        return {
            containerCol: [],//图表表格容器的列数
            containerRow:[0,1],//图表表格容器的行数
            dataFromMap:null, //map中传过来的图表数据
            chartPanelShow:[],//图表面板显示
            chartParSetShow:[],//图表参数显示
            addChartContainerShow:[],//添加图标容器面板显示
            chartType:['scatter','bar'],//支持的图表类型
            par:{},//图表参数存储对象
            myChart:[],//图表容器
            addZongMsg:'点击此处添加第二维纵坐标',
            addChartContainerMsg:'点击此处添加图表容器'
        }
    },
    components:{
        mapResult
    },
    beforeMount(){
        //初始化生成图表参数
        for(let i=0,string;i<6;i++){
            string = 'chart'+i;
            this.par[string] = {
                title: null,
                chartType: null,
                heng: null,
                zong1: null,
                zong2: null
            }
            this.chartPanelShow.push(true);
            this.addChartContainerShow.push(false);
            this.chartParSetShow.push(false);
            this.myChart.push(null);
        }
        this.chartPanelShow.splice(this.chartPanelShow.length-1,1,false);
        this.addChartContainerShow.splice(this.addChartContainerShow.length-1,1,true)
        //初始化生成图表列数
        for(let i=0;i<this.containerRow.length;i++){
            this.containerCol.push([3*i,3*i+1,3*i+2])
        }
        if(window.sessionStorage.getItem('computeResultForChart')){
            let initData = JSON.parse(window.sessionStorage.getItem('computeResultForChart')),chartKey;
            this.chartPanelShow = initData.chartPanelShowStorage;
            this.chartParSetShow = initData.chartParSetShowStorage;
            this.containerCol = initData.containerColStorage;
            this.containerRow = initData.containerRowStorage;
            this.addChartContainerShow = initData.addChartContainerShowStorage;
            if(this.myChart.length < this.chartPanelShow.length){
                for(let i=0;i<(this.myChart.length-this.chartPanelShow.length);i++){
                    this.myChart.push(null);
                }
            }
            this.par = Object.assign({}, initData.chartPar);
        };
    },
    mounted(){
        this.listenValue();
        // this.initChart();
        // this.listenComputeAgain();
        window.sessionStorage.getItem('computeResultForChart') ? this.initChartBaseOnStorage() : this.initChart();
        // !window.sessionStorage.getItem('computeResultForChart') && this.initChart()
    },
    computed:{
        ...mapState({
            parentNodeIndex: state => state.parent_node_index,
            childNodeIndex: state => state.child_node_index,
            computeResult: state => state.computeResult.data.features
        })
    },
    methods:{
        //监听重新计算
        listenComputeAgain:function(){
            let self = this;
            messageBus.$on('compute-again',(par)=>{
                par && self.initChart();
            });
        },
        //添加图表容器
        addChartContainer:function(){
            let rowLen = this.containerRow.length-1,//行数
            colLastArr = this.containerCol[rowLen],//最后一行列的索引数组
            colLastEle = colLastArr[colLastArr.length-1];//最后一行最后一列的索引
            if(this.containerCol[rowLen].length == 3 ){
                this.containerRow.push(this.containerRow[rowLen]+1);//添加图表表格容器行
                this.containerCol.push([]);//添加图表表格容器列
            }
            this.containerCol[this.containerCol.length-1].push(colLastEle+1);//添加图表表格容器列新元素
            this.chartParSetShow.splice(this.chartParSetShow.length-1,1,true);//加号面板显示参数设置
            this.chartParSetShow.push(false);//添加图表参数显示参数
            this.addChartContainerShow.splice(this.addChartContainerShow.length-1,1,false);//加号面板加号隐藏
            this.addChartContainerShow.push(true);//添加图标容器面板显示参数
            this.chartPanelShow.push(false);//添加图表显示参数
            this.par['chart'+(colLastEle+1)]={
                title: null,
                chartType: null,
                heng: null,
                zong1: null,
                zong2: null
            };//添加图表参数存储对象
            this.myChart.push(null);//添加图表容器
            this.handleSession();
        },
        //依据sessionStorage初始化图表内容
        initChartBaseOnStorage:function(){
            let chartKey = Object.keys(this.par);
            for(let f=0;f<chartKey.length;f++){
                let chart_par_spec = this.par[chartKey[f]],par_arr_temp = [];
                this.drawChart(f,chart_par_spec.title,chart_par_spec.heng,chart_par_spec.zong1,chart_par_spec.zong2,chart_par_spec.chartType);
            }
        },
        //更新数组
        updateArr:function(arr,newarr){
            for(let i=0;i<arr.length;i++){
                arr.splice(i,1,newarr[i]);
            }
            for(let i=arr.length;i<newarr.length;i++){
                arr.push(newarr[i]);
            }
        },
        //将图表设置存储入sessionStorage
        handleSession:function(){
            let sessionJson = {
                containerColStorage:this.containerCol,containerRowStorage:this.containerRow,
                chartPanelShowStorage:this.chartPanelShow,chartParSetShowStorage:this.chartParSetShow,
                addChartContainerShowStorage:this.addChartContainerShow,//chartContainerStorage:chartContainer,
                chartPar:this.par};
            window.sessionStorage.setItem('computeResultForChart',JSON.stringify(sessionJson));
        },
        //初始化图表
        initChart: function(){
            let heng_arr = Object.keys(this.computeResult[0].properties),
            zong1 = 'yhat', zong2 = null;
            for(let i=0;i<this.chartPanelShow.length;i++){
                let heng = heng_arr[i],title = heng+'-'+zong1;
                this.drawChart(i,title,heng,zong1,zong2,this.chartType[0]);
                this.par['chart'+i] = {
                    title: title,
                    chartType: this.chartType[0],
                    heng: heng,
                    zong1: zong1,
                    zong2: zong2
                }
            }
        },
        //监听地图点击事件传来的数据
        listenValue:function(){
            let self = this;
            messageBus.$on('data-for-chart',(prop)=>{    
                self.dataFromMap = prop;
                for(let i=0;i<self.myChart.length;i++){
                    let title = self.par['chart'+i]['title'],
                        heng = self.par['chart'+i]['heng'],
                        zong1 = self.par['chart'+i]['zong1'],
                        zong2 = self.par['chart'+i]['zong2'],
                        chartType = self.par['chart'+i]['chartType'];
                    self.myChart[i] && self.drawChart(i,title,heng,zong1,zong2,chartType)//地图与数据表联动
                }
            });
        },
        //设置图表容器id
        chartPanelId:function(index){
            return 'chart-panel'+index;
        },
        /**
         * 提交图表参数设置
         * @param index        图表容器索引，标定图表绘制的容器
         * @param title        图表标题
         * @param heng         图表横坐标
         * @param zong1/zong2  图表纵坐标
         * @param chartType    图表类型
         */
        parSettingSubmit:function(index,title,heng,zong1,zong2,chartType){      
            if(heng && (zong1 || zong2) && chartType){
                this.chartPanelShow.splice(index,1,true);
                this.chartParSetShow.splice(index,1,false);
                this.addChartContainerShow.splice(index,1,false);
                this.drawChart(index,title,heng,zong1,zong2,chartType);
                !title && alert('没有选择图表标题哦~~');
                this.handleSession();
            }else{
                alert('图表的横纵坐标等必要参数没有设置完全哦~~')
            }
        },
        //图表绘制
        drawChart:function(index,title,heng,zong1,zong2,chartType){
            let strId = 'chart-panel'+index,
                scatterChart = document.getElementById(strId),
                app = {},data1=[],data2=[],series=[],self=this,yAxisName='',option,xAxisType;
            this.myChart.splice(index,1,echarts.init(scatterChart));
            for(let i=0;i<this.computeResult.length;i++){
                zong1 && data1.push([this.computeResult[i].properties[heng],this.computeResult[i].properties[zong1]]);
                zong2 && data2.push([this.computeResult[i].properties[heng],this.computeResult[i].properties[zong2]]);
            }
            zong1 && data1 && series.push({name:zong1,type:chartType,symbolSize:4,data:data1});
            zong2 && data2 && series.push({name:zong2,type:chartType,symbolSize:4,data:data2});
            if(zong1 && !zong2){yAxisName = zong1;}
            if(zong2 && !zong1){yAxisName = zong2;}
            if(zong2 && zong1){yAxisName = zong1+'/'+zong2;}
            this.dataFromMap && series.push({
                type: 'effectScatter',
                itemStyle:{color:'#FC4E2A'},
                symbolSize: 10,
                data: [[this.dataFromMap[heng],this.dataFromMap[zong1]],[this.dataFromMap[heng],this.dataFromMap[zong2]]],
            });
            xAxisType = chartType == 'bar'? 'category':'value';
            option = {
                title : {text: title},
                tooltip : {trigger: 'item'},
                grid: {x:40,bottom:45},
                toolbox: {show: true, feature: {
                    dataZoom: {},
                    saveAsImage: {},
                    myTool: {
                        show: true,
                        title: '删除图表',
                        icon: 'path://M176.662 817.173c-8.19 8.471-7.96 21.977 0.51 30.165 8.472 8.19 21.978 7.96 30.166-0.51l618.667-640c8.189-8.472 7.96-21.978-0.511-30.166-8.471-8.19-21.977-7.96-30.166 0.51l-618.666 640z M795.328 846.827c8.19 8.471 21.695 8.7 30.166 0.511 8.471-8.188 8.7-21.694 0.511-30.165l-618.667-640c-8.188-8.471-21.694-8.7-30.165-0.511-8.471 8.188-8.7 21.694-0.511 30.165l618.666 640z',
                        onclick:function(){
                            self.chartPanelShow.splice(index,1,false);
                            self.chartParSetShow.splice(index,1,true);
                            self.addChartContainerShow.splice(index,1,false);
                            self.myChart.splice(index,1,null);
                            self.handleSession();
                        }
                    }}},
                xAxis : [{name:heng,nameLocation:'center',nameGap:25,type : 'category',scale:true,splitNumber:4}],
                yAxis : [{name:yAxisName,type : 'value',scale:true}],
                legend: [{data: [zong1,zong2],right:0,top:30}],
                series : series
            };
            this.myChart[index].setOption(option, true);
        }
    }
}
</script>
