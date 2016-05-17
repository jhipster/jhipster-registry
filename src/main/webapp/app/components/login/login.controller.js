(function() {
    'use strict';

    angular
        .module('JHipsterRegistryApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$state', '$sessionStorage', '$timeout', 'Auth', '$uibModalInstance'];

    function LoginController ($rootScope, $state, $sessionStorage, $timeout, Auth, $uibModalInstance) {
        var vm = this;

        vm.authenticationError = false;
        vm.cancel = cancel;
        vm.credentials = {};
        vm.login = login;
        vm.password = null;
        vm.rememberMe = true;
        vm.username = null;

        $timeout(function (){angular.element('#username').focus();});

        function cancel () {
            vm.credentials = {
                username: null,
                password: null,
                rememberMe: true
            };
            vm.authenticationError = false;
            $uibModalInstance.dismiss('cancel');
        }

        function login (event) {
            event.preventDefault();
            Auth.login({
                username: vm.username,
                password: vm.password,
                rememberMe: vm.rememberMe
            }).then(function () {
                vm.authenticationError = false;
                $uibModalInstance.close();
                $state.go('home');

                $rootScope.$broadcast('authenticationSuccess');

                // previousState was set in the authExpiredInterceptor before being redirected to login modal.
                // since login is succesful, go to stored previousState and clear previousState
                if ($sessionStorage.previousStateName) {
                    var previousStateName = $sessionStorage.previousStateName;
                    var previousStateParams = $sessionStorage.previousStateParams;
                    delete $sessionStorage.previousStateName;
                    delete $sessionStorage.previousStateParams;
                    $state.go(previousStateName, previousStateParams);
                }
            }).catch(function () {
                vm.authenticationError = true;
            });
        }
    }
})();
