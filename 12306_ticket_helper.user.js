﻿
// ==UserScript==
// @name 			12306.CN 订票助手 For Firefox&Chrome
// @namespace		http://www.u-tide.com/fish/
// @author			iFish@FishLee.net <ifish@fishlee.net> http://www.fishlle.net/
// @developer		iFish
// @contributor		
// @description		帮你订票的小助手 :-)
// @match			http://dynamic.12306.cn/otsweb/*
// @match			https://dynamic.12306.cn/otsweb/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @icon			http://www.12306.cn/mormhweb/images/favicon.ico
// @run-at			document-idle
// @version 		3.2.7
// @updateURL		http://www.fishlee.net/Service/Download.ashx/44/47/12306_ticket_helper.user.js
// @supportURL		http://www.fishlee.net/soft/44/
// @homepage		http://www.fishlee.net/soft/44/
// @contributionURL	https://me.alipay.com/imfish
// @contributionAmount	￥5.00
// ==/UserScript==


// @id				12306_ticket_helper_by_ifish@fishlee.net
// @namespace		ifish@fishlee.net

var version = "3.2.7";
var updates = "* 修正改签页面中验证码被帮助隐藏功能隐藏的BUG\n* 出现重复提交错误时，自动刷新页面验证TOKEN并重新提交\n* 修改对-4状态码的处理动作";

var loginUrl = "/otsweb/loginAction.do";
var queryActionUrl = "/otsweb/order/querySingleAction.do";
//预定
var confirmOrderUrl = "/otsweb/order/confirmPassengerAction.do";
var faqUrl = "http://www.fishlee.net/soft/44/faq.html";
//标记
var utility_emabed = false;


//#region -----------------UI界面--------------------------

function initUIDisplay() {
	injectStyle();
}

/**
 * 将使用的样式加入到当前页面中
 */
function injectStyle() {
	var s = document.createElement("style");
	s.id = "12306_ticket_helper";
	s.type = "text/css";
	s.textContent = ".fish_running, .fish_clock, .fish_error, .fish_ok {\
    line-height:20px;\
    text-indent:18px;\
    background-repeat:no-repeat;\
    background-position:2px 50%;\
    font-size:12px;\
    }\
    .fish_running{background-image:url(data:image/gif;base64,R0lGODlhEAAQALMPAHp6evf394qKiry8vJOTk83NzYKCgubm5t7e3qysrMXFxe7u7pubm7S0tKOjo////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCAAPACwAAAAAEAAQAAAETPDJSau9NRDAgWxDYGmdZADCkQnlU7CCOA3oNgXsQG2FRhUAAoWDIU6MGeSDR0m4ghRa7JjIUXCogqQzpRxYhi2HILsOGuJxGcNuTyIAIfkECQgADwAsAAAAABAAEAAABGLwSXmMmjhLAQjSWDAYQHmAz8GVQPIESxZwggIYS0AIATYAvAdh8OIQJwRAQbJkdjAlUCA6KfU0VEmyGWgWnpNfcEAoAo6SmWtBUtCuk9gjwQKeQAeWYQAHIZICKBoKBncTEQAh+QQJCAAPACwAAAAAEAAQAAAEWvDJORejGCtQsgwDAQAGGWSHMK7jgAWq0CGj0VEDIJxPnvAU0a13eAQKrsnI81gqAZ6AUzIonA7JRwFAyAQSgCQsjCmUAIhjDEhlrQTFV+lMGLApWwUzw1jsIwAh+QQJCAAPACwAAAAAEAAQAAAETvDJSau9L4QaBgEAMWgEQh0CqALCZ0pBKhRSkYLvM7Ab/OGThoE2+QExyAdiuexhVglKwdCgqKKTGGBgBc00Np7VcVsJDpVo5ydyJt/wCAAh+QQJCAAPACwAAAAAEAAQAAAEWvDJSau9OAwCABnBtQhdCQjHlQhFWJBCOKWPLAXk8KQIkCwWBcAgMDw4Q5CkgOwohCVCYTIwdAgPolVhWSQAiN1jcLLVQrQbrBV4EcySA8l0Alo0yA8cw+9TIgAh+QQFCAAPACwAAAAAEAAQAAAEWvDJSau9WA4AyAhWMChPwXHCQRUGYARgKQBCzJxAQgXzIC2KFkc1MREoHMTAhwQ0Y5oBgkMhAAqUw8mgWGho0EcCx5DwaAUQrGXATg6zE7bwCQ2sAGZmz7dEAAA7); color: green;}\
    .fish_clock{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAG/SURBVHjapJM/S8NQFMVvpaVfoEKojWL9U3DLIqjoooJDu/sFmnQoiIujQz+Aix3a1FUQXIR2UFA6+WeRUhBprERroGTopg6lSeo7iY1pq4sNHPpy3+8c7n0v9XW7XRrl8SFAlmVvbYFpmynOJHzXKkwlphOmxx4oiiL5sbAsi1KpFOVyuWQwGMzEYjEuGo0Sx3E2qOu6oKqqoChKst1u7zO2wNifDrLZLNbJUCgkLy2vEM/zv7araRrd3lxTq9US2WshnU7TGDZM01zwBwKZxaVlCkd4MtmxQDXlyVbvHXtgwMIDrx3Q6XS2Z2bnufDEJJkWuWIt2/LWwICFxw0wDCM+PTPXB0K4IGiwDhYeeP3fHQjjXIQMq3/mev3J/l0fqIOFxxtAxi+fg/rsBOztSE7QVpwpQT2PN6Dy1mgIYX7KNZcvipQ5yA+Fosum1rA93jMo1R6q7oxX50Va20wMzd4TWHi8t3BSvb/T1bpz4qsbf5vBgIXHDWB3+vj58b5fPj9jc9fcex8U9sCAhcc7Au1mDgtN7VU8Oz7SL0un9PbyTBYzQVijhj0wYOFxP2VJkv71Z8rn807AKM+XAAMArp1CsEFrDIIAAAAASUVORK5CYII=); color: blue;}\
    .fish_error{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJFSURBVHjapJO/T1pRFMe/Dx7ypEXri4lUGUhsHF40hODSpQ61cTH+2HSoZaF1dHSxpU7+Ca04NE7dyuBiapcuLFokTdD4A01awNdBSkAf8ut5zhUoxq3e5OS+nPv5nnvuyfdJpmniPksSBd68aM1pFDMU4xS+ei5GsUHxmSLRJD9+hcx7rVqFZWwMtc3NIGy2Zam31yX19ABdXTdgNuszdd1nptNBlMtviQ0TC0ujg1LgGWNByelctQ4M4G8qhfN4HLmDA6HvpJzq9eJRXx+qlDPz+deUDrd9+i6KoFouazVg2erx4M/uLn5FItGLk5NX/qUliYO+I2o2C4vLBWaYZQ1rRYFyqTQDVXXl02mcb29HbXb7S+/CwjqKRSAaDXlHRqYwOoqdxUUww6zQNApUSqVxuaMDF8kk2hTlgxYIHMMwaHSxEB2/a4g7u7sjzDDLmn8dXF35ZJsNVWrzycTEOtxuYH//lpjWezqbZoZZ1rQ+AXyj3eEQO7a27oj9s7OhVkZoWjqIFXUdD1QVub29L3fEk5MhXF7y2RwzzLKmdQYb+UwGiqLwO6duiVdWxM2GrvfTfOaZYZY1TScmvE7NKsvf3B6PyzE8jB9ra6DJR2TTnBYXSNIcbfN021Mjl8Pv09OzaqXyXIvnE6LAT00RRlLa21cfk1kesgNpULBab5xITiUHokADzJDJioYhjDSUKNafUKlgaHAwXCCHJQ8Pz1JHRyhQm2RhEfzNOT5jhlnWNJ+w0y/918/kPzbrf+M91rUAAwCuQDz94e2kLwAAAABJRU5ErkJggg==); color: blue;}\
    .fish_ok{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHsSURBVHjapFNBSBtBFH2xgoqmKipEC6XkYqhUWXOxUAQhpyJ4Wgi0l0rNsdBbL/WgF2/eV8hNSBF68uhFkOrFhCAGS8mWgmYjG9lCKVGTuP1vsrvuIac68HZm/n/vz5/9fyKu6+IhI8IA5k4kbHsuSAsWBZpnKwh2BTlBySfGdTmcAX7kOJc5r5hfhyw7/86t21/EVVbgmjb6yPG4SqsyONtWGaz0Dk8aYzMf0R+b65ju3+oR7OImrp3vGdluJd646KKj1ZK0H0XXRqfeo390Emg6HUEfOeQqjQwVoNFAOvpkPjYw8kw2NRgfFtQchm8jh1xqggDNJhYHY3Jy41IhmXodrDvZyKWG2m4vA23gcR9wa6m7Jue1YO2PsI1casIB5GPBWM8ilZLyvFzu+BPNwyz29oDM5+W2JhSg8NsqaRSTMHycxfg4MDHRJlUqgCWHO/IvyRGu0gQB5D671Z+mlpiZFXEejjSInrw/OS4wjiWwNFx8ehZnRVNpwlXI/SrXqvbFOfS3TxWRAtNpwxfTRw651AQZSE1Lrfrd6mmhZky96IGejuJgX5rL9HpbrvBKbHbFxunJDa6F67e0X0YsLWHr6uouc/StXi3m/yCRkNTjbXBNG33kkEtN8Jh2Pv3fY9I3vLfwkPFPgAEApRUigcIVl3AAAAAASUVORK5CYII=); color: purple;}\
     .outerbox{border:5px solid #EAE3F7;}\
    .box{border:1px solid #6E41C2;color:#444;}\
    .box .title{padding:5px;line-height:20px;background-color:#B59DE2;color:#fff;}\
	.box .title a {color:white;}\
    .box .content{padding:5px;}\
    .box table{border-collapse:collapse; width:100%;}\
    .box table td{padding:5px;}\
    .box input[type=button],.fish_button {padding:5px;}\
	.box .name ,.box .caption,.box .caption td { background-color:#EAE3F7; font-weight:bold;}\
	.fish_sep td {border-top:1px solid #A688DD;}\
	.lineButton { cursor:pointer; border: 1px solid green; border-radius:3px; line-height: 16px; padding:3px; backround-color: lightgreen; color: green;}\
	.lineButton:hover { color: white; background-color: green; }\
    ";

	document.head.appendChild(s);
}

