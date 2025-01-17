const express = require('express');
const router = express.Router();
const {WebhookClient} = require('dialogflow-fulfillment');
const {Order} = require('../schema/model');

router.get('/', function (req, res, next) {
    res.send(`Server is up and running.`);
});

router.post('/webhook', function (req, res, next) {

    const agent = new WebhookClient({request: req, response: res});

    // console.log('Dialogflow Request headers >> ' + JSON.stringify(req.headers));
    // console.log('Dialogflow Request body >> ' + JSON.stringify(req.body));

    let intentMap = new Map();

    intentMap.set('book hotel', bookHotel);
    intentMap.set('count bookings', countBookings);
    intentMap.set('show all bookings', showBookings);

    agent.handleRequest(intentMap);

    function bookHotel(agent) {
        let params = agent.parameters;
        var order = new Order(params);
        return order
            .save()
            .then(order => {
                console.log(`order added with ID ${order._id}`);
                return agent.add(`ok ${params.name} your hotel booking request of ${params.roomType} room for ${params.persons} persons is forwarded \n Have a good day`);
            })
            .catch(err => {
                console.log(`Error in adding document ${err}`);
                return agent.add(`Error in adding document ${err}`);
            });
    }

    function countBookings(agent) {
        let query = {};
        return Order
            .find(query)
            .then(res => {
                let orders = res;
                if (orders.length) {
                    return agent.add(`you have ${orders.length} orders, would you like to see them?\n`);
                } else {
                    return agent.add(`you have\'nt order anything yet`);
                }
            })
            .catch(err => {
                console.log(`Error in getting document ${err}`);
                return agent.add(`Error in adding document ${err}`);
            });
    }

    function showBookings(agent) {
        let query = {};
        return Order
            .find(query)
            .then(res => {
                let orders = res;
                let speech = `here are your orders, \n The `;
                orders.forEach((order, i) => {
                    speech += `${i + 1} is hotel booking request for ${order.persons} ${order.roomType} rooms ordered by ${order.name} \n`;
                });
                return agent.add(speech);
            })
            .catch((err) => {
                console.log(`Error in getting orders ${err}`);
                return agent.add(`Error while getting orders ${err}`);
            });
    }
});

module.exports = router;
