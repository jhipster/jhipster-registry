(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .config(stateSsh);

    stateSsh.$inject = ['$stateProvider'];

    function stateSsh($stateProvider) {
        $stateProvider.state('ssh', {
            parent: 'app',
            url: '/ssh',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'SSH public key'
            },
            views: {
                'content@': {
                    templateUrl: 'app/ssh/ssh.html',
                    controller: 'SshController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