//#endregion

//#region -----------------执行环境兼容----------------------

var utility = {
	icon: "http://www.12306.cn/mormhweb/images/favicon.ico",
	notifyObj: null,
	timerObj: null,
	notify: function (msg, timeout) {
		console.log("信息提示: " + msg);
		if (window.webkitNotifications) {
			if (window.webkitNotifications.checkPermission() == 0) {
				utility.closeNotify();

				if (utility.notifyObj == null)
					utility.notifyObj = webkitNotifications.createNotification(utility.icon, '订票', msg);
				utility.notifyObj.show();
				if (!timeout || timeout != 0) utility.timerObj = setTimeout(utility.closeNotify, timeout || 5000);
			} else {
				alert("【警告：您尚未允许脚本的Notify权限！请开启以避免使用这种对话框来进行提示！】\n\n" + msg);
			}
		} else {
			if (typeof (GM_notification) != 'undefined') {
				GM_notification(msg);
			} else {
				console.log("主页面中脚本信息, 无法提示, 写入通知区域.");
				utility.notifyOnTop(msg);
			}
		}
	},
	notifyOnTop: function (msg) {
		window.localStorage.setItem("notify", msg);
	},
	closeNotify: function () {
		if (!utility.notifyObj) return;

		utility.notifyObj.cancel();
		if (utility.timerObj) {
			clearTimeout(utility.timerObj);
		}
		utility.timerObj = null;
		utility.notifyObj = null;
	},
	setPref: function (name, value) {
		window.localStorage.setItem(name, value);
	},
	getPref: function (name) {
		return window.localStorage[name];
	},
	unsafeCallback: function (callback) {
		if (typeof (unsafeInvoke) == "undefined") callback();
		else unsafeInvoke(callback);
	},
	getTimeInfo: function () {
		var d = new Date();
		return d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
	},
	savePrefs: function (obj, prefix) {
		var objs = obj.find("input");
		objs.change(function () {
			var type = this.getAttribute("type");
			if (type == "text") utility.setPref(prefix + "_" + this.getAttribute("id"), $(this).val());
			else if (type == "checkbox") utility.setPref(prefix + "_" + this.getAttribute("id"), this.checked ? 1 : 0);
		})
	},
	reloadPrefs: function (obj, prefix) {
		var objs = obj.find("input");
		objs.each(function () {
			var e = $(this);
			var type = e.attr("type");
			var id = e.attr("id");
			var value = utility.getPref(prefix + "_" + id);
			if (typeof (value) == "undefined") return;

			if (type == "text") e.val(value);
			else if (type == "checkbox") this.checked = value == "1";
			e.change();
		});
		utility.savePrefs(obj, prefix);
	},
	getErrorMsg: function (msg) {
		/// <summary>获得给定信息中的错误信息</summary>
		var m = msg.match(/var\s+message\s*=\s*"([^"]*)/);
		return m && m[1] ? m[1] : "&lt;未知信息&gt;";
	},
	delayInvoke: function (target, callback, timeout) {
		var e = $(target);
		if (timeout <= 0) {
			e.html("正在执行").removeClass("fish_clock").addClass("fish_running");
			callback();
		} else {
			var str = (Math.floor(timeout / 100) / 10) + '';
			if (str.indexOf(".") == -1) str += ".0";
			e.html(str + " 秒后重试....").removeClass("fish_running").addClass("fish_clock");
			setTimeout(function () {
				utility.delayInvoke(target, callback, timeout - 500);
			}, 500);
		}
	},
	saveList: function (name) {
		/// <summary>将指定列表的值保存到配置中</summary>
		var dom = document.getElementById(name);
		window.localStorage["list_" + name] = utility.getOptionArray(dom).join("|");
	},
	loadList: function (name) {
		/// <summary>将指定的列表的值从配置中加载</summary>
		var dom = document.getElementById(name);
		var data = window.localStorage["list_" + name];
		if (!data) return;

		data = data.split('|');
		$.each(data, function () {
			dom.options[dom.options.length] = new Option(this, this);
		});
	},
	addOption: function (dom, text, value) {
		/// <summary>在指定的列表中加入新的选项</summary>
		dom.options[dom.options.length] = new Option(text, value);
	},
	getOptionArray: function (dom) {
		/// <summary>获得选项的数组格式</summary>
		return $.map(dom.options, function (o) { return o.value; });
	},
	inOptionList: function (dom, value) {
		/// <summary>判断指定的值是否在列表中</summary>
		for (var i = 0; i < dom.options.length; i++) {
			if (dom.options[i].value == value) return true;
		}
		return false;
	},
	getAudioUrl: function () {
		/// <summary>获得音乐地址</summary>
		return window.localStorage["audioUrl"] || "http://www.w3school.com.cn/i/song.ogg";
	},
	resetAudioUrl: function () {
		/// <summary>恢复音乐地址为默认</summary>
		window.localStorage.removeItem("audioUrl");
	},
	parseDate: function (s) { /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/.exec(s); return new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3); },
	getDate: function (s) {
		/// <summary>获得指定日期的天单位</summary>
		return new Date(s.getFullYear(), s.getMonth(), s.getDate());
	},
	formatDate: function (d) {
		/// <summary>格式化日期</summary>
		var y = d.getFullYear();

		return y + "-" + utility.formatDateShort(d);
	},
	formatDateShort: function (d) {
		/// <summary>格式化日期</summary>
		var mm = d.getMonth() + 1;
		var d = d.getDate();

		return (mm > 9 ? mm : "0" + mm) + "-" + (d > 9 ? d : "0" + d);
	},
	addTimeSpan: function (date, y, mm, d, h, m, s) {
		/// <summary>对指定的日期进行偏移</summary>
		return new Date(date.getFullYear() + y, date.getMonth() + mm, date.getDate() + d, date.getHours() + h, date.getMinutes() + m, date.getSeconds() + s);
	},
	serializeForm: function (form) {
		/// <summary>序列化表单为对象</summary>
		var v = {};
		var o = form.serializeArray();
		for (var i in o) {
			if (typeof (v[o[i].name]) == 'undefined') v[o[i].name] = o[i].value;
			else v[o[i].name] += "," + o[i].value;
		}
		return v;
	},
	getSecondInfo: function (second) {
		var show_time = "";
		var hour = parseInt(second / 3600);  //时
		if (hour > 0) {
			show_time = hour + "小时";
			second = second % 3600;
		}
		var minute = parseInt(second / 60);  //分
		if (minute >= 1) {
			show_time = show_time + minute + "分";
			second = second % 60;
		} else if (hour >= 1 && second > 0) {
			show_time = show_time + "0分";
		}
		if (second > 0) {
			show_time = show_time + second + "秒";
		}

		return show_time;
	},
	post: function (url, data, dataType, succCallback, errorCallback) {
		$.ajax({
			url: url,
			data: data,
			timeout: 30000,
			type: "POST",
			success: succCallback,
			error: errorCallback,
			dataType: dataType
		});
	}
}

