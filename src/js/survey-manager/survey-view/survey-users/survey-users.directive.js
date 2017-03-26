/**
 * Created by Tim Osadchiy on 19/03/2017.
 */

"use strict";

var userTypes = require("./survey-users-types")();

module.exports = function (app) {
    app.directive("surveyUsers", ["AdminUsersService", directiveFun]);
    require("./survey-user-modal/survey-user-modal.directive")(app);
};

function directiveFun(AdminUsersService) {

    function controller(scope, element, attribute) {

        scope.userModalIsOpen = false;

        scope.views = {
            staff: new View("Staff"),
            respondents: new View("Respondents")
        };

        scope.searchQuery = "";

        scope.users = [];

        scope.userTypes = userTypes;

        scope.editedUser = null;

        scope.newUser = function () {
            scope.userModalIsOpen = true;
        };

        scope.selectView = function (view) {
            for (var i in scope.views) {
                if (scope.views.hasOwnProperty(i)) {
                    scope.views[i].active = false;
                }
            }
            view.active = true;
        };

        scope.onUserSaved = function () {
            console.log(user);
        };

        scope.selectView(scope.views.respondents);

        scope.$watchCollection(function () {
            return [scope.surveyId, scope.views.staff.active, scope.views.respondents.active];
        }, function (newVal) {
            if (scope.surveyId == null) {
                return;
            } else if (scope.views.staff.active) {
                AdminUsersService.listSurveyStaff(scope.surveyId, 0, 999).then(function (data) {
                    scope.users = data;
                });
            } else if (scope.views.respondents.active) {
                AdminUsersService.listSurveyRespondents(scope.surveyId, 0, 999).then(function (data) {
                    scope.users = data;
                });
            }
        }, true);

        scope.$watch("userModalIsOpen", function (newVal) {
            if (!newVal) {
                scope.editedUser = null;
            }
        });

    }

    return {
        restrict: "E",
        scope: {
            surveyId: "=?"
        },
        link: controller,
        template: require("./survey-users.directive.html")
    }

}

function View(name) {
    this.name = name;
    this.active = false;
}
