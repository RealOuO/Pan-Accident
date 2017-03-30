function getKeyWord(){
    var selection = window.getSelection();
	var str = selection.toString();
    if(str !== ''){
        chrome.runtime.sendMessage({type:'title', data:str});
    }
}

function autoSave(){
	chrome.runtime.sendMessage({type:'get'}, function(response) {
		checkToSave(response);
	});
}

(function(){
	//var my_element=$("#video-wrap.video-start-tip");
	//if(my_element.size() === 0){
	//	return;
	//}
	//if(!$("#video-wrap.video-start-tip").is(':hidden')){
	//	alert('test');
		autoSave();
	//}
}());



window.onmouseup = getKeyWord;

function checkToSave(dic){
	var title = document.title;
	for(i in dic){
		var key = dic[i];
		if(title.indexOf(key) >=0 ){
			console.log('自动保存');
			$("a.save-to-pan:first")[0].click();
			break;
		}
	}
}

//var links = $("a.save-to-pan:first")[0];
//console.log(links);