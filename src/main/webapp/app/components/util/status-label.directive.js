(function() {
    'use strict';

    var statusLabel = {
        template: '<span class="label label-success" ng-if="$ctrl.status == \'UP\'">{{$ctrl.status}}</span>' +
            '<span class="label label-warning" ng-if="$ctrl.status != \'UP\' && $ctrl.status != \'DOWN\'">{{$ctrl.status}}</span>' +
            '<span class="label label-danger" ng-if="$ctrl.status == \'DOWN\'">{{$ctrl.status}}</span>',
        bindings: {
            status: '='
        }
    };

    angular
        .module('JHipsterRegistryApp')
        .component('statusLabel', statusLabel);
})();
