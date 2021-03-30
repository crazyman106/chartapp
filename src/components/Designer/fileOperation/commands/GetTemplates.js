
import FileService from '../../../../service/fileService'
import GC from "@grapecity/spread-sheets"

async function loadTemplate(fileName, designer){
    var json = await FileService.loadTemplate(fileName);
    if(json){
        var spread = designer.getWorkbook();
        spread.fromJSON(json)
    }
}
var GetTemplates = {
    iconClass: "ribbon-button-download",
    text: "加载",
    commandName: "GetTemplates",
    execute: async function(designer){

        var files = await FileService.getTemplatesList()
        if(files && files.length){
            var spread = designer.getWorkbook();
            var sheet = spread.getActiveSheet();
            sheet.reset();
            sheet.defaults.colWidth = 180
            sheet.setArray(0, 0, [files])
            var h = new GC.Spread.Sheets.CellTypes.HyperLink();
            h.onClickAction(function (e) {
                var sheet = e.sheet, row = e.row, col = e.col;
                var value = sheet.getValue(row, col);
                loadTemplate(value, designer)
            })
            sheet.getRange(0, 0, 1, files.length).cellType(h)
        }
    },
}

export default GetTemplates;