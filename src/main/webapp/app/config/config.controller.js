(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('ConfigController', ConfigController);

    ConfigController.$inject = ['ConfigService', 'ProfileService'];

    function ConfigController (ConfigService, ProfileService) {
        var vm = this;
        vm.application = "application";
        vm.profile = "prod";
        vm.activeRegistryProfiles = [];
        vm.refresh = refresh;
        vm.load = load;

        vm.load();
        vm.refresh();

        function load () {
            ProfileService.getProfileInfo().then(function (response) {
                vm.activeRegistryProfiles = response.activeProfiles;
                vm.isNative = vm.activeRegistryProfiles.includes('native');
                vm.nativeSearchLocation = response.nativeSearchLocation;
                vm.gitUri = response.gitUri;
                vm.gitSearchLocation = response.gitSearchLocation;
            });
        }

        function refresh () {
            ConfigService.getConfig(vm.application, vm.profile).then(function (response) {
                vm.data = response;
            });
        }
    }
})();
