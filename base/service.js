//公共方法

//操作Cookie
mysupport.service('msCookie', function() {
	this.get = function(name) {
		var arr,
			reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg)) {
			return unescape(arr[2]);
		} else {
			return null;
		}
	};
	this.set = function(name, value) {
		var Days = 30,
			exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
	};
	this.delete = function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
		var cval = this.get(name);
		document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString() + ";path=/";
	};
});

//操作SessionStorage
mysupport.service('msSessionStorage', function() {
	this.get = function(name) {
		return sessionStorage.getItem(name);
	};
	this.set = function(name, value) {
		sessionStorage.setItem(name, value);
	};
	this.delete = function(name) {
		sessionStorage.removeItem(name);
	};
	this.clear = function() {
		sessionStorage.clear();
	};
});

//操作LocalStorage
mysupport.service('msLocalStorage', function() {
	this.get = function(name) {
		return localStorage.getItem(name);
	};
	this.set = function(name, value) {
		localStorage.setItem(name, value);
	};
	this.delete = function(name) {
		localStorage.removeItem(name);
	};
	this.clear = function() {
		localStorage.clear();
	};
});

//copy
mysupport.service('msCopy', function() {
	this.array = function(arr) {
		return arr.concat();
	};
	this.object = function(obj) {
		return JSON.parse(JSON.stringify(obj));
	};
	this.objarr = function(arr) {
		var newArr = [];
		for (var i = 0; i < arr.length; i++) {
			newArr.push(this.object(arr[i]));
		}
		return newArr;
	}
});

//弹出框
mysupport.service('msPop', function($compile) {
	this.confirm = function($scope, option) {
		var directive = '<ms-pop';
		directive += ' pop-title="' + option.title + '"';
		directive += ' pop-content="' + option.content + '"';
		if (option.fn) {
			directive += ' confirm-flag="true"';
			directive += ' confirm-fn="' + option.fn + '"';
		}
		directive += '></ms-pop>';
		angular.element('body').css('overflow', 'hidden');
		angular.element('[ng-controller=index]').append($compile(directive)($scope));
		return;
	};
	this.hint = function($scope, option) {
		var directive = '<ms-pop';
		directive += ' pop-title="' + option.title + '"';
		directive += ' pop-content="' + option.content + '"';
		directive += ' type="hint"';
		directive += '></ms-pop>';
		angular.element('body').css('overflow', 'hidden');
		angular.element('[ng-controller=index]').append($compile(directive)($scope));
		return;
	};
});