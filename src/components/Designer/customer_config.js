import fileOperationConfig from './fileOperation/config.json'
import fileOperationCommandMap from './fileOperation/commandMap'

var customer_ribbon = {
    "id": "operate",
    "text": "操作",
    "buttonGroups": [
        fileOperationConfig
    ]
}

// console.log(fileOperationCommandMap)

export default {
    ribbon: customer_ribbon,
    commandMap: fileOperationCommandMap
}