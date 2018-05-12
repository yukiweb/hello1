//指令集合

/*
 * input type=text
 * textarea
 */
mysupport.directive("msInput", [function() {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            placeholder: '@',
            required: '@',
            pattern: '@',
            blurCheck: '@',
            form: '=',
            enterFlag: '@',
            enterQuery: '&',
            textarea: '@',
            readonly: '@',
        },
        templateUrl: 'directive/input/input.html',
        controller: function($scope) {
            if (typeof($scope.form) == 'undefined') {
                $scope.form = {
                    value: ""
                };
            }
            if ($scope.pattern) {
                $scope.reg = new RegExp($scope.pattern);
                if ($scope.reg.test("")) {
                    $scope.form.isValid = true;
                } else {
                    $scope.form.isValid = false;
                }
            } else if ($scope.required) {
                $scope.form.isValid = false;
            } else {
                $scope.form.isValid = true;
            }
            $scope.isValid = true;
            $scope.isUrl = true;
            $scope.keyup = function($event) {
                $scope.validCheck();
                if ($scope.enterFlag && $event.keyCode == 13) {
                    $scope.enterQuery();
                }
            };
            $scope.validCheck = function() {
                $scope.form.isValid = true;
                if ($scope.reg && (!$scope.reg.test($scope.form.value))) {
                    $scope.form.isValid = false;
                    $scope.isUrl = false;
                    return;
                } else {
                    $scope.isUrl = true;
                }
                if ($scope.required && (!$scope.form.value || !$.trim($scope.form.value))) {
                    $scope.form.isValid = false;
                    return;
                }
            };
            $scope.blur = function() {
                if (!$scope.readonly) {
                    $scope.isFocus = false;
                }
                if ($scope.blurCheck) {
                    $scope.isValid = $scope.form.isValid;
                } else {
                    if ($scope.form.isValid) {
                        $scope.isValid = true;
                    }
                }
            };
            $scope.focus = function() {
                if (!$scope.readonly) {
                    $scope.isFocus = true;
                }
            };
            $scope.$watch('form', function(n, o) {
                if (n.check) {
                    $scope.isValid = $scope.form.isValid;
                    $scope.form.check = false;
                }
            }, true);
        },
        replace: true
    };
}]);

/*
 * page turn
 */
mysupport.directive("msPage", [function() {
    return {
        restrict: 'E',
        scope: {
            page: '=',
            max: '@',
            query: '&'
        },
        templateUrl: 'directive/page/page.html',
        controller: function($scope) {
            $scope.pageList = [];
            $scope.$watch('page', function(n, o) {
                var max = parseInt($scope.max);
                if (!n) {
                    return;
                }
                if (n.pages <= max) {
                    $scope.pageList = $scope.createNumberArray(1, n.pages);
                } else {
                    if ($scope.page.pageNum < Math.ceil(max / 2)) {
                        $scope.pageList = $scope.createNumberArray(1, max);
                    } else if ($scope.page.pageNum + Math.floor(max / 2) > n.pages) {
                        $scope.pageList = $scope.createNumberArray(n.pages - max + 1, n.pages);
                    } else {
                        $scope.pageList = $scope.createNumberArray($scope.page.pageNum - Math.ceil(max / 2) + 1, $scope.page.pageNum + Math.floor(max / 2));
                    }
                }
            }, true);
            $scope.createNumberArray = function(from, to) {
                var arr = [];
                for (var i = from; i <= to; i++) {
                    arr.push(i);
                }
                return arr;
            };
            $scope.changeSize = function() {
                $scope.pageJump(1);
            };
            $scope.pre = function() {
                if ($scope.page.pageNum > 1) {
                    $scope.pageJump($scope.page.pageNum - 1);
                }
            };
            $scope.next = function() {
                if ($scope.page.pageNum < $scope.page.pages) {
                    $scope.pageJump($scope.page.pageNum + 1);
                }
            };
            $scope.turn = function(num) {
                if (num != $scope.page.pageNum) {
                    $scope.pageJump(num);
                }
            };
            $scope.keyup = function() {
                $scope.pageNum = $scope.pageNum.replace(/[^0-9]/g, '');
            };
            $scope.click = function() {
                if (/^\d+$/.test($scope.pageNum)) {
                    $scope.pageJump($scope.pageNum);
                }
            };
            $scope.pageJump = function(num) {
                $scope.page.pageNum = Math.max(1, Math.min(num, $scope.page.pages));
                $scope.pageNum = '';
                $scope.query();
            };
        },
        replace: true
    };
}]);

