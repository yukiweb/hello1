var mysupport = angular.module("mysupport");
mysupport.controller("roleList", ['$scope', '$http', 'msPop', 'msLang', function($scope, $http, msPop, msLang) {
	$scope.role = {
		value: ''
	};
	$scope.page = {
		total: 0,
		pageNum: 1,
		pageSize: 8,
		pageSizeArray: [8, 16, 32, 64, 128]
	};
	$scope.list = [];
	$scope.query = function(init) {
		if (init) {
			$scope.page.pageNum = 1;
		}
		$scope.search = $.trim($scope.role.value);
		$http({
			url: 'mysupport/role/list?pageNum=' + $scope.page.pageNum + '&pageSize=' + $scope.page.pageSize + ($scope.search ? '&roleName=' + $scope.search : ''),
			method: 'GET'
		}).then(function(resp) {
			$scope.list = resp.data.data;
			$scope.page.total = resp.data.total;
			$scope.page.pages = resp.data.pages;
		});
	};
	$scope.query(1);
	$scope.del = function(roleId) {
		var option = {
			title: msLang.get("role.delete.hint"),
			content: msLang.get("role.delete.hint.role"),
			fn: 'deleteRole(\'' + roleId + '\')'
		}
		msPop.confirm($scope, option);
	};
	$scope.deleteRole = function(roleId) {
		$http({
			url: 'mysupport/role/delete',
			method: 'POST',
			data: {
				roleId: roleId
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			transformRequest: function(obj) {
				var str = [];
				for (var s in obj) {
					str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
				}
				return str.join("&");
			}
		}).then(function(resp) {
			$scope.role.value = '';
			$scope.query(1);
		});
	};
	$scope.init = function() {
		$scope.draw();
	};
	$scope.$on('resize', function() {
		$scope.draw();
	});
	$scope.draw = function() {
		var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
		$('[ui-view=right]').css('max-height', mainHeight - 15);
	};
}]);
mysupport.controller("roleAdd", ['$scope', '$http', '$state', '$timeout', 'msCopy', 'msPop', 'msLang', function($scope, $http, $state, $timeout, msCopy, msPop, msLang) {
	//页面初始显示成员列表
	$scope.showUser = true;
	//初始化msPage指令翻页参数
	$scope.page = {
		total: 0,
		pageNum: 1,
		pageSize: 12,
		pageSizeArray: [12, 24, 48, 96, 192],
	};
	//渲染一页
	$scope.query = function() {
		$scope.userSelectAll = false;
		$scope.page.total = $scope.users.length;
		var user = $scope.users.slice(($scope.page.pageNum - 1) * $scope.page.pageSize, $scope.page.pageNum * $scope.page.pageSize).concat();
		$scope.user = [];
		for (var i = 0; i < user.length; i++) {
			$scope.user.push(JSON.parse(JSON.stringify(user[i])));
		}
		$scope.page.pages = Math.ceil($scope.page.total / $scope.page.pageSize);
	};
	//初始渲染一页
	$scope.members = [];
	$scope.users = [];
	$scope.query();
	//点击全选框
	$scope.chooseAll = function() {
		if ($scope.userSelectAll) {
			$scope.userSelectAll = false;
			if (typeof($scope.user) != 'undefined') {
				for (var i = 0; i < $scope.user.length; i++) {
					$scope.user[i].active = false;
				}
			}
		} else {
			$scope.userSelectAll = true;
			if (typeof($scope.user) != 'undefined') {
				for (var i = 0; i < $scope.user.length; i++) {
					$scope.user[i].active = true;
				}
			}
		}
	};
	//点击单选框
	$scope.chooseOne = function(id) {
		var all = true;
		for (var i = 0; i < $scope.user.length; i++) {
			if ($scope.user[i].userId == id) {
				$scope.user[i].active = !$scope.user[i].active;
			}
			if (!$scope.user[i].active) {
				all = false;
			}
		}
		$scope.userSelectAll = all;
	};
	//点击查询按钮
	$scope.queryUser = function() {
		$scope.users = [];
		for (var i = 0; i < $scope.members.length; i++) {
			if ($scope.members[i].account.toLowerCase().indexOf($scope.userName.value.toLowerCase()) != -1) {
				$scope.users.push(msCopy.object($scope.members[i]));
			} else if ($scope.members[i].name.toLowerCase().indexOf($scope.userName.value.toLowerCase()) != -1) {
				$scope.users.push(msCopy.object($scope.members[i]));
			}
		}
		$scope.page.pageNum = 1;
		$scope.query();
	};
	//打开新增成员弹框
	$scope.openAddUser = function() {
		$scope.userText = '';
		$scope.userError = undefined;
		$scope.showAddUserList = false;
		$('.role-modal').show();
		$('.role-user-select-area').show();
		$('body').css('overflow', 'hidden');
		$('#addUser').focus();
	};
	//关闭新增成员弹框
	$scope.closeAddUser = function() {
		$('.role-modal').hide();
		$('.role-user-select-area').hide();
		$('body').css('overflow', 'visible');
	};
	//初始化请求状态
	$scope.complete = true;
	$scope.valid = false;
	//新增成员弹框keyup事件（没有其他请求时，2s内不继续输入or回车触发查询）
	$scope.keyup = function($event) {
		if ($event.keyCode == 13) {
			$event.returnValue = false;
			$($event.target).val($($event.target).val().replace(/[\r\n]/g, ''));
			$timeout.cancel($scope.timer);
			if ($scope.complete) {
				$scope.getUser($event);
			}
		} else {
			var count = $($event.target).val().split(";");
			if (count.length > 50) {
				count.splice(50);
				$($event.target).val(count.join(";"));
			}
			if (!$scope.complete) {
				return;
			}
			if (!$scope.timer) {
				$scope.timer = $timeout(function() {
					$scope.getUser($event);
				}, 2000);
			} else {
				$timeout.cancel($scope.timer);
				$scope.timer = $timeout(function() {
					$scope.getUser($event);
				}, 2000);
			}
		}
	};
	//新增成员弹框输入值查询
	$scope.getUser = function($event) {
		var search = $($event.target).val();
		if (!$.trim(search)) {
			return;
		}
		var searchArr = search.split(';');
		for (var i = searchArr.length - 1; i >= 0; i--) {
			if ($.trim(searchArr[i])) {
				searchArr[i] = $.trim(searchArr[i]);
			} else {
				searchArr.splice(i, 1);
			}
		}
		$scope.searchArr = searchArr;
		$scope.showAddUserList = false;
		$scope.userError = false;
		$scope.tempUser = [];
		for (var i = 0; i < searchArr.length; i++) {
			if (i == searchArr.length - 1) {
				(function(i) {
					$scope.getUserInfo(searchArr[i], function(data) {
						if (data.length == 1) {
							$scope.tempUser[i] = data[0];
						} else if (data.length > 1) {
							$scope.showAddUserList = true;
							$scope.userList = data;
							$scope.tempUser[i] = 'select';
						} else {
							$scope.tempUser[i] = {};
						}
					});
				})(i);
			} else {
				(function(i) {
					$scope.getUserInfo(searchArr[i], function(data) {
						if (data.length == 1) {
							$scope.tempUser[i] = data[0];
						} else {
							$scope.tempUser[i] = {};
						}
					});
				})(i);
			}
		}
	};
	//新增成员弹框/user/queryUser接口执行用户联想
	$scope.getUserInfo = function(search, fn) {
		$http({
			url: 'mysupport/user/queryUser?account=' + search,
			method: 'GET'
		}).then(function(resp) {
			fn(resp.data);
		});
	};
	//新增成员弹框下拉框选择
	$scope.choose = function(data) {
		$scope.tempUser[$scope.searchArr.length - 1] = data;
		$scope.showAddUserList = false;
	};
	//新增成员弹框监听请求是否完成，同步替换输入框中的值
	$scope.$watch('tempUser', function(n, o) {
		if (!n) {
			return;
		}
		var complete = true;
		var valid = true;
		for (var i = 0; i < $scope.searchArr.length; i++) {
			if (!n[i]) {
				complete = false;
				valid = false;
			} else if (n[i] == "select") {
				valid = false;
			} else if (JSON.stringify(n[i]) != "{}") {
				$scope.searchArr[i] = n[i].account;
			} else if (JSON.stringify(n[i]) == "{}" && i != $scope.searchArr.length - 1) {
				$scope.searchArr[i] = "";
			} else {
				$scope.userError = true;
			}
		}
		var text = "";
		for (var i = 0; i < $scope.searchArr.length; i++) {
			if (i == $scope.searchArr.length - 1 && (!n[i] || n[i] == 'select' || $scope.userError)) {
				text += $scope.searchArr[i];
			} else if ($scope.searchArr[i]) {
				text += $scope.searchArr[i] + "; ";
			}
		}
		$scope.userText = text;
		$scope.complete = complete;
		$scope.valid = valid;
	}, true);
	//新增成员弹框点击确定
	$scope.inputUser = function() {
		if (typeof($scope.userError) == 'undefined' || $scope.userError || !$scope.valid) {
			return;
		}
		var ids = [];
		for (var i = 0; i < $scope.members.length; i++) {
			ids.push($scope.members[i].userId);
		}
		for (var i = 0; i < $scope.tempUser.length; i++) {
			if ($scope.tempUser[i].userId && ids.indexOf($scope.tempUser[i].userId) == -1) {
				$scope.members.push($scope.tempUser[i]);
				ids.push($scope.tempUser[i].userId);
			}
		}
		$scope.users = msCopy.objarr($scope.members);
		$scope.page.pageNum = 1;
		$scope.query();
		$scope.closeAddUser();
	};
	//删除or删除成员按钮
	$scope.inputUserDel = function(ids) {
		if (typeof(ids) == 'undefined') {
			var ids = [];
			for (var i = 0; i < $scope.user.length; i++) {
				if ($scope.user[i].active) {
					ids.push($scope.user[i].userId);
				}
			}
		}
		if (!ids.length) {
			var option = {
				title: msLang.get("role.delete.hint"),
				content: msLang.get("role.delete.hint.user.nodata")
			}
			msPop.hint($scope, option);
			return;
		}
		for (var i = $scope.members.length - 1; i >= 0; i--) {
			if (ids.indexOf($scope.members[i].userId) != -1) {
				$scope.members.splice(i, 1);
			}
		}
		$scope.users = msCopy.objarr($scope.members);
		$scope.query();
		if (!$scope.user.length) {
			$scope.userSelectAll = false;
		}
	};

	//初始化资源数据
	$scope.resources = [];
	$scope.reso = [];
	//初始化关联资源下拉框
	$scope.resoType = {
		value: msLang.get("role.all")
	};
	$scope.resourceType = [msLang.get("role.all"), msLang.get("role.resource.type.menu"), msLang.get("role.resource.type.page"), msLang.get("role.resource.type.function")];
	//初始化关联资源树
	$scope.resoTitle = [msLang.get("role.resource.title.type"), msLang.get("role.resource.title.id"), msLang.get("role.resource.title.name"), msLang.get("role.resource.title.app"), msLang.get("role.resource.title.operate")];
	$scope.resoList = [];
	//绘制关联资源树
	$scope.drawResoTree = function() {
		var recursion = function(reso, list) {
			for (var i = 0; i < reso.length; i++) {
				var temp = {};
				temp.data = [$scope.resourceType[reso[i].resourceType], reso[i].resourceId, reso[i].resourceName, reso[i].appId];
				if (reso[i].childList && reso[i].childList.length) {
					temp.child = recursion(reso[i].childList, []);
				}
				list.push(temp);
			}
			return list;
		};
		$scope.resoList = recursion($scope.reso, []);
	};
	//点击关联资源查询按钮
	$scope.queryReso = function() {
		var type = $scope.resourceType.indexOf($scope.resoType.value);
		var search = $.trim($scope.resoName.value);
		if (!search && !type) {
			$scope.reso = $scope.resources;
			$scope.drawResoTree();
			return;
		}
		var resoList = [];
		var recursion = function(reso) {
			for (var i = 0; i < reso.length; i++) {
				if (reso[i].childList && reso[i].childList.length) {
					recursion(reso[i].childList);
				}
				if ((!type || reso[i].resourceType == type) && (reso[i].resourceName.toLowerCase().indexOf(search.toLowerCase()) != -1 || reso[i].resourceId.toLowerCase().indexOf(search.toLowerCase()) != -1)) {
					var temp = msCopy.object(reso[i]);
					temp.childList = null;
					resoList.push(temp);
				}
			}
		};
		recursion($scope.resources);
		$scope.reso = resoList;
		$scope.drawResoTree();
	};
	//打开新增关联资源弹框
	$scope.openAddReso = function() {
		$scope.pop.resoType.value = msLang.get("role.all");
		$scope.pop.resoName.value = '';
		$scope.pop.appId.value = msLang.get("role.all");
		$scope.queryPopReso();
		$('.role-modal').show();
		$('.role-reso-select-area').show();
		$('body').css('overflow', 'hidden');
		$('#addUser').focus();
	};
	//关闭新增关联资源弹框
	$scope.closeAddReso = function() {
		$('.role-modal').hide();
		$('.role-reso-select-area').hide();
		$('body').css('overflow', 'visible');
	};
	//初始化新增关联资源弹框输入框
	$scope.pop = {
		resoType: {
			value: msLang.get("role.all")
		},
		resoName: {
			value: ''
		},
		appId: {
			value: msLang.get("role.all")
		},
		resoTitle: [msLang.get("role.resource.title.type"), msLang.get("role.resource.title.id"), msLang.get("role.resource.title.name"), msLang.get("role.resource.title.app")],
		resoList: []
	};
	$scope.appId = [msLang.get("role.all")];
	//点击新增关联资源弹框查询按钮
	$scope.queryPopReso = function(first) {
		if (first) {
			$http({
				url: 'mysupport/resource/tree',
				method: 'GET'
			}).then(function(resp) {
				$scope.pop.origin = msCopy.objarr(resp.data);
				$scope.removeDuplicate();
				var recursion = function(reso, list) {
					for (var i = 0; i < reso.length; i++) {
						var temp = {};
						temp.data = [$scope.resourceType[reso[i].resourceType], reso[i].resourceId, reso[i].resourceName, reso[i].appId];
						if (reso[i].childList && reso[i].childList.length) {
							temp.child = recursion(reso[i].childList, []);
						}
						list.push(temp);
					}
					return list;
				};
				$scope.pop.resoList = recursion($scope.pop.reso, []);
			});
		} else {
			var type = $scope.resourceType.indexOf($scope.pop.resoType.value);
			var search = $.trim($scope.pop.resoName.value);
			var app = $scope.pop.appId.value;
			if (!search && !type && app == $scope.appId[0]) {
				$scope.pop.reso = $scope.pop.resources;
				var recursion = function(reso, list) {
					for (var i = 0; i < reso.length; i++) {
						var temp = {};
						temp.data = [$scope.resourceType[reso[i].resourceType], reso[i].resourceId, reso[i].resourceName, reso[i].appId];
						if (reso[i].childList && reso[i].childList.length) {
							temp.child = recursion(reso[i].childList, []);
						}
						list.push(temp);
					}
					return list;
				};
				$scope.pop.resoList = recursion($scope.pop.reso, []);
				return;
			}
			var resoList = [];
			var recursion = function(reso) {
				for (var i = 0; i < reso.length; i++) {
					if (reso[i].childList && reso[i].childList.length) {
						recursion(reso[i].childList);
					}
					if ((!type || reso[i].resourceType == type) && (reso[i].resourceName.toLowerCase().indexOf(search.toLowerCase()) != -1 || reso[i].resourceId.toLowerCase().indexOf(search.toLowerCase()) != -1) && (app == $scope.appId[0] || reso[i].appId == app)) {
						var temp = msCopy.object(reso[i]);
						temp.childList = null;
						resoList.push(temp);
					}
				}
			};
			recursion($scope.pop.resources);
			$scope.pop.reso = resoList;
			var recursion = function(reso, list) {
				for (var i = 0; i < reso.length; i++) {
					var temp = {};
					temp.data = [$scope.resourceType[reso[i].resourceType], reso[i].resourceId, reso[i].resourceName, reso[i].appId];
					if (reso[i].childList && reso[i].childList.length) {
						temp.child = recursion(reso[i].childList, []);
					}
					list.push(temp);
				}
				return list;
			};
			$scope.pop.resoList = recursion($scope.pop.reso, []);
		}
	};
	$scope.queryPopReso(true);
	//去重
	$scope.removeDuplicate = function() {
		var ids = [];
		var recursionReso = function(reso) {
			for (var i = 0; i < reso.length; i++) {
				ids.push(reso[i].resourceId);
				if (reso[i].childList && reso[i].childList.length) {
					recursionReso(reso[i].childList);
				}
			}
		};
		if ($scope.resources) {
			recursionReso($scope.resources);
		}
		var recursionResp = function(reso) {
			for (var i = reso.length - 1; i >= 0; i--) {
				if (reso[i].childList && reso[i].childList.length) {
					recursionResp(reso[i].childList);
				}
				if (ids.indexOf(reso[i].resourceId) != -1 && (!reso[i].childList || !reso[i].childList.length)) {
					reso.splice(i, 1);
				}
			}
		};
		$scope.pop.resources = msCopy.objarr($scope.pop.origin);
		recursionResp($scope.pop.resources);
		$scope.appId = [msLang.get("role.all")];
		var recursionApp = function(reso) {
			for (var i = 0; i < reso.length; i++) {
				if ($scope.appId.indexOf(reso[i].appId) == -1) {
					$scope.appId.push(reso[i].appId);
				}
				if (reso[i].childList && reso[i].childList.length) {
					recursionApp(reso[i].childList);
				}
			}
		};
		recursionApp($scope.pop.resources);
		$scope.pop.reso = msCopy.objarr($scope.pop.resources);
	};
	//点击新增关联资源弹框确定按钮
	$scope.inputReso = function() {
		var recursion = function(reso) {
			var tempArr = [];
			for (var i = 0; i < reso.length; i++) {
				if (reso[i].selected) {
					var temp = {
						appId: reso[i].data[3],
						resourceId: reso[i].data[1],
						resourceName: reso[i].data[2],
						resourceType: $scope.resourceType.indexOf(reso[i].data[0])
					};
					if (reso[i].child && reso[i].child.length) {
						var child = recursion(reso[i].child);
						if (child.length) {
							temp.childList = child;
						}
					}
					tempArr.push(temp);
				} else {
					if (reso[i].child && reso[i].child.length) {
						var child = recursion(reso[i].child);
						if (child.length) {
							tempArr = tempArr.concat(child);
						}
					}
				}
			}
			return tempArr;
		};
		$scope.resources = $scope.resources.concat(recursion($scope.pop.resoList));
		$scope.removeDuplicate();
		$scope.resoType.value = msLang.get("role.all");
		$scope.resoName.value = '';
		$scope.queryReso();
		$scope.closeAddReso();
	};
	$scope.deleteRelation = function(ids) {
		if (typeof(ids) == 'undefined') {
			var ids = [];
			var recursion = function(reso) {
				for (var i = 0; i < reso.length; i++) {
					if (reso[i].selected) {
						ids.push(reso[i].data[1]);
					}
					if (reso[i].child && reso[i].child.length) {
						recursion(reso[i].child);
					}
				}
			};
			recursion($scope.resoList);
		}
		if (!ids.length) {
			var option = {
				title: msLang.get("role.delete.hint"),
				content: msLang.get("role.delete.hint.reso.nodata")
			}
			msPop.hint($scope, option);
			return;
		}
		var resource = [];
		var recursion = function(reso) {
			for (var i = reso.length - 1; i >= 0; i--) {
				if (reso[i].childList && reso[i].childList.length) {
					recursion(reso[i].childList);
				}
				if (ids.indexOf(reso[i].resourceId) != -1) {
					if (reso[i].childList && reso[i].childList.length) {
						resource = resource.concat(reso[i].childList);
					}
					reso.splice(i, 1);
				}
			}
		};
		recursion($scope.resources);
		$scope.resources = $scope.resources.concat(resource);
		$scope.reso = $scope.resources;
		$scope.drawResoTree();
		$scope.removeDuplicate();
	};

	//点击提交新增角色数据--begin
	$scope.addRole = function() {
		$scope.form.roleName.check = true;
		$scope.form.roleDesc.check = true;
		var data = {
			roleName: $scope.form.roleName.value,
			roleDesc: $scope.form.roleDesc.value
		};
		if ($scope.members.length) {
			data.userIds = [];
			for (var i = 0; i < $scope.members.length; i++) {
				data.userIds.push($scope.members[i].userId);
			}
		}
		if ($scope.resources.length) {
			data.resourceIds = [];
			var recursionReso = function(reso) {
				for (var i = 0; i < reso.length; i++) {
					data.resourceIds.push(reso[i].resourceId);
					if (reso[i].childList && reso[i].childList.length) {
						recursionReso(reso[i].childList);
					}
				}
			};
			recursionReso($scope.resources);
		}
		if ($scope.form.roleName.isValid && $scope.form.roleDesc.isValid) {
			$http({
				url: 'mysupport/role/create',
				method: 'POST',
				data: data,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				transformRequest: function(obj) {
					var str = [];
					for (var s in obj) {
						str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
					}
					return str.join("&");
				}
			}).then(function(resp) {
				if (resp.data.errorCode) {
					var option = {
						title: msLang.get("role.delete.hint"),
						content: resp.data.message
					}
					msPop.hint($scope, option);
					return;
				}
				$state.go('index.setting.successrole', {
					roleId: resp.data.roleId
				});
			});
		}
	};
	//点击提交新增角色数据--end

	//页面渲染--begin
	$scope.init = function() {
		$scope.draw();
	};
	$scope.$on('resize', function() {
		$scope.draw();
	});
	$scope.draw = function() {
		var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
		$('[ui-view=right]').css('max-height', mainHeight - 15);
	};
	//页面渲染--end
}]);
mysupport.controller("roleView", ['$scope', '$http', '$state', '$stateParams', 'msCopy', 'msLang', function($scope, $http, $state, $stateParams, msCopy, msLang) {
	//roleId从地址栏参数获取
	$scope.roleId = {
		value: $stateParams.roleId
	};
	//页面初始根据roleId查询角色数据--begin
	$scope.queryRole = function() {
		$http({
			url: 'mysupport/role/byId?roleId=' + $stateParams.roleId,
			method: 'GET'
		}).then(function(resp) {
			$scope.origin = msCopy.object(resp.data);
			$scope.form.roleName.value = resp.data.roleName;
			$scope.form.roleName.isValid = true;
			$scope.form.roleDesc.value = resp.data.roleDesc;
			$scope.form.roleDesc.isValid = true;
			$scope.members = msCopy.objarr(resp.data.members);
			$scope.users = msCopy.objarr($scope.members);
			$scope.query();
			$scope.resources = msCopy.objarr(resp.data.resources);
			$scope.reso = msCopy.objarr($scope.resources);
			$scope.drawResoTree();
		});
	};
	$scope.queryRole();
	//页面初始根据roleId查询角色数据--end

	//编辑按钮
	$scope.modify = function() {
		$state.go('index.setting.modifyrole', {
			roleId: $stateParams.roleId
		});
	};

	//页面初始显示成员列表
	$scope.showUser = true;
	//初始化msPage指令翻页参数
	$scope.page = {
		total: 0,
		pageNum: 1,
		pageSize: 12,
		pageSizeArray: [12, 24, 48, 96, 192],
	};
	//渲染一页
	$scope.query = function() {
		$scope.userSelectAll = false;
		$scope.page.total = $scope.users.length;
		var user = $scope.users.slice(($scope.page.pageNum - 1) * $scope.page.pageSize, $scope.page.pageNum * $scope.page.pageSize).concat();
		$scope.user = [];
		for (var i = 0; i < user.length; i++) {
			$scope.user.push(JSON.parse(JSON.stringify(user[i])));
		}
		$scope.page.pages = Math.ceil($scope.page.total / $scope.page.pageSize);
	};
	//点击查询按钮
	$scope.queryUser = function() {
		$scope.users = [];
		for (var i = 0; i < $scope.members.length; i++) {
			if ($scope.members[i].account.toLowerCase().indexOf($scope.userName.value.toLowerCase()) != -1) {
				$scope.users.push(msCopy.object($scope.members[i]));
			} else if ($scope.members[i].name.toLowerCase().indexOf($scope.userName.value.toLowerCase()) != -1) {
				$scope.users.push(msCopy.object($scope.members[i]));
			}
		}
		$scope.page.pageNum = 1;
		$scope.query();
	};

	//初始化资源关系下拉框
	$scope.resoType = {
		value: msLang.get("role.all")
	};
	$scope.resourceType = [msLang.get("role.all"), msLang.get("role.resource.type.menu"), msLang.get("role.resource.type.page"), msLang.get("role.resource.type.function")];
	//初始化资源关系树
	$scope.resoTitle = [msLang.get("role.resource.title.type"), msLang.get("role.resource.title.id"), msLang.get("role.resource.title.name"), msLang.get("role.resource.title.app")];
	$scope.resoList = [];
	//绘制资源关系树
	$scope.drawResoTree = function() {
		var recursion = function(reso, list) {
			for (var i = 0; i < reso.length; i++) {
				var temp = {};
				temp.data = [$scope.resourceType[reso[i].resourceType], reso[i].resourceId, reso[i].resourceName, reso[i].appId];
				if (reso[i].childList && reso[i].childList.length) {
					temp.child = recursion(reso[i].childList, []);
				}
				list.push(temp);
			}
			return list;
		};
		$scope.resoList = recursion($scope.reso, []);
	};
	//点击资源关系查询按钮
	$scope.queryReso = function() {
		var type = $scope.resourceType.indexOf($scope.resoType.value);
		var search = $.trim($scope.resoName.value);
		if (!search && !type) {
			$scope.reso = $scope.resources;
			$scope.drawResoTree();
			return;
		}
		var resoList = [];
		var recursion = function(reso) {
			for (var i = 0; i < reso.length; i++) {
				if (reso[i].childList && reso[i].childList.length) {
					recursion(reso[i].childList);
				}
				if ((!type || reso[i].resourceType == type) && (reso[i].resourceName.toLowerCase().indexOf(search.toLowerCase()) != -1 || reso[i].resourceId.toLowerCase().indexOf(search.toLowerCase()) != -1)) {
					var temp = msCopy.object(reso[i]);
					temp.childList = null;
					resoList.push(temp);
				}
			}
		};
		recursion($scope.resources);
		$scope.reso = resoList;
		$scope.drawResoTree();
	};

	//页面渲染--begin
	$scope.init = function() {
		$scope.draw();
	};
	$scope.$on('resize', function() {
		$scope.draw();
	});
	$scope.draw = function() {
		var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
		$('[ui-view=right]').css('max-height', mainHeight - 15);
	};
	//页面渲染--end
}]);
mysupport.controller("roleModify", ['$scope', '$http', '$state', '$stateParams', '$timeout', 'msCopy', 'msPop', 'msLang', function($scope, $http, $state, $stateParams, $timeout, msCopy, msPop, msLang) {
	//roleId从地址栏参数获取
	$scope.roleId = {
		value: $stateParams.roleId
	};
	//页面初始根据roleId查询角色数据--begin
	$scope.queryRole = function() {
		$http({
			url: 'mysupport/role/byId?roleId=' + $stateParams.roleId,
			method: 'GET'
		}).then(function(resp) {
			$scope.origin = msCopy.object(resp.data);
			$scope.form.roleName.value = resp.data.roleName;
			$scope.form.roleName.isValid = true;
			$scope.form.roleDesc.value = resp.data.roleDesc;
			$scope.form.roleDesc.isValid = true;
			$scope.members = msCopy.objarr(resp.data.members);
			$scope.users = msCopy.objarr($scope.members);
			$scope.query();
			$scope.resources = msCopy.objarr(resp.data.resources);
			$scope.reso = msCopy.objarr($scope.resources);
			$scope.drawResoTree();
		});
	};
	$scope.queryRole();
	//页面初始根据roleId查询角色数据--end

	//页面初始显示成员列表
	$scope.showUser = true;
	//初始化msPage指令翻页参数
	$scope.page = {
		total: 0,
		pageNum: 1,
		pageSize: 12,
		pageSizeArray: [12, 24, 48, 96, 192],
	};
	//渲染一页
	$scope.query = function() {
		$scope.userSelectAll = false;
		$scope.page.total = $scope.users.length;
		var user = $scope.users.slice(($scope.page.pageNum - 1) * $scope.page.pageSize, $scope.page.pageNum * $scope.page.pageSize).concat();
		$scope.user = [];
		for (var i = 0; i < user.length; i++) {
			$scope.user.push(JSON.parse(JSON.stringify(user[i])));
		}
		$scope.page.pages = Math.ceil($scope.page.total / $scope.page.pageSize);
	};
	//点击全选框
	$scope.chooseAll = function() {
		if ($scope.userSelectAll) {
			$scope.userSelectAll = false;
			if (typeof($scope.user) != 'undefined') {
				for (var i = 0; i < $scope.user.length; i++) {
					$scope.user[i].active = false;
				}
			}
		} else {
			$scope.userSelectAll = true;
			if (typeof($scope.user) != 'undefined') {
				for (var i = 0; i < $scope.user.length; i++) {
					$scope.user[i].active = true;
				}
			}
		}
	};
	//点击单选框
	$scope.chooseOne = function(id) {
		var all = true;
		for (var i = 0; i < $scope.user.length; i++) {
			if ($scope.user[i].userId == id) {
				$scope.user[i].active = !$scope.user[i].active;
			}
			if (!$scope.user[i].active) {
				all = false;
			}
		}
		$scope.userSelectAll = all;
	};
	//点击查询按钮
	$scope.queryUser = function() {
		$scope.users = [];
		for (var i = 0; i < $scope.members.length; i++) {
			if ($scope.members[i].account.toLowerCase().indexOf($scope.userName.value.toLowerCase()) != -1) {
				$scope.users.push(msCopy.object($scope.members[i]));
			} else if ($scope.members[i].name.toLowerCase().indexOf($scope.userName.value.toLowerCase()) != -1) {
				$scope.users.push(msCopy.object($scope.members[i]));
			}
		}
		$scope.page.pageNum = 1;
		$scope.query();
	};
	//打开新增成员弹框
	$scope.openAddUser = function() {
		$scope.userText = '';
		$scope.userError = undefined;
		$scope.showAddUserList = false;
		$('.role-modal').show();
		$('.role-user-select-area').show();
		$('body').css('overflow', 'hidden');
		$('#addUser').focus();
	};
	//关闭新增成员弹框
	$scope.closeAddUser = function() {
		$('.role-modal').hide();
		$('.role-user-select-area').hide();
		$('body').css('overflow', 'visible');
	};
	//初始化请求状态
	$scope.complete = true;
	$scope.valid = false;
	//新增成员弹框keyup事件（没有其他请求时，2s内不继续输入or回车触发查询）
	$scope.keyup = function($event) {
		if ($event.keyCode == 13) {
			$event.returnValue = false;
			$($event.target).val($($event.target).val().replace(/[\r\n]/g, ''));
			$timeout.cancel($scope.timer);
			if ($scope.complete) {
				$scope.getUser($event);
			}
		} else {
			var count = $($event.target).val().split(";");
			if (count.length > 50) {
				count.splice(50);
				$($event.target).val(count.join(";"));
			}
			if (!$scope.complete) {
				return;
			}
			if (!$scope.timer) {
				$scope.timer = $timeout(function() {
					$scope.getUser($event);
				}, 2000);
			} else {
				$timeout.cancel($scope.timer);
				$scope.timer = $timeout(function() {
					$scope.getUser($event);
				}, 2000);
			}
		}
	};
	//新增成员弹框输入值查询
	$scope.getUser = function($event) {
		var search = $($event.target).val();
		if (!$.trim(search)) {
			return;
		}
		var searchArr = search.split(';');
		for (var i = searchArr.length - 1; i >= 0; i--) {
			if ($.trim(searchArr[i])) {
				searchArr[i] = $.trim(searchArr[i]);
			} else {
				searchArr.splice(i, 1);
			}
		}
		$scope.searchArr = searchArr;
		$scope.showAddUserList = false;
		$scope.userError = false;
		$scope.tempUser = [];
		for (var i = 0; i < searchArr.length; i++) {
			if (i == searchArr.length - 1) {
				(function(i) {
					$scope.getUserInfo(searchArr[i], function(data) {
						if (data.length == 1) {
							$scope.tempUser[i] = data[0];
						} else if (data.length > 1) {
							$scope.showAddUserList = true;
							$scope.userList = data;
							$scope.tempUser[i] = 'select';
						} else {
							$scope.tempUser[i] = {};
						}
					});
				})(i);
			} else {
				(function(i) {
					$scope.getUserInfo(searchArr[i], function(data) {
						if (data.length == 1) {
							$scope.tempUser[i] = data[0];
						} else {
							$scope.tempUser[i] = {};
						}
					});
				})(i);
			}
		}
	};
	//新增成员弹框/user/queryUser接口执行用户联想
	$scope.getUserInfo = function(search, fn) {
		$http({
			url: 'mysupport/user/queryUser?account=' + search,
			method: 'GET'
		}).then(function(resp) {
			fn(resp.data);
		});
	};
	//新增成员弹框下拉框选择
	$scope.choose = function(data) {
		$scope.tempUser[$scope.searchArr.length - 1] = data;
		$scope.showAddUserList = false;
	};
	//新增成员弹框监听请求是否完成，同步替换输入框中的值
	$scope.$watch('tempUser', function(n, o) {
		if (!n) {
			return;
		}
		var complete = true;
		var valid = true;
		for (var i = 0; i < $scope.searchArr.length; i++) {
			if (!n[i]) {
				complete = false;
				valid = false;
			} else if (n[i] == "select") {
				valid = false;
			} else if (JSON.stringify(n[i]) != "{}") {
				$scope.searchArr[i] = n[i].account;
			} else if (JSON.stringify(n[i]) == "{}" && i != $scope.searchArr.length - 1) {
				$scope.searchArr[i] = "";
			} else {
				$scope.userError = true;
			}
		}
		var text = "";
		for (var i = 0; i < $scope.searchArr.length; i++) {
			if (i == $scope.searchArr.length - 1 && (!n[i] || n[i] == 'select' || $scope.userError)) {
				text += $scope.searchArr[i];
			} else if ($scope.searchArr[i]) {
				text += $scope.searchArr[i] + "; ";
			}
		}
		$scope.userText = text;
		$scope.complete = complete;
		$scope.valid = valid;
	}, true);
	//新增成员弹框点击确定
	$scope.inputUser = function() {
		if (typeof($scope.userError) == 'undefined' || $scope.userError || !$scope.valid) {
			return;
		}
		var ids = [];
		for (var i = 0; i < $scope.members.length; i++) {
			ids.push($scope.members[i].userId);
		}
		for (var i = 0; i < $scope.tempUser.length; i++) {
			if ($scope.tempUser[i].userId && ids.indexOf($scope.tempUser[i].userId) == -1) {
				$scope.members.push($scope.tempUser[i]);
				ids.push($scope.tempUser[i].userId);
			}
		}
		$scope.users = msCopy.objarr($scope.members);
		$scope.page.pageNum = 1;
		$scope.query();
		$scope.closeAddUser();
	};
	//删除or删除成员按钮
	$scope.inputUserDel = function(ids) {
		if (typeof(ids) == 'undefined') {
			var ids = [];
			for (var i = 0; i < $scope.user.length; i++) {
				if ($scope.user[i].active) {
					ids.push($scope.user[i].userId);
				}
			}
		}
		if (!ids.length) {
			var option = {
				title: msLang.get("role.delete.hint"),
				content: msLang.get("role.delete.hint.user.nodata")
			}
			msPop.hint($scope, option);
			return;
		}
		var str = '';
		for (var i = 0; i < ids.length; i++) {
			if (!i) {
				str += '\'' + ids[i] + '\'';
			} else {
				str += ', \'' + ids[i] + '\',';
			}
		}
		var option = {
			title: msLang.get("role.delete.hint"),
			content: msLang.get("role.delete.hint.user"),
			fn: 'deleteUser([' + str + '])'
		}
		msPop.confirm($scope, option);
	};
	//删除成员
	$scope.deleteUser = function(ids) {
		for (var i = 0; i < ids.length; i++) {
			$http({
				url: 'mysupport/role/deleteUser',
				method: 'POST',
				data: {
					roleId: $stateParams.roleId,
					userId: ids[i]
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				transformRequest: function(obj) {
					var str = [];
					for (var s in obj) {
						str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
					}
					return str.join("&");
				}
			}).then(function(resp) {});
		}
		for (var i = $scope.members.length - 1; i >= 0; i--) {
			if (ids.indexOf($scope.members[i].userId) != -1) {
				$scope.members.splice(i, 1);
			}
		}
		$scope.users = msCopy.objarr($scope.members);
		$scope.query();
		if (!$scope.user.length) {
			$scope.userSelectAll = false;
		}
	};

	//初始化资源关系下拉框
	$scope.resoType = {
		value: msLang.get("role.all")
	};
	$scope.resourceType = [msLang.get("role.all"), msLang.get("role.resource.type.menu"), msLang.get("role.resource.type.page"), msLang.get("role.resource.type.function")];
	//初始化资源关系树
	$scope.resoTitle = [msLang.get("role.resource.title.type"), msLang.get("role.resource.title.id"), msLang.get("role.resource.title.name"), msLang.get("role.resource.title.app"), msLang.get("role.resource.title.operate")];
	$scope.resoList = [];
	//绘制资源关系树
	$scope.drawResoTree = function() {
		var recursion = function(reso, list) {
			for (var i = 0; i < reso.length; i++) {
				var temp = {};
				temp.data = [$scope.resourceType[reso[i].resourceType], reso[i].resourceId, reso[i].resourceName, reso[i].appId];
				if (reso[i].childList && reso[i].childList.length) {
					temp.child = recursion(reso[i].childList, []);
				}
				list.push(temp);
			}
			return list;
		};
		$scope.resoList = recursion($scope.reso, []);
	};
	//点击资源关系查询按钮
	$scope.queryReso = function() {
		var type = $scope.resourceType.indexOf($scope.resoType.value);
		var search = $.trim($scope.resoName.value);
		if (!search && !type) {
			$scope.reso = $scope.resources;
			$scope.drawResoTree();
			return;
		}
		var resoList = [];
		var recursion = function(reso) {
			for (var i = 0; i < reso.length; i++) {
				if (reso[i].childList && reso[i].childList.length) {
					recursion(reso[i].childList);
				}
				if ((!type || reso[i].resourceType == type) && (reso[i].resourceName.toLowerCase().indexOf(search.toLowerCase()) != -1 || reso[i].resourceId.toLowerCase().indexOf(search.toLowerCase()) != -1)) {
					var temp = msCopy.object(reso[i]);
					temp.childList = null;
					resoList.push(temp);
				}
			}
		};
		recursion($scope.resources);
		$scope.reso = resoList;
		$scope.drawResoTree();
	};
	//打开新增关联资源弹框
	$scope.openAddReso = function() {
		$scope.pop.resoType.value = msLang.get("role.all");
		$scope.pop.resoName.value = '';
		$scope.pop.appId.value = msLang.get("role.all");
		$scope.queryPopReso();
		$('.role-modal').show();
		$('.role-reso-select-area').show();
		$('body').css('overflow', 'hidden');
		$('#addUser').focus();
	};
	//关闭新增关联资源弹框
	$scope.closeAddReso = function() {
		$('.role-modal').hide();
		$('.role-reso-select-area').hide();
		$('body').css('overflow', 'visible');
	};
	//初始化新增关联资源弹框输入框
	$scope.pop = {
		resoType: {
			value: msLang.get("role.all")
		},
		resoName: {
			value: ''
		},
		appId: {
			value: msLang.get("role.all")
		},
		resoTitle: [msLang.get("role.resource.title.type"), msLang.get("role.resource.title.id"), msLang.get("role.resource.title.name"), msLang.get("role.resource.title.app")],
		resoList: []
	};
	$scope.appId = [msLang.get("role.all")];
	//点击新增关联资源弹框查询按钮
	$scope.queryPopReso = function(first) {
		if (first) {
			$http({
				url: 'mysupport/resource/tree',
				method: 'GET'
			}).then(function(resp) {
				$scope.pop.origin = msCopy.objarr(resp.data);
				$scope.removeDuplicate();
				var recursion = function(reso, list) {
					for (var i = 0; i < reso.length; i++) {
						var temp = {};
						temp.data = [$scope.resourceType[reso[i].resourceType], reso[i].resourceId, reso[i].resourceName, reso[i].appId];
						if (reso[i].childList && reso[i].childList.length) {
							temp.child = recursion(reso[i].childList, []);
						}
						list.push(temp);
					}
					return list;
				};
				$scope.pop.resoList = recursion($scope.pop.reso, []);
			});
		} else {
			var type = $scope.resourceType.indexOf($scope.pop.resoType.value);
			var search = $.trim($scope.pop.resoName.value);
			var app = $scope.pop.appId.value;
			if (!search && !type && app == $scope.appId[0]) {
				$scope.pop.reso = $scope.pop.resources;
				var recursion = function(reso, list) {
					for (var i = 0; i < reso.length; i++) {
						var temp = {};
						temp.data = [$scope.resourceType[reso[i].resourceType], reso[i].resourceId, reso[i].resourceName, reso[i].appId];
						if (reso[i].childList && reso[i].childList.length) {
							temp.child = recursion(reso[i].childList, []);
						}
						list.push(temp);
					}
					return list;
				};
				$scope.pop.resoList = recursion($scope.pop.reso, []);
				return;
			}
			var resoList = [];
			var recursion = function(reso) {
				for (var i = 0; i < reso.length; i++) {
					if (reso[i].childList && reso[i].childList.length) {
						recursion(reso[i].childList);
					}
					if ((!type || reso[i].resourceType == type) && (reso[i].resourceName.toLowerCase().indexOf(search.toLowerCase()) != -1 || reso[i].resourceId.toLowerCase().indexOf(search.toLowerCase()) != -1) && (app == $scope.appId[0] || reso[i].appId == app)) {
						var temp = msCopy.object(reso[i]);
						temp.childList = null;
						resoList.push(temp);
					}
				}
			};
			recursion($scope.pop.resources);
			$scope.pop.reso = resoList;
			var recursion = function(reso, list) {
				for (var i = 0; i < reso.length; i++) {
					var temp = {};
					temp.data = [$scope.resourceType[reso[i].resourceType], reso[i].resourceId, reso[i].resourceName, reso[i].appId];
					if (reso[i].childList && reso[i].childList.length) {
						temp.child = recursion(reso[i].childList, []);
					}
					list.push(temp);
				}
				return list;
			};
			$scope.pop.resoList = recursion($scope.pop.reso, []);
		}
	};
	$scope.queryPopReso(true);
	//去重
	$scope.removeDuplicate = function() {
		var ids = [];
		var recursionReso = function(reso) {
			for (var i = 0; i < reso.length; i++) {
				ids.push(reso[i].resourceId);
				if (reso[i].childList && reso[i].childList.length) {
					recursionReso(reso[i].childList);
				}
			}
		};
		if ($scope.resources) {
			recursionReso($scope.resources);
		}
		var recursionResp = function(reso) {
			for (var i = reso.length - 1; i >= 0; i--) {
				if (reso[i].childList && reso[i].childList.length) {
					recursionResp(reso[i].childList);
				}
				if (ids.indexOf(reso[i].resourceId) != -1 && (!reso[i].childList || !reso[i].childList.length)) {
					reso.splice(i, 1);
				}
			}
		};
		$scope.pop.resources = msCopy.objarr($scope.pop.origin);
		recursionResp($scope.pop.resources);
		$scope.appId = [msLang.get("role.all")];
		var recursionApp = function(reso) {
			for (var i = 0; i < reso.length; i++) {
				if ($scope.appId.indexOf(reso[i].appId) == -1) {
					$scope.appId.push(reso[i].appId);
				}
				if (reso[i].childList && reso[i].childList.length) {
					recursionApp(reso[i].childList);
				}
			}
		};
		recursionApp($scope.pop.resources);
		$scope.pop.reso = msCopy.objarr($scope.pop.resources);
	};
	//点击新增关联资源弹框确定按钮
	$scope.inputReso = function() {
		var recursion = function(reso) {
			var tempArr = [];
			for (var i = 0; i < reso.length; i++) {
				if (reso[i].selected) {
					var temp = {
						appId: reso[i].data[3],
						resourceId: reso[i].data[1],
						resourceName: reso[i].data[2],
						resourceType: $scope.resourceType.indexOf(reso[i].data[0])
					};
					if (reso[i].child && reso[i].child.length) {
						var child = recursion(reso[i].child);
						if (child.length) {
							temp.childList = child;
						}
					}
					tempArr.push(temp);
				} else {
					if (reso[i].child && reso[i].child.length) {
						var child = recursion(reso[i].child);
						if (child.length) {
							tempArr = tempArr.concat(child);
						}
					}
				}
			}
			return tempArr;
		};
		$scope.resources = $scope.resources.concat(recursion($scope.pop.resoList));
		$scope.removeDuplicate();
		$scope.resoType.value = msLang.get("role.all");
		$scope.resoName.value = '';
		$scope.queryReso();
		$scope.closeAddReso();
	};
	//解绑or删除关联资源按钮
	$scope.deleteRelation = function(ids) {
		if (typeof(ids) == 'undefined') {
			var ids = [];
			var recursion = function(reso) {
				for (var i = 0; i < reso.length; i++) {
					if (reso[i].selected) {
						ids.push(reso[i].data[1]);
					}
					if (reso[i].child && reso[i].child.length) {
						recursion(reso[i].child);
					}
				}
			};
			recursion($scope.resoList);
		}
		if (!ids.length) {
			var option = {
				title: msLang.get("role.delete.hint"),
				content: msLang.get("role.delete.hint.reso.nodata")
			}
			msPop.hint($scope, option);
			return;
		}
		var str = '';
		for (var i = 0; i < ids.length; i++) {
			if (!i) {
				str += '\'' + ids[i] + '\'';
			} else {
				str += ', \'' + ids[i] + '\',';
			}
		}
		var option = {
			title: msLang.get("role.delete.hint"),
			content: msLang.get("role.delete.hint.reso"),
			fn: 'deleteReso([' + str + '])'
		}
		msPop.confirm($scope, option);
	};
	//删除关联资源
	$scope.deleteReso = function(ids) {
		for (var i = 0; i < ids.length; i++) {
			$http({
				url: 'mysupport/role/deleteResource',
				method: 'POST',
				data: {
					roleId: $stateParams.roleId,
					resourceId: ids[i]
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				transformRequest: function(obj) {
					var str = [];
					for (var s in obj) {
						str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
					}
					return str.join("&");
				}
			}).then(function(resp) {});
		}
		var resource = [];
		var recursion = function(reso) {
			for (var i = reso.length - 1; i >= 0; i--) {
				if (reso[i].childList && reso[i].childList.length) {
					recursion(reso[i].childList);
				}
				if (ids.indexOf(reso[i].resourceId) != -1) {
					if (reso[i].childList && reso[i].childList.length) {
						resource = resource.concat(reso[i].childList);
					}
					reso.splice(i, 1);
				}
			}
		};
		recursion($scope.resources);
		$scope.resources = $scope.resources.concat(resource);
		$scope.reso = $scope.resources;
		$scope.drawResoTree();
		$scope.removeDuplicate();
	};

	//点击保存更新角色数据--begin
	$scope.updateRole = function() {
		//必传字段roleId
		var data = {
			roleId: $stateParams.roleId
		};
		//校验roleName是否有更新
		$scope.form.roleName.check = true;
		if ($scope.form.roleName.isValid && $scope.form.roleName.value != $scope.origin.roleName) {
			data.roleName = $scope.form.roleName.value;
		}
		//校验roleDesc是否有更新
		$scope.form.roleDesc.check = true;
		if ($scope.form.roleDesc.isValid && $scope.form.roleDesc.value != $scope.origin.roleDesc) {
			data.roleDesc = $scope.form.roleDesc.value;
		}
		//校验是否有新增用户
		var oldIds = [];
		for (var i = 0; i < $scope.origin.members.length; i++) {
			oldIds.push($scope.origin.members[i].userId);
		}
		var newUser = false;
		for (var i = 0; i < $scope.members.length; i++) {
			if (oldIds.indexOf($scope.members[i].userId) == -1) {
				newUser = true;
			}
		}
		if (newUser) {
			newIds = [];
			for (var i = 0; i < $scope.members.length; i++) {
				newIds.push($scope.members[i].userId);
			}
			data.userIds = newIds;
		}
		//校验是否有新增资源
		var oldResoIds = [];
		var recursionOriginReso = function(reso) {
			for (var i = 0; i < reso.length; i++) {
				oldResoIds.push(reso[i].resourceId);
				if (reso[i].childList && reso[i].childList.length) {
					recursionOriginReso(reso[i].childList);
				}
			}
		};
		recursionOriginReso($scope.origin.resources);
		var newResoIds = [];
		var recursionNewReso = function(reso) {
			for (var i = 0; i < reso.length; i++) {
				newResoIds.push(reso[i].resourceId);
				if (reso[i].childList && reso[i].childList.length) {
					recursionNewReso(reso[i].childList);
				}
			}
		};
		recursionNewReso($scope.resources);
		var newReso = false;
		for (var i = 0; i < newResoIds.length; i++) {
			if (oldResoIds.indexOf(newResoIds.userId) == -1) {
				newReso = true;
			}
		}
		if (newReso) {
			data.resourceIds = newResoIds;
		}
		//roleDesc、用户、资源均无更新则直接返回列表页
		var arr = Object.keys(data);
		if (arr.length == 1) {
			return;
		}
		//调用/role/update接口，之后返回列表页
		$http({
			url: 'mysupport/role/update',
			method: 'POST',
			data: data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			transformRequest: function(obj) {
				var str = [];
				for (var s in obj) {
					str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
				}
				return str.join("&");
			}
		}).then(function(resp) {
			$state.go('index.setting.role');
		});
	};
	//点击保存更新角色数据--end

	//页面渲染--begin
	$scope.init = function() {
		$scope.draw();
	};
	$scope.$on('resize', function() {
		$scope.draw();
	});
	$scope.draw = function() {
		var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
		$('[ui-view=right]').css('max-height', mainHeight - 15);
	};
	//页面渲染--end
}]);
mysupport.controller("roleSuccess", ['$scope', '$http', '$state', '$stateParams', function($scope, $http, $state, $stateParams) {
	$scope.roleId = $stateParams.roleId;
	$scope.view = function() {
		$state.go('index.setting.viewrole', {
			roleId: $stateParams.roleId
		});
	};
	$scope.init = function() {
		$scope.draw();
	};
	$scope.$on('resize', function() {
		$scope.draw();
	});
	$scope.draw = function() {
		var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
		$('[ui-view=right]').css('max-height', mainHeight - 15);
	};
}]);