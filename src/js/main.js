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

var locationViewModel = function(){
  var self = this;
  var form = $('#list-filter-form');

  // set up the map
  self.mapCenter = {lat: 40.678473, lng: -73.978521};

  self.map = new google.maps.Map(document.getElementById('map'), {
    center: self.mapCenter,
    scrollwheel: false,
    zoom: 15
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
    var listLength = self.locationList().length;
    var filterVal = $('input:text').val().toLowerCase();
    var filterValLength = filterVal.length;
    //debugger;
    for (var i = listLength-1; i > -1; i--) {
      var compareString = self.locationList()[i].title().toLowerCase();
      if (compareString.indexOf(filterVal) < 0) {
        self.removeLocation(self.locationList()[i]);
      }
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

  self.updateInfoWindow = function(whichLocation, foursqData){
    //debugger;
    var contentString = '<p>' + whichLocation.title() + '<br>' + foursqData + '</p>';
    self.infoWindow.setContent(contentString);
  }

  // update location and create/update infoWindow with current location
  self.onClick = function(whichLocation){
    var myTitle = whichLocation.title;
    var myPos = whichLocation.position;

    $.ajax({
      url: 'https://api.foursquare.com/v2/venues/search?ll=' + myPos.lat + ',' + myPos.lng + '&intent=match&query=' + myTitle() + '&client_id=RBVKWXN2WH0OQLFMDGKAKNIAIPOLODHEKBLYIHMCQYX3AKJ0&client_secret=LUFOAZGAL4BYJJKBGY2ZJ0MNHRXFS0DOTKCWIW0GXYUI4X1X&v=20151018',
      context: document.body
    }).done(function(data) {
      if (data.response.venues.length > 0) {
        var venue = data.response.venues[0];
        var address = venue.location.formattedAddress.join('<br>');
        var phone = venue.contact.formattedPhone;
        var foursqData = address + '<br>' + phone;
        self.updateInfoWindow(whichLocation, foursqData);
      } else {
        var foursqData = 'not found';
        self.updateInfoWindow(whichLocation, foursqData);
      }
    })
    .fail(function(){
      var foursqData = 'not found';
      self.updateInfoWindow(whichLocation, foursqData);
    });

    self.changeLocation(whichLocation);
    self.openWindow();

  };

  self.removeLocation = function(location){
    //debugger;
    location.marker.setVisible(false);
    self.locationList.remove(location);
  };
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
