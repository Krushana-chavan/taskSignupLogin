const mongoose = require('mongoose');
const orderModel = require('../order.model');

const getOrderById = async (id) => {
    try{
        let filterQuery = {active: true, _id : new mongoose.Types.ObjectId(id)}

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
                $lookup: {
                    from: 'users', 
                    localField: 'chemist',
                    foreignField: '_id',
                    as: 'chemist'
                }
            },
            {
                $unwind: {
                    path: '$chemist',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'driver'
                }
            },
            {
                $unwind: {
                    path: '$driver',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    'chemist.profilePic': 0,
                    'chemist.password': 0,
                    'chemist.createdAt': 0,
                    'chemist.updatedAt': 0,
                    'chemist.seqId': 0,
                    'driver.profilePic': 0,
                    'driver.password': 0,
                    'driver.createdAt': 0,
                    'driver.updatedAt': 0,
                    'driver.seqId': 0,
                }
            },
        ]
        const order = await orderModel.aggregate(aggregate)
        if(order){
            return {data:order,status:true,code:200};
        }
        else{
            return {data:"Order Not Found",status:false,code:400};
        }
    }catch(error){
        return {data:error.message,status:false,code:500};
    }
  };

module.exports = getOrderById
