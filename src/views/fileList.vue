<template>
  <div class="fileList">
<div style="text-align: center;">
	<el-button
		size="mini"
		@click="openDialog"
		>导入文件</el-button>
</div>
				<el-tree :data="fileTree"  :props="defaultProps" @node-click="handleNodeClick"
					lazy
					:load="loadNode"
					:default-checked-keys="default_select"
					@node-contextmenu="menu"
					>
				</el-tree>	
<div v-show="menuVisible">
   <ul id="menu" class="menu">
     <li class="menu__item" @click="add(1)">新建文件夹</li>
		 <li class="menu__item" @click="add(3)">新建文件</li>
		 <li class="menu__item" @click="c">复制</li>
		 <li class="menu__item" @click="v">粘贴</li>
     <li class="menu__item" @click="del">删除</li>
		 <li class="menu__item" @click="rname">重命名</li>
		 
	<!-- 	 <li class="menu__item" @click="add(2)">新建文件夹-同级</li>
		 <li class="menu__item" @click="add(4)">新建文件-同级</li> -->
   </ul>
</div>
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
				isLeaf:'isLeaf'
			},
			default_select: [],
			fileTree:[],
			resolveInit:null,
			menuVisible:false,
			choseNode:null,
			a:20000,
			copy:""
			
		};
	},
	methods: {
		rname(){
			var $this =this;
			this.$prompt('请输入文件名', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(({ value }) => {
				this.$get('/api/app/ajaxRnameFile?old='+$this.choseNode.data.path+"&name="+value,{
				},function(data){
					$this.choseNode.parent.loaded = false;
					$this.choseNode.parent.expand(); 
					console.log(data);
					$this.$msg(data.msg);
				});
			}).catch((e) => {
					console.log(e);
			});
		},
		c(){
			this.copy= this.choseNode.data.path;
		},
		v(){
			if(this.copy==""){
				$this.msg("请先复制");
				return false;
			}
			var $this = this;
			var v = $this.choseNode.data.path;
			if(v.split(".").length>=2){
				$this.msg("请选择目标文件夹粘贴");
				return false;
			}
			this.$get('/api/app/ajaxVPath?c='+$this.copy+"&v="+v,{
			},function(data){
				$this.choseNode.loaded = false;
				$this.choseNode.expand(); 
				$this.$msg(data.msg);
			});
		},
		del(o){
			var $this =this;
			this.$get('/api/app/ajaxDelPath?path='+this.choseNode.data.path,{
			},function(data){
				$this.choseNode.parent.loaded = false;
				$this.choseNode.parent.expand(); 
				$this.$msg(data.msg);
			});
			console.log("del----",o);
		},
		add(flag){
			var path ="";
			var a="1";
			var tree=null;
			var nowNode=null;
			if(flag==1){
				tree = this.choseNode.data.child;
				path = this.choseNode.data.path;
				nowNode=this.choseNode;
			}else if(flag==2){
				if(this.choseNode.level==1){
					tree = this.fileTree;
					path = this.choseNode.data.path.substr(this.choseNode.data.path.lastIndexOf("\\")+1);
				}else{
					tree = this.choseNode.parent.data.child;
					path = this.choseNode.parent.data.path;
					nowNode=this.choseNode.parent;
				}
			}else if(flag==3){
				tree = this.choseNode.data.child;
				path = this.choseNode.data.path;
				nowNode=this.choseNode;
				a="2";
			}else if(flag==4){
				if(this.choseNode.level==1){
					tree = this.fileTree;
					path = this.choseNode.data.path.substr(this.choseNode.data.path.lastIndexOf("\\")+1);
				}else{
					tree = this.choseNode.parent.data.child;
					path = this.choseNode.parent.data.path;
					nowNode=this.choseNode.parent;
				}
				a="2";
			}
			console.log("add path="+path,"tree=",tree);
			var $this =this;
			this.$prompt('请输入文件名', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消'
			}).then(({ value }) => {
				if(flag==3 || flag==4){
					if(value.split(".").length<=1)value = value+".xlsx";
				}
				console.log("nowNode",nowNode);
				var newChild = {
					name: value,
					path:path+"\\"+value,
					isLeaf:true,
					child:[],
					id:++$this.a,
					a:a
				};
				this.$get('/api/app/ajaxAddFile?path='+newChild.path,{
				},function(data){
					$this.$msg(data.msg);
					if(nowNode!=null){
						//$this.$refs.tree.updateKeyChildren(nowNode,newChild);
						nowNode.loaded = false;
						nowNode.expand(); 
					}else{
						tree.push(newChild);
					}
				});
			}).catch((e) => {
					console.log(e);
			});
		},
		addNext(o){
			this.add(1);
			console.log("addNext----",o);
		},
		menu(MouseEvent, object, Node, element) { // 鼠标右击触发事件
        this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
        this.menuVisible = true  // 显示模态窗口，跳出自定义菜单栏
				this.choseNode = Node
        var menu = document.querySelector('#menu') 
        menu.style.left = MouseEvent.clientX  + 'px'
        menu.style.top = MouseEvent.clientY  + 'px'
        console.log('右键被点击的event:', MouseEvent)
        console.log('右键被点击的object:', object)
        console.log('右键被点击的value:', Node)
        console.log('右键被点击的element:', element)
        console.log('鼠标点击了树形结构图')
				document.addEventListener('click', this.cancelAdd)
    },
		cancelAdd(){
			this.menuVisible = false
      document.removeEventListener('click', this.cancelAdd) 
		},
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
					//$this.$msg(data.data);
					call([]);
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
			console.log("2222222222222222222");
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
				console.log(data);
				resolve(data);
			});
		},

		spreadInitHandle: function (spread) {
			this.spread = spread
			this.spread.fromJSON(s)
		},
		///////////////////
	}
}
</script>

<style >
	
/* .el-tree .el-tree-node__children{
	text-align: left;
}
.el-tree{
	text-align: left;
} */
.menu__item {
    display: block;
    line-height: 20px;
    text-align: left;
    margin-top: 10px;
  }
.menu {
		z-index:9999;
    height: 220px;
    width: 130px;
    position: absolute;
    border-radius: 10px;
    border: 1px solid #999999;
    background-color: #f4f4f4;
		padding-left: 10px;
  }
   li:hover {
    background-color: #1790ff;
    color: white;
  }
</style>
