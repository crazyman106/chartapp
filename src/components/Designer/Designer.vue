<template>
  <div class="designer">
    <gc-spread-sheets-designer
      :styleInfo="styleInfo"
      :config="config"
      @designerInitialized="designerInitialized"
    ></gc-spread-sheets-designer>
  </div>
</template>

<script>
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css";
import "@grapecity/spread-sheets-designer-resources-cn";
import "@grapecity/spread-sheets-designer-vue";
import "../../assets/style.css"
import * as GC from "@grapecity/spread-sheets"
import * as ExcelIO from "@grapecity/spread-excelio"

import CustomerConfig from './customer_config'
import s from './e.json'
let DefaultConfig = GC.Spread.Sheets.Designer.DefaultConfig;
DefaultConfig.ribbon.push(CustomerConfig.ribbon)


// GC.Spread.Sheets.LicenseKey = "your spreadjs key"
// GC.Spread.Sheets.Designer.LicenseKey = "your designer key";
var callSaveFile=function(){}
export default {
  name: "designer",
  data: function () {
    return {
      styleInfo: { height:"200px", width: "100%", border: "solid gray 1px" },
      config: DefaultConfig,
      designer: null
    };
  },
  created(){
  },
	mounted() {
	  const self = this;
	  this.$emit('childEvent', this.designer);
		console.log("this.designer",this.designer)
		window.addEventListener('resize',() => this.measure1(), false)
		this.measure1();
		callSaveFile = self.initSave;
	},
  methods: {
		measure1(){
			var self =this;
			var h= `${document.documentElement.clientHeight}`;
			self.styleInfo.height=(h-61)+"px";
			self.designer.refresh();
		},
		initSave(context){
			this.$emit('saveFileTool',context);
		},
    designerInitialized(value) {
      this.designer = value;
      var spread = this.designer.getWorkbook();
      spread.options.newTabVisible = false;
			//spread.fromJSON(s);
      var sheet = spread.getActiveSheet();
      sheet.frozenColumnCount(2);
      this._registEvent(spread)
    },
    _registEvent(spread){
      spread.commandManager().addListener("anyscLicenser", (info)=>{
        console.log(info)
      })
    }
  },
};
DefaultConfig.commandMap = {
   cmdSaveData: {
      title: "",
      text: "保存",
      iconClass: "cmdSaveData",
      bigButton: "true",
      commandName: "cmdSaveData",
      execute: (context, propertyName, fontItalicChecked) => {
        console.log("execute---",context,propertyName,fontItalicChecked);
				callSaveFile(context);
     }
   }
}

Object.assign(DefaultConfig.commandMap, CustomerConfig.commandMap)
</script>
<style>
.designer{
    text-align:left;
	width:100%;
}
</style>