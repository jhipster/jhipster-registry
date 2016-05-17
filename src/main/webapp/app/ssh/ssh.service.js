(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .factory('SshService', SshService);

    SshService.$inject = ['$http'];

    function SshService ($http) {

        var ssh = {
            getSshPublicKey: getSshPublicKey
        };

        return ssh;

        function getSshPublicKey() {
            return $http.get('api/ssh/public_key').then(function (response) {
                return response.data;
            });
        }
    }
})();
