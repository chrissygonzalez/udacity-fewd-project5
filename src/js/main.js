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
function initMap(){
  var myLatLng = {lat: 40.678473, lng: -73.978521};

  var map = new google.maps.Map(document.getElementById('map'), {
    center: self.myLatLng,
    scrollwheel: false,
    zoom: 14
  });
}
*/

var locationViewModel = function(){
  var self = this;

  var form = $('#list-filter-form');

  // set up the map
  self.mapCenter = {lat: 40.678473, lng: -73.978521};

  self.map = new google.maps.Map(document.getElementById('map'), {
    center: self.mapCenter,
    scrollwheel: false,
    zoom: 14
  });

  // list of locations, current location, change current location
  self.locationList = ko.observableArray([]);

  locations.forEach(function(locationItem){
    self.locationList.push(new Location(locationItem, self.map, self));
  });

  self.currentLocation = ko.observable(self.locationList()[0]);

  // define the infoWindow
  self.infoWindow = new google.maps.InfoWindow({
    content: self.currentLocation().title(),
    pixelOffset: new google.maps.Size(0, -38)
  });

  form.submit(function(){
    //alert($('input:text').val());
    var listLength = self.locationList().length;
    var filterVal = $('input:text').val().toLowerCase();
    var filterValLength = filterVal.length;

    for (var i = 0; i < listLength; i++) {
      var compareString = self.locationList()[i].title().substring(0, filterValLength).toLowerCase();
      debugger;
      if (filterVal === compareString) {
        console.log(self.locationList()[i].title() + ' matched!');
        debugger;
      }
      //console.log(self.locationList()[i].title() + ' ' + filterVal + ' ' + filterValLength);
    }
    return false;
  });

  self.changeLocation = function(whichLocation){
    self.currentLocation(whichLocation);
    self.infoWindow.setPosition(whichLocation.position);
    self.updateInfoWindow(whichLocation);
  };

  self.openWindow = function(whichLocation){
    self.infoWindow.open(self.map);
  }

  self.updateInfoWindow = function(whichLocation){
    self.infoWindow.setContent(whichLocation.title());
  }

  // update location and create/update infoWindow with current location
  self.onClick = function(whichLocation){
    self.changeLocation(whichLocation);
    self.openWindow();
  };

  self.filterList = function(){

  }
}

var Location = function(data, map, self){
  this.map = map;
  this.position = data.position;
  this.title = ko.observable(data.title);

  this.marker = new google.maps.Marker({
    map: this.map,
    position: this.position,
    title: this.title()
  });

  this.marker.addListener('click', function(){
    self.infoWindow.open(this.map);
    self.infoWindow.setContent(this.title);
    self.infoWindow.setPosition(this.position);
  });

}

ko.applyBindings(new locationViewModel());
