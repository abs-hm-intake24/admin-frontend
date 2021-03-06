/**
 * Created by Tim Osadchiy on 24/10/2016.
 */

'use strict';

module.exports = function (app) {
    app.directive('fileButton', [directiveFun]);

    function directiveFun() {

        function controller(scope, element, attributes) {
            element.bind("click", function (e) {

                if (element && element[0].attributes.disabled)
                    return false;

                var $input = angular.element("<input type='file' class='hidden'" +
                    (scope.multiple ? ' multiple ' : '') + ">");
                $input[0].onchange = function () {
                    scope.onChange({fileList: $input[0].files});
                    $input.remove();
                    scope.$apply();
                };
                element.after($input);
                $input[0].click();
            });
        }

        return {
            restrict: 'A',
            link: controller,
            scope: {
                multiple: "=?",
                onChange: "&"
            }
        };
    }

};
