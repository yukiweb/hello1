var mysupport = angular.module("mysupport");
mysupport.controller("setting", ['$scope', '$state', 'msUser', function($scope, $state, msUser) {
    $scope.id = 'setting';
    $scope.menu = msUser.getLeftNameAndUrl($scope.id);
    $scope.changeNav = function(href) {
        if (!href) {
            for (var i = 0; i < $scope.menu.length; i++) {
                $scope.menu[i].active = false;
            }
            return;
        }
        for (var i = 0; i < $scope.menu.length; i++) {
            if (href.indexOf($scope.menu[i].url) === 0) {
                $scope.menu[i].active = true;
            } else {
                $scope.menu[i].active = false;
            }
        }
    };
    $scope.$on('navChange', function(event, id) {
        if (id == $scope.id) {
            $scope.changeNav(null);
        }
    });
    $scope.closeActive = false;
    $scope.toggleNav = function() {
        $scope.closeActive = !$scope.closeActive;
        $('[ui-view=left]').toggleClass('close');
        $('[ui-view=right]').toggleClass('close');
    };
    $scope.init = function() {
        $scope.changeNav(location.href.substring(location.href.indexOf('#/')));
        $scope.draw();
    };
    $scope.$on('resize', function() {
        $scope.draw();
    });
    $scope.draw = function() {
        var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
        $('[ng-controller=setting]').css('min-height', mainHeight);
    };
}]);
mysupport.controller('settingRight', ['$scope', '$state', 'msLang', '$http','$interval',function($scope, $state, msLang, $http,$interval) {

    $scope.isShowMenu = false;
    $scope.searchTree = true;
   
 
    //todo   待优化呢
    
    $scope.map = [{
        '1': "菜单",
        '2': "页面",
        '3': "功能"
    }]

    $scope.map1 = {
        "菜单": 1,
        "页面": 2,
        "功能": 3
    }
    $scope.page = {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pageSizeArray: [10, 20, 50, 100, 500]
    };
    $scope.list = [];
    // 渲染列表
    $scope.query = function() {
        $http({
            url: 'mysupport/resource/list?pageNum=' + $scope.page.pageNum + '&pageSize=' + $scope.page.pageSize,
            method: 'GET'
        }).then(function(resp) {
            $scope.items = resp.data.data;
            $scope.items.forEach(val => {
                val.resourceType = $scope.map[0][val.resourceType];

            });
            $scope.page.total = resp.data.total;
            $scope.page.pages = resp.data.pages;
        });
        return $scope.items;
    };
    $scope.query();
   
   


    // 查询
    $scope.reGetResoList = function() {
        var _resourceType = $('.resourceType').text();
        var _appId = $('.currentVal').val();
        var _resourceId = $('.id_code').val();
        for (item in $scope.map[0]) {

            if ($scope.map[0][item] == _resourceType) {
                var _resourceType = item;
            }
        }
        console.log('----- 查询参数-------');
        console.log(_resourceType, _appId, _resourceId)
        if (_resourceType != '' || _appId != '' || _resourceId != '') {
            $http.get('mysupport/resource/list?pageNum=' + $scope.page.pageNum + '&pageSize=' + $scope.page.pageSize + '&resourceType=' + _resourceType + '&appId=' + _appId + '&resourceId=' + _resourceId).then(resp => {
                $scope.items = resp.data.data;
                // alert($scope.items.length)
                if ($scope.items.length == 0) {
                    alert('暂无数据')
                } else {
                    $scope.items.forEach(val => {
                        val.resourceType = $scope.map[0][val.resourceType];
                    });
                    $scope.page.total = resp.data.total;
                    $scope.page.pages = resp.data.pages;
                }

            })
        } else {
            alert('至少选择一个 ')
        }

    }
    $interval(function(){
         $scope.businessId = sessionStorage.getItem('appId');
    },100)
   
    // 点击所属业务模块
    $scope.selectApps = function() {
       
       $scope.isShow = true;
        // 选择业务模块分页
         $scope.getApps =function(){
             $http.get('mysupport/app/list?pageNum=' + $scope.page.pageNum + '&pageSize=' + $scope.page.pageSize).then(resp => {
                $scope.resourceApp = resp.data.data;
                $scope.page.total = resp.data.total;
                $scope.page.pages = resp.data.pages;
            });
             return $scope.resourceApp
        }
        $scope.getApps();
        $scope.arrs = $scope.getApps();
        $scope.businessId = 
        angular.element('.modalTip').css('display','block');
        
    }

   

    $scope.fun = '功能';

    // // 测试接口
    // $http.get('mysupport/resource/byId/?resourceId=Pursebuscardorderdetailsinquiry').then(res => {
    //     console.log("-------------------")
    //     console.log(res)
    // })

}]);

