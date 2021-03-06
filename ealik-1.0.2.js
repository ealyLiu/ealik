/**
 * Created by liuxianyi
 * Version: 1.0.2 (2018-05-17)
 * Copyright (C) 2016 Liu Xianyi
 * http://www.liuxianyi.com
 */
;(function(window){

    if(!Array.prototype.indexOf){
        Array.prototype.indexOf = function(elt /*, from*/){
            var len = this.length >>> 0,
                from = Number(arguments[1]) || 0;

            from = (from < 0)?Math.ceil(from):Math.floor(from);
            if(from < 0){
                from += len;
            }

            for(;from<len;from++){
                if(from in this && this[from] === elt){
                    return from;
                }
            }
            return -1;
        };
    }

    function attachFn(obj,sEv,fn,type){
        if(obj.attachEvent){
            if(type){
                obj.attachEvent("on" + sEv,fn);
            }else{
                obj.attachEvent("on" + sEv,function(){
                    if(false == fn.call(obj)){
                        event.cancelBubble = true;
                        return false;
                    }
                });
            }
        }else{
            if(type){
                obj.addEventListener(sEv,fn,false);
            }else{
                obj.addEventListener(sEv,function(ev){
                    if(false == fn.call(obj)){
                        ev.cancelBubble = true;
                        ev.preventDefault();
                    }
                },false);
            }

        }
    }

    function callback(obj,xhr){
        obj.complete?obj.complete():"";
        if(xhr.status == 200){
            obj.success((obj.dataType && obj.dataType.tolowerCase == "json") ? JSON.parse(xhr.responseText) : xhr.responseText);
        }else{
            obj.error?obj.error():"";
        }
    }

    function appendArr(arr1,arr2,type){
        var i = 0,
            len = arr2.length;

        for(;i<len;i++){
            if(type){
                if(arr1.indexOf(arr2[i]) == -1){
                    arr1.push(arr2[i]);
                }
            }else{
                arr1.push(arr2[i]);
            }
        }
    }

    function getByClass(oParent,sClass){
        var node = oParent || document,
            oDiv = node.getElementsByTagName("*"),
            i = 0,
            len = oDiv.length,
            aResult = [];

        for(;i<len;i++){
            if(oDiv[i].className.indexOf(" ") != -1){
                var newSclass = oDiv[i].className.split(" "),
                    lenj = newSclass.length,
                    j = 0;
                for(;j<lenj;j++){
                    if(newSclass[j] == sClass){
                        aResult.push(oDiv[i]);
                    }
                }
            }else{
                if(oDiv[i].className == sClass){
                    aResult.push(oDiv[i]);
                }
            }
        }
        return aResult;
    }

    function getStyle(obj,attr){
        if(obj.currentStyle){
            return obj.currentStyle[attr];
        }else{
            return getComputedStyle(obj,false)[attr];
        }
    }

    function getIndex(obj){
        var aBrother = obj.parentNode.children,
            i = 0,
            len = aBrother.length;

        for(;i<len;i++){
            if(aBrother[i] == obj){
                return i;
            }
        }
    }

    function startMove(obj,json,fn){
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
            var bStop = true,
                attr;
            for(attr in json){
                var iCur = 0;

                if(attr == "opacity"){
                    iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100);
                }else{
                    iCur = parseInt(getStyle(obj, attr));
                }

                var iSpeed = (json[attr] - iCur) / 8;
                iSpeed = iSpeed > 0?Math.ceil(iSpeed):Math.floor(iSpeed);

                if(iCur != json[attr]){
                    bStop = false;
                }

                if(attr == "opacity"){
                    obj.style.filter = "alpha(opacity:" + (iCur + iSpeed) + ")";
                    obj.style.opacity = (iCur + iSpeed)/100;
                }else{
                    obj.style[attr] = iCur + iSpeed + "px";
                }
            }

            if(bStop){
                clearInterval(obj.timer);
                fn?fn():"";
            }
        },30);
    }

    function forFn(obj,sEv,fn){
        var i = 0,
            len = obj.length;
        for(;i<len;i++){
            attachFn(obj[i],sEv,fn);
        }
    }

    function filterNode(aResult,obj){
        var parentsNode = [],
            i = 0,
            len = aResult.length,
            aReNode = null;

        for(;i<len;i++){
            aReNode = aResult[i].getElementsByTagName("*");
            var j = 0,lenj = aReNode.length;
            for(;j<lenj;j++){
                if(aReNode[j] == obj){
                    parentsNode.push(aResult[i]);
                }
            }
        }
        return parentsNode.reverse();
    }

    function valHTML(obj,attr,arg){
        var i = 0,
            len = obj.length;
        for(;i<len;i++){
            if(arg !== undefined){
                obj[i][attr] = arg;
            }else{
                return obj[0][attr]?obj[0][attr]:"";
            }
        }
        return obj;
    }

    function domOprate(obj,node,type,parent){
        var i = 0,
            len = obj.length,
            lenNode = node.length;

        for(;i<len;i++){
            var oDiv = document.createElement("div"),
                nodeArr = [],
                oDnodes = [];

            if(typeof node == "object"){
                var nodeClone = [],
                    k = 0;
                for(;k<lenNode;k++){
                    nodeClone.push(node[k].cloneNode(true));
                }
                if(i>0){
                    oDnodes = nodeClone;
                }else{
                    oDnodes = node;
                }
            }else{
                oDiv.innerHTML = node;
                oDnodes = oDiv.childNodes;
            }

            appendArr(nodeArr,oDnodes);
            var j = 0,nodeArrLen = nodeArr.length;

            for(;j<nodeArrLen;j++){
                if(type){
                    if(parent == 1){
                        obj[i].parentNode.insertBefore(nodeArr[j],obj[i]);
                    }else if(parent == 2){
                        if($(obj[i]).next().length > 0){
                            obj[i].parentNode.insertBefore(nodeArr[j],$(obj[i]).next()[0]);
                        }else{
                            obj[i].parentNode.appendChild(nodeArr[j]);
                        }
                    }else{
                        if(obj[i].children.length == 0){
                            obj[i].appendChild(nodeArr[j]);
                        }else{
                            obj[i].insertBefore(nodeArr[j],obj[i].children[0]);
                        }
                    }
                }else{
                    obj[i].appendChild(nodeArr[j]);
                }
            }
        }
    }

    function switchArg(obj,par,arr){
        var oPar = par == window ? document : par;
        switch(obj.charAt(0)){
            case "#":
                var idEles = document.getElementById(obj.substring(1));
                idEles?arr.push(idEles):"";
                break;
            case ".":
                var classArr = getByClass(oPar,obj.substring(1));
                appendArr(arr,classArr,1);
                break;
            default:
                var tagArr = oPar.getElementsByTagName(obj);
                appendArr(arr,tagArr,1);
        }
    }

    function selector(arg,obj){
        var arr = [],
            ele = obj || document,
            argArr = [],
            i = 0,
            len_i;

        if(arg.indexOf(",") != -1){
            argArr = arg.split(",");
        }else{
            argArr = [arg];
        }

        len_i = argArr.length;
        for(;i<len_i;i++){
            if(argArr[i].indexOf(" ") != -1){

                var spaceArr = argArr[i].split(" "),
                    childElements = [],
                    node = [ele],
                    j = 0,len_j = spaceArr.length;

                for(;j<len_j;j++){
                    switch (spaceArr[j].charAt(0)){
                        case "#":
                            childElements = [];
                            childElements.push(document.getElementById(spaceArr[j].substring(1)));
                            node = childElements;
                            break;
                        case ".":
                            childElements = [];
                            var z = 0,len = node.length;
                            for(;z<len;z++){
                                var temps = getByClass(node[z],spaceArr[j].substring(1)),
                                    k = 0,lens = temps.length;
                                for(;k<lens;k++){
                                    childElements.push(temps[k]);
                                }
                            }
                            node = childElements;
                            break;
                        default:
                            childElements = [];
                            var x = 0,len_x = node.length;
                            for(;x<len_x;x++){
                                var parNode = node[x] || document,
                                    oTemp = parNode.getElementsByTagName(spaceArr[j]),
                                    y = 0,lent = oTemp.length;
                                for(;y<lent;y++){
                                    childElements.push(oTemp[y]);
                                }
                            }
                            node = childElements;
                    }
                }
                appendArr(arr,childElements,1);
            }else{
                switchArg(argArr[i],ele,arr);
            }
        }
        return arr;
    }

    function merge(first,second){
        var i = 0,
            len = second.length;

        for(;i<len;i++){
            first[i] = second[i];
        }

        first.length = len;

        return first;
    }

    function Ealik(arg){
        return new Ealik.fn.init(arg);
    }

    Ealik.fn = Ealik.prototype = {
        constructor:Ealik,
        init:function(arg){
            var eles = [];
            if(!arg){
                return this;
            }
            switch(typeof arg){
                case "function":
                    attachFn(window,"load",arg);
                    break;
                case "string":
                    eles = selector(arg);
                    eles = merge(this.constructor(),eles);
                    return eles;
                    break;
                case "object":
                    eles.push(arg);
                    eles = merge(this.constructor(),eles);
                    return eles;
            }
        },
        on:function(sEv,ele,fn){
            if(arguments.length == 2){
                forFn(this,sEv,ele);
                return this;
            }
            var i = 0,
                len = this.length;

            for(;i<len;i++){
                attachFn(this[i],sEv,function(ev){
                    var oEvent = ev || event,
                        oTarget = oEvent.target || oEvent.srcElement;
                    if(ele.charAt(0) == "#"){
                        if(oTarget.id == ele.substring(1)){
                            if(this.attachEvent){
                                if(false == fn.call(oTarget)){
                                    oEvent.cancelBubble = true;
                                    return false;
                                }
                            }else{
                                if(false == fn.call(oTarget)){
                                    oEvent.cancelBubble = true;
                                    oEvent.preventDefault();
                                }
                            }
                            return;
                        }
                    }else if(ele.charAt(0) == "."){
                        if(oTarget.className == ele.substring(1)){
                            if(this.attachEvent){
                                if(false == fn.call(oTarget)){
                                    oEvent.cancelBubble = true;
                                    return false;
                                }
                            }else{
                                if(false == fn.call(oTarget)){
                                    oEvent.cancelBubble = true;
                                    oEvent.preventDefault();
                                }
                            }
                            return;
                        }
                    }else{
                        if(oTarget.tagName.toLowerCase() == ele){
                            if(this.attachEvent){
                                if(false == fn.call(oTarget)){
                                    oEvent.cancelBubble = true;
                                    return false;
                                }
                            }else{
                                if(false == fn.call(oTarget)){
                                    oEvent.cancelBubble = true;
                                    oEvent.preventDefault();
                                }
                            }
                            return;
                        }
                    }

                    var oParents = $(this).find(ele),
                        len_z = oParents.length,j = 0,z = 0;

                    for(;z<len_z;z++){
                        var oNodes = oParents[z].getElementsByTagName("*"),
                            len_j = oNodes.length;
                        for(;j<len_j;j++){
                            if(oNodes[j] == oTarget){
                                if(this.attachEvent){
                                    if(false == fn.call(oParents[z])){
                                        oEvent.cancelBubble = true;
                                        return false;
                                    }
                                }else{
                                    if(false == fn.call(oParents[z])){
                                        oEvent.cancelBubble = true;
                                        oEvent.preventDefault();
                                    }
                                }
                                return;
                            }
                        }
                    }
                },1);
            }
            return this;
        },
        splice:[].splice,
        bind:function(sEv,fn){
            forFn(this,sEv,fn);
            return this;
        },
        hover:function(fnOver,fnOut){
            var i = 0,
                len = this.length;

            for(;i<len;i++){
                attachFn(this[i],"mouseover",fnOver);
                attachFn(this[i],"mouseout",fnOut);
            }
            return this;
        },
        addClass:function(sClass){
            var i = 0,
                len = this.length;
            for(;i<len;i++){
                this[i].className += " " + sClass;
            }
            return this;
        },
        removeClass:function(sClass){
            var i = 0,
                len = this.length;
            for(;i<len;i++){
                if(this[i].className.indexOf(" ") != -1){
                    var oClass = this[i].className.split(" "),
                        seftClass = [],
                        k = 0,lenk = oClass.length;
                    for(;k<lenk;k++){
                        if(oClass[k] != sClass){
                            seftClass.push(oClass[k]);
                        }
                    }
                    this[i].className = seftClass.join(" ");
                }else{
                    if(this[i].className == sClass){
                        this[i].className = "";
                    }
                }
            }
            return this;
        },
        hasClass:function(sClass){
            if(this[0].className.indexOf(" ") != -1){
                var oClass = this[0].className.split(" "),
                    i = 0,len = oClass.length;
                for(;i<len;i++){
                    if(oClass[i] == sClass){
                        return true;
                    }
                }
            }else{
                if(this[0].className == sClass){
                    return true;
                }
            }
            return false;
        },
        css:function(attr,value){
            var i = 0,
                k,
                len = this.length;
            if(arguments.length == 2){
                for(;i<len;i++){
                    this[i].style[attr] = value;
                }
            }else{
                if(typeof attr == "string"){
                    return getStyle(this[0],attr);
                }else{
                    for(;i<len;i++){
                        for(k in attr){
                            this[i].style[k]=attr[k];
                        }
                    }
                }
            }
            return this;
        },
        attr:function(attr,value){
            var i = 0,
                len = this.length;
            if(arguments.length == 2){
                for(;i<len;i++){
                    this[i].setAttribute(attr,value);
                }
            }else{
                return this[0].getAttribute(attr);
            }
            return this;
        },
        find:function(str){
            var i = 0,
                aResult = [],
                len = this.length,
                _this;

            for(;i<len;i++){
                appendArr(aResult,selector(str,this[i]),1);
            }
            _this = merge(this.constructor(),aResult);
            return _this;
        },
        animated:function(json,fn){
            var i = 0,
                len = this.length;
            for(;i<len;i++){
                startMove(this[i],json,fn);
            }
            return this;
        },
        index:function(){
            return getIndex(this[0]);
        },
        eq:function(n){
            return $(this[n]);
        },
        remove:function(){
            var i = 0,
                len = this.length;
            for(;i<len;i++){
                this[i].parentNode.removeChild(this[i]);
            }
        },
        empty:function(){
            var i = 0,
                len = this.length;
            for(;i<len;i++){
                this[i].innerHTML = "";
            }
            return this;
        },
        html:function(arg){
            return valHTML(this,"innerHTML",arg);
        },
        val:function(arg){
            return valHTML(this,"value",arg);
        },
        append:function(node){
            domOprate(this,node,0,0);
            return this;
        },
        prepend:function(node){
            domOprate(this,node,1,0);
            return this;
        },
        before:function(node){
            domOprate(this,node,1,1);
            return this;
        },
        after:function(node){
            domOprate(this,node,1,2);
            return this;
        },
        parent:function(){
            var i = 0,
                len = this.length,
                parentResult = [],
                _this;
            for(;i<len;i++){
                if(parentResult.indexOf(this[i].parentNode) == -1){
                    parentResult.push(this[i].parentNode);
                }
            }

            _this = merge(this.constructor(),parentResult);
            return _this;
        },
        parents:function(arg){
            var aResult=[],
                _this,
                parentResult = [],
                i = 0,
                len = this.length;

            arg?switchArg(arg,document,aResult):aResult = document.getElementsByTagName("*");

            for(;i<len;i++){
                appendArr(parentResult,filterNode(aResult,this[i]),1);
            }

            _this = merge(this.constructor(),parentResult);
            return _this;
        },
        children:function(arg){
            var i = 0,
                len = this.length,
                aResult = [],
                _this;
            for(;i<len;i++){
                if(arg){
                    switchArg(arg,this[i],aResult);
                }else{
                    var _children = this[i].children;
                    appendArr(aResult,_children,1);
                }
            }

            _this = merge(this.constructor(),aResult);
            return _this;
        },
        siblings:function(arg){
            var i = 0,
                len = this.length,
                aResult = [],
                _this;
            if(arg){
                for(;i<len;i++){
                    switch(arg.charAt(0)){
                        case ".":
                            var aEle = getByClass(this[i].parentNode,arg.substring(1));
                            appendArr(aResult,aEle,1);
                            break;
                        case "#":
                            var aId = document.getElementById(arg.substring(1));
                            if(aId.parentNode == this[i].parentNode){
                                aResult = [aId];
                            }
                            break;
                        default:
                            var aTags = this[i].parentNode.children,
                                eleArr = [],
                                lenj = aTags.length,
                                j = 0;
                            for(;j<lenj;j++){
                                if(aTags[j] != this[i]){
                                    eleArr.push(aTags[j]);
                                }
                            }
                            appendArr(aResult,eleArr,1);
                    }
                }
            }else{
                for(;i<len;i++){
                    var eleSiblings = this[i].parentNode.children,
                        lenz = eleSiblings.length,
                        z = 0;
                    for(;z<lenz;z++){
                        if(this[i] != eleSiblings[z]){
                            if(aResult.indexOf(eleSiblings[z]) == -1){
                                aResult.push(eleSiblings[z]);
                            }
                        }
                    }
                }
            }

            _this = merge(this.constructor(),aResult);
            return _this;
        },
        next:function(){
            var i = 0,
                len = this.length,
                _this,
                nextArr = [];

            for(;i<len;i++){
                if(this[i].parentNode.children.length >= this.eq(i).index()+2){
                    if(nextArr.indexOf(this[i].parentNode.children[this.eq(i).index()+1]) == -1){
                        nextArr.push(this[i].parentNode.children[this.eq(i).index()+1]);
                    }
                }
            }

            _this = merge(this.constructor(),nextArr);
            return _this;
        },
        prev:function(){
            var i = 0,
                len = this.length,
                _this,
                prevArr = [];

            for(;i<len;i++){
                if(this.eq(i).index() > 0){
                    if(prevArr.indexOf(this[i].parentNode.children[this.eq(i).index()-1]) == -1){
                        prevArr.push(this[i].parentNode.children[this.eq(i).index()-1]);
                    }
                }
            }

            _this = merge(this.constructor(),prevArr);
            return _this;
        }
    };

    Ealik.fn.init.prototype = Ealik.fn;

    window.Ealik = window.$ = Ealik;

    $.ajax = function(obj){
        obj.beforeSend?obj.beforeSend():"";
        var xhr = new XMLHttpRequest(),
            asyncType = obj.async?obj.async:false;
        
        if(asyncType == true){
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4){
                    callback(obj,xhr);
                }
            };
        }
        var params = [];
        for (var attr in obj.data){
            params.push(attr + '=' + obj.data[attr]);
        }
        var postData = params.join('&');
        if(obj.type.toLowerCase() == "post"){
            xhr.open(obj.type,obj.url + "?_=" + new Date().getTime(),asyncType);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
            xhr.send(postData);
        }else{
            xhr.open(obj.type,obj.url + '?' + postData + "&_=" + new Date().getTime(),asyncType);
            xhr.send(null);
        }
        if(asyncType == false){
            callback(obj,xhr);
        }
    };

    $.trim = function(str){
        return str.replace(/^\s+|\s+$/g,"");
    };

})(window);