const mongoose = require('mongoose');
const OrderModel = require('../order.model');
const User = require('../../user/user.model');
const addDriverNotes = async (id,driverId,driverNotes) => {

	try {
		const findDriver = await  User.findOne({_id: new mongoose.Types.ObjectId(driverId),role: 'driver'});
        console.log(driverNotes)
    
		if(!findDriver)	{
			return { status: false, code: 400, data: "Driver not found" }
		}	
		
		const updateOrder = await OrderModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { driverNotes: driverNotes },{new:true});
      
        if (updateOrder) {
			 return { status: true, code: 200, data: "Notes added successfully." } 
			}
			else {
                return { status: false, code: 400, data: "Order not found" }
            }

	} catch (error) {
        console.log(error.message)
		return { status: false, code: 500, msg: error.message };
	}
}

module.exports = addDriverNotes