function beginExecute() {
	/// <summary>开始执行脚本</summary>
	entryPoint();
}

function safeInvoke(callback) {
	/// <summary>沙箱模式下的回调</summary>

	//因为Chrome不支持require引入脚本包的功能，为避免需要将整个jQuery加载进来，这里使用非安全模式进行执行
	if (isChrome) unsafeInvoke(callback);
	else callback();
}


function unsafeInvoke(callback) {
	/// <summary>非沙箱模式下的回调</summary>
	var cb = document.createElement("script");
	cb.type = "text/javascript";
	cb.textContent = buildCallback(callback);
	document.head.appendChild(cb);
}

function buildCallback(callback) {
	var content = "";
	if (!utility_emabed) {
		content += "if(typeof(window.utility)!='undefined'){ alert('警告! 检测到您似乎同时运行了两个12306购票脚本! 请转到『附加组件管理『（Firefox）或『扩展管理』（Chrome）中卸载老版本的助手！');}; \r\nwindow.utility=" + buildObjectJavascriptCode(utility) + ";\r\n";
		utility_emabed = true;
	}
	content += "window.__cb=" + buildObjectJavascriptCode(callback) + ";\r\n\
	if(typeof(jQuery)!='undefined')window.__cb();\r\n\
	else{\
		var script=document.createElement('script');\r\nscript.src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';\r\n\
		script.type='text/javascript';\r\n\
		script.addEventListener('load', window.__cb);\r\n\
		document.head.appendChild(script);\r\n\
	}";

	return content;
}

function buildObjectJavascriptCode(object) {
	/// <summary>将指定的Javascript对象编译为脚本</summary>
	if (!object) return null;

	var t = typeof (object);
	if (t == "string") {
		return "\"" + object.replace(/(\r|\n|\\)/gi, function (a, b) {
			switch (b) {
				case "\r":
					return "\\r";
				case "\n":
					return "\\n";
				case "\\":
					return "\\\\";
			}
		}) + "\"";
	}
	if (t != "object") return object + "";

	var code = [];
	for (var i in object) {
		var obj = object[i];
		var objType = typeof (obj);

		if ((objType == "object" || objType == "string") && obj) {
			code.push(i + ":" + buildObjectJavascriptCode(obj));
		} else {
			code.push(i + ":" + obj);
		}
	}

	return "{" + code.join(",") + "}";
}

var isChrome = navigator.userAgent.indexOf("AppleWebKit") != -1;
var isFirefox = navigator.userAgent.indexOf("Firefox") != -1;

if (location.host == "dynamic.12306.cn") {
	if (!isChrome && !isFirefox) {
		alert("很抱歉，未能识别您的浏览器，或您的浏览器尚不支持脚本运行，请使用Firefox或Chrome浏览器！\n如果您运行的是Maxthon3，请确认当前页面运行在高速模式而不是兼容模式下 :-)");
	} else if (isFirefox && typeof (GM_notification) == 'undefined') {
		alert("很抱歉，本脚本需要最新的Scriptish扩展，请安装它！");
		window.open("https://addons.mozilla.org/zh-CN/firefox/addon/scriptish/");
	} else {
		initUIDisplay();
		beginExecute();
	}
}

//#endregion

//#region -----------------入口----------------------

function entryPoint() {
	//版本兼容检测
	var currentVersion = window.localStorage["helperVersion"] || "";
	if (!currentVersion || currentVersion < version) {
		window.localStorage.setItem("helperVersion", version);

		alert("！！！！【警告】！！！！\n\n12306订票助手是【免费】软件并且只接受【捐助】，尚没有授权任何人在淘宝或任何渠道出售！\n请点击页面最底部的【捐助作者】来支持作者，而不要通过任何第三方渠道购买！\n\n如果您已经购买此软件，请立刻对申请退款并向作者以及淘宝投诉！！\n\n12036订票助手感谢您的支持，唯一的官方网站是 http://www.fishlee.net/ ，请不要相信官网上没有注明的任何第三方的交易！\n\n"
			+ "您正在使用的版本是 " + version + "，更新如下：\n=================================\n" + updates);

	}



	var location = window.location;
	var path = location.pathname;

	if ((path == loginUrl && location.search == "?method=init") || path == "/otsweb/login.jsp") {
		//登录页
		safeInvoke(initLogin);
		checkUpdate();
	} else if (path == queryActionUrl) {
		unsafeInvoke(initTicketQuery);
	} else if (path == "/otsweb/order/myOrderAction.do" && location.search.indexOf("method=resign") != -1) {
		unsafeInvoke(initTicketQuery);
	} else if (path == confirmOrderUrl || path == "/otsweb/order/confirmPassengerResignAction.do") {
		unsafeInvoke(initAutoCommitOrder);
		safeInvoke(autoCommitOrderInSandbox);
	} else if (path == "/otsweb/main.jsp" || path == "/otsweb/") {
		//主框架
		console.log("正在注入主框架脚本。");

		//跨页面弹窗提示，防止因为页面跳转导致对话框不关闭
		console.log("启动跨页面信息调用检查函数");
		console.log(window.setInterval(function () {
			var msg = window.localStorage["notify"];
			if (typeof (msg != 'undefined') && msg) {
				console.log("主窗口拦截提示请求: " + msg);
				window.localStorage.removeItem("notify");
				utility.notify(msg);
			}
		}, 100));

		safeInvoke(injectMainPageFunction);
	}
}

//#endregion

//#region -----------------主框架----------------------

function injectMainPageFunction() {
	if (utility.getPref("warning_noAutomaticSkipVerifyCode") != "1") {
		alert("提醒：现在系统已禁止验证码自动跳过，所以当出现验证码错误时，系统将会自动刷新验证码并自动定位到验证码输入框中，请输入验证码，输入满" +
			"四位的时候系统将会自动重新提交。\n\n脚本当前无法实现OCR识别，非常抱歉。\n\n您将无法使用多浏览器同步提交。\n\n这个提示仅会出现一次。");
		utility.setPref("warning_noAutomaticSkipVerifyCode", "1");
	}
	//资源
	var main = $("#main")[0];
	main.onload = function () {
		var location = null;
		try {
			location = main.contentWindow.location + '';
		} catch (e) {
			//出错了，跨站
		}
		if (!location || location == "http://www.12306.cn/mormhweb/logFiles/error.html") {
			resubmitForm();
		}
	}

	if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
		alert("请启用通告，不然提交会变慢！");
	}

	var resubmitForm = function () {
		var form = $("#orderForm");
		if (form.length == 0) return;

		utility.notify("页面出错了！正在重新预定！");
		form.submit();
	}
}

//#endregion

