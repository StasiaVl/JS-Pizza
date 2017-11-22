/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');

var API = require("../API");
var Pizza_List = [];
//var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");


var PizzaFilter ={
    Meat:'М’ясна піца',
    Pineapple:'ананаси',
    Mushrooms:'шампінйони',
    Vega:'Вега піца',
    Fish:'Морська піца',
    All:0
};

var $title = $("#pizza-title");
var count = 0;
var $number = $("#counter");

function refresh() {
    $filterPin.removeClass("active");
    $filterAll.removeClass("active");
    $filterFish.removeClass("active");
    $filterVega.removeClass("active");
    $filterMush.removeClass("active");
    $filterMeat.removeClass("active");

}

var $filterMeat = $("#filter-meat").click(function(){
    filterPizza(PizzaFilter.Meat);
    $title.text("М'ясні піци");
    refresh();
    $filterMeat.addClass("active");
});
var $filterPin = $("#filter-pineapple").click(function(){
    filterPizza(PizzaFilter.Pineapple);
    $title.text("Піци з ананасами");
    refresh();
    $filterPin.addClass("active");
});
var $filterMush = $("#filter-mushrooms").click(function(){
    filterPizza(PizzaFilter.Mushrooms);
    $title.text("Піци з грибами");
    refresh();
    $filterMush.addClass("active");
});
var $filterVega = $("#filter-vega").click(function(){
    filterPizza(PizzaFilter.Vega);
    $title.text("Вега піци");
    refresh();
    $filterVega.addClass("active");
});
var $filterFish = $("#filter-fish").click(function(){
    filterPizza(PizzaFilter.Fish);
    $title.text("Морські піци");
    refresh();
    $filterFish.addClass("active");
});
var $filterAll = $("#filter-all").click(function(){
    filterPizza(PizzaFilter.All);
    $title.text("Усі піци");
    refresh();
    $filterAll.addClass("active");
});

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }
    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
    count = 0;
    Pizza_List.forEach(function(pizza){
        //Якщо піца відповідає фільтру
        if (pizza.type === filter ||
            pizza.content.mushroom === filter ||
            pizza.content.pineapple === filter ||
            filter === PizzaFilter.All){
            pizza_shown.push(pizza);
            count +=1;
        }
    });

    $number.text(count);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци

    API.getPizzaList(function(err, data){
        if (err) {
            alert("Can't load pizzas!");
        } else {
            Pizza_List = data;
            showPizzaList(Pizza_List);
        }
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;