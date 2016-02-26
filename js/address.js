/*
This javascript file is responsible for determining the location of the user using google map's Geocoding feature.
It then fills in an input box with the physical address of the user.
It also initializes a map with markers on the user's location and food places around the user.
 */

//Variables that deal with geocoding
var geocoder, currentLat, currentLng, currentLocation;

//These variables hold the images of the markers for the different types of food places
var image = '../img/here.png';
var supermarket = '../img/supermarket.png';
var fruit = '../img/fruit.png';
var market = '../img/market.png';
var garden = '../img/garden.png';
var convenience = '../img/convenience.png';
var takeaway = '../img/takeaway.png';
var other = '../img/other.png';

//Array to hold all the markers which will be randomly chosen later
var markerList = [supermarket, fruit, market, garden, convenience, takeaway, other];

//Variables that will hold Google Maps components
var map, marker, infoWindow;
var zoomAmount = 18;

/*
This function is responsible for determining the user's position.
Uses the geolocation feature to determine the current location. If current device doesn't have the feature,
the error message is displayed and the map will not be initialized.
 */
function getLocation() {

    geocoder = new google.maps.Geocoder;
    currentLocation = document.getElementById("currentLocation"); //Assign the variable to the input box for the address

    /*
     If the current device has the geolocation feature then proceed determining the user's position.
     Otherwise, display the error message to the user.
     */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        currentLocation.value = "Cannot find current location";
    }
}

/*
This function receives an object containing the latitude and longitude of the user's position.
Assigns the values to the appropriate variables and calls geocodeLatLng(currentLat,currentLng)
to convert from LatLng to physical address
 */
function showPosition(position) {
    currentLat = position.coords.latitude;
    currentLng = position.coords.longitude;

    geocodeLatLng(currentLat,currentLng);
}

/*
Uses the geocode() function in the geocoder to convert from LatLng to physical address. The results are stored
in an array (results) which contain multiple variants of addresses but the common one used is the one in the
first position (index 0).
 */
function geocodeLatLng(currentLat,currentLng) {

    var tempLatLng = {lat: currentLat, lng: currentLng};

    geocoder.geocode({'location': tempLatLng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                currentLocation.value = results[0].formatted_address;
                initMap(tempLatLng);
            } else {
                currentLocation.value = 'No results found';
            }
        } else {
            currentLocation.value = 'Geocoder failed due to: ' + status;
        }
    });
}

/*
This function creates a Google Map element and embeds the map inside a div in the html file.
The map has all points of interests removed except for schools and medical facilities to improve
clarity of the map. The map will be populated by markers which indicate a food business.
 */
function initMap(tempLatLng) {

    /*
    Array to hold the styles to apply to the gMap element
     */
    var styles = [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
        ,{
            featureType: "poi.school",
            elementType: "labels",
            stylers: [
                { visibility: "on" }
            ]
        }
        ,{
            featureType: "poi.medical",
            elementType: "labels",
            stylers: [
                { visibility: "on" }
            ]
        }
    ];

    /*
    Creates the map with specified zoom value and center.
    The default UI is disabled to improve clarity in the map
     */
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoomAmount,
        center: tempLatLng,
        disableDefaultUI: true
    });

    //Associate the styled map with the MapTypeId and set it to display.
    var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    initMarker(tempLatLng);
    initInfoWindow();
    getFoodPlaces(tempLatLng);

}

/*
Creates a marker indicating the location of the user
 */
function initMarker(tempLatLng){
    marker = new google.maps.Marker({
        position: tempLatLng,
        map: map,
        icon: image
    });
}

/*
Creates a info window to display a message to the user.
The info window will appear on the marker where the user is located
 */
function initInfoWindow(){
    infoWindow = new google.maps.InfoWindow({
        map: map,
        content: 'You are here'
    });

    infoWindow.open(map, marker);
}

/*
This function searches for all the nearby places of the specified types in the
type array passed into the request to the function nearbySearch().
The center of the search is the location of the user.
 */
function getFoodPlaces(tempLatLng){
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: tempLatLng,
        radius: 500,
        types: ['bakery', 'bar' , 'cafe','food',
            'grocery_or_supermarket', 'hospital', 'meal_delivery' , 'meal_takeaway',
            'restaurant' , 'school']
    }, createFoodMarker);
}

/*
This function takes in an array of places and goes through each element and creates
a marker for them which will appear on the map.
 */
function createFoodMarker(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

/*
This function creates a marker for each of the places passed into the function.
It chooses the markers randomly from the array of images specified at the top of this file.
It attaches an event listener to each marker so that when the user clicks on the marker,
an info window opens with the appropriate information about the food place.
 */
function createMarker(place) {
    var randomNumber = Math.floor(Math.random() * (markerList.length)); //Choose a random number between 0-markerList.length
    var tempImage = markerList[randomNumber]; //Choose a random marker

    var marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        icon: tempImage
    });

    /*
    The info window contains the name of the place, the ETA with a bicycle icon and
    a list of badges that the place has earned. This information is hard coded because
    the prototype is used to communicate this design idea across.
     */
    var infoWindowContent = '<p style="padding:0px; margin:0px;" onclick=\"window.location.href=\'food.html\'\">' +
                                place.name + '<br> 5 min&nbsp <i class="fa fa-bicycle"></i>' +

                                '<div class="row">' +

                                    '<div class="col-xs-4" style="padding-right:0px;">' +
                                        '<img style="width:40px; height:40px; padding:0px; margin:0px;" src="../img/oilBadge.png"/>' +
                                    '</div>' +
                                    '<div class="col-xs-4" style="padding-right:0px;">' +
                                        '<img style="width:40px; height:40px; padding:0px; margin:0px;" src="../img/saltBadge.png"/>' +
                                    '</div>' +
                                    '<div class="col-xs-4">' +
                                        '<img style="width:25px; height:25; padding:0px;  padding-top:15px; margin:0px;" src="../img/sugarBadge.png"/>' +
                                    '</div>' +

                                '</div>' +
                            '</p>';

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, this);
    });
}