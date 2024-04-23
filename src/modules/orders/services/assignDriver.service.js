const mongoose = require('mongoose');
const OrderModel = require('../order.model');
const User = require('../../user/user.model');
const assignDriver = async ({ orderId,driverId,chemistPay, driverPayout }) => {
	try {
		const findDriver = await  User.findOne({_id: new mongoose.Types.ObjectId(driverId),role: 'driver'});
		if(!findDriver)	{
			return { status: false, code: 400, data: "Driver not found" }
		}	
		
		const updateOrder = await OrderModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(orderId) }, { driver: new mongoose.Types.ObjectId(driverId), deliveryStatus: 1,chemistPay, driverPayout });
		if (updateOrder) {
			 return { status: true, code: 200, data: "Driver Assigned succefully" } 
			}
			else {
                return { status: false, code: 400, data: "Order not found" }
            }

	} catch (error) {
		return { status: false, code: 500, msg: error.message };
	}
}

module.exports = assignDriver