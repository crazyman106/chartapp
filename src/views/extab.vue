<template>
  <div class="extab">
			<Designer @childEvent="getDes" @saveFileTool="saveFileTool"></Designer>
  </div>
</template>

<script>
import Designer from "@/components/Designer/Designer.vue";
import fileList from "@/views/fileList.vue";
import * as ExcelIO from "@grapecity/spread-excelio"
import FaverSaver from 'file-saver'
import s from './e.json'
import * as GC from '@grapecity/spread-sheets';
import  "@grapecity/spread-sheets-print";
import  "@grapecity/spread-sheets-pdf";
import  "@grapecity/spread-sheets-charts";

export default {
  name: "extab",
  components: {
    Designer,
		fileList
  },
  data() {
	return {
		spread:{},
		filePath:"",
	  editableTabsValue: '1',
	  editableTabs: [{
			title: 'Tab 1',
			name: '1',
			content: 'Tab 1 content'
		}],
		abIndex: 1,
		num:200
	  }
	},
	mounted() {
			var $this=this;
			this.$emit('getTabsData', function(data,path){
				console.log("exttab init call",data);
				if(data)
				$this.importXlsx(data);
				$this.filePath=path;
			});
			document.addEventListener('keydown', this.savefile);
	},
	methods: {
		save(type) {
			console.log(`content saved by `+type);
		},
		saveFileTool(e){
			console.log("saveFileTool---",e);
			var spread = e.getWorkbook();
			if(this.filePath!=""){
				this.savefileAjaxTool(spread);
			}
		},
		savefile(e){
			var key = window.event.keyCode ? window.event.keyCode : window.event.which;
/* 			if (key === 83 && e.ctrlKey) {
				this.save('hot key')
					if(this.filePath!=""){
						this.savefileAjax();
					}
					e.preventDefault();
					e.returnValue=false;
					return false;
			} */
		},
		savefileAjaxTool(spread){
			var $this= this;
			var s = spread.toJSON();
			console.log(this.filePath,s);
			var json = JSON.stringify(s);
			this.$post('/api/app/ajaxSaveFile',{
				path:$this.filePath,
				json:json
			},function(data){
				console.log(data);
			});
		},
		savefileAjax(){
			var $this= this;
			var s = this.spread.toJSON();
			console.log(this.filePath,s);
			var json = JSON.stringify(s);
			this.$post('/api/app/ajaxSaveFile',{
					path:$this.filePath,
					json:json
				},function(data){
					console.log(data);
				},function(e){
					console.log(e);
				}
			);
		},
		 handleTabsEdit(targetName, action) {
			if (action === 'add') {
/* 			  let newTabName = ++this.tabIndex + '';
			  this.editableTabs.push({
				title: 'New Tab',
				name: newTabName,
				content: 'New Tab content'
			  });
			  this.editableTabsValue = newTabName; */
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
			console.log(file);
			//let excelFile = new Blob([data], {type: "application/vnd.ms-excel";}); 
			//excelFile.type="application/vnd.ms-excel";
			let type = file.type;
			if("ssjson"==type){
			 this.imjson(file);
			}else if("xlsx"==type){
			 this.imexcel(file);
			}else if("fac"==type){
				this.imfac(file);
			}else if("txt"==type){
					this.imtxt(file);
			}else{
				this.imcvs(file);
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
				self.$err("不支持的文件类型");
			});
		},
		imcvs(json){
			var test = [
			       { "Series0": 2, "Series1": 1 },
			       { "Series0": 4, "Series1": 2 },
			       { "Series0": 3, "Series1": 4 }
			            ];
			let self = this;
			let sheet = this.spread.getSheet(0);
			let num = self.num;
			console.log("sheet,num===",sheet,num);
			sheet.autoGenerateColumns = true;
			/* sheet.setCsv(
				1,1,",","\r\n",","
			); */
			var reader = new FileReader();
			reader.onload = function(event){
			    var str = reader.result;
				var rows = str.split("\r\n");
				var strArray=[];
				for(var i in rows){
					var o =new Object();
					var liArray = rows[i].split(",");
					for(var j in liArray){
						var c = liArray[j];
						if(c!=undefined && c!=null && c!='' && c.length>=3){
							o[""+j] =c.substr(1,c.length-2);
						}
					}
					o = dealCol(liArray,num,o);
					for(var m in o){
						strArray.push(o);
						break;
					}
				}
				console.log(strArray);
				sheet.setDataSource(strArray, true);
			};
			reader.readAsText(json);
		},
		dealCol(liArray,num,o){
			let liLenth = liArray.length;
			if(liLenth<num){
				for(var nn=liLenth;nn<num;nn++){
					o[""+nn] =null;
				}
			}
			return o;
		},
		imtxt(json){
			let self = this;
			let sheet = this.spread.getSheet(0);
			let num = self.num;
			console.log("sheet,num===",sheet,num);
			sheet.autoGenerateColumns = true;
			var reader = new FileReader();
			reader.onload = function(event){
					var str = reader.result;
				var rows = str.split("\r\n");
				var strArray=[];
				for(var i in rows){
					var o =new Object();
					var liArray = rows[i].split("	");
					for(var j in liArray){
						var c = liArray[j];
							o[""+j] =c;
					}
					o = self.dealCol(liArray,num,o);
					for(var m in o){
						strArray.push(o);
						break;
					}
				}
				console.log(strArray);
				sheet.setDataSource(strArray, true);
			};
			reader.readAsText(json);
		},
		imfac(json){
			let self = this;
			let sheet = this.spread.getSheet(0);
			let num = self.num;
			console.log("sheet,num===",sheet,num);
			sheet.autoGenerateColumns = false;
			var reader = new FileReader();
			reader.onload = function(event){
					var str = reader.result;
				var rows = str.split("\r\n");
				var strArray=[];
				console.log(rows[1]);
				for(var i in rows){
					var o =new Object();
					var liArray = rows[i].split(",");
					for(var j in liArray){
						var c = liArray[j];
						if(c!=undefined && c!=null ){
							o[""+j] =c;
						}
					}
					o = self.dealCol(liArray,num,o);
					for(var m in o){
						strArray.push(o);
						break;
					}
				}
				console.log("pac------imp---",strArray);
				sheet.setDataSource(strArray, true);
			};
			reader.readAsText(json);
		}
		/////////////////
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