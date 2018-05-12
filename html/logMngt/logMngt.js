var mysupport = angular.module("mysupport");
mysupport.controller("logMngt", ["$rootScope","$scope", "$http", function ($rootScope,$scope, $http) {
    //获取当前时间：$filter('date')(new Date().getTime(),'yyyy-MM-dd')
    //初始化，右边区域的高度固定
    $scope.init = function () {
        $scope.draw();
    };
    $scope.draw = function () {
        var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
        $('[ui-view=right]').css('max-height', mainHeight - 15);
    };
    $scope.isMoveUp = true;
    $scope.isMoveDown = !$scope.isMoveUp;
    $scope.isShowDetail = false;
    $scope.changeMoveClass = function () {
        $scope.isMoveUp = !$scope.isMoveUp;
        $scope.isMoveDown = !$scope.isMoveUp;
        $scope.isShowDetail = !$scope.isShowDetail;
    }
    //模拟假数据
    $scope.logData = {
        "data":[
            {"operatortype":"","operatorip":"","operatorresouname":"","operatorbrowser":"","loggerdetails":"","operateTime":"","operatorid":""},
            {"operatortype":"","operatorip":"","operatorresouname":"","operatorbrowser":"","loggerdetails":"","operateTime":"","operatorid":""},
            {"operatortype":"","operatorip":"","operatorresouname":"","operatorbrowser":"","loggerdetails":"","operateTime":"","operatorid":""},
            {"operatortype":"","operatorip":"","operatorresouname":"","operatorbrowser":"","loggerdetails":"","operateTime":"","operatorid":""}
        ],
        "cursor":"",
        "hasMore":""
    }
    $scope.queryLogList = function () {
        console.log($rootScope.isShowStart);
        if($rootScope.start && $rootScope.end){
            if(!$scope.isShowQueryResult){
                $scope.isShowQueryResult = !$scope.isShowQueryResult
            }//如果为false就切换，即查询结果列表从无到有
        }
        if($rootScope.start != null  && $rootScope.end != null){
            $http.get('mysupport/sds/findLoggerInfo', {
                params: {
                    "userId": null,
                    "appId": "app_201804290535310195",//这个值应该是输入框的值
                    "start": $rootScope.start + " 00:00:01",//这个值应该是输入框的值
                    "end": $rootScope.end + " 23:59:59"//这个值应该是输入框的值
                }
            })
                .then(function (resp, status, headers, config) {
                    if (resp && resp.data) {
                        $scope.app = resp.data;
                        console.log($scope.app);
                    }
                }, function (resp) {

                })
        }
        console.log($rootScope);
    }
}
]);
mysupport.controller('dateStart', ["$rootScope","$scope", "$http", function ($rootScope,$scope, $http) {
    $scope.$on('select', function (e, newName) {
        var html = ''
        for (var i = 0; i < newName.length; i++) {
            if (i < 2) {
                html += newName[i] + "-";
            } else {
                html += newName[i];
            }
        }
        $scope.starts = html;
        $rootScope.start = html;
        if (newName.length == 3) {
            $scope.isShowStart = !$scope.isShowStart;
        }
        $rootScope.isShowStart = $scope.isShowStart;
    })
}]);
mysupport.controller('dateEnd', ["$rootScope","$scope", "$http", function ($rootScope,$scope, $http) {
    $scope.$on('select', function (e, newName) {
        var html = ''
        for (var i = 0; i < newName.length; i++) {
            if (i < 2) {
                html += newName[i] + "-";
            } else {
                html += newName[i];
            }
        }
        $scope.ends = html;
        $rootScope.end = html;
        if (newName.length == 3) {
            $scope.isShowEnd = !$scope.isShowEnd;
        }
        $rootScope.isShowEnd = $scope.isShowEnd;
    })
}]);
