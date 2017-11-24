/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    var order_description = "Ім'я замовника: " + order_info.name + " Адреса замовлення: " + order_info.address + " Телефон: " + order_info.phone + " Замовлені піци: ";
    order_info.order.forEach(function(item) {
        order_description += " | " + item.pizza.title + " " + item.size + " " + item.quantity;
    });

    console.log("Creating Order", order_info);

    function base64(str){
        return new Buffer(str).toString('base64');
    }

    var crypto=	require('crypto');

    function sha1(string) {
        var sha1 = crypto.createHash('sha1');
        sha1.update(string);
        return sha1.digest('base64');
    }

    var LIQPAY_PUBLIC_KEY = i22916139463;
    var LIQPAY_PRIVATE_KEY = rVejyppvxt3fzU29kyP5YirL9xQG7N5RHR1GnJjl;

    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: order_info.price,
        currency: "UAH",
        description: order_description,
        order_id: Math.random(),
            //!!!Важливо щоб було 1,	бо інакше візьмегроші!!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);


    res.send({
        success: true,
        name: order_info.name,
        phone: order_info.phone,
        address: order_info.address,
        price: order_info.price,
        data: data,
        signature: signature
    });
};