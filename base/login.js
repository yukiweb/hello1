//登录逻辑
mysupport.run(['$rootScope', '$state', function($rootScope, $state) {
	$rootScope.$on('$stateChangeStart', function(event, tostate) {
		if (tostate.name != 'login' && typeof(MS.user) == 'undefined') {
			event.preventDefault();
			$state.go('login', {
				url: window.location.href
			});
			$("#page-loading").show();
		}
	});
}]);