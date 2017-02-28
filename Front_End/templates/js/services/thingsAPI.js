//This File will hold a factory that Will handle all of our
var app = angular.module('catthings_app');

//This Factory will act as a global doorway to the THIGNS API, all controllers
//will have access to this service.
app.factory('thingsAPI', ['$http', function($http){
//private Variables
  var _admin = false;
  var _token = null;
  var _user = 'Guest';

  //For local dev mode comment out the first line and uncomment the second...
  var _urlBase = 'https://things.cs.pdx.edu:3000/';
  //var _urlBase = 'https://localhost:3000/';


  var obj = {}; //this is the object that will be handed to our controller.
//Methods

  //Getters
  obj.getUserName = ()=>{return _user;}
  obj.getBaseURL = () =>{return _urlBase;}
  obj.getAdmin = ()=>{return _admin;}

  //Setters
  obj.setToken = (token)=>{_token=token};
  obj.setUserName = (user)=>{_user=user};
  obj.setAdmin = (admin)=>{_admin=admin};

  //route calls
  obj.authenticate=(loginData)=>{
    return $http.post(_urlBase+'authenticate', loginData);
  }

  //get view
  obj.getView = ()=>{
    return $http.get(_urlBase+'view');
  }

  //get history
  obj.getHistory = ()=>{

  }
  //add new item
  obj.add = (name, desc, price, thresh)=>{
    var req = {
      method : 'PUT',
      url: `${_urlBase}a/admin/add/${name}/${desc}/${price}/${thresh}`,
      headers: {
        'x-access-token': _token
      },
    }

    return $http(req);
  }

  //request item
  obj.request = (qData) => {
    return $http.post(_urlBase+'request', qData);
  }

  //checkout ==eventually to become person and cart==
  obj.checkout = (id, person, qty)=>{
    var req = {
      method: 'POST',
      url: `${_urlBase}a/checkout/${id}/${person}/${qty}`,
      headers: {
        'x-access-token': _token
      },
      //data: items
    }

    return $http(req);
    }//end checkout


    //log out
    obj.logOut = ()=>{
      _name = 'Guest';
      _admin = false;
      _token = null;
    };

  return obj;//return the object
}]);
