<template>
  <div class="fileList1">
<el-dialog
      title=""
      :append-to-body="true"
      :visible.sync="routeDialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="routeDialog">
        <el-form-item label="" prop="path">
          <el-input style="width:450px; padding-left:20px" size="mini" v-model="routeDialog.path">
          </el-input>
           <el-button
            style="float: right; margin: 5px 40px 0 0"
            size="mini"
            @click="backRoute()"
            >向上</el-button
          >
        </el-form-item>
        <el-scrollbar style="height: 350px">
          <el-table
            :data="tableData"
            stripe
            highlight-current-row
            style="width:520px; margin-left:15px"
            @row-click="clickData"
          >
            <el-table-column prop="name" label="名称"> </el-table-column>
          </el-table>
        </el-scrollbar>
      </el-form>

      <!-- 内容底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeGetPath()">取 消</el-button>
        <el-button type="primary" @click="confirmRoute()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'fileList1',
	data: function () {
		return {
			form: {
				imgSavePath: ''
			},
			tableData:[],
			routeDialogVisible:true,
			routeDialog:{
				path:''
			}
		};
	},
	methods: {
		//获取路径的方法
    handleGetPath(path) {
      this.routeDialogVisible = true;
    },
    //关闭窗口
    closeGetPath() {
      this.routeDialogVisible = false;
    },
    //确定按钮
    confirmRoute() {
      this.settingForm.resultPath = this.routeDialog.path;
      this.routeDialogVisible = false;
    },
 //点击进入文件列表
    clickData(row, event) {
      console.log(row);
     
    },
    //向上一级
    backRoute() {
      if (this.routeDialog.path.endsWith("\\")) {
        var len = this.routeDialog.path.lastIndexOf("\\");
        var sub = this.routeDialog.path.substring(0, len);
        console.log(sub);
      } else {
        var len = this.routeDialog.path.lastIndexOf("\\");
        if (len == 2) {
          var sub = this.routeDialog.path.substring(0, len);
          console.log(sub);
        } else {
          var sub = this.routeDialog.path.substring(0, len);
          console.log(sub);
          this.routeDialog.path = sub;
          console.log(sub);
        }
      }
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
			for(var i in files){
				const file=files[i];
				console.log(file.webkitRelativePath);
			}
		},
    btnChange() {
      var file = document.getElementById('file')
      file.click()
    }
	}
}
</script>
