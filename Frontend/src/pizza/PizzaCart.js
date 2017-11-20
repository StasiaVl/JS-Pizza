/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

//Змінна замовлення
var $order = $("#full_cart");
var number = 0;
var all_price = 0;

//Очистити замовлення
$order.find(".order-btn").click(function () {
    Cart = [];
    number = 0;
    all_price = 0;
    $order.find(".orange-circle").text(number);
    $order.find(".dop-text").text("Простіше подзвонити, аніж готувати!");
    $order.find(".btn-order").prop("disabled", true);
    $order.find(".sum-of-the-order").hide();
    updateCart();
});

$order.find(".btn-order").click(function () {
    location.href="http://localhost:5050/order.html";
});

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var cart_item = {
        pizza: pizza,
        size: size,
        quantity: 1
    };
    //Приклад реалізації, можна робити будь-яким іншим способом

    function contains(cart_item, index, array) {
        if (cart_item.pizza === pizza && cart_item.size === size){
            cart_item.quantity += 1;
            //all_price += pizza[size].price;
            return true;
        }else return false;
    }

    if (!Cart.some(contains))
        Cart.push(cart_item);

    $order.find(".orange-circle").text(++number);
    all_price += pizza[size].price;
    if (number > 0) {
        $order.find(".dop-text").text("");
        $order.find(".btn-order").prop("disabled", false);//html("enabled");
        $order.find(".sum-of-the-order").show();
    }
    //Оновити вміст кошика на сторінці
    updateCart();
}


function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    Cart.splice(Cart.indexOf(cart_item),1);
    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    Cart = [];
    number = 0;
    all_price = 0;

    new_number = JSON.parse(localStorage.getItem('number'));
    if (new_number)
        number = new_number;

    new_price = JSON.parse(localStorage.getItem('price'));
    if (new_price)
        all_price = new_price;

    var saved_orders = JSON.parse(localStorage.getItem('orders'));
    if(number > 0){
        Cart = saved_orders;
        $order.find(".dop-text").text("");
        $order.find(".btn-order").prop("disabled", false);
        $order.find(".sum-of-the-order").show();
    }else{
        $order.find(".dop-text").text("Простіше подзвонити, аніж готувати!");
        $order.find(".btn-order").prop("disabled", true);
        $order.find(".sum-of-the-order").hide();
    }

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            all_price += cart_item.pizza[cart_item.size].price;
            $order.find(".orange-circle").text(++number);
            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity -= 1;
            $order.find(".orange-circle").text(--number);
            all_price -= cart_item.pizza[cart_item.size].price;
            if(cart_item.quantity === 0){
                if (number == 0) {
                    $order.find(".dop-text").text("Простіше подзвонити, аніж готувати!");
                    $order.find(".btn-order").prop("disabled", true);
                    $order.find(".sum-of-the-order").hide();
                }
                removeFromCart(cart_item);
            }

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".delete").click(function(){
            number -= cart_item.quantity;
            all_price -= cart_item.pizza[cart_item.size].price * cart_item.quantity;
            $order.find(".orange-circle").text(number);
            if (number == 0) {
                $order.find(".dop-text").text("Простіше подзвонити, аніж готувати!");
                $order.find(".btn-order").prop("disabled", true);
                $order.find(".sum-of-the-order").hide();
            }
            removeFromCart(cart_item);
            //Оновлюємо відображення
            updateCart();
        });

        $cart.append($node);
    }

    localStorage.setItem('orders', JSON.stringify(Cart));
    localStorage.setItem('number', JSON.stringify(number));
    localStorage.setItem('price', JSON.stringify(all_price));

    $order.find(".sum").html(all_price +" грн");

    $order.find(".orange-circle").text(number);

    Cart.forEach(showOnePizzaInCart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;