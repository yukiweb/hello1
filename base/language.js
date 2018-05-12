//国际化
mysupport.config(['$translateProvider', function($translateProvider) {
	var lang = typeof(MS) != 'undefined' && typeof(MS.lang) != 'undefined' && $.inArray(MS.lang, ['zh', 'en']) != -1 ? MS.lang : 'zh';
	$translateProvider.preferredLanguage(lang);
	$translateProvider.useStaticFilesLoader({
		prefix: 'lang/',
		suffix: '.json'
	});
}]);
mysupport.factory('msLang', ['$translate', function($translate) {
	var factory = {};
	factory.get = function(name) {
		return $translate.instant(name);
	};
	return factory;
}]);
mysupport.filter("msLang", ['$translate', function($translate) {
	return function(name) {
		return $translate.instant(name);
	}
}]);