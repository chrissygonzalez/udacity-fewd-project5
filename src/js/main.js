/**
 * This is my neighborhood map application for Udacity Project 5.
 * @fileOverview Main.js runs my single-page neighborhood map application.
 * @author  Chrissy Gonzalez
 */

/**
 * Data model is array of hardcoded locations and their titles
 * @type {Array}
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

/**
 * The ViewModel draws the map and creates Locations to be place on the map.
 * It contains methods for generating the list of locations, filtering
 * the list, and pulling in data from external APIs for each Location.
 */
var locationViewModel = function(){
  var self = this;

  /**
   * Tracks whether side menu is open or not.
   * @type {Boolean}
   */
  self.isMenuClosed = ko.observable(false);

  /**
   * Tracks content of filter input field
   * @type {String}
   */
  self.searchValue = ko.observable('');

  /**
   * Centers the map on Park Slope, Brooklyn.
   * @type {Object}
   */
  self.mapCenter = {lat: 40.678473, lng: -73.978521};

  /**
   * The Google map and its styles.
   * @type {google}
   */
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

  /**
   * Boundary rectangle for the map
   * @type {google}
   */
  self.bounds = new google.maps.LatLngBounds();

  /**
   * An observable array that holds the current list of locations.
   * @type {Array}
   */
  self.locationList = ko.observableArray([]);

  /**
   * Creates new Location for each object in the data model and pushes
   * it to the locationList.
   * @param  {Object} locationItem from data model
   * @param {google} self.map Reference to the Google Map for creating new Marker
   * @param {Object} self Reference to ViewModel context for calling isActive
   */
  self.initList = function(){
    locations.forEach(function(locationItem){
      self.locationList.push(new Location(locationItem, self.map, self));
    });
  };

  self.initList();
  self.map.fitBounds(self.bounds);

  /**
   * The current location at any time
   * @type {Location}
   */
  self.currentLocation = ko.observable(self.locationList()[0]);

  /**
   * The infoWindow that shows above a selected Marker
   * @type {google}
   */
  self.infoWindow = new google.maps.InfoWindow({
    content: self.currentLocation().title(),
    pixelOffset: new google.maps.Size(0, -30)
  });

  /**
   * Opens the infoWindow
   * @param  {Location}
   */
  self.openWindow = function(whichLocation){
    self.infoWindow.open(self.map);
  };

  /**
   * Updates currentLocation to this Location,
   * moves infoWindow to point to new Marker
   * @param  {Location}
   */
  self.changeLocation = function(whichLocation){
    self.currentLocation(whichLocation);
    self.infoWindow.setPosition(whichLocation.position);
  };

  /**
   * Updates infoWindow content with data from Foursquare and/or Flickr.
   * @param  {Location}
   * @param  {Object}
   * @param  {Object}
   */
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
    self.infoWindow.setContent(contentString);
  };

  /**
   * Calls allInactive, then sets this location to active.
   * @param  {Location}
   */
  self.toggleActive = function(whichLocation){
    self.allInactive();
    whichLocation.isActive(!whichLocation.isActive());
  };

  /**
   * Sets all locations to inactive. Called by toggleActive.
   */
  self.allInactive = function() {
    for (var i = 0; i < self.locationList().length; i++){
      self.locationList()[i].isActive(false);
      self.locationList()[i].marker.setAnimation(google.maps.Animation.null);
    }
  };

  /**
   * Sets all locations to inactive when infoWindow close button is clicked.
   * @param  {google}
   */
  google.maps.event.addListener(self.infoWindow, "closeclick", function(){
    self.allInactive();
  });

  /**
   * Retrieves data on location from Foursquare and Flickr APIs
   * @param  {Location}
   */
  self.getApiData = function(whichLocation){
    var myTitle = whichLocation.title;
    var myPos = whichLocation.position;
    var myTxt = whichLocation.title();
    /**
     * Changes spaces in location.title to + signs for use in Flickr search
     */
    var searchTxt = myTxt.split(' ').join('+');

    $.when(
      /**
       * Foursquare venue query with lat/lng
       * @type {String}
       */
      $.ajax({
      url: 'https://api.foursquare.com/v2/venues/search?ll=' + myPos.lat + ',' + myPos.lng + '&intent=match&query=' + myTitle() + '&client_id=RBVKWXN2WH0OQLFMDGKAKNIAIPOLODHEKBLYIHMCQYX3AKJ0&client_secret=LUFOAZGAL4BYJJKBGY2ZJ0MNHRXFS0DOTKCWIW0GXYUI4X1X&v=20151018',
        context: document.body
      }),
      /**
       * Flickr photo query with lat/lng and title
       * @type {String}
       */
      $.ajax({
      url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d9e2b24a8f57f49550dccb519a8081a2&text=' + searchTxt +'&lat=' + myPos.lat + '&lon=' + myPos.lng + '&per_page=1&format=json&nojsoncallback=1',
      context: document.body
    })
    ).done(function(data1, data2){
      var venue, address, phone, foursqData;
      /**
       * If Foursquare has a matching venue, format response for infoWindow
       * @param  {Object}
       */
      if(data1[0].response.venues[0]) {
        venue = data1[0].response.venues[0];
        address = venue.location.formattedAddress.join('<br>');
        phone = venue.contact.formattedPhone;
        foursqData = address;
        if (phone) { foursqData = foursqData + '<br>' + phone; }
      } else {
        foursqData = null;
      }
      /**
       * Flickr will return something, so format response for infoWindow
       */
      var farmId = data2[0].photos.photo[0].farm;
      var serverId = data2[0].photos.photo[0].server;
      var photoId = data2[0].photos.photo[0].id;
      var secret = data2[0].photos.photo[0].secret;
      var flickrData = 'https://farm' + farmId + '.staticflickr.com/' +  serverId + '/' + photoId + '_' + secret + '_q.jpg';

      /**
       * Now that we have the API data, show it on the map:
       * update the content in the infoWindow, make this the current location,
       * pan the map here, open the infoWindow, set this location to active,
       * make this marker bounce
       */
      self.updateInfoWindow(whichLocation, flickrData, foursqData);
      self.changeLocation(whichLocation);
      self.map.panTo(whichLocation.position);
      self.openWindow();
      self.toggleActive(whichLocation);
      whichLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
      window.setTimeout(function() {
        whichLocation.marker.setAnimation(null);
      }, 2100);
    })
    .fail(function(jqXHR, status, error){
      alert('Oops, we seem to be having trouble getting location data! Sorry for the difficulties. Please try again later.');
    });
  };

  /**
   * Handle click on location item in location list:
   * Get location data and close side menu.
   * @param  {Location}
   */
  self.onClick = function(whichLocation) {
    self.getApiData(whichLocation);
    if(!self.isMenuClosed()) {
      self.isMenuClosed(true);
    }
  };

  /**
   * Reset value of searchValue to an empty string
   */
  self.clearSearch = function(){
    self.searchValue('');
  };

  /**
   * Toggle side menu open/closed when hamburger button is clicked.
   */
  self.toggleMenu = function(){
    self.isMenuClosed(!self.isMenuClosed());
    console.log(self.isMenuClosed());
  };

  /**
   * Update visible locations based on value of searchValue
   */
  self.filterList = ko.computed(function() {
    var listLength = self.locationList().length;
    var filterVal = self.searchValue().toLowerCase(); // Get the value of the search input field

    // for each location
    for (var i = 0; i < listLength; i++) {
      var compareString = self.locationList()[i].title().toLowerCase();
      // Does the location name contain the search term?
      if (compareString.indexOf(filterVal) < 0) {
        self.locationList()[i].marker.setVisible(false); // hide the map marker
        self.locationList()[i]._destroy(true); // hide the location in the list view
      } else {
        self.locationList()[i].marker.setVisible(true); // show the map marker
        self.locationList()[i]._destroy(false); // show the location in the list view
      }
    }

    self.infoWindow.close();
    self.allInactive();
  });
};

/**
* Represents a location on the Google map.
* @constructor
* @param {Object} data - a single location object from data model
* @param (Object) map - reference to the Google map
* @param (Object) self - reference to the locationViewModel context
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

  self.bounds.extend(new google.maps.LatLng(this.position.lat, this.position.lng));

  this.marker.addListener('click', function(){
    self.onClick(that);
  });

  this.isActive = ko.observable(false);
  this._destroy = ko.observable(false);
};

/**
 * Callback function for asynchronous Google Map loading
 **/
function initMap() {
  ko.applyBindings(new locationViewModel());
}
