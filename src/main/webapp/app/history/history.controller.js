(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = ['HistoryService'];

    function HistoryController (HistoryService) {
        var vm = this;
        vm.refresh = refresh;
        vm.activate = activate;

        vm.refresh();

        function refresh () {
            HistoryService.get().$promise.then(function(data) {
                vm.data = data;
                vm.activate('registered');
            });
        }

        function activate(objKey) {
            vm.items = [];
            var obj = vm.data ? vm.data[objKey] : null;
            if (obj) {
                for (var key in obj) {
                    vm.items.push({ key: key, value: obj[key] });
                }
            }
        }
    }
})();
