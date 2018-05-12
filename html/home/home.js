var mysupport = angular.module("mysupport");
mysupport.controller("home", ['$scope', 'msUser', 'msLang', function($scope, msUser, msLang) {
	$scope.showKpi = msUser.hasKpi();
	$scope.kpiInit = function() {
		window.onresize = function() {
			$scope.kpiDraw();
			$scope.redrawCharts(['accountchart','walletchart','paychart','activechart'],[$scope.accountOption,$scope.walletOption,$scope.payOption,$scope.activeOption]);
		};
		$scope.kpiDraw();
		$scope.isActive = [true, false, false];
		$scope.drawCharts(1);
	};
	$scope.kpiDraw = function() {
		var mainR = document.querySelector(".main-right");
		mainR.style.width = ((document.documentElement.scrollWidth || document.body.scrollWidth) - 300) + "px";
	};
	$scope.drawCharts = function(group) {
		$scope.isActive = [false, false, false];
		$scope.isActive[group - 1] = true;
		var accountchart = echarts.init(document.getElementById('accountchart'));
		var walletchart = echarts.init(document.getElementById('walletchart'));
		var paychart = echarts.init(document.getElementById('paychart'));
		var activechart = echarts.init(document.getElementById('activechart'));
		var date = new Date();
		var acountStr;
		var walletStr;
		var payStr;
		var activeStr;
		var activeGroup;
		var xdata;
		var ydata;
		var activexdata;
		var number = 60 * 60 * 1000;
		var addDate = function(date, days) {
			var d = new Date(date);
			d.setDate(d.getDate() + days);
			var m = d.getMonth() + 1;
			var day = d.getDate();

			if (day < 10) {
				day = "0" + day;
			}
			return m + '-' + day;
		};
		var addMonth = function(date, months) {
			var d = new Date(date);
			var m = d.getMonth();
			var mon;
			mon = m + months;
			if (mon < 0) {
				mon = mon + 12;
			}
			return mon + 1;
		};
		var getHour = function(date) {
			return date.substring(11, 13);
		};
		var dateParse = function(mic, format) {
			var date = new Date(mic);
			var formatArray = format.split('');
			var formatStr = '';
			for (var i = 0; i < formatArray.length; i++) {
				switch (formatArray[i]) {
					case 'Y':
						formatStr += date.getFullYear();
						break;
					case 'm':
						formatStr += date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
						break;
					case 'd':
						formatStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
						break;
					case 'H':
						formatStr += date.getHours();
						break;
					case 'i':
						formatStr += date.getMinutes();
						break;
					case 's':
						formatStr += date.getSeconds();
						break;
					default:
						formatStr += formatArray[i];
						break;
				}
			}
			return formatStr;
		};
		if (group == 1) {
			xdata = [getHour(dateParse(new Date().getTime() - 23 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 22 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 21 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 20 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 19 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 18 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 17 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 16 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 15 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 14 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 13 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 12 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 11 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 10 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 9 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 8 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 7 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 6 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 5 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 4 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 3 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 2 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 1 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime(), 'Y-m-d H'))
			];

			ydata = [getHour(dateParse(new Date().getTime() - 23 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 22 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 21 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 20 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 19 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 18 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 17 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 16 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 15 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 14 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 13 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 12 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 11 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 10 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 9 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 8 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 7 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 6 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 5 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 4 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 3 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime() - 2 * number, 'Y-m-d H')),
				getHour(dateParse(new Date().getTime() - 1 * number, 'Y-m-d H')), getHour(dateParse(new Date().getTime(), 'Y-m-d H'))
			];
			activexdata = [addDate(date, -6), addDate(date, -5), addDate(date, -4), addDate(date, -3), addDate(date, -2), addDate(date, -1), addDate(date, 0)];
			activeydata = [addDate(date, -6), addDate(date, -5), addDate(date, -4), addDate(date, -3), addDate(date, -2), addDate(date, -1), addDate(date, 0)];
			activeGroup = 2;
		} else if (group == 2) {
			xdata = [addDate(date, -6), addDate(date, -5), addDate(date, -4), addDate(date, -3), addDate(date, -2), addDate(date, -1), addDate(date, 0)];
			ydata = [addDate(date, -6), addDate(date, -5), addDate(date, -4), addDate(date, -3), addDate(date, -2), addDate(date, -1), addDate(date, 0)];
			activexdata = xdata;
			activeydata = ydata;
			activeGroup = group;
		} else if (group == 3) {
			xdata = [addMonth(date, -11), addMonth(date, -10), addMonth(date, -9), addMonth(date, -8), addMonth(date, -7), addMonth(date, -6),
				addMonth(date, -5), addMonth(date, -4), addMonth(date, -3), addMonth(date, -2), addMonth(date, -1), addMonth(date, 0)
			];
			ydata = [addMonth(date, -11), addMonth(date, -10), addMonth(date, -9), addMonth(date, -8), addMonth(date, -7), addMonth(date, -6),
				addMonth(date, -5), addMonth(date, -4), addMonth(date, -3), addMonth(date, -2), addMonth(date, -1), addMonth(date, 0)
			];
			activeGroup = group;
			activexdata = xdata;
			activeydata = ydata;
		}
		var accoutdata = new Array();
		var walletdata = new Array();
		var paydata = new Array();
		var activedata = new Array();
		$.ajax({
			url: 'mysupport/kpi/queryLoginTimes',
			type: 'GET',
			data: {
				'group': activeGroup
			},
			success: function(data) {
				for (var i = 0; i < ydata.length; i++) {
					var flag = 0;
					for (var j = 0; j < data.length; j++) {
						var checkflag = 0;
						if (activeGroup == 2) {
							checkflag = data[j].date.substring(5, 10).indexOf(activeydata[i]);
						} else if (activeGroup == 3) {
							checkflag = data[j].date.substring(5, 7).indexOf(activeydata[i]);
						}
						if (checkflag >= 0) {
							flag = 1;
							activedata[i] = data[j].value;
						}
					}
					if (flag == 0) {
						activedata[i] = 0;
					}
				}
				$scope.activeOption = {
					title: {
						text: msLang.get("home.js.activechart.title"),
						textStyle: {
							fontWeight: 'normal'
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: activexdata
					},
					yAxis: {
						type: 'value',
						name: '用户数（人）'
					},
					label: {
						normal: {
							position: 'top',
							textStyle: {
								color: 'black'
							}
						}
					},
					series: [{
						itemStyle: {
							normal: {
								color: '#00B2EE'
							}
						},
						symbol: "none",
						data: activedata,
						type: 'line',
						smooth: true
					}]
				};
				$scope.redrawCharts(['activechart'],[$scope.activeOption]);
			}
		});

		$.ajax({
			url: 'mysupport/kpi/query',
			type: 'GET',
			data: {
				'group': group
			},
			success: function(data) {
				var accountcount = 0;
				var walletcount = 0;
				var paycount = 0;
				var shownum = 0;
				if (group == 1) {
					shownum = 1;
				}
				for (var i = 0; i < ydata.length; i++) {
					var accountflag = 0;
					var walletflag = 0;
					var payflag = 0;
					for (var j = 0; j < data.kpiList.length; j++) {
						var flag = 0;
						if (group == 1) {
							flag = data.kpiList[j].hour.indexOf(ydata[i]);
						} else if (group == 2) {
							flag = data.kpiList[j].date.substring(5, 10).indexOf(ydata[i]);
						} else if (group == 3) {
							flag = data.kpiList[j].date.substring(5, 7).indexOf(ydata[i]);
						}
						if (group == 2 || group == 3) {
							if (flag >= 0 && data.kpiList[j].category == "app_2018020110330606551") {
								accountflag = 1;
								accoutdata[i] = data.kpiList[j].value;
								accountcount = accountcount + data.kpiList[j].value;
							}

							if (flag >= 0 && data.kpiList[j].category == "app_2018020216100808771") {
								walletflag = 1;
								walletdata[i] = data.kpiList[j].value;
								walletcount = walletcount + data.kpiList[j].value;
							}
							if (flag >= 0 && data.kpiList[j].category == "app_2018040909593907531") {
								payflag = 1;
								paydata[i] = data.kpiList[j].value;
								paycount = paycount + data.kpiList[j].value;
							}
						} else if (group == 1) {
							if (data.kpiList[j].hour == ydata[i] && data.kpiList[j].category == "app_2018020110330606551") {
								accountflag = 1;
								accoutdata[i] = data.kpiList[j].value;
								accountcount = accountcount + data.kpiList[j].value;
							}

							if (data.kpiList[j].hour == ydata[i] && data.kpiList[j].category == "app_2018020216100808771") {
								walletflag = 1;
								walletdata[i] = data.kpiList[j].value;
								walletcount = walletcount + data.kpiList[j].value;
							}
							if (data.kpiList[j].hour == ydata[i] && data.kpiList[j].category == "app_2018040909593907531") {
								payflag = 1;
								paydata[i] = data.kpiList[j].value;
								paycount = paycount + data.kpiList[j].value;
							}
						}

					}
					if (accountflag == 0) {
						accoutdata[i] = 0;
					}
					if (walletflag == 0) {
						walletdata[i] = 0;
					}
					if (payflag == 0) {
						paydata[i] = 0;
					}
				}
				var accountfail = 0;
				var walletfail = 0;
				var payfail = 0;
				for (var j = 0; j < data.failedKpiList.length; j++) {
					if (data.failedKpiList[j].category == "app_2018020110330606551") {
						accountfail = accountfail + data.failedKpiList[j].value;
					}
					if (data.failedKpiList[j].category == "app_2018020216100808771") {
						walletfail = walletfail + data.failedKpiList[j].value;
					}
					if (data.failedKpiList[j].category == "app_2018040909593907531") {
						payfail = payfail + data.failedKpiList[j].value;
					}
				}

				if (accountcount == 0 || accountfail == 0) {
					$("#accountPro").html(0 + "%");
				} else {
					$("#accountPro").html(Math.ceil(accountfail * 100 / accountcount) + "%");
				}
				if (paycount == 0 || payfail == 0) {
					$("#payPro").html(0 + "%");
				} else {
					$("#payPro").html(Math.ceil(payfail * 100 / paycount) + "%");
				}
				if (walletcount == 0 || walletfail == 0) {
					$("#walletPro").html(0 + "%");
				} else {
					$("#walletPro").html(Math.ceil(walletfail * 100 / walletcount) + "%");
				}
				// 指定图表的配置项和数据
				$scope.accountOption = {
					title: {
						text: msLang.get("home.js.accountchart.title"),
						textStyle: {
							fontWeight: 'normal'
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: xdata,
						axisLabel: {
							interval: shownum
						}
					},

					yAxis: {
						type: 'value',
						name: msLang.get("home.js.accountchart.yname")
					},
					label: {
						normal: {
							position: 'top',
							textStyle: {
								color: 'black'
							}
						}
					},
					series: [{
						itemStyle: {
							normal: {
								color: '#EE5C42'
							}
						},
						symbol: "none",
						type: 'line',
						smooth: true,
						data: accoutdata
					}]
				};

				$scope.walletOption = {
					title: {
						text: msLang.get("home.js.walletchart.title"),
						textStyle: {
							fontWeight: 'normal'
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: xdata,
						axisLabel: {
							interval: shownum
						}
					},
					yAxis: {
						type: 'value',
						name: msLang.get("home.js.walletchart.yname")
					},
					label: {
						normal: {
							position: 'top',
							textStyle: {
								color: 'black'
							}
						}
					},
					series: [{
						itemStyle: {
							normal: {
								color: '#ADFF2F'
							}
						},
						symbol: "none",
						data: walletdata,
						type: 'line',
						smooth: true,
					}]
				};

				$scope.payOption = {
					title: {
						text: msLang.get("home.js.paychart.title"),
						textStyle: {
							fontWeight: 'normal'
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: xdata,
						axisLabel: {
							interval: shownum
						}
					},
					yAxis: {
						type: 'value',
						name: msLang.get("home.js.paychart.yname")
					},
					label: {
						normal: {
							position: 'top',
							textStyle: {
								color: 'black'
							}
						}
					},
					series: [{
						itemStyle: {
							normal: {
								color: '#DAA520'
							}
						},
						symbol: "none",
						data: paydata,
						type: 'line',
						smooth: true,
					}]
				};
				$scope.redrawCharts(['accountchart','walletchart','paychart'],[$scope.accountOption,$scope.walletOption,$scope.payOption]);
			}
		});
	};
	$scope.redrawCharts = function(id, option) {
		for (var i = 0; i < id.length; i++) {
			$('#'+id[i]).removeAttr("_echarts_instance_");
			if(option[i]) {
				echarts.init(document.getElementById(id[i])).setOption(option[i]);
			}
		}
	};
	$scope.welcomeInit = function() {
		window.onresize = function() {
			$scope.welcomeDraw();
		};
		$scope.welcomeDraw();
	};
	$scope.welcomeDraw = function() {
		var mainHeight = $(window).height() - $('[ui-view=header]').height() - $('[ui-view=footer]').height();
		$('.main-right2').height(mainHeight);
		var imgTop = (mainHeight - 320) / 2;
		$('.main-right2 img').css("margin-top", imgTop);
	}
}]);