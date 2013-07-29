
var hidden, visibilityChange;   
if (typeof document.hidden !== "undefined") {  
    hidden = "hidden";  
    visibilityChange = "visibilitychange";  
} else if (typeof document.mozHidden !== "undefined") {  
    hidden = "mozHidden";  
    visibilityChange = "mozvisibilitychange";  
} else if (typeof document.msHidden !== "undefined") {  
    hidden = "msHidden";  
    visibilityChange = "msvisibilitychange";  
} else if (typeof document.webkitHidden !== "undefined") {  
    hidden = "webkitHidden";  
    visibilityChange = "webkitvisibilitychange";  
} 

var favicon = {
		change: function(iconURL) {
		  if (arguments.length==2) {
			document.title = optionalDocTitle;
		  }
		  this.addLink(iconURL, "icon");
		  this.addLink(iconURL, "shortcut icon");
		},
		addLink: function(iconURL, relValue) {
		  var link = document.createElement("link");
		  link.type = "image/x-icon";
		  link.rel = relValue;
		  link.href = iconURL;
		  this.removeLinkIfExists(relValue);
		  this.docHead.appendChild(link);
		},
		removeLinkIfExists: function(relValue) {
		  var links = this.docHead.getElementsByTagName("link");
		  for (var i=0; i<links .length; i++) {
			var link = links[i];
			if (link.type=="image/x-icon" && link.rel==relValue) {
			  this.docHead.removeChild(link);
			  return; // Assuming only one match at most.
			}
		  }
		},
		docHead:document.getElementsByTagName("head")[0]
		}

function handleVisibilityChange() {
	console.log(document[hidden]);
    if (document[hidden]) {  
       console.log("http://a.xnimg.cn/favicon-rr.ico?ver=3");
       favicon.change("http://a.xnimg.cn/favicon-rr.ico?ver=3");
    } else {  
    	favicon.change("http://t.sohu.com/favicon.ico");
    	console.log("http://t.sohu.com/favicon.ico");
    }  
} 
document.addEventListener(visibilityChange, handleVisibilityChange, false); 