/*
 * select
 */
mysupport.directive("msSelect", [function() {
    return {
        restrict: 'E',
        scope: {
            selectId: '@',
            selectTitle: '@',
            form: '=',
            data: '='
        },
        templateUrl: 'directive/select/select.html',
        controller: function($scope) {
            $scope.listShow = false;
            $scope.form.isValid = false;
            $scope.isValid = true;
            $(document).on('click', '.ms-select#' + $scope.selectId + ' .ms-area span, .ms-select#' + $scope.selectId + ' .ms-area i', function(event) {
                if ($(this).parent().hasClass('open')) {
                    $(this).parent().removeClass('open');
                } else {
                    $(this).parent().addClass('open');
                }
                event.stopPropagation();
                $('.ms-select:not(#' + $scope.selectId + ') .ms-area').removeClass('open');
            }).on('click', function() {
                $('.ms-select#' + $scope.selectId + ' .ms-area').removeClass('open');
            });
        },
        replace: true
    };
}]);

/*
 * select 下拉directive
 */
mysupport.directive('msSelects', ['$http', function($http) {
    return {
        restrict: "AE",
        scope: {
            list: "="
        },
        link: function(scope, ele, attrs) {
            scope.showMenu = function() {
                // $scope.list = true;
                scope.list = !scope.list
            };

            scope.getVlaue = function(event) {
                $http.get('mysupport/resource/tree').then(res => {
                    console.log(res)
                })
                var val = this.innerHTML;
                scope.selectedName = event.target.innerHTML;
            }
        },
        replace: true,
        templateUrl: 'directive/selectInput/selectInput.html'
    }
}]);

/*
 *  弹弹弹   模态框 directive,非完全封装 慎用，最好不用
 */

mysupport.directive('msgModal', ['$http', function($http) {
    return {
        restrict: 'AE',
        replace: false,
        scope: {
            arrs: '=',
            isShow: '=',
            page: '=',
            query: "&",
            max: "=",
            titles: '@',
            appContent: '=',
            draw: "&"
        },
        link: function(scope, ele, attrs) {
            scope.hideanything = function() {
                angular.element(ele).css('display', 'none')
            }
            scope.getIds = function(event) {
                $(event.target).addClass('active').parents('tr').siblings('tr').find('i').removeClass('active');
                scope.appContent = $(event.target).parent('span').attr('data-appId');
            }
            scope.cancel = function() {
                angular.element(ele).css('display', 'none')
            }
            scope.sure = function(event) {
                sessionStorage.setItem('appId', scope.appContent);
                angular.element(ele).css('display', 'none');

            }
        },
        templateUrl: "directive/msgModal/msgModal.html"
    }
}]);

/*
 * 日历控件封装
 */
