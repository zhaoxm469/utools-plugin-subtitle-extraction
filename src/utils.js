
const util = require("util")
const fs = require('fs');
const path = require('path');

const readdirSync = util.promisify(fs.readdir)

const { directoryPath } = require("./config")

async function getFileList (){
  const data = await readdirSync(directoryPath)
  let fileList = []

  data.forEach(file=>{
    const filePath = path.join(directoryPath, file)
    const fileStatic = fs.statSync(filePath)
    if(!fileStatic.isDirectory()) return false

    fileStatic.fileName = file
    fileStatic.filePath = filePath

    fileList.push({
      ...fileStatic
    })
  })

  fileList.sort((a,b)=>{
    return b.ctime - a.ctime
  })
  
  return fileList
}

function getDraftInfo (filePath){
  return require(path.join(filePath,"draft_info.json"))
}

function getSubtitle(filePath){
  const draft_info = getDraftInfo(filePath)
  const texts = draft_info.materials.texts

  const subtitles = []
  for(let { content } of texts) {
    if(content) {
      // 使用正则表达式提取方括号内的内容
      const match = content.match(/\[(.*?)\]/);
      if (match) {
        // 提取方括号内的内容
        content = match[1]; 
      } else {
        console.log('未找到方括号');
      }
      subtitles.push(content)
    }
  }
  return subtitles
}

exports.getFileList = getFileList
exports.getSubtitle = getSubtitle