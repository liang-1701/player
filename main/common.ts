import fs from 'fs';
import path from 'path';
import { contextBridge } from "electron";

const configFilePath = path.join(__dirname, '/config/common.json');

let commonConfig;
try {
    const rawdata = fs.readFileSync(configFilePath);
    commonConfig = JSON.parse(rawdata.toString());
} catch (err) {
    console.error('加载配置文件错误', err);
}

contextBridge.exposeInMainWorld('c', commonConfig);