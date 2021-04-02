<template>
  <div class="fileList">
							<el-button
								size="mini"
								@click="openDialog"
								>导入文件</el-button>
				<el-tree :data="fileTree" :props="defaultProps" @node-click="handleNodeClick"
					lazy 	v-if="openTree" 
					:load="loadNode"
					:default-checked-keys="default_select"
					>
				</el-tree>	

  </div>
</template>

<script>

import ExcelIO from '@grapecity/spread-excelio'
import FaverSaver from 'file-saver'
import * as GC from '@grapecity/spread-sheets';
import  "@grapecity/spread-sheets-print";
import  "@grapecity/spread-sheets-pdf";
import  "@grapecity/spread-sheets-charts";
export default {
  name: 'fileList',
	data: function () {
		return {
			spread: {},
			path:"",
			routeDialogVisible:false,
			form: {
				imgSavePath: ''
			},
			openTree:true,
			tree:null,
			defaultProps: {
				children: 'child',
				label: 'name',
				isLeaf: 'isLeaf'
			},
			default_select: [],
			fileTree:[],
			resolveInit:null
		};
	},
	methods: {
		choseFile(path){
			var $this = this;
			this.$axios({
				method: 'post', 
				withCredentials: true, 
				url:'/api/app/ajaxGetFile?path='+path,
				responseType: "blob"
			}).then(function(response) {
				console.log(response);
				$this.$emit('choseFile', response.data,path);
			}).catch(function(err) {
				console.log(err);
			});
		},
		handleNodeClick(node, data) {
			console.log(node);
			var $this = this;
			if(node.isLeaf==true){
				var path = node.path;
				$this.choseFile(path);
/* 				this.$get('/api/app/ajaxGetFile?path='+path,{
				},function(data){
					if(data.flag=="true"){
						$this.choseFile(data.data);
					}else{
						$this.$msg(data.msg);
					}
				}); */
			}
			console.log(path);
		},
		fileChange(e) {
		  try {
			const fu = document.getElementById('file')
			if (fu == null) return
					//console.log(fu.files)
			this.fileDeal(fu.files)
		  } catch (error) {
			console.debug('choice file err:', error)
		  }
		},
		ajaxImpPath(type){
			//this.openTree=false;	
			//this.fileTree=[];
			//this.openTree=true;
			var $this = this;
			this.$get('/api/app/ajaxImpPath?path='+this.path+"&type="+type,{
			},function(data){
				if(data.flag=="true"){
					//$this.fileDeal(data.data);
					$this.resolveInit(data.data);
				}else{
					$this.$msg(data.msg);
				}
			});
		},
		ajaxGetPathInit(){
			var $this = this;
			this.$get('/api/app/ajaxGetPathInit',{
			},function(data){
				if(data.flag=="true"){
					$this.resolveInit(data.data);
				}else{
					$this.$msg(data.msg);
				}
			});
		},
		ajaxGetPathChile(path,call,type){
			var $this = this;
			this.$get('/api/app/ajaxGetPathChile?path='+path+"&type="+type,{
			},function(data){
				//console.log(data);
				if(data.flag=="true"){
						call(data.data);
				}else{
					$this.$msg(data.data);
				}
				//console.log($this.fileTree);
			});
		},
		fileDeal(files){
			try {
				for(var i in files){
					const file=files[i];
					const o ={};			
					o.name = file.name;
					o.path =file.path; 
					this.fileTree.push(o);
				}
			} catch (error) {
				console.debug('error:', error)
			}
			//console.log(this.fileTree);
		},
		openDialog() {
			var $this =this;
			this.$prompt('请输入文件路径', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(({ value }) => {
				$this.path = value;
				$this.ajaxImpPath(1);
			}).catch(() => {
						 
			});
		},
		loadNode(node, resolve) {
			//console.log(node);
			var url;
			if (node.level === 0) {
				this.resolveInit = resolve;
				this.ajaxGetPathInit();
				return ;
			}else{
				url= node.data.path;
			}
			//console.log(node);
			this.ajaxGetPathChile(url,function(data){
				resolve(data);
			});
		},

		spreadInitHandle: function (spread) {
			this.spread = spread
			this.spread.fromJSON(s)
		},
		
	}
}
</script>

<style scoped>
  .componentContainer {
    position: absolute;
    padding: 10px;
    left: 242px;
    top: 0;
    bottom: 20px;
    right: 0;
  }
  .spreadContainer {
    padding: 10px;
    box-shadow: 0 0 20px grey;
  }
  .spreadContainer{
    position: absolute;
    left: 0px;
    right: 30px;
    top: 100px;
    bottom: 10px;
  }
  .spreadHost{
    width: 100%;
    height: 100%;
  }
</style>
