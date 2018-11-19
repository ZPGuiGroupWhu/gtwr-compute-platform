GTWR计算平台说明
===
[![node version](https://img.shields.io/badge/node-%3E%3D6.0.0-brightgreen.svg)](http://nodejs.org)
[![npm](https://img.shields.io/badge/npm-%3E%3D3.0.0-blue.svg)](https://www.npmjs.com)
[![vue](https://img.shields.io/badge/Vue-2.5.2-orange.svg)](https://vuejs.org)
[![echarts](https://img.shields.io/badge/echarts-4.2.1-orange.svg)](http://echarts.baidu.com)
[![leaflet](https://img.shields.io/badge/leafley-1.3.1-orange.svg)](https://leafletjs.com/)

> GTWR计算平台，本网站意图辅助用户进行GWR或GTWR的在线计算，支持计算参数自定义、原始数据及计算结果的多维度可视化。该平台主要包括以下几个主要功能模块：

> * 首屏展播：基于echarts-al制作3D动态可视化效果，突出平台主要内容与地理回归相关；利用轮播图展示GTWR计算的相关应用案>例，包含案例来源文章基本信息、文章链接、主要图表等内容。
> * 原始数据预览：平台提供示例数据，它们根据数据集分类组织为树形结构，平台支持对数据集中每一份单独属性数据的预览，预览包括数据具体内容、数据在地图上的空间可视化两部分。
> * 原始数据计算：平台支持自定义计算参数，参数可选择原始数据中的数据属性，也可手动输入固定常量；开始计算后如果参数设置不完全、计算参数设置不正确或计算接口调用失败，平台都会给出错误的计算日志；如果计算成功，除计算过程的计算日志之后，还会曝光计算结果图表展示、计算结果精度评定两个入口，其中计算结果图表展示模块包含地图可视化、数据图表两部分，数据图表部分支持用户添加图表容器、自定义图表参数。

## 项目部署

1. 下载JDK，安装并配置Java环境；下载Tomcat，安装并配置Tomcat环境，配置后**打开tomcat服务**。<br/>
    **注意**:  平台默认tomcat端口为8080，若端口不为8080，则需要在代码库中[gtwr_vue/src/components/ParDefiner.vue](https://github.com/ZPGUIGroupWHU/GTWR-compute-platform/blob/master/src/components/ParDefiner.vue)中compute函数中修改变量requestUrl中端口的定义。
2. 下载node,npm以及cnpm，
    * [node安装配置教程地址](http://www.runoob.com/nodejs/nodejs-install-setup.html)
    * [npm安装配置教程地址](http://www.runoob.com/nodejs/nodejs-npm.html)
3. 在[gtwr的代码库：https://github.com/ZPGUIGroupWHU/GTWR-compute-platform](https://github.com/ZPGUIGroupWHU/GTWR-compute-platform)中下载平台源代码
4. 将代码库路径[gtwr/src/assets/webservice/gwr_war.war](https://github.com/ZPGUIGroupWHU/GTWR-compute-platform/tree/master/src/assets/webService)中的gwr_war.war文件放置在tomcat安装文件下webapps中
5. 在终端中打开源代码文件路径，执行如下代码安装平台依赖：
    ```
    cnpm install //安装平台的依赖工具包
    npm run dev //运行平台代码，会自动打开浏览器展示前端界面
    ```

## 项目结构

以上的安装配置过程能够保证平台正常展示，而平台代码的修改需要熟悉代码库的代码结构，项目中模块将由以下结构组成

    ├── src                                           - 项目主要源码
    │   ├── assets                                    - 项目需要引用的额外静态资源
    │       ├── data                                 
    │           ├── dataForDynamicThreeD.json         - 首屏三维地理可视化效果需要引用的数据
    │           ├── dataTreeNodeName.json             - “计算数据选择”面板中数据节点树需要引用的数据
    │           ├── demoData                          
    │               ├── fakeData.json                 - “GWR计算数据”需要引用的数据
    │               ├── housePrice.json               - “房价数据”需要引用的数据
    |
    │       ├── img                                   - 项目需要应用的图片
    │       ├── webservice                            - 项目后端war包，需要放在tomcat/webapps中
    |
    │   ├── bus  
    │       ├── messageBus.js                         - 组件间通信bus的定义js文件         
    |                    
    │   ├── router             
    │       ├── index.js                              - 组件路由vue-router定义的js文件
    | 
    │   ├── store             
    │       ├── store.js                              - 组件间需频繁交互的公共状态vuex定义的js文件 
    │
    │   ├── components                                - 项目组件
    │       ├── firstPage
    │           ├── DynamicThreed.vue                 - 首屏三维地理可视化组件
    │           ├── slides.vue                        - 首屏应用案例轮播组件 
    |   
    │       ├── login 
    │           ├── coverForReset.vue                 - 重设密码遮罩组件
    │           ├── coverForSign.vue                  - 注册账号遮罩组件 
    │           ├── coverForLogin.vue                 - 登录账号遮罩组件   
    |                     
    │       ├── rightSideForResult 
    │           ├── MapForResult.vue                  - 计算成功后计算结果的地图可视化组件
    │           ├── chartAnalysis.vue                 - 计算成功后计算结果的图表可视化组件 
    │           ├── computeLog.vue                    - 计算过程的日志打印组件
    │           ├── precision.vue                     - 计算成功后计算结果的精度评定组件
    |
    │       ├── DataSelector.vue                      - "计算数据选择"组件
    │       ├── DataViewer.vue                        - “计算数据内容”表格组件
    │       ├── Home.vue                              - 登录后进行的首页总体架构组件
    │       ├── MapViewer.vue                         - “计算数据选择”中“预览”所展示的原始数据地图组件  
    │       ├── ParDefiner.vue                        - “计算参数设置”组件
    │       ├── RightSideForDataView.vue              - 页面右侧容器总体架构组件 
    │       ├── RightSideForDescription.vue           - “计算数据选择”中“说明”所展示的原始数据描述组件
    │       ├── RightSideForResult.vue                - 计算成功后计算结果总体架构组件 
    │       ├── firstpage.vue                         - 首屏总体架构组件 
    │  
    │   ├── App.vue                                   - 项目编译的入口组件
    │   ├── main.js                                   - 项目编译的入口js文件，用于注册全局使用的组件
    └── package.json                                  - 项目依赖的工具包的配置