mysupport.directive('datePicker', ['$http', function($http) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            arrs: '=',
            res: '=',
            obj: "="
        },
        link: function($scope) {
            //配置年、月、周

            $scope.year = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];
            $scope.month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            $scope.week = [{
                'value': '周日',
                'class': 'weekend'
            }, {
                'value': '周一',
                'class': ''
            }, {
                'value': '周二',
                'class': ''
            }, {
                'value': '周三',
                'class': ''
            }, {
                'value': '周四',
                'class': ''
            }, {
                'value': '周五',
                'class': ''
            }, {
                'value': '周六',
                'class': 'weekend'
            }];
            var date = new Date(),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                dayInMonth = date.getDate(),
                dayInWeek = date.getDay() //星期几
                ,
                selected = [year, month, dayInMonth],
                days = [];
            //判断是否是闰年
            var isLeapYear = function(y) {
                return y % 400 == 0 || (y % 4 == 0 && y % 100 != 0);
            };
            //判断是否是今天
            var isToday = function(y, m, d) {
                return y == year && m == month && d == dayInMonth;
            };
            //判断是否是周末
            var isWeekend = function(emptyGrids, d) {
                return (emptyGrids + d) % 7 == 0 || (emptyGrids + d - 1) % 7 == 0
            };
            //判断某月的第一天是周几
            var calEmptyGrid = function(y, m) {
                return new Date(`${y}/${m}/01 00:00:00`).getUTCDay();
            };
            //确定某月有几天
            var calDaysInMonth = function(year, month) {
                var leapYear = isLeapYear(year);
                if (month == 2 && leapYear) {
                    return 29;
                }
                if (month == 2 && !leapYear) {
                    return 28;
                }
                if ([4, 6, 9, 11].includes(month)) {
                    return 30;
                }
                return 31;
            };
            //获取每月天数
            var calDays = function(y, m) {
                var emptyGrids = calEmptyGrid(y, m);
                var days = [];
                for (var i = 1; i <= 31; i++) {
                    var ifToday = isToday(y, m, i);
                    var isSelected = selected[0] == y && selected[1] == m && selected[2] == i;
                    var today = ifToday ? 'today' : '';
                    var weekend = isWeekend(emptyGrids, i + 1) ? 'weekend' : '';
                    var todaySelected = ifToday && isSelected ? 'today-selected' : '';
                    var day = {
                        'value': i,
                        'class': `date-bg ${weekend} ${today}  ${todaySelected}`,
                    }
                    days.push(day);
                }
                return days.slice(0, calDaysInMonth(y, m));
            }
            //根据年月获取每个月前的空格子
            var emptyGridsArray = function(year, month) {
                var emptyGrids = calEmptyGrid(year, month);
                switch (emptyGrids) {
                    case 0:
                        return [{}];
                    case 1:
                        return [{}, {}];
                    case 2:
                        return [{}, {}, {}];
                    case 3:
                        return [{}, {}, {}, {}];
                    case 4:
                        return [{}, {}, {}, {}, {}];
                    case 5:
                        return [{}, {}, {}, {}, {}, {}];
                    default:
                        return [];
                }
            };
            //左右按钮选择月份
            $scope.changeMonth = function(e) {
                var id = e.target.id;
                var currYear = $scope.currYear;
                var currMonth = $scope.currMonth;
                currMonth = id == 'prev' ? currMonth - 1 : currMonth + 1;
                if (id == 'prev' && currMonth < 1) {
                    currYear -= 1;
                    currMonth = 12;
                }
                if (id == 'next' && currMonth > 12) {
                    currYear += 1;
                    currMonth = 1;
                }
                $scope.emptyGrids = emptyGridsArray(currYear, currMonth);
                $scope.days = calDays(currYear, currMonth);
                $scope.currYear = currYear;
                $scope.currMonth = currMonth;
            };
            //由选择框选择年份
            $scope.isChangeYear = function() {
                var currYear = $scope.selectYear;
                $scope.currYear = currYear;
                // $scope.getallVal()
                return currYear;

            }
            //由选择框选择月份
            $scope.isChangeMonth = function() {
                var currYear = $scope.isChangeYear();
                var currMonth = $scope.selectMonth;
                $scope.emptyGrids = emptyGridsArray(currYear, currMonth);
                $scope.days = calDays(currYear, currMonth);
                $scope.currYear = currYear;
                $scope.currMonth = currMonth;
                // $scope.getallVal();
            }
            //由选择框选择天数
            $scope.getVal = function(event) {
                $(event.target).addClass('today-selected')
                $(event.target).parent('div').siblings('div').find('.date-bg').removeClass('today-selected');
                $scope.isShow = false;
                $scope.arrs = event.target.innerHTML;
                $scope.getallVal();
            }
            $scope.getallVal = function() {
                $scope.myDate = [];
                $scope.myDate.push($scope.currYear, $scope.currMonth, $scope.arrs);
                $scope.$emit('select', $scope.myDate);
            }
            //初始化
            $scope.emptyGrids = emptyGridsArray(year, month);
            $scope.days = calDays(year, month);
            $scope.currYear = year;
            $scope.currMonth = month;

        },
        templateUrl: "directive/datePicker/datePicker.html"
    }
}]);

