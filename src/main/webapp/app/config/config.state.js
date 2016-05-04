(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('config', {
            parent: 'app',
            url: '/config',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'Configuration'
            },
            views: {
                'content@': {
                    templateUrl: 'app/config/config.html',
                    controller: 'ConfigController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
