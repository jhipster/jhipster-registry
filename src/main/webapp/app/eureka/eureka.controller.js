(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('EurekaController', EurekaController);

    EurekaController.$inject = ['EurekaService'];

    function EurekaController (EurekaService) {
        var vm = this;
        vm.refresh = refresh;

        vm.refresh();

        function refresh () {
            vm.data = EurekaService.get();
        }
    }
})();
