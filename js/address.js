var geocoder, currentLat, currentLng, currentLocation;
var zoomAmount = 18;
var image = '../img/here.png';
var supermarket = '../img/supermarket.png';
var fruit = '../img/fruit.png';
var market = '../img/market.png';
var garden = '../img/garden.png';
var convenience = '../img/convenience.png';
var takeaway = '../img/takeaway.png';
var other = '../img/other.png';
var markerList = [supermarket, fruit, market, garden, convenience, takeaway, other];
var map, marker, infoWindow;

function getLocation() {

    geocoder = new google.maps.Geocoder;
    currentLocation = document.getElementById("currentLocation");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        currentLocation.value = "Cannot find current location";
    }
}

function showPosition(position) {
    currentLat = position.coords.latitude;
    currentLng = position.coords.longitude;

    geocodeLatLng(currentLat,currentLng);
}

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

function initMap(tempLatLng) {

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

function initMarker(tempLatLng){
    marker = new google.maps.Marker({
        position: tempLatLng,
        map: map,
        icon: image
    });
}

function initInfoWindow(){
    infoWindow = new google.maps.InfoWindow({
        map: map,
        content: 'You are here'
    });

    infoWindow.open(map, marker);
}

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

function createFoodMarker(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var randomNumber = Math.floor(Math.random() * (markerList.length));
    var tempImage = markerList[randomNumber];

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



















