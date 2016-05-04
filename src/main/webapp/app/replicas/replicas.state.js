(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('replicas', {
            parent: 'app',
            url: '/replicas',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'Replicas'
            },
            views: {
                'content@': {
                    templateUrl: 'app/replicas/replicas.html',
                    controller: 'ReplicasController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
