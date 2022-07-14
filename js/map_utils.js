const cityMapJson = { 
  湖州市:'json/map/huzhou.json',
  嘉兴市:'json/map/jiaxing.json',
  杭州市:'json/map/hangzhou.json',
  绍兴市:'json/map/shaoxing.json',
  宁波市:'json/map/ningbo.json',
  衢州市:'json/map/qvzhou.json',
  金华市:'json/map/jinhua.json',
  台州市:'json/map/taizhou.json',
  丽水市:'json/map/lishui.json',
  温州市:'json/map/wenzhou.json'
}

function getCityMapJsonByName(arg) {
  return cityMapJson[arg]
}