(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('ApplicationsController', ApplicationsController);

    ApplicationsController.$inject = ['ApplicationsService', '$q'];

    function ApplicationsController (ApplicationsService, $q) {
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
            for (var i = 0; i < vm.data.applications.length; i++) {
                var testApplication = vm.data.applications[i];
                vm.data.applications[i].active = '';
                if (testApplication.name == vm.application) {
                    vm.instances = testApplication.instances;
                    vm.data.applications[i].active = 'active';
                }
            }
        }
    }
})();
