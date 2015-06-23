var _referrerDivide = function(path,domain){
	/*--Start UA --*/
	var isIE = /*@cc_on!@*/false;
	var isIE6 = (isIE && !window.XMLHttpRequest);
	var isIE7 = (isIE && window.XMLHttpRequest && !(document.documentMode >=8));
	var isIE8 = (isIE && window.XMLHttpRequest && document.documentMode == 8);
	var isIE6_8 = (isIE6 || isIE7 || isIE8);
	/*----End UA --*/
	
	/*--Start private var --*/
	var me = this;
	/*----Start xmlHttp ----*/
	var xmlHttp;
	
	if (window.XMLHttpRequest){
		xmlHttp = new XMLHttpRequest();
	}else{
		if (window.ActiveXObject){
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}else{
			xmlHttp = null;
		}
	}
	/*----End xmlHttp ----*/
	
	/*--Start public var --*/
	this.request = function(path){
		xmlHttp.open("get",path,true);
		xmlHttp.setRequestHeader('Pragma', 'no-cache');
		xmlHttp.setRequestHeader('Cache-Control', 'no-cache');
		xmlHttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
		xmlHttp.send("");
	};
	
	this.ReXML = function(){
		var ReXML;
		
		if(xmlHttp.readyState == 4) {
			ReXML = xmlHttp.responseXML;
		}
		
		return ReXML;
	};
	
	this.ReText = function(){
		var ReText;
		
		if(xmlHttp.readyState == 4) {
			ReText = xmlHttp.responseText;
		}
		
		return ReText;
	};
	
	this.getCookie = function(Name){
		var Value = undefined;
		var Key;
		var Cookies;
		var str = document.cookie;
			while (str.indexOf(';') != -1){
				Cookies = str.substring(0,str.indexOf(';'));
				Key = Cookies.substring(0,Cookies.indexOf('='));
				if (Key == Name){
					Value = Cookies.substring(Cookies.indexOf('=') + 1);
					break;
				}
				str = str.substring(str.indexOf(';') + 2);
			}
		return Value
	}
	/*----End public var --*/
	
	/*--Start constructor --*/
	var Referrer = document.referrer;
	var Dreg = new RegExp('^' + domain);
	var dTime = new Date();
	if (Referrer.match(Dreg)){
		Referrer = this.getCookie('referrerDivide');
		if (Referrer == undefined){Referrer = "";}
	} else {
		dTime.setYear(dTime.getYear() - 1);
		document.cookie = 'referrerDivide=' + ';expires=' + dTime.toGMTString();
		document.cookie = 'referrerDivide=' + Referrer;
	}
	
	this.request(path);
	
	try{
		window.addEventListener("load",function(){me.ini()},false);
	} catch(e) {
		window.attachEvent("onload",function(){me.ini()});
	}
	/*----End constructor --*/
	
	this.ini = function(){
		var XML = this.ReXML();
		var Text = this.ReText();
		
		if (isIE){
			if (XML == undefined){
				setTimeout(function(){me.ini();},1000);
			} else {
				this.mainIE();
			}
		} else {
			if (Text == undefined){
				setTimeout(function(){me.ini();},1000);
			} else {
				this.mainNotIE();
			}
		}
	}
	
	this.mainIE = function(){
		var XML = this.ReXML();
		var dummyDOM = document.createElement("dummy");
		var dummyDOMs, ItemDOMs, ListDOMs;
		var ReFlg, Cade, reg;
		var ReSelect = false;
		var Element;
		
		dummyDOM = XML.lastChild;
		dummyDOMs = dummyDOM.firstChild;
		
		while (dummyDOMs != undefined){
			if (dummyDOMs.nodeName == "item") {
				ReFlg = false;
				ItemDOMs = dummyDOMs.firstChild
				while (ItemDOMs != undefined){
					switch (ItemDOMs.nodeName) {
					case 'referrer':
						reg = new RegExp(ItemDOMs.text);
						if (ItemDOMs.text == 'default' && ReSelect == false) {
							ReFlg = true;
						} else if (Referrer.match(reg)){
							ReFlg = true;
							ReSelect = true;
						}
						break;
					case 'list':
						ListDOMs = ItemDOMs.firstChild;
						while (ListDOMs != undefined){
							switch (ListDOMs.nodeName) {
							case 'id':
								Element = document.getElementById(ListDOMs.text);
								break;
							case 'cade':
								Cade = ListDOMs.xml;
							}
							ListDOMs = ListDOMs.nextSibling;
						}
						if (Element != null && ReFlg == true){
							Element.innerHTML = Cade; 
						}
						break;
					}
					ItemDOMs = ItemDOMs.nextSibling;
				}
			}
			dummyDOMs = dummyDOMs.nextSibling;
		}
		setTimeout(function(){addGaTracking.add();},1000);
	};
	
	this.mainNotIE = function(){
		var Text = this.ReText();
		var i, j, k;
		var dummyDOM = document.createElement("dummy");
		var dummyDOMs, ItemDOMs;
		var ReFlg, Cade, reg;
		var ReSelect = false;
		
		dummyDOM.innerHTML = Text;
		dummyDOMs = dummyDOM.childNodes;
		
		for (i = 0; i < dummyDOMs.length; i++) {
			if (dummyDOMs[i].tagName == "ITEM") {
				ReFlg = false;
				ItemDOMs = dummyDOMs[i].childNodes;
				for (j = 0;j < ItemDOMs.length; j++){
					switch (ItemDOMs[j].tagName) {
					case 'REFERRER':
						reg = new RegExp(ItemDOMs[j].innerHTML);
						if (ItemDOMs[j].innerHTML == 'default' && ReSelect == false) {
							ReFlg = true;
						} else if (Referrer.match(reg)){
							ReFlg = true;
							ReSelect = true;
						}
						break;
					case 'LIST':
						ListDOMs = ItemDOMs[j].childNodes;
						for(k = 0; k < ListDOMs.length; k++){
							switch (ListDOMs[k].nodeName) {
							case 'ID':
								Element = document.getElementById(ListDOMs[k].innerHTML);
								break;
							case 'CADE':
								Cade = ListDOMs[k].innerHTML;
							}
						}
						if (Element != null && ReFlg == true){
							Element.innerHTML = Cade; 
						}
						break;
					}
				}
			}
		}
		setTimeout(function(){addGaTracking.add();},1000);
	};
}