//#region -----------------自动提交----------------------
function initAutoCommitOrder() {
	var count = 0;
	var breakFlag = 0;
	var randCode = "";
	var submitFlag = false;
	var tourFlag;

	//#region 如果系统出错，那么重新提交

	if ($(".error_text").length > 0 && parent.$("#orderForm").length > 0) {
		utility.notifyOnTop("页面出错了！正在重新预定！");
		setTimeout(function () {
			parent.$("#orderForm").submit();
		}, 1000);

		return;
	}

	//#endregion

	//获得tourflag
	(function () {
		/'(dc|fc|wc|gc)'/.exec($("div.tj_btn :button:eq(2)")[0].onclick + '');
		tourFlag = RegExp.$1;
	})();

	function stop(msg) {
		setCurOperationInfo(false, "错误 - " + msg);
		setTipMessage(msg);
		$("div.tj_btn button, div.tj_btn input").each(function () {
			this.disabled = false;
			$(this).removeClass().addClass("long_button_u");
		});
		$("#btnCancelAuto").hide();
	}

	var reloadCode = function () {
		$("#img_rrand_code").click();
		$("#rand")[0].select();
	};

	var getSleepTime = function () {
		return 1000 * Math.max(parseInt($("#pauseTime").val()), 1);
	};

	function submitForm() {
		if (!window.submit_form_check || !submit_form_check("confirmPassenger")) {
			setCurOperationInfo(false, "您的表单没有填写完整!");
			stop("请填写完整表单");
			return;
		}

		count++;
		setCurOperationInfo(true, "第 " + count + " 次提交");
		if (breakFlag) {
			stop("已取消自动提交");
			breakFlag = 0;
			return;
		}
		$("#btnCancelAuto").show().removeClass().addClass("long_button_u_down")[0].disabled = false; //阻止被禁用
		breakFlag = 0;

		jQuery.ajax({
			url: '/otsweb/order/confirmPassengerAction.do?method=confirmSingleForQueueOrder',
			data: $('#confirmPassenger').serialize(),
			type: "POST",
			timeout: 30000,
			dataType: 'json',
			success: function (msg) {
				console.log(msg);

				var errmsg = msg.errMsg;
				if (errmsg != 'Y') {
					if (errmsg.indexOf("包含未付款订单") != -1) {
						alert("您有未支付订单! 等啥呢, 赶紧点确定支付去.");
						window.location.replace("/otsweb/order/myOrderAction.do?method=queryMyOrderNotComplete&leftmenu=Y");
						return;
					}
					if (errmsg.indexOf("重复提交") != -1) {
						console.log("TOKEN失效，刷新Token中....");
						reloadToken();
						return;
					}

					setCurOperationInfo(false, errmsg);
					stop(errmsg);
					reloadCode();
				} else {
					waitingForQueueComplete();
				}
			},
			error: function (msg) {
				setCurOperationInfo(false, "当前请求发生错误");
				submitForm();
			}
		});
	}

	function reloadToken() {
		setCurOperationInfo(true, "正在刷新TOKEN....");
		utility.post("/otsweb/order/confirmPassengerAction.do?method=init", null, "text", function (text) {
			if (!/TOKEN"\s*value="([a-f\d]+)"/i.test(text)) {
				setCurOperationInfo(false, "无法获得TOKEN，正在重试");
				utility.delayInvoke("#countEle", reloadToken, 1000);
			} else {
				var token = RegExp.$1;
				setCurOperationInfo(false, "已获得TOKEN - " + token);
				console.log("已刷新TOKEN=" + token);
				$("input[name=org.apache.struts.taglib.html.TOKEN]").val(token);
				submitForm();
			}
		}, function () { utility.delayInvoke("#countEle", reloadToken, 1000); });
	}

	function waitingForQueueComplete() {
		setCurOperationInfo(true, "订单提交成功, 正在等待队列完成操作....");
		$.ajax({
			url: '/otsweb/order/myOrderAction.do?method=getOrderWaitTime&tourFlag=' + tourFlag + '&' + Math.random(),
			data: {},
			type: 'GET',
			timeout: 30000,
			dataType: 'json',
			success: function (json) {
				console.log(json);

				if (json.waitTime == -1 || json.waitTime == 0) {
					utility.notify("订票成功!");
					if (json.orderId)
						window.location.replace("/otsweb/order/confirmPassengerAction.do?method=payOrder&orderSequence_no=" + json.orderId);
					else window.location.replace('/otsweb/order/myOrderAction.do?method=queryMyOrderNotComplete&leftmenu=Y');
				} else if (json.waitTime == -3) {
					var msg = "很抱歉, 铁道部无齿地撤销了您的订单, 赶紧重新下!";
					utility.notify(msg);
					setCurOperationInfo(false, msg);
					stop(msg);
					reloadCode();
				} else if (json.waitTime == -2) {
					var msg = "很抱歉, 铁道部说您占座失败 : " + json.msg + ', 赶紧重新来过!';
					utility.notify(msg);
					setCurOperationInfo(false, msg);
					stop(msg);
					reloadCode();
				}
					//else if (json.waitTime == -4) {
					//	var msg = "正在处理中，请稍等";
					//	setTipMessage(msg);
					//	utility.notify(msg);
					//	utility.delayInvoke("#countEle", waitingForQueueComplete, 1000);
					//}
				else if (json.waitTime < 0) {
					var msg = '很抱歉, 未知的状态信息 : waitTime=' + json.waitTime + ', 可能已成功，请验证未支付订单.';
					setTipMessage(msg);
					utility.notifyOnTop(msg);
					//utility.delayInvoke("#countEle", waitingForQueueComplete, 1000);
					window.location.replace('/otsweb/order/myOrderAction.do?method=queryMyOrderNotComplete&leftmenu=Y');
				} else {
					var msg = "订单提交成功, 但是大约需要 " + utility.getSecondInfo(json.waitTime) + " 处理完成, 请稍等.";
					setTipMessage(msg);
					utility.notify(msg);
					utility.delayInvoke("#countEle", waitingForQueueComplete, 1000);
				}
			},
			error: function (json) {
				setTipMessage("当前请求出现错误, 正在等待重试...");
				utility.delayInvoke("#countEle", waitingForQueueComplete, getSleepTime());
			}
		});
	}


	$("div.tj_btn").append("<button class='long_button_u_down' type='button' id='btnAutoSubmit'>自动提交</button> <button class='long_button_u_down' type='button' id='btnCancelAuto' style='display:none;'>取消自动</button>");
	$("#btnAutoSubmit").click(function () {
		count = 0;
		breakFlag = 0;
		submitFlag = true;
		submitForm();
	});
	$("#btnCancelAuto").click(function () {
		$(this).hide();
		breakFlag = 1;
		submitFlag = false;
	});
	$("#rand").keyup(function (e) {
		if (!submitFlag && !document.getElementById("autoStartCommit").checked) return;

		if (e.charCode == 13 || $("#rand").val().length == 4) submitForm();
	});

	//清除上次保存的预定信息
	if (parent) {
		parent.$("#orderForm").remove();
	}

	//进度提示框
	$("table.table_qr tr:last").before("<tr><td style='border-top:1px dotted #ccc;' colspan='9'><ul id='tipScript'>" +
	"<li class='fish_clock' id='countEle' style='font-weight:bold;'>等待操作</li>" +
	"<li style='color:green;'><strong>操作信息</strong>：<span>休息中</span></li>" +
	"<li style='color:green;'><strong>最后操作时间</strong>：<span>--</span></li></ul></td></tr>");

	var tip = $("#tipScript li");
	var count = 1;
	var errorCount = 0;

	//以下是函数
	function setCurOperationInfo(running, msg) {
		var ele = $("#countEle");
		ele.removeClass().addClass(running ? "fish_running" : "fish_clock").html(msg || (running ? "正在操作中……" : "等待中……"));
	}

	function setTipMessage(msg) {
		tip.eq(2).find("span").html(utility.getTimeInfo());
		tip.eq(1).find("span").html(msg);
	}

	//提交频率差别
	$(".table_qr tr:last").before("<tr><td colspan='9'>自动提交失败时休息时间：<input type='text' size='4' class='input_20txt' style='text-align:center;' value='3' id='pauseTime' />秒 (不得低于1)  <label><input type='checkbox' id='autoStartCommit' /> 输入验证码后立刻开始自动提交</label> <label><input type='checkbox' id='showHelp' /> 显示帮助</label></td></tr>");
	document.getElementById("autoStartCommit").checked = typeof (window.localStorage["disableAutoStartCommit"]) == 'undefined';
	document.getElementById("showHelp").checked = typeof (window.localStorage["disableAutoStartCommit"]) != 'undefined';
	$("#autoStartCommit").change(function () {
		if (this.checked) window.localStorage.removeItem("disableAutoStartCommit");
		else window.localStorage.setItem("disableAutoStartCommit", "1");
	});
	$("#showHelp").change(function () {
		if (this.checked) {
			window.localStorage.setItem("showHelp", "1");
			$("table.table_qr tr:eq(10)").show();
		}
		else {
			window.localStorage.removeItem("showHelp");
			$("table.table_qr tr:eq(10)").hide();
		}
	}).change();
}

function autoCommitOrderInSandbox() {
	//自动提示？
	if (window.localStorage["bookTip"]) {
		window.localStorage.removeItem("bookTip");
		if (window.Audio) {
			new window.Audio(utility.getAudioUrl()).play();
		}
		utility.notify("已经自动进入订票页面！请继续完成订单！");
	}
}

//#endregion

