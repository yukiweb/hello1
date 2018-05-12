mysupport.controller("index", ['$scope', function($scope) {
	$scope.$on('changeNav', function(event, id) {
		$scope.$broadcast('navChange', id);
	});
	window.onresize = function() {
		$scope.$broadcast('resize', null);
	};
}]);