var dicList = [];

function openCity(evt, cityName) {
	var i, tabcontent, tablinks;
	tabcontent = $(".tabcontent");
	for(i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for(i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(cityName).style.display = "block";
	//evt.target.className += " active";
}

// Get the element with id="firstLoad" and click on;

var list = document.querySelector('ul');
//	list.addEventListener('click', function(ev) {
//		if(ev.target.tagName === 'LI') {
//			ev.target.classList.toggle('checked');
//		}
//	}, false);
$('#btSwitch').click(function(event){openCity(event, 'Switch')}); 
$('#btList').click(function(event){openCity(event, 'List')}); 
$('#btContact').click(function(event){openCity(event, 'Contact')}); 
$('#AddKey').click(function(event){newElement()}); 
$("#btSwitch").click();

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for(i = 0; i < myNodelist.length; i++) {
	var span = document.createElement("SPAN");
	var txt = document.createTextNode("\u00D7");
	span.className = "close";
	span.appendChild(txt);
	myNodelist[i].appendChild(span);
}



// Create a new list item when clicking on the "Add" button
function newElement() {
	var li = document.createElement("li");
	var inputValue = document.getElementById("myInput").value;
	var t = document.createTextNode(inputValue);
	li.appendChild(t);
	if(inputValue === '') {
		alert("You must write something!");
	}
	document.getElementById("myInput").value = "";

	//不存在则保存
	if($.inArray(inputValue, dicList) < 0){
		dicList.push(inputValue);
		var data = JSON.stringify(dicList);
		chrome.storage.local.set({'pan': data}, function() {
			  // Notify that we saved.
			  console.log('Settings saved :' + data);
			  
				document.getElementById("myUL").appendChild(li);
				var span = document.createElement("SPAN");
				var txt = document.createTextNode("\u00D7");
				span.className = "close";
				span.appendChild(txt);
				li.appendChild(span);
				span.onclick = (function(index){ 
					console.log("i:"+index);
					return function(event) {
						var div = this.parentElement;
						div.style.display = "none";
						handleRemove(index);
					}
				})(dicList.length-1);
		});
	}else{
		alert("key exists!");
	}

}
if($('#ckSwitch').is(':checked')) { 
}

chrome.storage.local.get("pan", handleGet);

function handleGet(result){
	if(result){
		// 将json字符串转为对象
		var value  = result.pan;
		console.dir(value);
		value = value|| '[]';
		dicList = JSON.parse(value);
		console.log('chrome storage :' +dicList);
		
		for(p in dicList){
			var li = document.createElement("li");
			var t = document.createTextNode(dicList[p]);
			li.appendChild(t);
			document.getElementById("myUL").appendChild(li);

			var span = document.createElement("SPAN");
			var txt = document.createTextNode("\u00D7");
			span.className = "close";
			span.appendChild(txt);
			li.appendChild(span);
			span.onclick = (function(index){ 
				console.log("i:"+index);
				return function(event) {
					var div = this.parentElement;
					div.style.display = "none";
					handleRemove(index);
				}
			})(p);
		}
	}
}


function handleRemove(index){
	var keyword = dicList[index];
	dicList.splice(index,1);
	var data = JSON.stringify(dicList);
	chrome.storage.local.set({'pan': data}, function() {
		  // Notify that we saved.
		  console.log('Settings saved :' + data);
		  alert(keyword + "关键字已移除");
		  
	});
}