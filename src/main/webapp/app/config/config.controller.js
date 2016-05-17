(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('ConfigController', ConfigController);

    ConfigController.$inject = ['ConfigService'];

    function ConfigController (ConfigService) {
        var vm = this;
        vm.application = "application";
        vm.profile = "prod";
        vm.refresh = refresh;

        vm.refresh();

        function refresh () {

            ConfigService.getConfig(vm.application, vm.profile).then(function (response) {
                vm.data = response;
            });
        }
    }
})();
