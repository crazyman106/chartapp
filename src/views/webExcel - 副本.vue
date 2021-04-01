<template>
  <div class="webExcel">
    <el-container>
		<el-aside width="200px">
			<fileList @choseFile="choseFile" />
		</el-aside>
		<el-main>
		<el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
		  <el-tab-pane
			:key="item.name"
			v-for="(item, index) in editableTabs"
			:label="item.title"
			:name="item.name"
		  >
			<extab ></extab>
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
	  editableTabs: [{
		title: 'Tab 1',
		name: '1',
		content: 'Tab 1 content'
		}],
		  tabIndex: 1
	  }
	},
	methods: {
		 handleTabsEdit(targetName, action) {
			if (action === 'add') {
			  let newTabName = ++this.tabIndex + '';
			  this.editableTabs.push({
				title: 'New Tab',
				name: newTabName,
				content: 'New Tab content'
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
			}
		},
		choseFile(data){
			this.importXlsx(data);
		},
		getDes(e) {
				this.spread = e.getWorkbook();
		},
		exportXlsx(){
		  let ex = new ExcelIO.IO()
		  let json = this.spread.toJSON()
		  ex.save(json, function (blob) {
			FaverSaver.saveAs(blob, 'export.xlsx')
		  }, function (e) {
			console.log(e)
		  })
		},
		importXlsx(file){
		   //let excelFile = new Blob([data], {type: "application/vnd.ms-excel";}); 
		   //excelFile.type="application/vnd.ms-excel";
		   let type = file.type;
		   console.log(type);
		   if("ssjson"==type){
			   this.imjson(file);
		   }else if("csv"==type){
			   this.imcvs(file);
		   }else{
			   this.imexcel(file);
		   }
		},
		imjson(json){
			let self = this;
			var reader = new FileReader();
			reader.onload = function(event){
			    var content = reader.result;
				self.imjson2(JSON.parse(content));
			  };
			reader.readAsText(json);
		},
		imjson2(json){
			let self = this;
			let excelIO = new ExcelIO.IO();
			self.spread.fromJSON(json);
		},
		imexcel(dataBlob){
			let self = this;
			let excelIO = new ExcelIO.IO();
			excelIO.open(dataBlob, function (json) {
				console.log(json);
				let workbookObj = json;
				self.spread.fromJSON(workbookObj);
			}, function (e) {
				console.log(e);
				self.$msg(e);
			});
		},
		imcvs(dataBlob){
			let self = this;
			let excelIO = new ExcelIO.IO();
			excelIO.open(dataBlob, function (json) {
				console.log(json);
				let workbookObj = json;
				self.spread.fromJSON(workbookObj);
			}, function (e) {
				console.log(e);
				self.$msg(e);
			});
		}
	}
};
</script>
<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 50px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

</style>