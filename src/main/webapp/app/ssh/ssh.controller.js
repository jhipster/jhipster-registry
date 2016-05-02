(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('SshController', SshController);

    SshController.$inject = ['SshService'];

    function SshController(SshService) {
        var vm = this;
        SshService.getSshPublicKey().then(function (response) {
            vm.data = response;
        });
    }
})();
