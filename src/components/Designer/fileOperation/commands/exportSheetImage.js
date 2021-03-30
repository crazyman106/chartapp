
import FileService from '../../../../service/fileService'

var ExportSheetImage = {
    iconClass: "ribbon-control-dropdown-mergecenter",
    text: "Sheet导出图片",
    commandName: "ExportSheetImage",
    execute: async function(designer){
        var spread = designer.getWorkbook();
        var imageFile = await FileService.getImage(spread.toJSON(), false, true)
        const url = window.URL.createObjectURL(imageFile);
        window.open(url, "_blank")
    },
}

export default ExportSheetImage;