/**
 * Created by Tim Osadchiy on 26/03/2017.
 */

"use strict";

var getFormedUrl = require("../utils/get-formed-url");

module.exports = function (app) {
    app.service("AdminUsersService", ["$http", "$window", serviceFun]);
};

function serviceFun($http, $window) {

    var surveyStaffUrlPattern = $window.api_base_url + "surveys/:surveyId/users/staff",
        surveyRespondentsUrlPattern = $window.api_base_url + "surveys/:surveyId/users/respondents",
        surveyRespondentsCsvUrlPattern = $window.api_base_url + "surveys/:surveyId/users/respondents/upload-csv",
        surveyAclUrlPattern = $window.api_base_url + "surveys/:surveyId/acl",
        usersUrlPattern = $window.api_base_url + "users",
        userUrlPattern = $window.api_base_url + "users/:userId",
        userDeleteUrlPattern = $window.api_base_url + "users/:userId",
        userPasswordUrlPattern = $window.api_base_url + "users/:userId/password",
        authUrlsExportUrlPattern = $window.api_base_url + "data-export/:surveyId/users/authentication-urls/export",
        authUrlsStatusUrlPattern = $window.api_base_url + "data-export/:surveyId/users/authentication-urls/:requestId";

    function unpackPublicUserDataWithAlias(data) {
        return {
            id: data.id,
            userName: data.userName,
            email: data.email[0],
            name: data.name[0],
            phone: data.phone[0],
            emailNotifications: data.emailNotifications,
            smsNotifications: data.smsNotifications,
            roles: data.roles
        }
    }

    function unpackPublicUserDataWithAliasList(dataList) {
        return dataList.map(unpackPublicUserDataWithAlias);
    }

    function packCreateUseData(data) {
        return {
            userInfo: {
                name: data.name ? [data.name] : [],
                email: data.email ? [data.email] : [],
                phone: data.phone ? [data.phone] : [],
                roles: data.roles,
                customFields: {},
            },
            password: data.password
        }
    }

    function packCreateOrUpdateRespondentData(data) {
        return {
            id: data.id,
            userName: data.userName,
            password: data.password,
            name: data.name ? [data.name] : [],
            email: data.email ? [data.email] : [],
            phone: data.phone ? [data.phone] : [],
            customFields: {}
        }
    }

    function packPatchUserData(data) {
        return {
            name: data.name ? [data.name] : [],
            email: data.email ? [data.email] : [],
            phone: data.phone ? [data.phone] : [],
            roles: data.roles,
            emailNotifications: data.emailNotifications,
            smsNotifications: data.smsNotifications,
            customFields: {}
        }
    }

    return {
        listSurveyRespondents: function (surveyId, offset, limit) {
            var url = getFormedUrl(surveyRespondentsUrlPattern, {surveyId: surveyId}) +
                "?offset=" + offset +
                "&limit=" + limit;
            return $http.get(getFormedUrl(url)).then(unpackPublicUserDataWithAliasList);
        },
        listSurveyStaff: function (surveyId, offset, limit) {
            var url = getFormedUrl(surveyStaffUrlPattern, {surveyId: surveyId}) +
                "?offset=" + offset +
                "&limit=" + limit;
            return $http.get(url).then(unpackPublicUserDataWithAliasList);
        },
        createOrUpdateRespondent: function (userReq) {
            var url = getFormedUrl(surveyRespondentsUrlPattern, {surveyId: userReq.surveyId});
            var data = {users: [userReq].map(packCreateOrUpdateRespondentData)};
            return $http.post(url, data);

        },
        createUser: function (userReq) {
            var data = packCreateUseData(userReq);
            return $http.post(usersUrlPattern, data);

        },
        patchUser: function (userId, userReq) {
            var url = getFormedUrl(userUrlPattern, {userId: userId});
            var data = packPatchUserData(userReq);
            return $http.patch(url, data);

        },
        deleteUser: function (userId) {
            var url = getFormedUrl(userDeleteUrlPattern, {userId: userId});
            return $http.delete(url);
        },
        patchUserPassword: function (userId, password) {
            var url = getFormedUrl(userPasswordUrlPattern, {userId: userId});
            return $http.patch(url, {password: password});

        },
        uploadSurveyRespondentsCsv: function (surveyId, file) {
            var url = getFormedUrl(surveyRespondentsCsvUrlPattern, {surveyId: surveyId});
            var fd = new FormData();
            fd.append("file", file);
            return $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {"Content-Type": undefined}
            });
        },
        giveUsersAccessToSurvey: function (surveyId, userAccessSeq) {
            var url = getFormedUrl(surveyAclUrlPattern, {surveyId: surveyId});
            return $http.post(url, userAccessSeq);
        },
        withdrawUsersAccessToSurvey: function (surveyId, userAccessSeq) {
            return $http({
                method: 'DELETE',
                url: getFormedUrl(surveyAclUrlPattern, {surveyId: surveyId}),
                data: userAccessSeq,
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            });
        },
        find: function (query) {
            return $http.get(usersUrlPattern + "?q=" + query + "&limit=20");
        },
        exportAuthUrls: function(surveyId) {
            return $http.post(getFormedUrl(authUrlsExportUrlPattern, { surveyId: surveyId}));
        },
        authUrlsExportStatus: function (surveyId, requestId) {
            return $http.get(getFormedUrl(authUrlsStatusUrlPattern, { surveyId: surveyId, requestId: requestId}));
        }
    };

}
