import HttpUtils from '../utils/httpUtils'
import Gzip from '../utils/gzip'


function FileService(){

}

FileService.getTemplatesList = async function(){
    let data = await HttpUtils.get("/spread/getTemplates");
    if (data != undefined && data != "0") {
        data = Gzip.ungzipString(data);
        var files = data.split(";")
        return files;
    }
    return [];
}
FileService.loadTemplate = async function(fileName){

    let formData = new FormData();
    formData.append("fileName", fileName);
    let data = await HttpUtils.post("/spread/loadTemplate", formData);
    if (data != undefined && data != "0") {
        debugger
        data = Gzip.ungzipString(data);
        return JSON.parse(data);
    }
    return [];
}

FileService.getImage = async function(spreadJSON, isSelectedRange, isPDFMode){

    var spreadJSON = JSON.stringify(spreadJSON);
    var uploadData = Gzip.gzipString(spreadJSON);

    var formData = new FormData();
    formData.append("data", uploadData)
    if(isSelectedRange){
        formData.append("isSelectedRange", isSelectedRange)
    }
    if(isPDFMode){
        formData.append("isPDFMode", isPDFMode)
    }
    let data = await HttpUtils.post("/spread/getImage", formData, {responseType: "blob"});
    return data;
}


export default FileService


