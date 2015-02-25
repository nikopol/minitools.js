// minitools.js 0.5
// ~L~ nikomomo@gmail.com 2012-2015
// https://github.com/nikopol/minitools.js

/*
minitools.js is a collection of small js helpers for "modern" browsers.

** hash **

manage variables in the url anchor.

  hash.set({page:"home",skin:"default"}[,noev]);  //set the complete anchor
  hash.set("key","value"[,noev]);                 //set a variable
  all=hash.get();                                 //get all variables in an js object
  val=hash.get("key");                            //get a variable
  hash.del("key"[,noev]);                         //remove a variable
  hash.set({});                                   //remove all variables
  hash.onchange(function(vars){ ... });           //setup a callback called on anchor update

  note: set and del trigger the onchange callback, except if you give true as noev parameter

** hotkeys **

handle hotkeys

  hotkeys.add("CTRL U",function(){})              //define a hotkey
         .add(["CTRL Q","ALT F4"],function(){});  //define 2 equivalents hotkeys
  hotkeys.clear();                                //unset all hotkeys


** browser **

an object with client info

           Firefox 11 => { Firefox:11, Gecko:20100101, Mozilla:5 }
          Chromium 18 => { Chrome:18, Safari:535.19, Mozilla:5 }
                 IE 9 => { IE:9, Mozilla:5 }
                 IE 8 => { IE:8, Mozilla:4 }
                 IE 7 => { IE:7, Mozilla:4 }
              Opera 9 => { Opera: 9.8, Presto: 2.1, Version: 11.61 }
             Safari 5 => { Version:5.1, Safari:534.52, Mozilla:5 }

*/

var
hash=(function(){
	"use strict";
	var h, p,
	hash=function(){ return document.location.hash.slice(1) },
	encode=function(s){ return s.toString().replace(/&/g,'%26').replace(/=/g,'%3D') },
	decode=function(s){ return decodeURIComponent(s) },
	serialize=function(noev){
		var a=[], k;
		for (k in h) a.push(encode(k)+"="+encode(h[k]));
		if(noev) p=a.join("&");
		document.location.hash="#"+a.join("&");
		return true;
	},
	unserialize=function(){
		h={};
		p=hash();
		if(p.length) {
			var lst=p.split("&");
			lst.forEach(function(l){
				var kv=l.split("=");
				if(kv.length>1) h[decode(kv[0])] = decode(kv[1]);
			});
		}
	};
	unserialize();
	return {
		del: function(key,noev){ if(h.hasOwnProperty(key)){ delete h[key]; return serialize(noev) } return false },
		set: function(key,val,noev){ return typeof(key)=='object' ? serialize(val,h=key) : serialize(noev,h[key]=val) },
		get: function(key){ return arguments.length ? h[key]||'' : h },
		link: function(o){
			var z=[], k;
			if(o) for(k in o) z.push(k+'='+encode(o[k]));
			return '#'+z.join('&');
		},
		onchange: function(cb){
			window.onhashchange=function(){
				if(hash()!=p){
					unserialize();
					if(cb) cb();
				}
			}
		}
	}
})(),

hotkeys=(function(){
	"use strict";
	var 
	KEYS={
		ESC:27, TAB:9, SPACE:32, RETURN:13, ENTER:13, BACKSPACE:8, BS:8, SCROLL:145, CAPSLOCK:20, NUMLOCK:144,
		PAUSE:19, INSERT:45, DEL:46, HOME:36, END:35, PAGEUP:33, PAGEDOWN:34, LEFT:37, UP:38, RIGHT:39, DOWN:40,
		F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123,
		'*':106, '+':107, '-':109, '.':110, '/':111, ';':186, '=':187, ',':188, //'-':189,'.':190, '/':191,
		'`':192, '[':219, '\\':220, ']':221, '\'':222
	},
	MASKEYS={ ALT:1,CONTROL:2,CTRL:2,SHIFT:4,META:8 },
	list=[],
	cold=function(){ return /INPUT|SELECT|TEXTAREA|KBD/.test(document.activeElement.tagName) },
	trigger=function(e){
		if(!e) e=window.event;
		var i, k,
			chr=String.fromCharCode(e.which || e.charCode).toUpperCase(),
			msk=e.shiftKey*MASKEYS.SHIFT|e.ctrlKey*MASKEYS.CTRL|e.altKey*MASKEYS.ALT|e.metaKey*MASKEYS.META;
		for(i in list) {
			k=list[i];
			if((e.which==k.key || chr==k.key) && msk==k.mask) {
				if(k.glob || !cold() || k.key==27) {
					e.stopPropagation();
					e.preventDefault();
					k.fn(e);
					return false;
				}
			}
		}
		return true;
	};
	return {
		clear: function(){
			document.onkeydown=null;
			list=[];
			return this;
		},
		add: function(keys,fn,global){ 
			var msk=0, key=0;
			if(typeof keys=="string") keys=[keys];
			keys.forEach(function(k){
				if(typeof(k)=="string")
					(k == '+' ? ['+'] : k.toUpperCase().split('+')).forEach(function(n){
						if(MASKEYS[n]) msk|=MASKEYS[n];
						else if(KEYS[n]) key=KEYS[n];
						else key=n[0];
					});
				if(key) {
					list.push({key:key, fn:fn, glob:global, mask:msk||0});
					if(list.length==1) document.onkeydown=trigger;
				} else
					console.error('hotkey '+key+' unknown');
			});
			return this;
		}
	};
})(),

browser=function(){
	"use strict";
	var b={}, z=navigator.userAgent;
	if(/MSIE\s([\d\.]+)/.test(z)) b.IE=parseFloat(RegExp.$1);
	z.replace(/\s\(.+\)/g,'').split(' ').forEach(function(n){ if(/^(.+)\/(.+)$/.test(n)) b[RegExp.$1]=parseFloat(RegExp.$2) });
	return b;
}(),

htmlencode=function(s){
    return s
    	.replace(/&/g, '&amp;')
    	.replace(/</g, '&lt;')
    	.replace(/>/g, '&gt;')
    	.replace(/"/g, '&quot;');
};
