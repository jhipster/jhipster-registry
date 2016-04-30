(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .factory('EurekaService', EurekaService);

    EurekaService.$inject = ['$resource'];

    function EurekaService ($resource) {
        var service = $resource('api/eureka', {}, {
            'get': { method: 'GET'}
        });

        return service;
    }
})();
