const mongoose = require('mongoose');
const orderModel = require('../order.model');

const getMyRoute = async (id) => {
    try{
        let filterQuery = {active: true, driver : new mongoose.Types.ObjectId(id), deliveryStatus:2}

        const aggregate =[
            {
                $match: filterQuery
            },
            {
                $lookup: {
                    from: 'customers', 
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            {
                $unwind: {
                    path: '$customer',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id:0,
                    'customer.streetAddress': 1,
                    'customer.city': 1,
                    'customer.province': 1,
                    'customer.postalCode': 1, 
                }
            },
        ];

        const orders = await orderModel.aggregate(aggregate);
        const transformedData = orders.map(order => {
            const addressFields = ['streetAddress', 'city', 'province', 'postalCode'];
            const address = addressFields.map(field => order.customer[field]).join(' ');
            return address;
        });

        if(orders.length > 0){
            return {data: transformedData, status:true, code:200};
        }
        else{
            return {data: "Order Not Found", status:false, code:400};
        }
    } catch(error){
        return {data: error.message, status:false, code:500};
    }
};

module.exports = getMyRoute;
