(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('ConfigController', ConfigController);

    ConfigController.$inject = ['ConfigService', 'ProfileService', 'ApplicationsService'];

    function ConfigController (ConfigService, ProfileService, ApplicationsService) {
        var vm = this;
        vm.application = "application";
        vm.profile = "prod";
        vm.label = "master";
        vm.activeRegistryProfiles = [];
        vm.isNative = true;
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
            ConfigService.getConfig(vm.application, vm.profile, vm.label).then(function (response) {
                vm.data = response;
            }).catch(function(){
                vm.data = "";
            });

            ApplicationsService.get().$promise.then(function(data) {
                vm.applicationList = ["application"];
                data.applications.forEach(function (application) {
                    var instanceId = application.instances[0].instanceId;
                    var applicationName = instanceId.indexOf(':') == -1 ? application.name.toLowerCase() : instanceId.substr(0, instanceId.indexOf(':'));
                    vm.applicationList.push(applicationName);
                });
            });
        }
    }
})();
