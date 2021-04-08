import fileOperationConfig from './fileOperation/config.json'
import fileOperationCommandMap from './fileOperation/commandMap'

var customer_ribbon = {
    /* "id": "operate",
    "text": "操作",
    "buttonGroups": [
        fileOperationConfig
    ] */
	"id": "home",
	"text": "保存",
	"buttonGroups": [
		// 自定义"Save Data"按钮
		{
		"label": "",
		"thumbnailClass": "",
		"commandGroup": {
			"children": [
				{
				"direction": "vertical",
				"commands": [
				"cmdSaveData"
					]
				}
				]
			}
		}
	]
}
          
// console.log(fileOperationCommandMap)

export default {
    ribbon: customer_ribbon,
    commandMap: fileOperationCommandMap
}