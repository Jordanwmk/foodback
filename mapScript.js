var tempPos = {lat:0,lng:0};
var zoomAmount = 18;
var map, myMarker, service, latLng;
var placeArray = [];
var markerArray = [];
var lastSearchPos, tempMarker;
var moveRadius = 1;
var directionsService;
var directionsDisplay;

function rad(x){
	return x * Math.PI / 180;
}

function getDistance(origin, dest){

	var R = 6378137; // Earth’s mean radius in meter
	var dLat = rad(dest.lat - origin.lat);
	var dLong = rad(dest.lng - origin.lng);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	Math.cos(rad(origin.lat)) * Math.cos(rad(dest.lat)) *
	Math.sin(dLong / 2) * Math.sin(dLong / 2);
	 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	 var d = R * c;
	 return d; // returns the distance in meter
}

function initMap(){
	map = new google.maps.Map($('#map')[0], {
        zoom: zoomAmount,
        center: tempPos
    });
	
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	
	initMarker();
	getCurrentLocation();
	
	window.setInterval(function(){
		getCurrentLocation();
	}, 5000);
}

var myLatLng = {lat: -36.8576017, lng: 174.7590294};
					var image = 'here.png';

					var map = new google.maps.Map(document.getElementById('map'), {
						center: myLatLng,
						zoom: 18,
					});

					var marker = new google.maps.Marker({
						position: myLatLng,
						map: map,
						icon: image
					});

					var infoWindow = new google.maps.InfoWindow({
						map: map,
					});

					infoWindow.open(map,marker);

function centerMap(){
	map.setCenter(myMarker.position);
}

function initMarker(status){
	if (status){
		myMarker.setMap(null);
	}
	
    myMarker = new google.maps.Marker({
        position: tempPos,
        map: map,
        title: 'You are here'
    });
}

function getCurrentLocation(){
	infoWindow = new google.maps.InfoWindow();
	
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
        function(position){
            setMarkerPosition(position);
        },
        function(){
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
	
}

function setMarkerPosition(position,setCenter){
    tempPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    myMarker.setPosition(tempPos);
	
	if(!lastSearchPos){
		performSearch();
		lastSearchPos = tempPos;
		centerMap();
	}
	
	//search again if the user has moved more than 50m
	if(getDistance(lastSearchPos,tempPos) > moveRadius){
		performSearch();
		lastSearchPos=tempPos;
	}
}

function handleLocationError (hasGeolocation, infoWindow, pos){
    infoWindow.setPosition(pos);
    if (hasGeoLocation){
        infoWindow.setContent('Geolocation service failed');
		infoWindow.open(map, myMarker);
    } else {
        infoWindow.setContent('Browser doesnt support geolocation');
		infoWindow.open(map, myMarker);
    }
}

function performSearch(){

	service = new google.maps.places.PlacesService(map);

	request = 
    {
		location:tempPos, 
		rankBy: google.maps.places.RankBy.DISTANCE,
		types: ['bakery', 'bar' , 'cafe','food',
		'grocery_or_supermarket', 'hospital', 'meal_delivery' , 'meal_takeaway',
		'restaurant' , 'school']
    };
	
	service.nearbySearch(request,function(results,status){
		//create a marker for each result
		for(var i=0;i<results.length;i++){
			createMarker(results[i]);
		}
	});
}

function createMarker(place){
	var timeService = new google.maps.DistanceMatrixService;
	latLng = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());

	timeService.getDistanceMatrix({
		origins: [tempPos],
		destinations: [latLng],
		travelMode: google.maps.TravelMode.WALKING,
		unitSystem: google.maps.UnitSystem.METRIC,
		}, function(response,status){
			//getTime(place, response)
	});
}

function getTime(place, response){
	//check the place has not been visited yet
	if(placeArray.indexOf(place.place_id)<0){
		placeArray.push(place.place_id);
		
		var priceLevel = 'Unavailable';
		
		if (typeof place.price_level != 'undefined') {
			priceLevel = '';
			for (var i = 0; i < place.price_level; i++){
				priceLevel += '$';
			}
		}
		
		var tempLine='';
		tempLine += '<p onclick="showMarker(\'' + place.place_id + '\')">';
		tempLine += place.name + 
		" ETA " + response.rows[0].elements[0].duration.text + 
		" Distance " + response.rows[0].elements[0].distance.text + 
		" Price " + priceLevel +
		"</p>";
		$('#foodList')[0].innerHTML += tempLine;
		
	}
}

function showMarker(placeId){
	for (var i = 0; i < markerArray.length; i++){
		markerArray[i].setMap(null);
	}

	var service = new google.maps.places.PlacesService(map);
	service.getDetails({placeId:placeId},function(place,status){
		tempMarker = new google.maps.Marker({
			map:map,
			position:place.geometry.location,
		});

		console.log(place.price_level);
		markerArray.push(tempMarker);
		getDirection(place);
	});
}

function getDirection(place){
	directionsDisplay.setMap(null);
	directionsDisplay.setMap(map);
	calculateAndDisplayRoute(directionsService, directionsDisplay, place);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, place) {
	directionsService.route({
    origin: tempPos,
    destination: place.geometry.location,
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function centerMap(){
	map.setCenter(tempPos);
}

