 /** 
 * @author  :   Chrissy Gonzalez 
  * @file    main.js 
  * 
  * Date    :   November 2015 
  * Project :   Udacity P5-1: Neighborhood Map 
  * @description This code creates a neighborhood map of Park Slope, Brooklyn, NY. 
  * The data model contains a series of locations in the neighborhood. 
  * The view model draws a Google Map, renders locations as map markers, 
  * and searches Foursquare and Flickr for related info when the 
  * markers are tapped or clicked.
  *
  */


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
},{
  position: {lat: 40.674363, lng: -73.981648}, title: 'La Villa'
},{
  position: {lat: 40.679625, lng: -73.984193}, title: 'Brooklyn Boulders'
},{
  position: {lat: 40.677606, lng: -73.984065}, title: 'Dinosaur Bar-B-Que'
},{
  position: {lat: 40.677282, lng: -73.980109}, title: 'Konditori'
},{
  position: {lat: 40.674588, lng: -73.975089}, title: 'Roma Pizza'
},{
  position: {lat: 40.670267, lng: -73.978970}, title: 'Mr. Falafel'
},{
  position: {lat: 40.666512, lng: -73.981649}, title: 'Buttermilk Bakeshop'
},{
  position: {lat: 40.665231, lng: -73.982654}, title: 'Cafe Grumpy'
},{
  position: {lat: 40.666869, lng: -73.984626}, title: 'Bar Toto'
}, {
  position: {lat: 40.663868, lng: -73.983718}, title: 'A Shoe Grows in Brooklyn'
}];

/** the view model **/
var locationViewModel = function(){
  var self = this;
  var form = $('#list-filter-form');

  /** keeps track of whether filter menu is showing */
  self.isMenuOpen = true;

  /** centers the map in Park Slope, Brooklyn */
  self.mapCenter = {lat: 40.678473, lng: -73.978521};

  /** @function sets up and styles the Google map */
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
  };

  /** @function update current location, updates infoWindow content and position */
  self.changeLocation = function(whichLocation){
    self.currentLocation(whichLocation);
    /** setPosition is part of Google Maps API */
    self.infoWindow.setPosition(whichLocation.position);
  };

  /** @function update and format content of infoWindow with API data */
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
  };

  /** @function stop showing locations that don't match filter search */
  self.removeLocation = function(location){
    location.marker.setVisible(false);
    self.locationList.remove(location);
  };

  /** @function set all locations to inactive, then set selected location to active */
  self.toggleActive = function(whichLocation){
    self.allInactive();
    whichLocation.isActive(!whichLocation.isActive());
  };

  /** @function set all locations to inActive */
  self.allInactive = function() {
    for (var i = 0; i < self.locationList().length; i++){
      self.locationList()[i].isActive(false);
      self.locationList()[i].marker.setAnimation(google.maps.Animation.null);
    }
  };

  /** @function deselect list item on infowindow close */
  google.maps.event.addListener(self.infoWindow, "closeclick", function(){
    self.allInactive();
  });

  /** @function clear filter input and reset locationList to its original state */
  self.resetFilter = function(){
    locations.forEach(function(locationItem){
      self.locationList.push(new Location(locationItem, self.map, self));
    });
  };

/** @function this is the new version of my ajax functions */

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
      var venue, address, phone, foursqData;
      if(data1[0].response.venues[0]) {
        venue = data1[0].response.venues[0];
        address = venue.location.formattedAddress.join('<br>');
        vphone = venue.contact.formattedPhone;
        foursqData = address;
        if(phone) { foursqData = foursqData + '<br>' + phone; }
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
      whichLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
    })
    .fail(console.log('ajax error'));
  };

  self.onClick = function(whichLocation) {
    self.getApiData(whichLocation);
  };

  /** @function opens/closes the filter menu */
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

  /** @function filter location list based on input */
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
};

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
    title: this.title(),
    icon: 'img/bluepin.svg'
  });

  this.marker.addListener('click', function(){
    self.onClick(that);
  });

  this.isActive = ko.observable(false);

};

ko.applyBindings(new locationViewModel());

/*
d9e2b24a8f57f49550dccb519a8081a2

Secret:
226389f967702029
*/
