#Neighborhood Map
This single-page application uses Knockout.js and the Google Maps, Foursquare, and Flickr APIs to show a map of my neighborhood and a selection of interesting locations it contains. I built it in October/November 2015 for submission as project 5 in the Udacity Front-end Web Development Nanodegree.

### Classes
<dl>
<dt><a href="#Location">Location</a></dt>
<dd></dd>
</dl>
### Members
<dl>
<dt><a href="#locations">locations</a> : <code>Array</code></dt>
<dd><p>Data model is array of hardcoded locations and their titles</p>
</dd>
</dl>
### Functions
<dl>
<dt><a href="#locationViewModel">locationViewModel()</a></dt>
<dd><p>The ViewModel draws the map and creates Locations to be place on the map.
It contains methods for generating the list of locations, filtering
the list, and pulling in data from external APIs for each Location.</p>
</dd>
</dl>
<a name="Location"></a>
### Location
**Kind**: global class
<a name="new_Location_new"></a>
#### new Location(data, (Object), (Object))
Represents a location on the Google map.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | a single location object from data model |
| (Object) |  | map - reference to the Google map |
| (Object) |  | self - reference to the locationViewModel context |

<a name="locations"></a>
### locations : <code>Array</code>
Data model is array of hardcoded locations and their titles

**Kind**: global variable
<a name="locationViewModel"></a>
### locationViewModel()
The ViewModel draws the map and creates Locations to be place on the map.
It contains methods for generating the list of locations, filtering
the list, and pulling in data from external APIs for each Location.

**Kind**: global function
