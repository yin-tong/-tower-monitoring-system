var windpower = '获取风速失败'
var winddirection = '获取风向失败'
var temperature	= '获取温度失败'
var weather = '获取天气失败'
var city = ''
var address= '获取地址失败'

const adcode = {
	
  // 嘉兴
  南湖区:	'330402',
  秀洲区:    '330411',
  嘉善县:	'330421',
  海盐县:    '330424',
  海宁市:	'330481',
  平湖市:	'330482',
  桐乡市:	'330483',

  
  // 湖州
  吴兴区:	'330502',
  南浔区:	'330503',
  德清县:	'330521',
  长兴县:	'330522',
  安吉县	:   '330523',


  //杭州
  上城区:	'330102',
  下城区:	'330103',
  江干区:	'330104',
  拱墅区	:   '330105',
  西湖区:	'330106',
  滨江区:	'330108',
  萧山区:	'330109',
  余杭区:	'330110',
  富阳区:	'330111',
  临安区:	'330112',
  桐庐县:	'330122',
  淳安县:	'330127',
  建德市:	'330182',

  //绍兴
  越城区:	'330602',
  柯桥区:	'330603',
  上虞区:	'330604',
  新昌县:	'330624',
  诸暨市:	'330681',
  嵊州市:	'330683',
  
  //宁波
  海曙区: '330203',
  北仑区: '330206',
  镇海区: '330211',
  江北区: '330205',
  鄞州区: '330212',
  奉化区: '330213',
  象山县: '330225',
  宁海县: '330226',
  余姚市: '330281',
  慈溪市: '330282',
  
  //衢州市
  柯城区: '330802',
  常山县: '330822',
  衢江区: '330803',
  开化县: '330824',
  龙游县: '330825',
  江山市: '330881',
  
  //金华
  婺城区: '330702',
  金东区: '330703',
  浦江县: '330726',
  武义县: '330723',
  磐安县: '330727',
  兰溪市: '330781',
  义乌市: '330782',
  东阳市: '330783',
  永康市: '330784',

  //台州
  椒江区: '331002',
  黄岩区: '331003',
  路桥区: '331004',
  三门县: '331022',
  天台县: '331023',
  仙居县: '331024',
  温岭市: '331081',
  临海市: '331082',
  玉环市: '331083',

  //丽水
  遂昌县: '331123',
  龙泉市: '331181',
  庆元县: '331126',
  莲都区: '331102',
  青田县: '331121',
  松阳县: '331124',
  云和县: '331125',
  缙云县: '331122',
  景宁畲: '331127',
  
  //温州
  鹿城区: '330302',
  龙湾区: '330303',
  瓯海区: '330304',
  永嘉县: '330324',
  洞头区: '330305',
  平阳县: '330326',
  苍南县: '330327',
  文成县: '330328',
  泰顺县: '330329',
  瑞安市: '330381',
  乐清市: '330382',
  龙港市: '330383',

}

function getWeatherData(city){
	var json={
		"key":"d2cd9aebd58875ff9bf82fa7a26b5e5e",
		"city":city,
		"extensions":"base",
	};
	$.get("https://restapi.amap.com/v3/weather/weatherInfo",json,function (result) {
		windpower = result.lives[0].windpower
		winddirection = result.lives[0].winddirection	 
		temperature = result.lives[0].temperature
		weather = result.lives[0].weather
	},"json")	
}

//根据经纬度确定地址
function getAddreeByL(longitude,latitude){
	AMap.plugin('AMap.Geocoder', function() {
		  var geocoder = new AMap.Geocoder({
		    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
		    city: '',
			extensions: 'base',
		  })
		  var lnglat = [longitude, latitude ]
		  geocoder.getAddress(lnglat, function(status, result) {
		    if (status === 'complete' && result.info === 'OK') {
				address = result.regeocode.formattedAddress
				// console.log(address)
		    }
		  })
	})
	return address
}

