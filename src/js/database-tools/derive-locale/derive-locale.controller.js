"use strict";

var _ = require("underscore");

module.exports = function (app) {
    app.controller("DeriveLocaleController", ["$scope", "DeriveLocaleService",
        "LocalesService", "MessageService", "appRoutes", controllerFun]);
};

function controllerFun($scope, DeriveLocaleService, LocalesService, MessageService, AppRoutes) {


    $scope.requestInProgress = false;
    $scope.sourceLocale = undefined;
    $scope.targetLocale = undefined;
    $scope.errors = [];

    LocalesService.list().then(function (locales) {
        $scope.locales = locales;
    });

    $scope.uploadSpreadsheet = function (files) {
        $scope.requestInProgress = true;

        DeriveLocaleService.deriveLocale($scope.sourceLocale, $scope.targetLocale, files[0]).then(
            function (response) {
                $scope.requestInProgress = false;
                MessageService.showSuccess("New food database initialised successfully");
            }, function (response) {
                $scope.requestInProgress = false;

                if (response.status == 400) {
                    $scope.errors = response.data.errors;
                }
            }
        );
    };
}
