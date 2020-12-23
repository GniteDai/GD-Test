# GD-Test
###### 此專案單純作為紀錄或研究使用；目前有分兩個部分，分別為 Mapbox 與 A* search。

## Mapbox 
目前只有 import 地圖上去，並未有任何功能。

# A* search algorithm
目前功能為
* 新增、刪除障礙物（Wall），移動起點（Start）、終點（Target）
  > * 請嘗試使用滑鼠 點擊、點擊後移動（圈選） 來建立或刪除 Wall。
  > * Start 和 Target 請使用 滑鼠 拖移 的方式來改變其位置。
* 調整迷宮 row、column、Speed
  > * Click "Setting" Button 後出現調整介面。
* Run A* search algorithm
  > * Click "Run Algorithm" Button 即可。

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:9070
$ npm run dev

# build for production and launch server at localhost:8090
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
