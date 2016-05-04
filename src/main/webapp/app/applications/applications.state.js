(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('applications', {
            parent: 'app',
            url: '/applications',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'Applications'
            },
            views: {
                'content@': {
                    templateUrl: 'app/applications/applications.html',
                    controller: 'ApplicationsController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
