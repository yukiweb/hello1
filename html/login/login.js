var mysupport = angular.module("mysupport");
mysupport.controller("login", ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
	$scope.w3Submit = function() {
		$http({
			url: 'mysupport/login/getSamlRequest?targetUrl=' + encodeURIComponent($stateParams.url),
			method: 'GET'
		}).then(function(resp) {
			$("#relayState").val(resp.data.RelayState);
			$("#samlRequest").val(resp.data.SAMLRequest);
			$("#samlForm").attr("action", "https://uniportal-beta.huawei.com/saaslogin/sp");
			$("#samlForm").submit();
		});
	};
}]);