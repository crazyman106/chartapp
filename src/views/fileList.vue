<template>
  <div class="fileList">
		<el-form ref="form" :model="form" label-width="120px" style="width: 50%">
					<el-form-item label="保存至文件夹">
						<input type="file" id="file" hidden @change="fileChange" webkitdirectory>
						<el-input placeholder="请输入内容" v-model="form.imgSavePath" class="input-with-select">
							<el-button slot="append" icon="el-icon-folder" type="success" @click="btnChange"></el-button>
						</el-input>
					</el-form-item>
				</el-form>
				
				
<el-form>				
		<el-form-item label="文件列表">
		 <el-tree :data="fileTree"
			show-checkbox 
			node-key="id"
			@check="handleNodeClick"
			:default-expanded-keys="[]"
			ref="tree"
			:default-checked-keys="default_select"
			:props="defaultProps">
		 </el-tree>
		</el-form-item>
</el-form>		

  </div>
</template>

<script>

export default {
  name: 'fileList',
	data: function () {
		return {
			form: {
				imgSavePath: ''
			},
			tree:null,
			defaultProps: {
				children: 'child',
				label: 'name'
			},
			default_select: [],
			fileTree:[]
		};
	},
	methods: {

		handleNodeClick(e, data) {
		 console.log(data);
		 console.log(e);
		},
		fileChange(e) {
      try {
        const fu = document.getElementById('file')
        if (fu == null) return
				console.log(fu.files)
        this.fileDeal(fu.files)
      } catch (error) {
        console.debug('choice file err:', error)
      }
    },
		fileDeal(files){
			const fileTemp={};
			try {
				for(var i in files){
					const file=files[i];
					const f = file.webkitRelativePath.split("/");
					console.log(f)
					const o ={};
					const temp = f[1];				
					o.name = temp;
					o.id = i;
					fileTemp[temp]= o;
				}
			} catch (error) {
				console.debug('error:', error)
			}
			for(var i in fileTemp){
				this.fileTree.push(fileTemp[i]);
			}
			console.log(this.fileTree);
		},
    btnChange() {
      var file = document.getElementById('file')
      file.click()
    }
	}
}
</script>
