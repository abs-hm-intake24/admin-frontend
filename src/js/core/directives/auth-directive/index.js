/**
 * Created by Tim Osadchiy on 29/12/2016.
 */

"use strict";

module.exports = function (app) {
    app.directive("authDirective", ["UserStateService", "UserRequestService", "ModalService", "MessageService", directiveFun]);
};

function directiveFun(UserStateService, UserRequestService, ModalService, MessageService) {

    function controller(scope, element, attributes) {

        scope.survey_id = ""; // TODO
        scope.username = UserStateService.getUsername();
        scope.password = "";
        scope.modalLogOutVisible = false;
        scope.modalAuthenticateVisible = false;
        scope.modalResetPasswordVisible = false;

        scope.getBackdropVisibe = function () {
            return scope.modalLogOutVisible || scope.modalAuthenticateVisible || scope.modalResetPasswordVisible;
        };

        scope.login = function () {
            UserRequestService.login(scope.username, scope.password).then(function (data) {
                UserStateService.init(scope.username, data.refreshToken);
                UserRequestService.refresh().then(function (data) {
                    UserStateService.setAccessToken(data.accessToken);
                    ModalService.hideAll();
                }, function () {
                    UserStateService.logout();
                }).finally(function () {
                    scope.password = "";
                });
            });
        };

        scope.showPasswordReset = function() {
            scope.recaptchaResponse = undefined;
            ModalService.hideAll();
            ModalService.showPasswordResetModal();
        };

        scope.logout = function () {
            UserStateService.logout();
            ModalService.showAuthenticateModal();
        };

        scope.hideLogoutModal = function () {
            ModalService.hideLogoutModal();
        };

        scope.hidePasswordResetModal = function () {
          ModalService.hidePasswordResetModal();
          ModalService.showAuthenticateModal();
        };

        window.recaptchaCallback = function(r) {
          scope.recaptchaResponse = r;
        };

        scope.requestPasswordReset = function(r) {
            if (scope.recaptchaResponse) {

            } else
                MessageService.showWarning("Please tick the \"I'm not a robot\" box!");
        }

        scope.$watchCollection(function () {
            return [ModalService.getModalAuthenticateVisible(),
                ModalService.getModalLogOutVisible(),
            ModalService.getModalResetPasswordVisible()];
        }, function () {
            scope.modalAuthenticateVisible = ModalService.getModalAuthenticateVisible();
            scope.modalLogOutVisible = ModalService.getModalLogOutVisible();
            scope.modalResetPasswordVisible = ModalService.getModalResetPasswordVisible();
        });


        scope.$watch(function () {
            return UserStateService.getAuthenticated();
        }, function () {
            if (UserStateService.getAuthenticated()) {
                ModalService.hideAll();
            } else {
                ModalService.showAuthenticateModal();
            }
        });

    }

    return {
        restrict: "E",
        link: controller,
        scope: {},
        template: require("./auth-directive.pug")
    };
}
