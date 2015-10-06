var locations = [{
  position: {lat: 40.678856, lng: -73.987255}, title: 'Ample Hills Creamery'
},{
  position: {lat: 40.672857, lng: -73.967806}, title: 'Brooklyn Public Library Central Library'
},{
  position: {lat: 40.679724, lng: -73.977934}, title: 'Gorilla Coffee'
},{
  position: {lat: 40.665354, lng: -73.965317}, title: 'Prospect Park Zoo'
},{
  position: {lat: 40.672621, lng: -73.983856}, title: 'JJ Byrne Park'
},{
  position: {lat: 40.674980, lng: -73.988749}, title: 'Whole Foods'
},{
  position: {lat: 40.678246, lng: -73.985748}, title: '718 Cyclery'
},{
  position: {lat: 40.669580, lng: -73.986611}, title: 'Owl Farm'
},{
  position: {lat: 40.680887, lng: -73.975871}, title: 'A. Cheng'
},{
  position: {lat: 40.680557, lng: -73.975152}, title: 'Bklyn Larder'
}];

/*
function initMap() {
  var myLatLng = {lat: 40.678473, lng: -73.978521};

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 14
  });

  for (var location in locations) {
    //console.log(locations[location].position);
    var marker = new google.maps.Marker({
      map: map,
      position: locations[location].position,
      title: locations[location].title
      });
  }
}

initMap();
*/

var ViewModel = function(){
  var myLatLng = {lat: 40.678473, lng: -73.978521};

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 14
  });

  var self = this;

  self.locationList = ko.observableArray([]);

  locations.forEach(function(locationItem){
    self.locationList.push(new Location(locationItem, map));
  });

  self.currentLocation = ko.observable(self.locationList()[0]);

  self.changePlace = function(whichLocation){
    self.currentLocation(whichLocation);
  };

  self.openWindow = function(whichLocation){
    console.log(this.title());
  }

}

var Location = function(data, theMap){
  this.map = theMap;
  this.position = data.position;
  this.title = ko.observable(data.title);
  this.marker = new google.maps.Marker({
    map: this.map,
    position: this.position,
    title: this.title()
  });
}

/*
var Cat = function(data){
  this.clickCount = ko.observable(data.clickCount);
  this.name = ko.observable(data.name);
  this.imgSrc = ko.observable(data.imgSrc);
  this.level = ko.computed(function(){
    if(this.clickCount() < 20){
      return 'Newborn';
    } else if (this.clickCount() < 40){
      return 'Baby';
    } else if (this.clickCount() < 60) {
      return 'Child';
    } else if (this.clickCount() < 70) {
      return 'Teenager';
    }
  }, this);

  this.nicknames = ko.observableArray(data.nicknames);
}
*/

ko.applyBindings(new ViewModel());
