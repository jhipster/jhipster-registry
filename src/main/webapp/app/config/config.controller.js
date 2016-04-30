(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('ConfigController', ConfigController);

    ConfigController.$inject = ['ConfigService'];

    function ConfigController (ConfigService) {
        var vm = this;
        vm.refresh = refresh;

        vm.refresh();

        function refresh () {

            ConfigService.getConfig().then(function (response) {
                vm.data = response;
            });
        }
    }
})();
