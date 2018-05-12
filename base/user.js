//用户信息处理
mysupport.factory("msUser", [ 'msLang', function(msLang) {
	var factory = {};
	factory.getUser = function(name) {
		if (!MS.user) {
			return null;
		}
		return MS.user[name];
	};
	factory.getMenuNameAndUrl = function() {
		if (!MS.menus) {
			return [];
		}
		var menus = [{
			name: msLang.get("common.header.home"),
			url: "#/home"
		}];
		for (var i = 0; i < MS.menus.length; i++) {
			var menu = {};
			menu.name = MS.menus[i].resourceName;
			menu.id = MS.menus[i].resourceId;
			menu.url = MS.menus[i].resourceUrl;
			if (menu.url.indexOf('#') != -1) {
				menu.url = menu.url.substring(menu.url.indexOf('#'));
			}
			menus.push(menu);
		}
		return menus;
	};
	factory.getFunctionUrlList = function() {
		if (!MS.functions) {
			return [];
		}
		var functionUrlList = [];
		for (var i = 0; i < MS.functions.length; i++) {
			functionUrlList.push(MS.functions[i]['resourceUrl']);
		}
		return functionUrlList;
	};
	factory.hasKpi = function() {
		var functionUrlList = this.getFunctionUrlList();
		if ($.inArray('/kpi/queryLoginTimes', functionUrlList) != -1 && $.inArray('/kpi/query', functionUrlList) != -1) {
			return true;
		}
		return false;
	};
	factory.getLeftNameAndUrl = function(resourceId) {
		if (!MS.menus) {
			return [];
		}
		var menus = [];
		for (var i = 0; i < MS.menus.length; i++) {
			if (MS.menus[i].resourceId == resourceId) {
				for (var j = 0; j < MS.menus[i].childList.length; j++) {
					var menu = {};
					menu.name = MS.menus[i].childList[j].resourceName
					menu.url = MS.menus[i].childList[j].resourceUrl;
					menu.id = MS.menus[i].childList[j].appId;
					if (menu.url.indexOf('#') != -1) {
						menu.url = menu.url.substring(menu.url.indexOf('#'));
					}
					var id = MS.menus[i].childList[j].resourceId;
					var ids = id.split('.');
					menu.rsid = ids[ids.length - 1];
					menus.push(menu);
				}
			}
		}
		return menus;
	};
	factory.getMenuGroupByApp = function(resourceId) {
		if (!MS.apps || !MS.menus) {
			return [];
		}
		var all = this.getLeftNameAndUrl(resourceId);
		var menus = [];
		for (var i = 0; i < MS.apps.length; i++) {
			var menu = {};
			menu.id = MS.apps[i].appId;
			menu.title = MS.apps[i].appName;
			menu.subMenu = [];
			for (var j = 0; j < all.length; j++) {
				if (all[j].id == menu.id) {
					all[j].url = MS.apps[i].rootUrl + all[j].url;
					menu.subMenu.push(all[j]);
				}
			}
			if (menu.subMenu.length) {
				menus.push(menu);
			}
		}
		return menus;
	};
	return factory;
}]);