/*
 * pop
 */
mysupport.directive("msPop", [function() {
    return {
        restrict: 'E',
        scope: {
            popTitle: '@',
            popContent: '@',
            type: '@',
            confirmFlag: '@',
            confirmFn: '&'
        },
        templateUrl: 'directive/pop/pop.html',
        controller: function($scope) {
            $scope.cancel = function() {
                angular.element('body').css('overflow', 'visible');
                angular.element('.ms-pop').remove();
            };
            $scope.sure = function() {
                if ($scope.confirmFlag) {
                    $scope.confirmFn();
                }
                $scope.cancel();
            };
        },
        replace: true
    };
}]);

/*
 * relationtree
 */
mysupport.directive("msRelation", [function() {
    return {
        restrict: 'E',
        scope: {
            treeTitle: '=',
            treeList: '=',
            treeFnFlag: '@',
            treeFnText: '@',
            treeFn: '&',
            treeSelect: '@'
        },
        templateUrl: 'directive/relation/relation.html',
        controller: function($scope) {
            $scope.chooseAll = function() {
                if ($scope.selectAll) {
                    var select = false;
                } else {
                    var select = true;
                }
                var recursion = function(tree) {
                    for (var i = 0; i < tree.length; i++) {
                        tree[i].selected = select;
                        if (tree[i].child && tree[i].child.length) {
                            recursion(tree[i].child);
                        }
                    }
                };
                recursion($scope.treeList);
            };
            $scope.chooseItem = function(index) {
                if ($scope.treeList[index].selected) {
                    var select = false;
                } else {
                    var select = true;
                }
                $scope.treeList[index].selected = select;
                var recursion = function(tree) {
                    tree.selected = select;
                    if (tree.child && tree.child.length) {
                        for (var i = 0; i < tree.child.length; i++) {
                            recursion(tree.child[i])
                        }
                    }
                };
                recursion($scope.treeList[index]);
            };
            $scope.chooseSubItem = function(index, subindex) {
                if ($scope.treeList[index].child[subindex].selected) {
                    var select = false;
                } else {
                    var select = true;
                }
                $scope.treeList[index].child[subindex].selected = select;
                var recursion = function(tree) {
                    tree.selected = select;
                    if (tree.child && tree.child.length) {
                        for (var i = 0; i < tree.child.length; i++) {
                            recursion(tree.child[i])
                        }
                    }
                };
                recursion($scope.treeList[index].child[subindex]);
            };
            $scope.chooseThirdItem = function(index, subindex, thirdindex) {
                $scope.treeList[index].child[subindex].child[thirdindex].selected = !$scope.treeList[index].child[subindex].child[thirdindex].selected;
            };
            $scope.isSelectAll = function() {
                var all = true;
                var recursion = function(tree) {
                    for (var i = 0; i < tree.length; i++) {
                        if (!tree[i].selected) {
                            all = false;
                            break;
                        }
                        if (tree[i].child && tree[i].child.length) {
                            recursion(tree[i].child);
                        }
                    }
                };
                if ($scope.treeList && $scope.treeList.length) {
                    recursion($scope.treeList);
                } else {
                    all = false;
                }
                return all;
            }
            $scope.$watch('treeList', function(n) {
                $scope.selectAll = $scope.isSelectAll();
            }, true);
            $scope.click = function(id) {
                $scope.treeFn({
                    id: [id]
                });
            };
        },
        replace: true
    };
}]);