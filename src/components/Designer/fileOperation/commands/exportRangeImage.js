import FileService from '../../../../service/fileService'

var ExportRangeImage = {
    iconClass: "ribbon-control-dropdown-mergecenter",
    text: "选择区域图片",
    commandName: "ExportRangeImage",
    execute: async function(designer){
        var spread = designer.getWorkbook();
        var imageFile = await FileService.getImage(spread.toJSON(), true, true)
        const url = window.URL.createObjectURL(imageFile);
        window.open(url, "_blank")
    },
}

export default ExportRangeImage;