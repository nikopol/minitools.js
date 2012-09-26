minitools.js 0.1
================

minitools.js is a collection of small js helpers for "modern" browsers.

** hash **

manage variables in the url anchor.

  hash.set({page:"home",skin:"default"});  //set the complete anchor
  hash.set("key","value");                 //set a variable
  all=hash.get();                          //get all variables in an js object
  val=hash.get("key");                     //get a variable
  hash.del("key");                         //remove a variable
  hash.set({});                            //remove all variables
  hash.onchange(function(vars){ ... });    //setup a callback called on anchor update

** hotkeys **

handle hotkeys

  hotkeys.add("CTRL+U",function(){})              //define a hotkey
         .add(["CTRL+Q","ALT+F4"],function(){});  //define 2 equivalents hotkeys
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
