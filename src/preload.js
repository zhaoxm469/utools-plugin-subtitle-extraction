const { utools } = window;
const { getFileList,getSubtitle } = require("./utils");
const dayjs = require("dayjs");

let fileList = [];

window.exports = {
  "jianying-subtitle-extraction": {
    mode: "list",
    args: {
      // 进入插件应用时调用（可选）
      enter: async (action, callbackSetList) => {
        fileList = await getFileList();

        fileList = fileList.map((item) => {
          item.title = item.fileName;
          item.description = dayjs(item.mtime).format("YYYY-MM-DD HH:mm:ss");
          return item;
        });

        callbackSetList(fileList);
      },
      search: (action, searchWord, callbackSetList) => {
        const fileList = fileList.filter((item) =>
          item.title.includes(searchWord)
        );
        callbackSetList(fileList);
      },
      select: (action, itemData, callbackSetList) => {
         const subtitles = getSubtitle(itemData.filePath)
         if(!subtitles.length) {
            utools.showNotification("影片中没有任何字幕~");
            return 
         }
         utools.copyText(JSON.stringify(subtitles,null,4))
         utools.showNotification("字幕文案copy成功")
         utools.hideMainWindow()
         utools.outPlugin()
      },
      placeholder: "请输入搜索内容",
    },
  },
};
