(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4b3182f3"],{"2d3c":function(i,t,e){"use strict";var r=e("509a"),n=e.n(r);n.a},"3c9d":function(i,t,e){"use strict";e.r(t);var r=function(){var i=this,t=i.$createElement,e=i._self._c||t;return e("div",{attrs:{id:"history"}},[e("van-overlay",{staticClass:"loadingBox",attrs:{show:i.showOverlay,"z-index":3001}},[e("van-loading",{attrs:{size:"24px"}},[i._v("加载中...")])],1),e("div",[e("van-pull-refresh",{staticStyle:{"min-height":"calc(100vh - 46px)"},on:{refresh:i.onRefresh},model:{value:i.isLoading,callback:function(t){i.isLoading=t},expression:"isLoading"}},[e("div",{staticClass:"box",staticStyle:{"min-height":"calc(100vh - 46px)"}},i._l(i.historyArr,(function(t,r){return e("van-swipe-cell",{key:r,attrs:{"right-width":"150"},scopedSlots:i._u([{key:"right",fn:function(){return[e("van-button",{staticClass:"top-button slideButton",style:{border:"none",color:t.isTop?"#3b45ef":"#fff"},attrs:{square:"","icon-prefix":"iconfont",icon:t.isTop?"restore":"top",type:"default",text:t.isTop?"取消":"置顶",color:t.isTop?"rgba(59,69,239,.1)":"rgba(32, 18, 217, 255)"},on:{click:function(e){return i.topRecord(t,t.isTop)}}}),e("van-button",{staticClass:"delete-button slideButton",attrs:{"icon-prefix":"iconfont",icon:"del",square:"",text:"删除",type:"danger"},on:{click:function(e){return i.deleteRecord(t)}}})]},proxy:!0}],null,!0)},[e("van-card",{staticClass:"record-card",attrs:{desc:"来源："+(t.source||"未知来源"),title:t.title?t.title.replace(/[\n\r\t]/g,""):""},scopedSlots:i._u([{key:"thumb",fn:function(){return[e("div",{staticClass:"cover",style:"background-image: url("+t.img+");"})]},proxy:!0},{key:"price",fn:function(){return[i._v(" "+i._s(t.title?"点击恢复到播放\t"+t.text.replace(/[\n\r\t]/g,""):"")+" ")]},proxy:!0},t.isTop?{key:"tag",fn:function(){return[e("van-tag",{staticStyle:{"font-weight":"700"},attrs:{color:"rgba(32, 18, 217, 255)"}},[i._v("置顶")])]},proxy:!0}:null],null,!0)})],1)})),1)])],1)],1)},n=[],a=(e("b4fb"),e("fe59"),e("ea69"),e("08ba"),e("5748")),o=(e("6a61"),e("cf7f")),s=e("bcb3"),c=e("3089"),f=e("2fc5"),h=e("4360"),l=e("61f7");s["a"].use(f["a"]);var u={name:"history",data:function(){return{showOverlay:!0,historyArr:[],isLoading:!1}},mounted:function(){var i=this;this.$nextTick((function(){window.setTimeout(Object(o["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,i.getData();case 2:case"end":return t.stop()}}),t)}))),300)}))},methods:{fetchSringToObject:function(i,t){if(window.fy_bridge_app){var e=window.request(i,t||{});return e=Object(l["a"])(e)?[]:JSON.parse(e),e}},getData:function(){var i=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){var e,r,n,o,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:i.showOverlay=!0,h["a"].dispatch("bar/setTitle","历史记录管理"),window.fy_bridge_app?(e=i.fetchSringToObject("hiker://files/nirvana/nirvana_xx_history"),r=i.fetchSringToObject("hiker://files/nirvana/nirvana_xj_history"),n=i.fetchSringToObject("hiker://files/nirvana/nirvana_capuccilo_history"),o=i.fetchSringToObject("hiker://files/nirvana/nirvana_diga_history"),s=[].concat(Object(a["a"])(e),Object(a["a"])(r),Object(a["a"])(n),Object(a["a"])(o)),s=s.sort((function(i,t){return t.time-i.time})),i.historyArr=s,i.showOverlay=!1):i.showOverlay=!1;case 3:case"end":return t.stop()}}),t)})))()},onRefresh:function(){var i=this;this.showOverlay=!0,window.setTimeout(Object(o["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,i.getData();case 2:i.$nextTick((function(){Object(c["Toast"])("刷新成功"),i.isLoading=!1}));case 3:case"end":return t.stop()}}),t)}))),10)},topRecord:function(i,t){var e=this;if(this.showOverlay=!0,"涅槃.小虾"==i.source){var r=this.fetchSringToObject("hiker://files/nirvana/nirvana_xx_history");r.forEach((function(e){e.id!=i.id||t||(e.originalTime=e.time,e.time=1e14,e.isTop=!0),e.id==i.id&&t&&(e.time=e.originalTime,e.isTop=!1)})),r=JSON.stringify(r),window.fy_bridge_app.writeFile("hiker://files/nirvana/nirvana_xx_history",r),this.getData(),t?Object(c["Toast"])("取消成功"):Object(c["Toast"])("置顶成功")}else if("涅槃.小橘"==i.source){var n=this.fetchSringToObject("hiker://files/nirvana/nirvana_xj_history");n.forEach((function(e){e.id!=i.id||t||(e.originalTime=e.time,e.time=1e14,e.isTop=!0),e.id==i.id&&t&&(e.time=e.originalTime,e.isTop=!1)})),n=JSON.stringify(n),window.fy_bridge_app.writeFile("hiker://files/nirvana/nirvana_xj_history",n),this.getData(),t?Object(c["Toast"])("取消成功"):Object(c["Toast"])("置顶成功")}else if("涅槃.卡布奇洛"==i.source){var a=this.fetchSringToObject("hiker://files/nirvana/nirvana_capuccilo_history");a.forEach((function(e){e.id!=i.id||t||(e.originalTime=e.time,e.time=1e14,e.isTop=!0),e.id==i.id&&t&&(e.time=e.originalTime,e.isTop=!1)})),a=JSON.stringify(a),window.fy_bridge_app.writeFile("hiker://files/nirvana/nirvana_capuccilo_history",a),this.getData(),t?Object(c["Toast"])("取消成功"):Object(c["Toast"])("置顶成功")}else if("涅槃.迪迦"==i.source){var o=this.fetchSringToObject("hiker://files/nirvana/nirvana_diga_history");o.forEach((function(e){e.id!=i.id||t||(e.originalTime=e.time,e.time=1e14,e.isTop=!0),e.id==i.id&&t&&(e.time=e.originalTime,e.isTop=!1)})),o=JSON.stringify(o),window.fy_bridge_app.writeFile("hiker://files/nirvana/nirvana_diga_history",o),this.getData(),t?Object(c["Toast"])("取消成功"):Object(c["Toast"])("置顶成功")}else t?Object(c["Toast"])("取消失败，未知来源"):Object(c["Toast"])("置顶失败，未知来源");this.$nextTick((function(){e.showOverlay=!1}))},deleteRecord:function(i){var t=this;if(this.showOverlay=!0,"涅槃.小虾"==i.source){var e=this.fetchSringToObject("hiker://files/nirvana/nirvana_xx_history");e.forEach((function(t,r){t.id==i.id&&e.splice(r,1)})),e=JSON.stringify(e),window.fy_bridge_app.writeFile("hiker://files/nirvana/nirvana_xx_history",e),this.getData(),Object(c["Toast"])("删除成功")}else if("涅槃.小橘"==i.source){var r=this.fetchSringToObject("hiker://files/nirvana/nirvana_xj_history");r.forEach((function(t,e){t.id==i.id&&r.splice(e,1)})),r=JSON.stringify(r),window.fy_bridge_app.writeFile("hiker://files/nirvana/nirvana_xj_history",r),this.getData(),Object(c["Toast"])("删除成功")}else if("涅槃.卡布奇洛"==i.source){var n=this.fetchSringToObject("hiker://files/nirvana/nirvana_capuccilo_history");n.forEach((function(t,e){t.id==i.id&&n.splice(e,1)})),n=JSON.stringify(n),window.fy_bridge_app.writeFile("hiker://files/nirvana/nirvana_capuccilo_history",n),this.getData(),Object(c["Toast"])("删除成功")}else if("涅槃.迪迦"==i.source){var a=this.fetchSringToObject("hiker://files/nirvana/nirvana_diga_history");a.forEach((function(t,e){t.id==i.id&&a.splice(e,1)})),a=JSON.stringify(a),window.fy_bridge_app.writeFile("hiker://files/nirvana/nirvana_diga_history",a),this.getData(),Object(c["Toast"])("删除成功")}else Object(c["Toast"])("删除失败，未知来源");this.$nextTick((function(){t.showOverlay=!1}))}}},d=u,v=(e("2d3c"),e("9ca4")),g=Object(v["a"])(d,r,n,!1,null,"7475b4d9",null);t["default"]=g.exports},"509a":function(i,t,e){}}]);