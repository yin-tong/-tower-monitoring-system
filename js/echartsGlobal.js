//      mapDiv  start
var mcharts_map = echarts.init(document.querySelector("#mapDiv"),'chalk') 
var dangerIronNames = []
function reverMap(){
	var initOption = {
		layoutCenter: ['50%', '50%'],//位置
		layoutSize:'85%',//大小
		geo:{ map:'浙江'}
	}
	mcharts_map.setOption(initOption)
}
function  pushRemoveSame(arr1,arr2){
	var flag = true;
	for(var i=0;i<arr1.length;i++){
		if(arr1[i]==arr2){
			flag = false;
			break;
		}
	}
	if(flag){
		arr1.push(arr2)
		arr1.slice()
	}
}

function  deleteRemoveSame(arr1,arr2){
	for(var i=0;i<arr1.length;i++){
		if(arr1[i]==arr2){
			arr1.splice(i-1,1);
			break;
		}
	}
}

function  get(arr1,arr2){
	for(var i=0;i<arr1.length;i++){
		if(arr1[i]==arr2){
			arr1.splice(i-1,1);
			break;
		}
	}
}

$.extend({
 	'mapDivUpdate':function () {
		//注册地图
 		$.get('json/map/zhejiang.json',function(ret){
 			echarts.registerMap('浙江',ret)
			var initOption = {
				// layoutCenter: ['50%', '50%'],//位置
				title:{
					text:'| 铁塔位置分布',
					left:20,
					top:20,
					textStyle:{fontSize:15}
				},
				geo:{
					zoom: 1, //地图大小
					type:'map',
					map:'浙江',
					top:'5%',
					roam:true, 
					bottom:'5%',
					itemStyle:{
						areaColor:'#2E72BF',
						borderColor:'#333'
					}
				},
				legend:{
					left: '5%',
					bottom:'5%',
					orient:'vertical'
				}
			}
			mcharts_map.setOption(initOption)
			mcharts_map.on("mouseover", function (){
				var changOption = {
				   geo:{
					   slient:true
				   }
				}
				mcharts_map.setOption(changOption)
			});
			mcharts_map.on('click',(arg)=>{
				$.get(getCityMapJsonByName(arg.name),function(ret){
				    echarts.registerMap(arg.name,ret)
				    var changOption = {
					   geo:{
						   map:arg.name
					   }
				    }
				    mcharts_map.setOption(changOption)
				})
			})
 		})
		//每个一秒获取一次数据
		setInterval(function(){
			$.get('json/data/iron.json',function(ret){
				
				var color = [] 
				var lend_data = []
				
				var ironSecurityNumber = 0
				var ironDangerNumber = 0
				var seriesArr = ret.map(item => {
					// console.log(item)
					var name = ''
					if(item.situation =="安全"){
						name = '安全'
						ironSecurityNumber = ironSecurityNumber +1
						deleteRemoveSame(dangerIronNames,item.ironName)
						pushRemoveSame(color,'#00FF00')
						pushRemoveSame( lend_data,'安全')
					}else if(item.situation =="危险"){
						name = '危险'
						ironDangerNumber = ironDangerNumber +1
						pushRemoveSame(dangerIronNames,item.ironName) 
						pushRemoveSame(color,'#FF0000')
						pushRemoveSame( lend_data,'危险')
					}
					return {
						type:'effectScatter',
						rippleEffect:{
							scale:5,
							brushType:'stroke'
						},
						name:name,
						data:[item.ironName,item.situation,[item.precision,item.latitude]],
						coordinateSystem:'geo',
						symbolSize: 8,  //气泡大小
						itemStyle:{
							color: function(){
								if(item.situation == "安全"){
									return '#00FF00'
								}else if(item.situation == "危险"){
								    return '#FF0000'
								}
							}
						}
					}
				})
				// console.log(seriesArr)
				$("#ironSecurityNumber").html(ironSecurityNumber)
				$("#ironDangerNumber").html(ironDangerNumber)
				if(dangerIronNames.length!=0){
					$.ajax({
						  type: 'POST',
							  url: "",
							  data: JSON.stringify(dangerIronNames),    
							  contentType: 'application/json;charset=UTF-8',
							  dataType: 'json',   
							  success: function(data) {
							  },
							  error: function(xhr, type) {
						   }
					});
				}
				var dataOption = {
					tooltip: {  
						/*返回需要的信息*/  
						formatter: function(params) { 
							console.log(params);
 						    //获取 params 中 经纬度
 						    var params_longitude = params.value[0]
 						    var params_latitude = params.value[1]
 						    
 						    getAddreeByL(params_longitude,params_latitude)
 						    getWeatherData(adcode[address.substring(6,9)])
 						    
 						    //获取 seriesArr 中 经纬度
 						    for(var i =0;i<seriesArr.length;i++){
 						        if(seriesArr[i].data[2][0]==params_longitude&&seriesArr[i].data[2][1]==params_latitude){
 						    		return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 10px;padding-bottom: 7px;margin-bottom: 7px;">' 
 						    		+'编号： '+seriesArr[i].data[0] + '<br>'
 						    		+'状态:&nbsp;&nbsp;&nbsp;'+seriesArr[i].name+'<br>'
 						    		+'经纬度:&nbsp;&nbsp; [&nbsp;'+seriesArr[i].data[2][0]+'&nbsp;,&nbsp;'+seriesArr[i].data[2][1]+'&nbsp;]'+'<br>'
 						    		+'地址:&nbsp;&nbsp;&nbsp;'+address+'<br>'
 						    		+'天气:&nbsp;&nbsp;&nbsp;'+weather+'<br>'
 						    		+'风速:&nbsp;&nbsp;&nbsp;'+windpower+'级<br>'
 						    		+'风向:&nbsp;&nbsp;&nbsp;'+winddirection+'<br>'
 						    		+'温度:&nbsp;&nbsp;&nbsp;'+temperature+'°<br>'
 						    		+'</div>'
 						    	}
 						    	
 						    }
						}  
					},	
					color:color,
					legend: { data:lend_data },	
					series: seriesArr
				}
				mcharts_map.setOption(dataOption)
			})
		},1000)
 	},
	//显示传感器状态和数量
	'getSensorSAndN':function(){
		setInterval(function(){
			$.get('json/data/sensor.json',function(ret){
				var sensorSecurityNumber = 0
				var sensorDangerNumber = 0
				var sensorAbnormalNumber = 0
				var sensorCloseNumber = 0
				
				for(var i=0;i<ret.length;i++){
					if(ret[i].situation=="安全"){
						sensorSecurityNumber = sensorSecurityNumber +1;
					}else if(ret[i].situation=="危险"){
						sensorDangerNumber = sensorDangerNumber +1;
					}else if(ret[i].situation=="异常"){
						sensorAbnormalNumber = sensorAbnormalNumber +1;
					}else {
						sensorCloseNumber = sensorAbnormalNumber+1;
					}
				}
				
				$("#sensorSecurityNumber").html(sensorSecurityNumber)
				$("#sensorDangerNumber").html(sensorDangerNumber)
				$("#sensorAbnormalNumber").html(sensorAbnormalNumber)
				$("#sensorCloseNumber").html(sensorCloseNumber)
			});			
		},1000)
	},
	'allUpdate':function(){
		setInterval(function(){
			var myDate = new Date()
			$("#date").html(myDate.toLocaleString( ))			
		},1000)
		$.getSensorSAndN();
		$.mapDivUpdate();
	}
 })
// mapDiv  end


$.allUpdate();