//#region -----------------自动刷新----------------------
function initTicketQuery() {
	//#region 兼容性检测 for Maxthon3.
	//在Maxthon3下该入口函数会神奇地在日期选择界面出现，原因未查
	if (typeof (seatTypeRelation) == 'undefined' || !seatTypeRelation) return;
	//#endregion

	//#region 参数配置和常规工具界面

	var autoRefresh = false;
	var queryCount = 0;
	var timer = null;
	var isTicketAvailable = false;
	var audio = null; //通知声音
	var timerCountDown = 0;
	var timeCount = 0;
	var autoBook = false;
	//初始化表单
	var form = $("form[name=querySingleForm] .cx_from:first");
	form.find("tr:last").after("<tr class='append_row'><td colspan='9'><label><input type='checkbox' id='keepinfo' checked='checked' />记住信息</label> <label><input checked='checked' type='checkbox' id='autoRequery' />自动重新查询</label>，查询周期(S)：<input type='text' value='6' size='4' id='refereshInterval' style='text-align:center;' />(不得小于6) " +
		"<label><input type='checkbox' checked='checked' id='chkAudioOn'>声音提示</label> <label><input type='checkbox' id='chkSeatOnly'>仅座票</label> <label><input type='checkbox' id='chkSleepOnly'>仅卧铺</label>" +
		"<input type='button' id='enableNotify' onclick='window.webkitNotifications.requestPermission();' value='请点击以启用通告' style='line-height:25px;padding:5px;' /> <span id='refreshinfo'>已刷新 0 次，最后查询：--</span> <span id='refreshtimer'></span></td></tr>" +
		"<tr class='append_row'><td colspan='9'><input type='checkbox' checked='checked' id='chkAudioLoop'>声音循环</label>" +
		"<span style='font-weight:bold;margin-left:10px;color:blue;'><label><input type='checkbox' id='chkAutoResumitOrder' checked='checked' />预定失败时自动重试</label></span>" +
		"<span style='font-weight:bold;margin-left:10px;color:blue;'><label><input type='checkbox' id='chkAutoRequery' checked='checked' />查询失败时自动重试</label></span>" +
		"<span style='font-weight:bold;margin-left:10px;color:red;'><label><input type='checkbox' id='chkFilterNonBookable' />过滤不可预订的车次</label></span>" +
		"<span style='font-weight:bold;margin-left:10px;color:red;'><label><input type='checkbox' id='chkFilterNonNeeded' />过滤不需要的席别</label></span>" +
		"<span style='font-weight:bold;margin-left:10px;color:blue;display:none;'><label><input disabled='disabled' type='checkbox' id='chkAutoPreOrder' />自动预定</label></span>" +
		"<span style='font-weight:bold;margin-left:10px;color:blue;display: none;'><label><input disabled='disabled' type='checkbox' id='chkFilterByTrain' />开启按车次过滤</label></span>" +
		"</td></tr>" +
		"<tr><td colspan='9'><input style='line-height:25px;padding:5px;' disabled='disabled' type='button' value='停止声音' id='btnStopSound' /><input style='line-height:25px;padding:5px;' disabled='disabled'  type='button' value='停止刷新' id='btnStopRefresh' /><span style='margin-left:20px;color:purple;font-weight:bold;' id='serverMsg'></span></td> </tr>"
	);

	if (!window.Audio) {
		$("#chkAudioOn, #chkAudioLoop, #btnStopSound").remove();
	} else {
		$("#btnStopSound").click(function () {
			if (audio) {
				audio.pause();
			}
			this.disabled = true;
		});
	}

	//操作控制
	$("#btnStopRefresh").click(function () { resetTimer(); });

	//#endregion

	//#region 显示座级选择UI
	var ticketType = new Array();
	$(".hdr tr:eq(2) td").each(function (i, e) {
		ticketType.push(false);
		if (i < 3) return;

		var obj = $(this);
		ticketType[i] = (window.localStorage["typefilter_" + i] || "true") == "true";

		//修改文字，避免换行
		obj.attr("otext", obj.text());
		var cap = $.trim(obj.text());
		if (cap.length > 2) {
			cap = cap.replace("座", "").replace("高级软卧", "高软");
			obj.html(cap);
		}

		//加入复选框
		var c = $("<input/>").attr("type", "checkBox").attr("checked", ticketType[i]);
		c[0].ticketTypeId = i;
		c.change(
			function () {
				ticketType[this.ticketTypeId] = this.checked;
				window.localStorage["typefilter_" + this.ticketTypeId] = this.checked;
			}).appendTo(obj);
	});

	//座级选择
	$("#chkSeatOnly").click(function () {
		if (!this.checked) return;
		$(".hdr tr:eq(2) td").each(function (i, e) {
			var obj = $(this);
			var txt = obj.attr("otext");
			obj.find("input").attr("checked", typeof (txt) != 'undefined' && txt && txt.indexOf("座") != -1).change();
		});
		$("#chkSleepOnly")[0].checked = false;
	});
	$("#chkSleepOnly").click(function () {
		if (!this.checked) return;
		$(".hdr tr:eq(2) td").each(function (i, e) {
			var obj = $(this);
			var txt = obj.attr("otext");
			obj.find("input").attr("checked", typeof (txt) != 'undefined' && txt && txt.indexOf("卧") != -1).change();
		});
		$("#chkSeatOnly")[0].checked = false;
	});
	//#endregion

	//#region 显示额外的功能区
	$("body").append("<div class='outerbox' id='helperbox'><div class='box'><div class='title'>辅助工具 [<a href='#querySingleForm'>返回订票列表</a>]</div><div class='content'>\
<table id='helpertooltable'><tr><td colspan='4'><input type='button' value='添加自定义车票时间段' id='btnDefineTimeRange' />\
<input type='button' value='清除自定义车票时间段' id='btnClearDefineTimeRange' /></td></tr>\
<tr class='fish_sep caption'><td colspan='4'>以下是车次过滤以及自动预定列表。要将车次加入下列的列表，请在上面查询的结果中，将鼠标移动到车次链接上，并点击出现的提示框中的过滤或自动预定按钮。</td></tr>\
        <tr class='fish_sep'><td><strong>车次黑名单</strong><br /><span style='color:gray;'>指定车次将会<br />被从列表中过<br />滤，不再出现</span></td><td><select id='blackList' style='width:200px;height:100px;' size='10' multiple='multiple'></select><input type='button' value='删除' class='btn_list_delete' /><input type='button' class='btn_list_clear' value='清空' /></td>\
		<td><strong>自动预定</strong><br /><span style='color:gray;'>指定车次可用<br />时，将会自动<br />进入预定页面</td><td><select id='autoBookList' size='10' style='width:200px;height:100px;' multiple='multiple'></select><input type='button' class='btn_list_delete' value='删除' /><input type='button' class='btn_list_clear' value='清空' /></td></tr>\
<tr class='fish_sep'><td colspan='4'><label><input type='checkbox' id='autoBookTip' checked='checked' /> 如果自动预定成功，进入预定页面后播放提示音乐并弹窗提示</label></td></tr>\
\
\
\
\
<tr class='fish_sep caption'><td colspan='4'>相关设置</td></tr>\
<tr class='fish_sep musicFunc'><td class='name'>自定义音乐地址</td><td colspan='3'><input type='text' id='txtMusicUrl' value='" + utility.getAudioUrl() + "' onfocus='this.select();' style='width:70%;' /> <input type='button' onclick='new Audio(document.getElementById(\"txtMusicUrl\").value).play();' value='测试'/><input type='button' onclick='utility.resetAudioUrl(); document.getElementById(\"txtMusicUrl\").value=utility.getAudioUrl();' value='恢复默认'/></td></tr>\
<tr class='fish_sep musicFunc'><td class='name'>可用音乐地址</td><td colspan='3'><span style='color:gray;'>* 暂时木有，如果您有好的地址，请告知作者</span></td></tr>\
<tr class='fish_sep'><td style='text-align:center;' colspan='4'>12306.CN 订票助手 by iFish(木鱼) | <a href='http://t.qq.com/ccfish/' target='_blank' style='color:blue;'>腾讯微博</a> | <a href='http://www.fishlee.net/soft/44/' style='color:blue;' target='_blank'>助手主页</a> | <a href='http://www.fishlee.net/Discussion/Index/44' target='_blank'>反馈BUG</a> | <a style='font-weight:bold;color:red;' href='http://www.fishlee.net/honor/index.html' target='_blank'>捐助作者</a></td></tr>\
		</table></div></div></div>");
	$("#stopBut").before("<div class='jmp_cd' style='text-align:center;'><input type='button' class='fish_button' id='btnFilter' value='加入黑名单' /><input type='button' class='fish_button' id='btnAutoBook' value='自动预定本车次' /></div>");
	$("#txtMusicUrl").change(function () { window.localStorage["audioUrl"] = this.value; });
	$("form[name=querySingleForm]").attr("id", "querySingleForm");
	//#endregion

	//#region 添加自定义时间段
	function addCustomTimeRange() {
		var s = parseInt(prompt("请输入自定义时间段的起始时间（请填入小时，0-23）", "0"));
		if (isNaN(s) || s <= 0 || s > 23) {
			alert("起始时间不正确 >_<"); return;
		}
		var e = parseInt(prompt("请输入自定义时间段的结束时间（请填入小时，1-24）", "24"));
		if (isNaN(e) || e <= 0 || e > 24) {
			alert("结束时间不正确 >_<"); return;
		}
		var range = (s > 9 ? "" : "0") + s + ":00--" + (e > 9 ? "" : "0") + e + ":00";
		if (confirm("您想要记住这个时间段吗？")) {
			window.localStorage["customTimeRange"] = (window.localStorage["customTimeRange"] ? window.localStorage["customTimeRange"] + "|" : "") + range;
		};
		addCustomeTimeRangeToList(range);
	}
	function addCustomeTimeRangeToList(g) {
		var obj = document.getElementById("startTime");
		obj.options[obj.options.length] = new Option(g, g);
		obj.selectedIndex = obj.options.length - 1;
	}
	if (window.localStorage["customTimeRange"]) {
		var ctrs = window.localStorage["customTimeRange"].split("|");
		$.each(ctrs, function () { addCustomeTimeRangeToList(this); });
	}
	$("#btnClearDefineTimeRange").click(function () {
		if (!confirm("确定要清除自定义的时间段吗？清除后请刷新页面。")) return;
		window.localStorage.removeItem("customTimeRange");
	});
	$("#btnDefineTimeRange").click(addCustomTimeRange);
	//#endregion

	//#region 过滤车次
	var stopHover = window.onStopHover;
	window.onStopHover = function (info) {
		$("#stopDiv").attr("info", $.trim($("#id_" + info.split('#')[0]).text()));
		stopHover.call(this, info);
		$("#onStopHover").css("overflow", "hide");
	};
	$("input.btn_list_clear").click(function () {
		if (!confirm("确定清空车次列表？")) return;

		var btn = $(this);
		var list = btn.prev().prev();
		list[0].options.length = 0;

		utility.saveList(list.attr("id"));
	});
	$("input.btn_list_delete").click(function () {
		if (!confirm("确定从列表中删除指定车次？")) return;

		var btn = $(this);
		var list = btn.prev();
		var arr = list.val();
		var dom = list[0];
		for (var i = dom.options.length - 1; i >= 0; i--) {
			if ($.inArray(dom.options[i].value, arr) != -1) {
				dom.options[i] = null;
			}
		}

		utility.saveList(list.attr("id"));
	});
	utility.loadList("blackList");
	utility.loadList("autoBookList");

	var blackListDom = document.getElementById("blackList");
	var autoBookDom = document.getElementById("autoBookList");
	$("#btnFilter").click(function () {
		//加入黑名单
		var trainNo = $("#stopDiv").attr("info").split('#')[0];
		if (!trainNo || !confirm("确定要将车次【" + trainNo + "】加入黑名单？以后的查询将不再显示此车次。")) return;

		utility.addOption(blackListDom, trainNo, trainNo);
		utility.saveList("blackList");
	});
	$("#btnAutoBook").click(function () {
		//加入自动预定列表
		var trainNo = $("#stopDiv").attr("info").split('#')[0];
		if (!trainNo || !confirm("确定要将车次【" + trainNo + "】加入自动预定列表？如果下次查询有符合要求的席别将会自动进入预定页面。")) return;

		if (utility.inOptionList(blackListDom, trainNo)) {
			alert("指定的车次在黑名单里呢……");
			return;
		}

		utility.addOption(autoBookDom, trainNo, trainNo);
		utility.saveList("autoBookList");
	});
	//清除进入指定页面后提示的标记位
	if (window.localStorage["bookTip"]) window.localStorage.removeItem("bookTip");
	//#endregion

	//#region 自动重新查询

	var clickButton = null;//点击的查询按钮
	var filterNonBookable = $("#chkFilterNonBookable")[0];	//过滤不可定车次
	var filterNonNeeded = $("#chkFilterNonNeeded")[0];	//过滤不需要车次
	var onRequery = function () { };	//当重新查询时触发
	var onNoTicket = function () { };	//当没有查到票时触发

	//是否是学生票？
	$("#submitQuery, #stu_submitQuery").click(function () {
		clickButton = $(this);
		autoRefresh = ($("#autoRequery")[0].checked);
	});
	$("#autoRequery").change(function () {
		autoRefresh = this.checked;
		if (!this.checked) return;

		resetTimer();
	});
	//刷新时间间隔
	$("#refereshInterval").change(function () { timeCount = Math.max(6, parseInt($("#refereshInterval").val())); }).change();

	//定时查询
	function resetTimer() {
		queryCount = 0;
		$("#btnStopRefresh")[0].disabled = true;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		$("#refreshtimer").html("");
	}

	function countDownTimer() {
		timerCountDown--;
		$("#refreshtimer").html(" 【" + timerCountDown + "秒后自动查询...】");

		if (timerCountDown > 0) {
			timer = setTimeout(countDownTimer, 1000);
		} else {
			onRequery();
			doQuery();
		}
	}

	function startTimer() {
		timerCountDown = timeCount + 1;
		//没有定时器的时候，开启定时器准备刷新
		$("#btnStopRefresh")[0].disabled = false;
		countDownTimer();
	}

	function displayQueryInfo() {
		queryCount++;
		$("#refreshinfo").html("已刷新 " + queryCount + " 次，最后查询：" + utility.getTimeInfo());
		$("#refreshtimer").html("正在查询");
	}

	function doQuery() {
		timer = null;
		if (audio) audio.pause();
		displayQueryInfo();
		clickButton.click();
	}

	//验证车票有开始
	var onticketAvailable = function () {
		resetTimer();
		$("#refreshinfo").html("已经有票鸟！");

		utility.notifyOnTop("可以订票了！");
		if (window.Audio && $("#chkAudioOn")[0].checked) {
			if (!audio) {
				audio = new Audio($("#txtMusicUrl").val());
			}
			audio.loop = $("#chkAudioLoop")[0].checked;
			$("#btnStopSound")[0].disabled = false;
			audio.play();
		}
	}
	//检查是否可以订票
	function getTrainNo(row) {
		return $.trim($("td:eq(0)", row).text());
	}
	var checkTickets = function (row) {
		var trainNo = getTrainNo(row);
		//过滤
		if (utility.inOptionList(blackListDom, trainNo)) {
			row.hide();
			return 0;
		}


		var hasTicket = 1;
		if ($("input.yuding_x", row).length > 0) return 0;

		$("td", row).each(function (i, e) {
			if (!ticketType[i - 1]) return 0;

			var el = $(e);
			var info = $.trim(el.text()); //Firefox不支持 innerText

			if (info != "--" && info != "无") {
				hasTicket = 2;
				el.css("background-color", "#95AFFD");
			}
		});

		return hasTicket;
	}

	//目标表格
	$("body").ajaxComplete(function (e, r, s) {
		if (s.url.indexOf("queryLeftTicket") == -1)
			return;

		//验证有票
		var rows = $("table.obj tr:gt(0)");
		var ticketValid = false;
		var validRows = {};
		rows.each(function () {
			var row = $(this);
			var valid = checkTickets(row);

			if (valid == 2) {
				var code = getTrainNo(row);
				row.css("background-color", "#FD855C");
				validRows[code] = row;
			}
			else {
				if (valid == 1 && filterNonNeeded.checked) row.hide();
				if (valid == 0 && filterNonBookable.checked) row.hide();
			}
			ticketValid = ticketValid || valid == 2;
		});

		//自动预定
		if (document.getElementById("autoBookTip").checked) {
			$("#autoBookList option").each(function () {
				if (typeof (validRows[this.value]) != 'undefined') {
					window.localStorage["bookTip"] = 1;
					validRows[this.value].find(".yuding_u, .yuding_u_over").click();
					return false;
				}
				return true;
			});
		}


		if (ticketValid) {
			onticketAvailable();
		} else if (autoRefresh) {
			onNoTicket();
			startTimer();
		}
	});

	//系统繁忙时自动重复查询 chkAutoResumitOrder
	$("#orderForm").submit(function () {
		if ($("#chkAutoResumitOrder")[0].checked) {
			parent.$("#orderForm").remove();
			parent.$("body").append($("#orderForm").clone(false).attr("target", "main"));
		}
	});
	$("body").ajaxComplete(function (e, r, s) {
		if (!$("#chkAutoRequery")[0].checked) return;
		if (s.url.indexOf("/otsweb/order/querySingleAction.do") != -1 && r.responseText == "-1") {
			//invalidQueryButton();
			//delayButton();
			//startTimer();
		} else {
			$("#serverMsg").html("");
		}
	});
	$("body").ajaxError(function (e, r, s) {
		if (!$("#chkAutoRequery")[0].checked) return;
		if (s.url.indexOf("/otsweb/order/querySingleAction.do") != -1) {
			delayButton();
			startTimer();
		}
	});

	//Hack掉原来的系统函数。丫居然把所有的click事件全部处理了，鄙视
	window.invalidQueryButton = function () {
		var queryButton = $("#submitQuery");
		queryButton.unbind("click", sendQueryFunc);
		if (queryButton.attr("class") == "research_u") {
			renameButton("research_x");
		} else if (queryButton.attr("class") == "search_u") {
			renameButton("search_x");
		}
	}
	//#endregion

	//#region 配置加载、保存、权限检测
	//通知权限
	if (!window.webkitNotifications || window.webkitNotifications.checkPermission() == 0) {
		$("#enableNotify").remove();
	}

	//保存信息
	function saveStateInfo() {
		if (!$("#keepinfo")[0].checked || $("#fromStationText")[0].disabled) return;
		utility.setPref("_from_station_text", $("#fromStationText").val());
		utility.setPref("_from_station_telecode", $("#fromStation").val());
		utility.setPref("_to_station_text", $("#toStationText").val());
		utility.setPref("_to_station_telecode", $("#toStation").val());
		utility.setPref("_depart_date", $("#startdatepicker").val());
		utility.setPref("_depart_time", $("#startTime").val());
	}

	$("#submitQuery, #stu_submitQuery").click(saveStateInfo);
	//回填信息
	if (!$("#fromStationText")[0].disabled) {
		var FROM_STATION_TEXT = utility.getPref('_from_station_text');  // 出发站名称
		var FROM_STATION_TELECODE = utility.getPref('_from_station_telecode');  // 出发站电报码
		var TO_STATION_TEXT = utility.getPref('_to_station_text');  // 到达站名称
		var TO_STATION_TELECODE = utility.getPref('_to_station_telecode');  // 到达站电报码
		var DEPART_DATE = utility.getPref('_depart_date');  // 出发日期
		var DEPART_TIME = utility.getPref('_depart_time'); // 出发时间

		if (FROM_STATION_TEXT) {
			$("#fromStationText").val(FROM_STATION_TEXT);
			$("#fromStation").val(FROM_STATION_TELECODE);
			$("#toStationText").val(TO_STATION_TEXT);
			$("#toStation").val(TO_STATION_TELECODE);
			$("#startdatepicker").val(DEPART_DATE);
			$("#startTime").val(DEPART_TIME);
		}
	}

	//音乐
	if (!window.Audio) {
		$(".musicFunc").hide();
	}
	utility.reloadPrefs($("tr.append_row"), "ticket_query");
	//#endregion

	//---3.2中新增的功能---

	//#region 时间快捷修改
	(function () {
		var datebox = $("table.cx_from tr:eq(0) td:eq(5), table.cx_from tr:eq(1) td:eq(3)");
		datebox.width("170px");
		datebox.find("input").width("70px").before('<input type="button" class="date_prev lineButton" value="&lt;">').after('<input type="button" class="date_next lineButton" value="&gt;">');

		datebox.find(".date_prev").click(function () { var dobj = $(this).next(); dobj.val(utility.formatDate(utility.addTimeSpan(utility.parseDate(dobj.val()), 0, 0, -1, 0, 0, 0))).change(); });
		datebox.find(".date_next").click(function () { var dobj = $(this).prev(); dobj.val(utility.formatDate(utility.addTimeSpan(utility.parseDate(dobj.val()), 0, 0, 1, 0, 0, 0))).change(); });
	})();
	//#endregion

	//自动轮询，自动更改时间
	(function () {	//初始化UI
		var html = "<tr class='fish_sep' id='autoChangeDateRow'><td class='name'>查询日期</td><td>\
<label><input type='checkbox' id='autoCorrentDate' checked='checked' /> 查询日期早于或等于今天时，自动修改为明天</label>\
</td><td class='name'>自动轮查</td><td><label><input type='checkbox' id='autoChangeDate' /> 无票时自动更改日期轮查</label>\
</td></tr><tr class='fish_sep' style='display:none;'><td class='name'>轮查日期设置</td><td colspan='3' id='autoChangeDateList'></td></tr>\
	";
		$("#helpertooltable tr:last").before(html);
		var autoChangeDateList = $("#autoChangeDateList");
		var html = [];
		var now = new Date();
		for (var i = 0; i < 20; i++) {
			now = utility.addTimeSpan(now, 0, 0, 1, 0, 0, 0);
			html.push("<label style='margin-right:16px;'><input type='checkbox' value='" + utility.formatDate(now) + "' cindex='" + i + "' />" + utility.formatDateShort(now) + "</label>");
			if ((i + 1) % 10 == 0) html.push("<br />");
		}
		autoChangeDateList.html(html.join(""));
		$("#autoChangeDate").change(function () {
			var tr = $(this).closest("tr").next();
			if (this.checked) tr.show();
			else tr.hide();
		});
		//配置
		utility.reloadPrefs($("#autoChangeDateRow"), "autoChangeDateRow");
		//日期点选
		var stKey = "autoChangeDateRow_dates";
		var stValue = window.localStorage.getItem(stKey);
		if (typeof (stValue) != 'undefined' && stValue) {
			var array = stValue.split('|');
			autoChangeDateList.find(":checkbox").each(function () {
				this.checked = $.inArray(this.value, array) != -1;
			});
		}
		autoChangeDateList.find(":checkbox").change(function () {
			var value = $.map(autoChangeDateList.find(":checkbox:checked"), function (e, i) { return e.value; }).join("|")
			window.localStorage.setItem(stKey, value);
		});
	})();
	(function () {
		//如果当前查询日期在当前日期或之前，那么自动修改日期
		$("#startdatepicker, #roundTrainDate").change(function () {
			if (!document.getElementById("autoCorrentDate").checked) return;
			var obj = $(this);
			var val = utility.parseDate(obj.val());
			var tomorrow = utility.addTimeSpan(utility.getDate(new Date()), 0, 0, 1, 0, 0, 0);

			if (!val || isNaN(val.getFullYear()) || tomorrow > val) {
				console.log("自动修改日期为 " + utility.formatDate(tomorrow));
				obj.val(utility.formatDate(tomorrow));
			}
		}).change();
	})();
	onNoTicket = (function (callback) {
		return function () {
			//Hook onNoTicket
			callback();

			if (!document.getElementById("autoChangeDate").checked) return;
			console.log("自动轮询日期中。");

			var index = parseInt($("#autoChangeDate").attr("cindex"));
			if (isNaN(index)) index = -1;
			var current = index == -1 ? [] : $("#autoChangeDateList :checkbox:eq(" + index + ")").parent().nextAll(":has(:checked):eq(0)").find("input");
			if (current.length == 0) {
				index = 0;
				current = $("#autoChangeDateList :checkbox:checked:first");
				if (current.length == 0) return;	//没有选择任何
			}
			index = current.attr("cindex");
			if (current.length > 0) {
				$("#autoChangeDate").attr("cindex", index);
				$("#startdatepicker").val(current.val());
				//高亮
				$("#cx_titleleft span").css({ color: 'red', 'font-weight': 'bold' });
			}
		};
	}
		)(onNoTicket);

	//拦截弹出的提示框，比如服务器忙
	(function () {
		var _bakAlert = window.alert;
		window.alert = function (msg) {
			if (msg.indexOf("服务器忙") != -1) {
				$("#serverMsg").text(msg);
			} else _bakAlert(msg);
		}
	})();
	//默认加入拦截Ajax缓存
	(function () { $.ajaxSetup({ cache: false }); })();



}

