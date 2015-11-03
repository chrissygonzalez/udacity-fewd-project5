/** hardcoded locations for map pins **/
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

/** the view model **/
var locationViewModel = function(){
  var self = this;
  var form = $('#list-filter-form');

  /** keeps track of whether filter menu is showing */
  self.isMenuOpen = true;

  /** centers the map in Park Slope, Brooklyn */
  self.mapCenter = {lat: 40.678473, lng: -73.978521};

  /** sets up and styles the Google map */
  self.map = new google.maps.Map(document.getElementById('map'), {
    center: self.mapCenter,
    scrollwheel: false,
    zoom: 15,
    mapTypeControl: false,
    styles: [
  {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#E0E0CD" }
    ]
  },{
    "featureType": "road",
    "stylers": [
      { "color": "#F7F7E7" }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "color": "#C1C9DB" }
    ]
  },{
    "featureType": "poi.park",
    "stylers": [
      { "color": "#CBE2B3" }
    ]
  },{
    "elementType": "labels.text.fill",
    "stylers": [
      { "color": "#939378" }
    ]
  },{
    "featureType": "poi.medical",
    "elementType": "geometry",
    "stylers": [
      { "color": "#E2DBB1" }
    ]
  },{
    "featureType": "poi.school",
    "elementType": "geometry",
    "stylers": [
      { "color": "#E2DBB1" }
    ]
  },{
    "featureType": "transit",
    "elementType": "labels.icon",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi.business",
    "stylers": [
      { "visibility": "off" }
    ]
  }
]
  });

  /** observable array of each location in data model */
  self.locationList = ko.observableArray([]);

  /** push each location in data model into ko observable array */
  locations.forEach(function(locationItem){
    self.locationList.push(new Location(locationItem, self.map, self));
  });

  /** set current location to ko observable containing first location in array */
  self.currentLocation = ko.observable(self.locationList()[0]);

  /** set up a single infoWindow */
  self.infoWindow = new google.maps.InfoWindow({
    content: self.currentLocation().title(),
    pixelOffset: new google.maps.Size(0, -38)
  });

  /** open infoWindow */
  self.openWindow = function(whichLocation){
    self.infoWindow.open(self.map);
  }

  /** update current location, updates infoWindow content and position */
  self.changeLocation = function(whichLocation){
    self.currentLocation(whichLocation);
    /** setPosition is part of Google Maps API */
    self.infoWindow.setPosition(whichLocation.position);
  };

  /** update and format content of infoWindow with API data */
  self.updateInfoWindow = function(whichLocation, flickrData, foursqData){
    var contentString = '';
    if(flickrData){
      contentString += '<img src="' + flickrData + '" alt="Flickr photo">';
    }
    if(foursqData){
      contentString += '<p><span class="bold">' + whichLocation.title() + '</span><br>' + foursqData + '</p>';
    } else {
      contentString += '<p class="bold">' + whichLocation.title() + '</p>';
    }
    /** setContent is part of Google Maps API */
    self.infoWindow.setContent(contentString);
  }

  /** stop showing locations that don't match filter search */
  self.removeLocation = function(location){
    location.marker.setVisible(false);
    self.locationList.remove(location);
  };

  /** set all locations to inactive, then set selected location to active */
  self.toggleActive = function(whichLocation){
    for (var i = 0; i < self.locationList().length; i++){
      self.locationList()[i].isActive(false);
    }
      whichLocation.isActive(!whichLocation.isActive());
  };

  /** clear filter input and reset locationList to its original state */
  self.resetFilter = function(){
    locations.forEach(function(locationItem){
      self.locationList.push(new Location(locationItem, self.map, self));
    });
  };

