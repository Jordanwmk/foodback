/*
This javascript file is responsible for displaying the direction between 2 points on the map.
It initializes a map with markers on the 2 points of interest. It uses a google.maps.DirectionsService to determine the
path between the 2 points. Then it uses a google.maps.directions.DirectionsRenderer to draw the directions between the 2 places.
It also populates the map with markers of the user's location and food places around the user.
 */

//Variables that hold a hard coded LatLng object in the event that the device doesn't have the geolocation feature
var tempLatLng = {lat: -36.8576017, lng: 174.7590294};
var tempDest = {lat: -36.8576017, lng: 174.7590294};

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
var map, marker, infoWindow, directionsService, directionsDisplay;
var zoomAmount = 18;

//Array to hold the styles to apply to the gMap element
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

//This variable will eventually hold the user's location
var currentLatLng;

/*
 This function uses the geolocation feature to determine the user's position
 */
function initMap() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getLocation);
	}
}

/*
 This function creates a Google Map element and embeds the map inside a div in the html file.
 The map has all points of interests removed except for schools and medical facilities to improve
 clarity of the map. The map will be populated by markers which indicate a food business.
 */
function getLocation(position){

	if (typeof position !== 'undefined'){
		currentLatLng = {lat:position.coords.latitude,lng:position.coords.longitude};
	} else{
		currentLatLng = tempLatLng;
	}

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: zoomAmount,
		center: currentLatLng
	});

	var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');

	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;
	directionsDisplay.setMap(map);

	initMarker();
	initInfoWindow();
	getFoodPlaces();
	calculateAndDisplayRoute(directionsService, directionsDisplay);
}

/*
 Creates a marker indicating the location of the user
 */
function initMarker(){
	marker = new google.maps.Marker({
		position: currentLatLng,
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
	});
	infoWindow.close();
}

/*
 This function searches for all the nearby places of the specified types in the
 type array passed into the request to the function nearbySearch().
 The center of the search is the location of the user.
 */
function getFoodPlaces(){
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location: currentLatLng,
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

/*
This function uses the google maps feature to determine the direction between 2 points on the map.
Passes in the location and mode of transport to the directionsService object and uses
directionsDisplay to render the directions on the map
 */
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
	directionsService.route({
		origin: currentLatLng,
		destination: tempDest,
		travelMode: google.maps.TravelMode.WALKING
	}, function(response, status) {
		if (status === google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}