//#endregion

//#region -----------------自动登录----------------------

function initLogin() {
	//如果已经登录，则自动跳转
	utility.unsafeCallback(function () {
		if (parent && parent.$) {
			var str = parent.$("#username_ a").attr("href");
			if (str && str.indexOf("sysuser/user_info") != -1) {
				window.location.href = "https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=init";
			}
			return;
		}
	});

	//检测主框架是否是顶级窗口
	var isTop = false;
	try {
		isTop = (top.location + '').indexOf("dynamic.12306.cn") != -1;
	} catch (e) {

	}
	if (!isTop) {
		$("#loginForm table tr:first td:last").append("<a href='https://dynamic.12306.cn/otsweb/' target='_blank' style='font-weight:bold;color:red;'>强烈建议全屏订票！</a>");
	}



	//Hack当前UI显示
	$(".enter_right").empty().append("<div class='enter_enw'>" +
		"<div class='enter_rtitle' style='padding: 40px 0px 10px 0px; font-size: 20px;'>脚本提示信息</div>" +
		"<div class='enter_rfont'>" +
		"<ul id='tipScript'>" +
		"<li class='fish_clock' id='countEle' style='font-weight:bold;'>等待操作</li>" +
		"<li style='color:green;'><strong>操作信息</strong>：<span>休息中</span></li>" +
		"<li style='color:green;'><strong>最后操作时间</strong>：<span>--</span></li>" +
		"<li><a href='http://t.qq.com/ccfish/' target='_blank' style='color:blue;'>腾讯微博</a> | <a href='http://www.fishlee.net/soft/44/' style='color:blue;' target='_blank'>助手主页</a> | <a href='http://www.fishlee.net/Discussion/Index/44' target='_blank'>反馈BUG</a> | <a style='font-weight:bold;color:red;' href='http://www.fishlee.net/honor/index.html' target='_blank'>捐助作者</a></li>" +
		"<li id='updateFound' style='display:none;'><a style='font-weight:bold; color:red;' href='http://www.fishlee.net/Service/Download.ashx/44/47/12306_ticket_helper.user.js'>发现新版本！点此更新</a></li>" +
		'<li id="enableNotification"><input type="button" id="enableNotify" onclick="$(this).parent().hide();window.webkitNotifications.requestPermission();" value="请点击以启用通告" style="line-height:25px;padding:5px;" /></li><li style="padding-top:10px;line-height:normal;color:gray;">请输入用户名和密码，<strong style="color: red;">最后输入验证码</strong>，输入完成后系统将自动帮你提交。登录过程中，请勿离开当前页面。如果系统繁忙，系统会自动重新刷新验证码并自动定位到验证码输入框中，请直接输入验证码，输入完成后助手将自动帮你提交。</li>' +
		"</ul>" +
		"</div>" +
		"</div>");

	//插入登录标记
	var form = $("#loginForm");
	var trs = form.find("tr");
	trs.eq(1).find("td:last").html('<label><input type="checkbox" id="keepInfo" /> 记录密码</label>');

	if (!window.webkitNotifications || window.webkitNotifications.checkPermission() == 0) {
		$("#enableNotification").remove();
	}

	var tip = $("#tipScript li");
	var count = 1;
	var errorCount = 0;

	//以下是函数
	function setCurOperationInfo(running, msg) {
		var ele = $("#countEle");
		ele.removeClass().addClass(running ? "fish_running" : "fish_clock").html(msg || (running ? "正在操作中……" : "等待中……"));
	}

	function setTipMessage(msg) {
		tip.eq(2).find("span").html(utility.getTimeInfo());
		tip.eq(1).find("span").html(msg);
	}

	function getLoginRandCode() {
		setCurOperationInfo(true, "正在获得登录随机码");

		$.ajax({
			url: "/otsweb/loginAction.do?method=loginAysnSuggest",
			method: "POST",
			dataType: "json",
			cache: false,
			success: function (json, code, jqXhr) {
				//{"loginRand":"211","randError":"Y"}
				if (json.randError != 'Y') {
					setTipMessage("错误：" + json.randError);
					utility.delayInvoke("#countEle", getLoginRandCode, 500);
				} else {
					setTipMessage("登录随机码 -&gt; " + json.loginRand);
					$("#loginRand").val(json.loginRand);
					submitForm();
				}
			},
			error: function () {
				errorCount++;
				setTipMessage("[" + errorCount + "] 网络请求错误，重试")
				utility.delayInvoke("#countEle", getLoginRandCode, 500);
			}
		});
	}

	function submitForm() {
		var data = {};
		$.each($("#loginForm").serializeArray(), function () {
			if (this.name == "refundFlag" && !document.getElementById("refundFlag").checked) return;
			data[this.name] = this.value;
		});
		if (!data["loginUser.user_name"] || !data["user.password"] || !data.randCode || data.randCode.length != 4)
			return;

		if ($("#keepInfo")[0].checked) {
			utility.setPref("__un", data["loginUser.user_name"]);
			utility.setPref("__up", data["user.password"])
		}
		setCurOperationInfo(true, "正在登录中……");
		$.ajax({
			type: "POST",
			url: "/otsweb/loginAction.do?method=login",
			data: data,
			timeout: 30000,
			dataType: "text",
			success: function (html) {
				msg = utility.getErrorMsg(html);

				if (html.indexOf('请输入正确的验证码') > -1) {
					setTipMessage("验证码不正确");
					setCurOperationInfo(false, "请重新输入验证码。");
					stopLogin();
				} else if (msg.indexOf('密码') > -1) {
					setTipMessage(msg);
					setCurOperationInfo(false, "请重新输入。");
					stopLogin();
				} else if (msg.indexOf('锁定') > -1) {
					setTipMessage(msg);
					setCurOperationInfo(false, "请重新输入。");
					stopLogin();
				} else if (html.indexOf("欢迎您！") != -1) {
					utility.notifyOnTop('登录成功，开始查询车票吧！');
					window.location.href = "https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=init";
				} else {
					setTipMessage(msg);
					relogin();
				}
			},
			error: function (msg) {
				utility.delayInvoke("#countEle", relogin, 1000);
				errorCount++;
				setTipMessage("[" + errorCount + "] 网络请求错误，重试")
			}
		});
	}


	function relogin() {
		count++;
		getLoginRandCode();
	}

	function stopLogin() {
		//等待重试时，刷新验证码
		$("#img_rrand_code").click();
		$("#randCode").val("")[0].select();
	}

	//初始化
	function executeLogin() {
		count = 1;
		utility.notify("自动登录中：(1) 次登录中...");
		setTipMessage("开始登录中....");
		getLoginRandCode();

		return false;
	}

	var kun = utility.getPref("__un");
	var kup = utility.getPref("__up");
	if (kun && kup) {
		$("#UserName").val(kun);
		$("#password").val(kup);
		$("#randCode")[0].focus();
	}
	$("#randCode").keyup(function (e) {
		e = e || event;
		if (e.charCode == 13 || $("#randCode").val().length == 4) relogin();
	});
}

