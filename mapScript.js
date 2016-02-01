var myLatLng = {lat: -36.8576017, lng: 174.7590294};
var image = 'here.png';
var zoomAmount = 18;

var map = new google.maps.Map(document.getElementById('map'), {
	zoom: zoomAmount,
	center: myLatLng
});

var marker = new google.maps.Marker({
	position: myLatLng,
	map: map,
	icon: image
});

var infoWindow = new google.maps.InfoWindow({
	map: map,
	content: 'You are here'
});

function getFoodPlaces(){
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location: myLatLng,
		radius: 500,
		types: ['bakery', 'bar' , 'cafe','food',
		'grocery_or_supermarket', 'hospital', 'meal_delivery' , 'meal_takeaway',
		'restaurant' , 'school']
	}, createFoodMarker);
}

function createFoodMarker(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		position: place.geometry.location
		map: map,
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}

function initMap() {
	infowindow.open(map, marker);
	getFoodPlaces();
}

