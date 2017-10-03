/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

var angular = require("angular");

module.exports = function (app) {
    app.directive("guidedImageEditorMeta", ["$route",
        "GuidedImagesService", directiveFun]);

    function directiveFun($route, GuidedImagesService) {

        function controller(scope, element, attributes) {

            scope.loading = false;

            scope.editState = false;

            scope.edit = function () {
                scope.editState = true
            };

            scope.cancel = function () {
                refresh.call(scope);
                scope.editState = false;
            };
            scope.save = function () {
                scope.loading = true;
                GuidedImagesService
                    .patchMeta(scope.guideImageId, {id: scope.newId, description: scope.newDescription})
                    .then(function (data) {
                        $route.updateParams({guidedId: data.id});
                    })
                    .finally(function () {
                        scope.loading = false;
                    });
            };

            scope.$watch("[guideImageId,guideImageDescription]", function () {
                refresh.call(scope);
            })
        }

        return {
            restrict: 'E',
            link: controller,
            scope: {
                guideImageId: "=?",
                guideImageDescription: "=?"
            },
            template: require("./guided-image-editor-meta.directive.html")
        };
    }

};

function refresh() {
    this.newId = this.guideImageId;
    this.newDescription = this.guideImageDescription;
    console.log(this);
}


