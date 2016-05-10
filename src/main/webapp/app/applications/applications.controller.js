(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('ApplicationsController', ApplicationsController);

    ApplicationsController.$inject = ['ApplicationsService'];

    function ApplicationsController (ApplicationsService) {
        var vm = this;
        vm.application = '';
        vm.refresh = refresh;
        vm.show = show;

        vm.refresh();

        function refresh () {
            ApplicationsService.get().$promise.then(function(data) {
                vm.data = data;
                if (data.applications.length > 0) {
                    show(data.applications[0].name);
                }
            });

        }

        function show(app) {
            vm.application = app;
            angular.forEach(vm.data.applications, function (app) {
                app.active = '';
                if (app.name === vm.application) {
                    vm.instances = app.instances;
                    app.active = 'active';
                }
            });
        }
    }
})();
