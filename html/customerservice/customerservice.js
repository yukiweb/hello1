var mysupport = angular.module("mysupport");
mysupport.controller("customerserviceLeft", ['$scope', '$stateParams', '$state', 'msUser', function($scope, $stateParams, $state, msUser) {
	$scope.id = 'subservice';
	$scope.menus = msUser.getMenuGroupByApp($scope.id);
	$scope.changeNav = function(event, href) {
		if (!href) {
			for (var i = 0; i < $scope.menus.length; i++) {
				for (var j = 0; j < $scope.menus[i].subMenu.length; j++) {
					$scope.menus[i].subMenu[j].active = false;
				}
			}
			return;
		}
		if (event) {
			event.preventDefault();
		}
		for (var i = 0; i < $scope.menus.length; i++) {
			for (var j = 0; j < $scope.menus[i].subMenu.length; j++) {
				if (href.indexOf($scope.menus[i].subMenu[j].url) === 0) {
					$scope.menus[i].subMenu[j].active = true;
					if (event) {
						$state.go('index.customerservice.service', {
							url: $scope.menus[i].subMenu[j].url
						});
					}
				} else {
					$scope.menus[i].subMenu[j].active = false;
				}
			}
		}
	};
	$scope.changeNav(null, $stateParams.url);
	$scope.$on('navChange', function(event, id) {
		if (id == $scope.id) {
			$scope.changeNav(null, null);
		}
	});
	$scope.closeActive = false;
	$scope.toggleNav = function() {
		$scope.closeActive = !$scope.closeActive;
		$('[ui-view=left]').toggleClass('close');
		$('[ui-view=right]').toggleClass('close');
	};
	$scope.init = function() {
		window.onresize = function() {
			$scope.draw();
		};
		$scope.draw();
	};
	$scope.draw = function() {
		var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
		$('[ng-controller=customerserviceLeft]').css('min-height', mainHeight);
		$('[ng-controller=customerserviceRight]').css('min-height', mainHeight - 15).css('height', mainHeight - 15);
		$('#frame').attr('height', mainHeight - 15);
	};
}]);
mysupport.controller("customerserviceRight", ['$scope', '$stateParams', '$sce', function($scope, $stateParams, $sce) {
	$scope.url = $sce.trustAsResourceUrl($stateParams.url);
	$scope.init = function() {
		$scope.draw();
	}
	$scope.draw = function() {
		var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height() - 15;
		$('[ng-controller=customerserviceRight]').css('min-height', mainHeight).css('height', mainHeight);
		$('#frame').attr('height', mainHeight);
		$('#frame').on('load', function() {
			$('#iframe-loading').hide();
		});
	};
}]);