chrome.contextMenus.create({
    'type':'normal',
    'title':'pan助手',
    'contexts':['selection'],
    'id':'cn',
    'onclick':storage
});

var newValue = '';
var dicList = [];

function translate(info, tab){
    var url = 'http://translate.google.com.hk/#auto/zh-CN/'+info.selectionText ;
    window.open(url, '_blank');
}

function storage(info, tab){
	newValue = info.selectionText;
	chrome.storage.local.get("pan", handleCallback);
}

function handleCallback(result){
	if(result){
		// 将json字符串转为对象
		var value  = result.pan;
		console.dir(value);
		value = value|| '[]';
		dicList = JSON.parse(value);
		console.log('chrome storage :' +dicList);
		
		//不存在则保存
		if($.inArray(newValue, dicList) < 0){
			dicList.push(newValue);
			var data = JSON.stringify(dicList);
			chrome.storage.local.set({'pan': data}, function() {
				  // Notify that we saved.
				  console.log('Settings saved :' + data);
				  chrome.tabs.executeScript({
					code: 'alert("下次pan助手将帮你自动保存含有关键字\['+newValue+'\]的视频")'
				  });
			});
		}
	}
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    switch (message.type) {
        case 'title':
			chrome.contextMenus.update('cn',{
				'title':'添加“'+message.data+'”'+'到pan助手'
			});
			break;
		case 'get':
			chrome.storage.local.get("pan", function(result){
				console.dir(result.pan);
				dicList = JSON.parse(result.pan);
				console.log('chrome storage :' +dicList);
				if(dicList.length > 0){
					sendResponse(dicList);
				}
			});
			break;
		case 'authorize':
			//oauth.authorize(sendResponse);
			break;
		case 'search':
			//searchWord(message.data, sendResponse);
			break;
		default:

		}

	return true;
});


// Update the declarative rules on install or upgrade.
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        // When a page contains a <video> tag...
        new chrome.declarativeContent.PageStateMatcher({
          css: [".video-wrap"]
        })
      ],
      // ... show the page action.
      actions: [new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});
