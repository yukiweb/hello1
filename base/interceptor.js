//$http请求拦截器
mysupport.factory('msInterceptor', ['$q', function($q) {
	return {
		request: function(config) {
			$("#page-loading").show();
			return config || $q.when(config);
		},
		requestError: function(rejection) {

		},
		response: function(response) {
			$("#page-loading").hide();
			if (response.data.errorCode == 'token_timeout') {
				location.href = "mysupport/login/logout";
			} else if (response.data.errorCode == 'invalid_param') {

			} else if (response.data.errorCode == 'no_permission') {

			}
			return response || $q.when(response);
		},
		responseError: function(rejection) {
			$("#page-loading").hide();
		}
	}
}]);
mysupport.config(["$httpProvider", function($httpProvider) {　　
	$httpProvider.interceptors.push("msInterceptor");
}]);