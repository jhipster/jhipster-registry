(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('ReplicasController', ReplicasController);

    ReplicasController.$inject = ['ReplicasService'];

    function ReplicasController (ReplicasService) {
        var vm = this;
        vm.refresh = refresh;
        vm.showMore = true;

        vm.refresh();

        function refresh () {
            ReplicasService.get().$promise.then(function(replicas) {
                vm.replicas = replicas;
            });
        }
    }
})();
