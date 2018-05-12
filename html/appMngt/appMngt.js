var mysupport = angular.module("mysupport");
mysupport.controller("appList", ["$scope", "$http", "$state", "$rootScope", function($scope, $http, $state, $rootScope) {
    $scope.page = {
        total: 0,
        pageNum: 1,
        pageSize: 8,
        pageSizeArray: [8, 16, 32, 64, 128]
    };


    var reGetAppList = function() {
        $scope.resource = $scope.resource || {}

        $http.get('mysupport/app/list', {
                params: {
                    "pageNum": $scope.page.pageNum,
                    "pageSize": $scope.page.pageSize,
                    "appName": $scope.resource.value
                }
            })
            .then(function(resp, status, headers, config) {

                if (resp && resp.data.data && resp.data.data instanceof Array) {

                    $scope.page.total = resp.data.total;
                    $scope.page.pages = resp.data.pages;
                    $scope.items = resp.data.data;
                    // angular.forEach($scope.items, function(data, index, array) {
                    //     data.show = false;
                    // });
                }
            }, function(resp) {

            })
    }

    $scope.query = function() {
        reGetAppList();
    }

    $rootScope.reGetAppList = reGetAppList;
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', $scope.reGetAppList);

    $scope.toolsIn = false;
    $scope.deleteApp;
    $scope.cancel = function(item) {
        $scope.toolsIn = true;
        $scope.deleteApp = item;
        $scope.boxTitle = "提示";
        $scope.type = "warn";
        $scope.content = "确认删除业务" + item.appName;
    }

    $scope.sure = function() {
        if ($scope.deleteApp) {
            $http({
                url: 'mysupport/app/delete?appId=' + $scope.deleteApp.appId,
                method: 'post',

            }).then(function(resp) {

                if (resp.data && resp.data != "") {
                    $scope.toolsIn = true;
                    $scope.boxTitle = "提示";
                    $scope.type = "error";
                    $scope.content = resp.data.message;
                } else {
                    $scope.toolsIn = false;
                    reGetAppList();
                }


                $scope.deleteApp = null;

            }, function(resp) {

            });

        } else {
            $scope.toolsIn = false;
        }
    }

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


mysupport.controller("appDetailsCtrl", ['$state', '$stateParams', '$http', '$scope',  'msLang',
    function($state, $stateParams, $http, $scope,  msLang) {
        $scope.type = $stateParams.type;
        //根据id查询业务信息
        $http.get('mysupport/app/byId', {
                params: {

                    "appId": $stateParams.businessId
                }
            })
            .then(function(resp, status, headers, config) {

                if (resp && resp.data) {
                    $scope.app = resp.data;

                }
            }, function(resp) {

            })

        $scope.appGetUpdate = function($valid) {

            $scope.appAdd_form.submitted = true;
            if (!$valid || $scope.appAdd_form.wait) {
                return;
            }
            $http({
                url: 'mysupport/app/update?appId=' + $scope.app.appId + '&appName=' + $scope.app.appName + '&appDesc=' + $scope.app.appDesc + '&rootUrl=' + $scope.app.rootUrl,
                method: 'post',

            }).then(function(resp) {

                $state.go("index.setting.app");

            }, function(resp) {

            });

        }

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


    }
]);


mysupport.controller("appAddCtrl", ['$state', '$stateParams', '$http', '$scope', '$rootScope',
    function($state, $stateParams, $http, $scope, $rootScope) {
        $scope.toolsIn = false;
     
        $scope.sure = function() {
            $state.go("index.setting.app");
            // $rootScope.reGetAppList();
        }

        $scope.addApp = function($valid) {

            $scope.appAdd_form.submitted = true;
            $scope.appName.check = true;
            $scope.rootUrl.check = true;
            $scope.appDesc.check = true;

            if (!$valid) {
                return;
            } //新建业务
            $http({
                url: 'mysupport/app/create?appName=' + $scope.appName.value + '&appDesc=' + $scope.appDesc.value + '&rootUrl=' + $scope.rootUrl.value,
                method: 'post',

            }).then(function(resp) {

                $scope.toolsIn = true;
                if (resp.data && resp.data.errorCode == "invalid_param") {
                    $scope.boxTitle = "提示";
                    $scope.type = "error";
                    $scope.content = resp.data.message;
                } else {

                    $state.go("index.setting.app");
                }




            }, function(resp) {
                $scope.boxTitle = "提示";

                $scope.type = "error";
                $scope.content = "新增业务" + $scope.app.appName + "失败";
            });
        }

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
    }
]);