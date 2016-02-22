var myLatLng = {lat: -36.8576017, lng: 174.7590294};
var image = 'here.png';
var supermarket = 'supermarket.png';
var fruit = 'fruit.png';
var market = 'market.png';
var garden = 'garden.png';
var convenience = 'convenience.png';
var takeaway = 'takeaway.png';
var other = 'other.png';
var markerList = [supermarket, fruit, market, garden, convenience, takeaway, other];
var zoomAmount = 18;
var map, marker, infoWindow;

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
	var randomNumber = Math.floor(Math.random() * (markerList.length));
	var tempImage = markerList[randomNumber];
	
	var marker = new google.maps.Marker({
		position: place.geometry.location,
		map: map,
		icon: tempImage
	});
	var infoWindowContent = '<p style="padding:0px; margin:0px;" onclick=\"window.location.href=\'food.html\'\">' + place.name + '<br> 5 min away' +  
							'<div class="row"><div class="col-xs-4" style="padding-right:0px;"><img style="width:50px; height:50px; padding:0px; margin:0px;" src="oil2.png"/></div>' + 
							'<div class="col-xs-4" style="padding-right:0px;"><img style="width:50px; height:50px; padding:0px; margin:0px;" src="salt2.png"/></div>' +
							'<div class="col-xs-4"><img style="width:25px; height:25; padding-top:25px; margin:0px;" src="sugar2.png"/></div></div></p>';

	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.setContent(infoWindowContent);
		infoWindow.open(map, this);
	});
}

function initInfoWindow(){
	infoWindow = new google.maps.InfoWindow({
		map: map,
		content: 'You are here'
	});
	infoWindow.open(map, marker);
}

function initMarker(){
	marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		icon: image
	});
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: zoomAmount,
		center: myLatLng
	});
	
	initMarker();
	initInfoWindow();
	getFoodPlaces();
}
