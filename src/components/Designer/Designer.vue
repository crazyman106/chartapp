

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
DefaultConfig.commandMap = {};

Object.assign(DefaultConfig.commandMap, CustomerConfig.commandMap)

// GC.Spread.Sheets.LicenseKey = "your spreadjs key"
// GC.Spread.Sheets.Designer.LicenseKey = "your designer key";

export default {
  name: "Home",
  data: function () {
    return {
      styleInfo: { height:"", width: "100%", border: "solid gray 1px" },
      config: DefaultConfig,
      designer: null,
	  height:0,
	  h:70
    };
  },
  created(){

  },
	mounted() {
	  const self = this;
	 /* window.onresize = () => {
		return (() => {
			var ht = `${document.documentElement.clientHeight}`;
			var h = ht-self.h;
			if(h<=400) h=400;
			self.styleInfo.height=h+"px";
			console.log("height-33--",self.styleInfo);
			self.designer.refresh();
		})();
	  };
	  var ht = `${document.documentElement.clientHeight}`;
	  var h = ht-self.h;
	  if(h<=400) h=400; */
	  self.styleInfo.height=self.$bodyHeightTab+"px";
	  console.log("height-33--",self.styleInfo);
	  self.designer.refresh();
	  this.$emit('childEvent', this.designer);
	},
  methods: {
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
</script>
<style>
.designer{
    text-align:left;
	width:100%;
}
</style>