(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('LogsController', LogsController);

    LogsController.$inject = ['LogsService'];

    function LogsController (LogsService) {
        var vm = this;

        vm.changeLevel = changeLevel;
        vm.loggers = LogsService.findAll();

        function changeLevel (name, level) {
            LogsService.changeLevel({name: name, level: level}, function () {
                vm.loggers = LogsService.findAll();
            });
        }
    }
})();
