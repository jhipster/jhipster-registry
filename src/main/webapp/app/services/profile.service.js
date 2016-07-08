(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .factory('ProfileService', ProfileService);

    ProfileService.$inject = ['$q', '$http'];

    function ProfileService($q, $http) {

        var dataPromise;

        var service = {
            getProfileInfo : getProfileInfo
        };

        return service;

        function getProfileInfo() {
            if (angular.isUndefined(dataPromise)) {
                dataPromise = $http.get('api/profile-info').then(function(result) {
                    if (result.data.activeProfiles) {
                        return result.data;
                    }
                });
            }
            return dataPromise;
        }
    }
})();