mysupport.controller('resoAddCtrl', ['$scope', '$state', 'msLang', '$http', '$stateParams', function($scope, $state, msLang, $http, $stateParams) {
    //判断跳转后展示的页面
    $scope.type = $stateParams.type;
    $scope.resourceType = $stateParams.resourceType;

    $scope.typeToggle = function(){
        $scope.type='update'
    }
  //资源类型选择
    $scope.selectResourceType = function(type) {
        
        if (type == 1) {
            $scope.menu = true;
            $scope.page = false;
            $scope.fun = false;
            $scope.resourceType=''
        } else if (type == 2) {
            $scope.menu = false;
            $scope.page = true;
            $scope.fun = false;
            $scope.resourceType=''
            // $scope.resource.isLook = 2;  
            // $scope.resource.isExcRes = false;
        } else if (type == 3) {
            $scope.menu = false;
            $scope.page = false;
            $scope.fun = true;
            $scope.resourceType=''
            // $scope.resource.isLook = 2;
        }
        // $scope.resource.resourceType = type;
    }

    $scope.resource = {
        appResUrl: null,
        businessId: null,
        exclusionResoList: [],
        fatherResId: null,
        isExcRes: false,
        isFatherRes: false,
        isLook: 2,
        type:$stateParams.type,
        mobileFlag: 0,
        resoModuleList: [],
        resoRank: null,
        resourceDesCn: null,
        resourceDesEn: null,
        resourceId: null,
        resourceCode: null,
        resourceNameCh: null,
        resourceNameEn: null,
        resourceType: null,
        resourceUrl: null,
        siteResList: []
    }
    $scope.selectApp = function() {
        $scope.operationTitle = 'select';
        $scope.isTable = true;
        $scope.myData = $scope.query();

        $('#myModal').modal('show');
        $('.sure').addClass('tableSure');
    }

    // 资源新增
    if ($scope.type == 'add') {
        //页面数据初始化

        $scope.menu = false;
        $scope.page = false;
        $scope.fun = false;

        // 是否有父资源
        $scope.resourceFather = function() {

            $scope.unique1 = false;
            $scope.unique2 = false;
            if ($scope.resource.isFatherRes == false) {
                $scope.resource.fatherResId = "";
            }
            $scope.resource.isFatherRes = !$scope.resource.isFatherRes;
        }
    }
    //点击所属业务模块
   
    //判断跳转后展示的页面
  
    // alert($scope.type)
   
    // 资源查看详情
    if ($scope.type == 'view') {
        $http.get("mysupport/resource/byId?resourceId=" + $stateParams.resourceId).then(resp => {

            $scope._resourceName = resp.data.resourceName;
            $scope._resourceNameEn = resp.data.appId;
            $scope._resourceUrl = resp.data.resourceUrl;
            $scope._isFatherRes = resp.data.parentId;
            $scope._resourceDesc = resp.data.resourceDesc
            // $scope.tt= resp.data.resourceType;
            // console.log(resp.data.parentId)
        })
    }
    // 资源更新
    if ($scope.type == 'update') {
         $http.get("mysupport/resource/byId?resourceId=" + $stateParams.resourceId).then(resp => {
            $scope._resourceName = resp.data.resourceName;
            $scope._resourceNameEn = resp.data.appId;
            $scope._resourceUrl = resp.data.resourceUrl;
            $scope._isFatherRes = resp.data.parentId;
            $scope._resourceDesc = resp.data.resourceDesc
            // $scope.tt= resp.data.resourceType;
            // console.log(resp.data.parentId)
        });

        $scope.confirmUpdate =function(){
            $http.post('mysupport/resource/update?resourceId='+$stateParams.resourceId+'&resourceUrl='+$scope._resourceUrl+'&resourceDesc='+$scope._resourceDesc).then(resp=>{
                if(resp.data.errorCode=='no_permission'){
                    alert(resp.data.message)
                }
            })
        }
    }
}])