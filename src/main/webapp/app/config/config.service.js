(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .factory('ConfigService', ConfigService);

    ConfigService.$inject = ['$http'];

    function ConfigService ($http) {

        var config = {
            getConfig: getConfig
        };

        return config;

        function getConfig() {
            return $http.get('config/application-dev.yml').then(function (response) {
                return response.data;
            });
        }

    }
})();
