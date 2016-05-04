(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('eureka', {
            parent: 'app',
            url: '/eureka',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'Eureka'
            },
            views: {
                'content@': {
                    templateUrl: 'app/eureka/eureka.html',
                    controller: 'EurekaController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