/* this is the new version of my ajax functions */

  self.getApiData = function(whichLocation){
    var myTitle = whichLocation.title;
    var myPos = whichLocation.position;
    var myTxt = whichLocation.title();
    var searchTxt = myTxt.split(' ').join('+');

    $.when(
      $.ajax({
      url: 'https://api.foursquare.com/v2/venues/search?ll=' + myPos.lat + ',' + myPos.lng + '&intent=match&query=' + myTitle() + '&client_id=RBVKWXN2WH0OQLFMDGKAKNIAIPOLODHEKBLYIHMCQYX3AKJ0&client_secret=LUFOAZGAL4BYJJKBGY2ZJ0MNHRXFS0DOTKCWIW0GXYUI4X1X&v=20151018',
        context: document.body
      }),
      $.ajax({
      url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d9e2b24a8f57f49550dccb519a8081a2&text=' + searchTxt +'&lat=' + myPos.lat + '&lon=' + myPos.lng + '&per_page=1&format=json&nojsoncallback=1',
      context: document.body
    })
    ).done(function(data1, data2){
      if(data1[0].response.venues[0]) {
        var venue = data1[0].response.venues[0];
        var address = venue.location.formattedAddress.join('<br>');
        var phone = venue.contact.formattedPhone;
        var foursqData = address;
        if(phone) { foursqData = foursqData + '<br>' + phone};
      } else {
        foursqData = null;
      }
      var farmId = data2[0].photos.photo[0].farm;
      var serverId = data2[0].photos.photo[0].server;
      var photoId = data2[0].photos.photo[0].id;
      var secret = data2[0].photos.photo[0].secret;

      var flickrData = 'https://farm' + farmId + '.staticflickr.com/' +  serverId + '/' + photoId + '_' + secret + '_q.jpg';

      self.updateInfoWindow(whichLocation, flickrData, foursqData);

      self.changeLocation(whichLocation);
      self.map.panTo(whichLocation.position);
      self.openWindow();
      self.toggleActive(whichLocation);
    });
  };

  self.onClick = function(whichLocation) {
    self.getApiData(whichLocation);
  };


/*
* ----------------------------------------
* the original version of my ajax functions

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
        var foursqData = address;
        if(phone) { foursqData = foursqData + '<br>' + phone};
        self.updateInfoWindow(whichLocation, foursqData);
      } else {
        self.updateInfoWindow(whichLocation);
      }
    })
    .fail(function(){
      self.updateInfoWindow(whichLocation);
    });

    self.changeLocation(whichLocation);
    self.map.panTo(whichLocation.position);
    self.openWindow();
    self.toggleActive(whichLocation);

    self.tempFlickr(whichLocation);
  };

  self.tempFlickr = function(whichLocation){
     var myTxt = whichLocation.title();
     var searchTxt = myTxt.split(' ').join('+');
     var myPos = whichLocation.position;
    $.ajax({
      url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d9e2b24a8f57f49550dccb519a8081a2&text=' + searchTxt +'&lat=' + myPos.lat + '&lon=' + myPos.lng + '&per_page=1&format=json&nojsoncallback=1',
      context: document.body
    }).done(function(data){
      var farmId = data.photos.photo[0].farm;
      var serverId = data.photos.photo[0].server;
      var photoId = data.photos.photo[0].id;
      var secret = data.photos.photo[0].secret;
      console.log('https://farm' + farmId + '.staticflickr.com/' +  serverId + '/' + photoId + '_' + secret + '_q.jpg');
    });
  }

  */

  /** opens/closes the filter menu */
  $('#hamburger').click(function(){
    self.isMenuOpen = !self.isMenuOpen;
    console.log(self.isMenuOpen);

    if(self.isMenuOpen) {
      $('.location-list').animate(
      {left: '+=350'}, 500);
    } else {
    $('.location-list').animate(
      {left: '-=350'}, 500);
    }
  });

  /** filter location list based on input */
  form.submit(function(){
    var listLength = self.locationList().length;
    var filterVal = $('input:text').val().toLowerCase();
    var filterValLength = filterVal.length;

    /** compare input to location names, remove ones that don't match */
    for (var i = listLength-1; i > -1; i--) {
      var compareString = self.locationList()[i].title().toLowerCase();
      if (compareString.indexOf(filterVal) < 0) {
        self.removeLocation(self.locationList()[i]);
      }
    }
    /** show link to reset filter */
    $('#reset').show();
    /** close the infoWindow if it was open */
    self.infoWindow.close();
    return false;
  });

  /** resets the filter after a search */
  $('#reset').click(function(){
    self.resetFilter();
  });
}

/**
* Represents a location on the Google map.
* @constructor
* @param {object} data - a single location object from data model
* @param (object) map - reference to the Google map
* @param (object) self - reference to the locationViewModel context
 **/
var Location = function(data, map, self){
  var that = this;
  this.map = map;
  this.position = data.position;
  this.title = ko.observable(data.title);

  this.marker = new google.maps.Marker({
    map: this.map,
    position: this.position,
    title: this.title()
  });

  this.marker.addListener('click', function(){
    self.onClick(that);
  });

  this.isActive = ko.observable(false);

}

ko.applyBindings(new locationViewModel());

/*
d9e2b24a8f57f49550dccb519a8081a2

Secret:
226389f967702029
*/
