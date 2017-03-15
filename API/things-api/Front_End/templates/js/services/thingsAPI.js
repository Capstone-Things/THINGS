//This File will hold a factory that Will handle all of our
var app = angular.module('catthings_app');

//This Factory will act as a global doorway to the THIGNS API, all controllers
//will have access to this service.
app.factory('thingsAPI', ['$http', '$q', function ($http, $q) {
    //private Variables
    var _admin = false;
    var _token = null;
    var _user = 'Guest';

    //For local dev mode comment out the first line and uncomment the second...
    var _urlBase = 'https://things.cs.pdx.edu:3000/api/';
    //var _urlBase = 'https://localhost:3000/api/';


    var obj = {}; //this is the object that will be handed to our controller.
    //Methods

    //Getters
    obj.getUserName = () => { return _user; }
    obj.getBaseURL = () => { return _urlBase; }
    obj.getAdmin = () => { return _admin; }

    //Setters
    obj.setToken = (token) => { _token = token };
    obj.setUserName = (user) => { _user = user };
    obj.setAdmin = (admin) => { _admin = admin };

    //route calls
    obj.authenticate = (loginData) => {
        return $http.post(_urlBase + 'authenticate', loginData);
    }

    //get view
    obj.getView = () => {
        return $http.get(_urlBase + 'view');
    }

    //get Statistic
    obj.getStatistic = (name) => {
        var req = {
            method: 'GET',
            url: `${_urlBase}a/admin/stats/avgperday/${name}`,
            headers: {
                'x-access-token': _token
            }
        }
        return $http(req);
    }

    //get ShoppingList
    obj.getShoppingList = () => {
        var req = {
            method: 'GET',
            url: `${_urlBase}a/admin/shoppinglist`,
            headers: {
                'x-access-token': _token
            }
        }
        return $http(req);
    }

    //checkout
    obj.checkout = (id, person, qty) => {
        var req = {
            method: 'POST',
            url: `${_urlBase}a/checkout/${id}/${person}/${qty}`,
            headers: {
                'x-access-token': _token
            },
        }
        //return $http(req);

        var deferred = $q.defer();
        var promise = $http(req);
        promise.success(function () {
            deferred.resolve({
                success: true,
                item_id: id,
                name: person,
                quantity: qty
            });
        });
        promise.error(function (err, stat) {
            deferred.resolve({
                success: false,
                item_id: id,
                name: person,
                quantity: qty,
                error: err,
                status: stat
            });
        });
        return deferred.promise;
    }//end checkout

    //checkin
    obj.checkin = (id, person, qty) => {
        var req = {
            method: 'POST',
            url: `${_urlBase}a/admin/checkin/${id}/${person}/${qty}`,
            headers: {
                'x-access-token': _token
            }
        }
        //return $http(req);

        var deferred = $q.defer();
        var promise = $http(req);
        promise.success(function () {
            deferred.resolve({
                success: true,
                item_id: id,
                name: person,
                quantity: qty
            });
        });
        promise.error(function (err, stat) {
            deferred.resolve({
                success: false,
                item_id: id,
                name: person,
                quantity: qty,
                error: err,
                status: stat
            });
        });
        return deferred.promise;
    }

    //log out
    obj.logOut = () => {
        _name = 'Guest';
        _admin = false;
        _token = null;
    };

    return obj;//return the object
}]);
