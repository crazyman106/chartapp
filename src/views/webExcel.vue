<template>
  <div class="webExcel">
    <el-container>
			<div class="bg">
			<el-aside  :style="{height:scrollerHeightWebData}">
				<fileList @choseFile="choseFile"  />
			</el-aside>
			</div>
			<el-main>
				<el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
					<el-tab-pane
					:key="item.name"
					v-for="(item, index) in editableTabs"
					:label="item.title"
					:name="item.name"
					>
					<div> <extab @getTabsData="getTabsData(arguments,item)"></extab> </div>
					</el-tab-pane>
				</el-tabs>
			</el-main>
    </el-container>
  </div>
</template>

<script>
import Designer from "@/components/Designer/Designer.vue";
import fileList from "@/views/fileList.vue";
import extab from "@/views/extab.vue";
import * as ExcelIO from "@grapecity/spread-excelio"
import FaverSaver from 'file-saver'
import s from './e.json'
import * as GC from '@grapecity/spread-sheets';
import  "@grapecity/spread-sheets-print";
import  "@grapecity/spread-sheets-pdf";
import  "@grapecity/spread-sheets-charts";
/* 
{
				title: '首页',
				name: '1',
				data:null,
				path:'',
				content: ''
			} */

export default {
  name: "WebExcel",
  components: {
    Designer,
		fileList,
		extab
  },
  data() {
		return {
			editableTabsValue: '1',
			editableTabs: [],
			choseTabCurrent:{},
		  tabIndex: 1,
			scrollerHeightWebData:""
	  }
	},
	computed: {
    /* scrollerHeightWeb: function() {
			return this.scrollerHeightWebData;
    } */
  },
	mounted() {
		window.addEventListener('resize',() => this.measure1(), false)
		this.measure1();
	},
	methods: {
		measure1(){

			const self = this
			const tempH = `${document.documentElement.clientHeight}`-10
			var l =tempH-20
			this.scrollerHeightWebData=l+"px";
		},
		getTabsData(o,e){
			console.log("1111",o,e);
			var call =o[0];
			console.log("getTabsData",this.editableTabs);
			call(e.data,e.path);
		},
		choseFile(data,path){
			//var flag = this.choseTabCurrent[path+""];
			console.log("choseFile",data,path);
			var editableTabs = this.editableTabs;
			var b=false;
			for(var i in editableTabs){
				var temp = editableTabs[i];
				if(temp.path==path){
					this.editableTabsValue = temp.name;
					b=true;
					break;
				}
			}
			if(b) return ;
			var fileName = path.substr(path.lastIndexOf("\\")+1);
			let tabName = ++this.tabIndex + '';
			var obj = {
				title:fileName,
				name: tabName,
				path:path,
				data:data
			}
/* 			this.choseTabCurrent[path+""]={
				path:path,
				tabName:tabName
			}; */
			this.editableTabs.push(obj);
			this.editableTabsValue = tabName;
	
		},
		handleTabsEdit(targetName, action) {
			if (action === 'add') {
			  let newTabName = ++this.tabIndex + '';
			  this.editableTabs.push({
				title: '新建文件',
				name: newTabName,
				data:null,
				content: ''
			  });
			  this.editableTabsValue = newTabName;
			}
			if (action === 'remove') {
			  let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
				
				/* var choseTabCurrentTemp = this.choseTabCurrent;
				var tempRemove=[];
				for(var i in choseTabCurrentTemp){
					 var temp = choseTabCurrentTemp[i+""];
					 if(temp.tabName==targetName){
						 
					 }else{
						 tempRemove[i+""] = temp;
					 }
				}
				this.choseTabCurrent = tempRemove; */
			}
		}
	}
};
</script>
<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: left;
  line-height: 60px;
}
.bg{
	border: #e9eef3 solid 5px;
}
.el-aside {
  background-color: #fff;
  color: #333;
  text-align: left;
  line-height:5px;
	width:290px !important;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: left;
}

</style>