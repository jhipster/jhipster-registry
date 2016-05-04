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
            vm.items = [];
            for (var key in vm.data.registered) {
                vm.items.push({ key: key, value: vm.data.registered[key] });
            }
        }

        vm.activateCanceled = activateCanceled;
        function activateCanceled() {
            vm.registeredClass = 'btn-default';
            vm.canceledClass = 'btn-primary';
            vm.items = [];
            for (var key in vm.data.canceled) {
                vm.items.push({ key: key, value: vm.data.registered[key] });
            }
        }
    }
})();
