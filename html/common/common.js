var mysupport = angular.module("mysupport");
mysupport.controller("common", ['$scope', '$state', 'msUser', 'msLang', function($scope, $state, msUser, msLang) {
	document.title = msLang.get("common.js.title");
	$(document).on('click', '.dropdown-administrator', function(event) {
		$(this).addClass('open');
		event.stopPropagation();
	}).on('click', function() {
		$('.dropdown-administrator').removeClass('open');
	});
	$scope.name = msUser.getUser('name');
	$scope.menu = msUser.getMenuNameAndUrl();
	$scope.changeNav = function(href, first) {
		for (var i = 0; i < $scope.menu.length; i++) {
			if (href.indexOf($scope.menu[i].url) === 0) {
				$scope.menu[i].active = true;
				if (!first) {
					$scope.$emit('changeNav', $scope.menu[i].id);
				}
			} else {
				$scope.menu[i].active = false;
			}
		}
	};
	$scope.changeNav(location.href.substring(location.href.indexOf('#/')), true);
	$scope.exit = function() {
		$('#mysupport').remove();
		$('html').append("<h5>" + msLang.get("common.js.logout") + "</h5>");
		location.href = "mysupport/login/logout";
	};
}]);