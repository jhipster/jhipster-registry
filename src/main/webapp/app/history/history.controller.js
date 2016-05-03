(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = ['HistoryService'];

    function HistoryController (HistoryService) {
        var vm = this;
        vm.refresh = refresh;

        vm.refresh();

        function refresh () {
            HistoryService.get().$promise.then(function(data) {
                vm.data = data;
                vm.activateRegistered();
            });
        }

        vm.activateRegistered = activateRegistered;
        function activateRegistered() {
            vm.registeredClass = 'btn-primary';
            vm.canceledClass = 'btn-default';
            vm.instanceData = vm.data.registered;
        }

        vm.activateCanceled = activateCanceled;
        function activateCanceled() {
            vm.registeredClass = 'btn-default';
            vm.canceledClass = 'btn-primary';
            vm.instanceData = vm.data.canceled;
        }
    }
})();
