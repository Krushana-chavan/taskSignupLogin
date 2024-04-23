const mongoose = require('mongoose');
const userModel = require('../../user/user.model');
const orderModel = require('../order.model')
const chemistAnalytics = async (userId) => {
  try{

    const chemistSearchQuery = {active: true, chemist:new mongoose.Types.ObjectId(userId) };

 
    const pendingDelivery = await orderModel.countDocuments({...chemistSearchQuery,deliveryStatus:0})

    const assignedDriverDelivery = await orderModel.countDocuments({...chemistSearchQuery,deliveryStatus:1});

    const onTheWayDelivery = await orderModel.countDocuments({...chemistSearchQuery,deliveryStatus:2});

    const previousSuccessfullDelivery = await orderModel.countDocuments({...chemistSearchQuery,deliveryStatus:3});

    const failedDelivery = await orderModel.countDocuments({...chemistSearchQuery,deliveryStatus:4});

    const refundDelivery = await orderModel.countDocuments({...chemistSearchQuery,deliveryStatus:5});

    const totalDelivery = await orderModel.countDocuments(chemistSearchQuery)

    

    const data = {
        pendingDelivery,
        assignedDriverDelivery,
        onTheWayDelivery,
        previousSuccessfullDelivery,
        failedDelivery,
        refundDelivery,
        totalDelivery
                                                                                                                                                                            
    }
    if(driver ){
      return {data, status:true,code:200};
    }
    else{
      return {data:"User Not Found",status:false,code:400};
    }
  }catch(error){
    return{data:error.message,status:false,code:500};
  }
};

module.exports = chemistAnalytics
