#Neighborhood Map
This single-page application uses Knockout.js and the Google Maps, Foursquare, and Flickr APIs to show a map of my neighborhood and a selection of interesting locations it contains. I built it in October/November 2015 for submission as project 5 in the Udacity Front-end Web Development Nanodegree.

##How to run the app

 1. Download the project files
 2. Navigate to udacity-fewd-project5/dist
 3. Open the index.html file in a browser.
 4. Click around the list of locations or map markers to see more information about the locations.

##How to review the app

 1. Download the project files.
 2. Open Terminal and install the missing node modules:
 3. Grunt (npm install -g grunt-cli): task runner that automates the build process
 4. Cssmin (npm install grunt-contrib-cssmin): minifies the style.css file for faster loading
 5. Jshint (npm install grunt-contrib-jshint): Lints the main.js file for Javascript errors
 5. Uglify (npm install grunt-contrib-uglify): minifies the main.js file for faster loading
 6. JSdoc (npm install grunt-jsdoc): generates documentation based on comments in main.js
 7. JSDoc to Markdown (npm install grunt-jsdoc-to-markdown): generates a readme.md based on comments in main.js
 8. Processhtml (npm install grunt-processhtml): replace links to style.css and main.js with style.min.css and main.min.js
 9. Enter 'grunt' into Terminal to run the build (note that this will replace the readme.md you downloaded with an automated version without the introduction.)
 10. Navigate to udacity-fewd-project5/src and open index.html to run the app.
 11. Open udacity-fewd-project5/src/js/main.js to review the app code.

##Sources

 1. http://knockoutjs.com/
 2. https://developers.google.com/maps/documentation/javascript/
 3. http://www.hoonzis.com/knockoutjs-and-google-maps-binding/
 4. http://blog.logiticks.com/dynamically-binding-google-maps-location-using-knockout-js/
 5. http://jsfiddle.net/t9wcC/

## Classes
<dl>
<dt><a href="#Location">Location</a></dt>
<dd></dd>
</dl>
## Members
<dl>
<dt><a href="#locations">locations</a> : <code>Array</code></dt>
<dd><p>Data model is array of hardcoded locations and their titles</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#locationViewModel">locationViewModel()</a></dt>
<dd><p>The ViewModel draws the map and creates Locations to be place on the map.
It contains methods for generating the list of locations, filtering
the list, and pulling in data from external APIs for each Location.</p>
</dd>
<dt><a href="#initMap">initMap()</a></dt>
<dd><p>Callback function for asynchronous Google Map loading</p>
</dd>
</dl>
<a name="Location"></a>
## Location
**Kind**: global class
<a name="new_Location_new"></a>
### new Location(data, (Object), (Object))
Represents a location on the Google map.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | a single location object from data model |
| (Object) |  | map - reference to the Google map |
| (Object) |  | self - reference to the locationViewModel context |

<a name="locations"></a>
## locations : <code>Array</code>
Data model is array of hardcoded locations and their titles

**Kind**: global variable
<a name="locationViewModel"></a>
## locationViewModel()
The ViewModel draws the map and creates Locations to be place on the map.
It contains methods for generating the list of locations, filtering
the list, and pulling in data from external APIs for each Location.

**Kind**: global function
<a name="initMap"></a>
## initMap()
Callback function for asynchronous Google Map loading

**Kind**: global function
