(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('history', {
            parent: 'admin',
            url: '/history',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'History'
            },
            views: {
                'content@': {
                    templateUrl: 'app/history/history.html',
                    controller: 'HistoryController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