//#endregion

//#region 检查更新

function checkUpdate() {
	//谷歌的依然有跨站问题。所以用传统的方法，委屈Firefox下Scriptish的新特性了。。
	var updateScriptVersion = document.createElement("script");
	updateScriptVersion.type = "text/javascript";
	updateScriptVersion.textContent = "var version='" + version + "'; " + compareVersion + "; (" + updateScriptContentForChrome + ")();";
	document.head.appendChild(updateScriptVersion);
}

function updateScriptContentForChrome() {
	var updateScipt = document.createElement('script');
	updateScipt.src = 'https://github.com/iccfish/12306_ticket_helper/raw/master/version.js?' + Math.random();
	updateScipt.type = 'text/javascript';
	updateScipt.addEventListener('load', function () {
		if (compareVersion(version, version_12306_helper) < 0) {
			if (typeof (external.mxCall) != 'undefined') {
				$("#updateFound a").attr("href", "http://www.fishlee.net/soft/44/#C-192").attr("target", "_blank");
			}
			$("#updateFound").show();
			alert('助手脚本已经发布了最新版 ' + version_12306_helper + '，请在登录页面上点击更新链接更新 :-)');
		}
	});
	document.head.appendChild(updateScipt);
}

function compareVersion(v1, v2) {
	var vv1 = v1.split('.');
	var vv2 = v2.split('.');

	var length = Math.min(vv1.length, vv2.length);
	for (var i = 0; i < length; i++) {
		var s1 = parseInt(vv1[i]);
		var s2 = parseInt(vv2[i]);

		if (s1 < s2) return -1;
		if (s1 > s2) return 1;
	}

	return vv1.length > vv2.length ? 1 : vv1.length < vv2.length ? -1 : 0;
}

//#endregion