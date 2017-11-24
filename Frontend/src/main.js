/**
 * Created by chaika on 25.01.16.
 */


var $addressplace = $("#user-address");
var $address = $("#address");
var $deliveryTime = $('#time');

function initialize() {

    var myPosition =  new google.maps.LatLng(50.464379, 30.519131);
    //Тут починаємо працювати з картою
    var mapProp = {
        center: myPosition,
        zoom: 14
    };
    var html_element = document.getElementById("googleMap");
    var map = new google.maps.Map(html_element, mapProp);

    //    Карта створена і показана

    var marker = new google.maps.Marker({
        position: myPosition,
        map: map,
        icon: "assets/images/map-icon.png"
    });
    var home = new google.maps.Marker();

    $addressplace.focusout(function () {
        var address = $addressplace.val();
        geocodeAddress(address, function (err, coordinates) {
            if(!err){
                home.setMap(null);
                home = new google.maps.Marker({
                    position: coordinates,
                    map: map,
                    icon: "assets/images/home-icon.png"
                });
                geocodeLatLng(coordinates,	function(err,	address){
                    if(!err)	{
                        //Дізналися адресу
                        $addressplace.val(address);
                        $address.text(address);
                        calculateRoute(myPosition, coordinates, function callback(err, data){
                            if (!err){
                                $deliveryTime.text(data.duration.text);
                            } else {
                                $deliveryTime.text("невідомий");
                            }
                        });
                    } else {
                        console.log("Немає адреси");
                        $address.text("невідома");
                        $deliveryTime.text("невідомий");
                    }
                })
            }else {
                console.log("Немає адреси");
                $address.text("невідома");
                $deliveryTime.text("невідомий");
                home.setMap(null);
            }
        })
    });
    google.maps.event.addListener(map, 'click',function(me){
        var coordinates	=	me.latLng;
        home.setMap(null);
        home = new google.maps.Marker({
            position: coordinates,
            map: map,
            icon: "assets/images/home-icon.png"
        });
        geocodeLatLng(coordinates,	function(err,	address){
            if(!err)	{
                //Дізналися адресу
                $addressplace.val(address);
                $address.text(address);
                calculateRoute(myPosition, coordinates, function callback(err, data){
                    if (!err){
                        $deliveryTime.text(data.duration.text);
                    } else {
                        $deliveryTime.text("невідомий");
                    }
                });
            } else {
                console.log("Немає адреси");
                $address.text("невідома");
                $deliveryTime.text("невідомий");
            }
        })
    });
}
function	geocodeLatLng(latlng,	 callback){
    //           Модуль за роботу з адресою
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'location':	latlng},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK && results[1])	{
            var address =	results[1].formatted_address;
            callback(null,	address);
        }	else	{
            callback(new Error("Can't find address"));
        }
    });
}


function	geocodeAddress(address,	 callback)	{
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'address':	address},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
            var coordinates	=	results[0].geometry.location;
            callback(null,	coordinates);
        }	else	{
            callback(new	Error("Can`t find the address"));
        }
    });
}

function	calculateRoute(A_latlng,	 B_latlng,	callback)	{
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination:	B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    },	function(response,	status)	{
        if	(status	===	google.maps.DirectionsStatus.OK )	{
            var leg	= response.routes[0].legs[0];
            callback(null,{
                duration:leg.duration
            });
        }	else	{
            callback(new Error("Can't find direction"));
        }
    });
}

$(function () {
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();

    if ($(".pizza-title").html() === undefined) {
        google.maps.event.addDomListener(window, 'load', initialize);
    }

    $(".name-help").hide();
    $(".phone-help").hide();
    $(".address-help").hide();

    function checkName() {
        var name = $(".name-group");
        var input = $("#user-name").val();
        var helpText = $(".name-help");

        if (input.match(/^[a-zA-Zа-яА-я \-]{1,25}$/)) {

            helpText.hide();
            name.addClass("has-success");
            name.removeClass("has-error");
            return true;
        } else {
            helpText.show();
            name.addClass("has-error");
            name.removeClass("has-success");
            return false;
        }
    }

    function checkPhone() {
        var phone = $(".phone-group");
        var input = $("#user-phone").val();
        var helpText = $(".phone-help");

        if ((input.startsWith("380") && input.length === 12) || (input.startsWith("0") && input.length === 10)) {
            helpText.hide();
            phone.addClass("has-success");
            phone.removeClass("has-error");
            return true;
        } else {
            helpText.show();
            phone.addClass("has-error");
            phone.removeClass("has-success");
            return false;
        }
    }

    function checkAddress() {
        var address = $(".address-group");
        var input = $("#user-address").val();
        var helpText = $(".address-help");

        if (input !== "" && $address.text() !== "невідома") {

            helpText.hide();
            address.addClass("has-success");
            address.removeClass("has-error");
            return true;
        } else {
            helpText.show();
            address.addClass("has-error");
            address.removeClass("has-success");
            return false;
        }
    }

    $("#user-name").keyup(function () {
        checkName();
    });

    $("#user-phone").keyup(function () {
        checkPhone();
    });

    $("#user-address").keyup(function () {
        checkAddress();
    });

    $(".btn-next").click(function () {
        var nameCheck = checkName();
        var phoneNumberCheck = checkPhone();
        var addressCheck = checkAddress();

        if (nameCheck && phoneNumberCheck && addressCheck) {
            PizzaCart.createOrder(function (err, data) {
                if (err) {
                    alert("Неможливо створити замовлення. " + err.toString());
                } else {
                    LiqPayCheckout.init({
                        data: data.data,
                        signature: data.signature,
                        embedTo:	"#liqpay",
                        mode:	"popup"	//	embed	||	popup
                    }).on("liqpay.callback", function(data){
                        console.log(data.status);
                        console.log(data);
                    }).on("liqpay.ready", function(data){ // ready
                    }).on("liqpay.close",function(data){ //	close
                    });
                    console.log("Order successful. Your money have been spent.\n" + JSON.stringify(data));
                }
            });
        }
    });

});