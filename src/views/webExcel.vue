<template>
  <div class="webExcel">
    <el-container>
      <el-aside width="200px">
				<fileList @choseFile="choseFile" />
			</el-aside>
      <el-main>
        <Designer @childEvent="getDes"></Designer>
      </el-main>
    </el-container>
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
  name: "WebExcel",
  components: {
    Designer,
		fileList
  },
	methods: {
		choseFile(data){
			console.log(666,data);
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
    importXlsx(excelFile){
       let self = this;
       let excelIO = new ExcelIO.IO();
       //let excelFile = new Blob([data], {type: "application/vnd.ms-excel"}); 
			 excelIO.open(excelFile, function (json) {
          let workbookObj = json;
          self.spread.fromJSON(workbookObj);
        }, function (e) {
            alert(e.errorMessage);
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