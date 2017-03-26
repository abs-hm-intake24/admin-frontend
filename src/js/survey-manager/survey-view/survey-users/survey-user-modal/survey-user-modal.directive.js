/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

var userTypes = require("../survey-users-types")(),
    USER_TYPE_STAFF = userTypes.USER_TYPE_STAFF,
    USER_TYPE_RESPONDENT = userTypes.USER_TYPE_RESPONDENT;

module.exports = function (app) {
    app.directive("surveyUserModal", ["AdminUsersService", "ModalService", directiveFun]);
};

function directiveFun(AdminUsersService, ModalService) {

    function controller(scope, element, attribute) {

        scope.newUserName = "";
        scope.password = "";
        scope.name = "";
        scope.email = "";
        scope.phone = "";

        scope.loading = false;

        scope.formValidation = {
            userName: true
        };

        scope.cancel = function () {
            scope.isOpen = false;
        };

        scope.save = function () {
            if (!formIsValid(scope)) {
                return;
            }
            var service,
                userReq = getRequest(scope);
            scope.loading = true;
            if (scope.userType == USER_TYPE_STAFF) {
                service = AdminUsersService.patchSurveyStaff(userReq)
            } else if (scope.userType == USER_TYPE_RESPONDENT) {
                service = AdminUsersService.patchSurveyRespondent(userReq)
            }
            service.then(function () {
                scope.onSaved(userReq);
            }).finally(function () {
                scope.loading = false;
            });
        };

        scope.$watch("isOpen", function (newVal) {
            var modalId = "surveyUserModal";
            if (newVal) {
                ModalService.showArbitraryModal(modalId);
            } else {
                ModalService.hideArbitraryModal(modalId);
            }
        })

    }

    return {
        restrict: "E",
        scope: {
            surveyId: "=?",
            isOpen: "=?",
            user: "=?",
            userType: "=?",
            onSaved: "&"
        },
        link: controller,
        template: require("./survey-user-modal.directive.html")
    }

}

function formIsValid(scope) {
    scope.formValidation.userName = scope.user ? scope.user.userName : scope.newUserName;
    return scope.formValidation.userName;
}

function getRequest(scope) {
    return {
        userName: scope.user ? scope.user.userName : scope.newUserName,
        password: scope.password,
        name: scope.name,
        surveyId: scope.surveyId,
        email: scope.email,
        phone: scope.phone
    }
}
