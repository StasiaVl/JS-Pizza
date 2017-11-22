/**
 * Created by chaika on 25.01.16.
 */


function	initialize()	{
//Тут починаємо працювати з картою
    var mapProp =	{
        center:	new	google.maps.LatLng(50.464379,30.519131),
        zoom:	14
    };
    var html_element =	document.getElementById("googleMap");
    var map	=	new	google.maps.Map(html_element, mapProp);
//Карта створена і показана
}

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();

    if ($(".pizza-title").html() === undefined){
        google.maps.event.addDomListener(window,'load',	initialize);
    }

    $(".name-help").hide();
    $(".phone-help").hide();
    $(".address-help").hide();

    function checkName(){
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
    function checkPhone(){
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
    function checkAddress(){
        var address = $(".address-group");
        var input = $("#user-address").val();
        var helpText = $(".address-help");

        if (input !== "") {

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

    $("#user-name").keyup(function(){
        checkName();
    });

    $("#user-phone").keyup(function(){
        checkPhone();
    });

    $("#user-address").keyup(function(){
        checkAddress();
    });

    $(".btn-next").click(function(){
        var nameCheck = checkName();
        var phoneNumberCheck = checkPhone();
        var addressCheck = checkAddress();

        if (nameCheck && phoneNumberCheck && addressCheck) {
            PizzaCart.createOrder(function(err, data){
                if (err) {
                    alert(err.toString());
                } else {
                    //LiqPay here
                    console.log("Order successful. Your money have been spent.\n" + JSON.stringify(data));
                }
            });
        }
    });

});