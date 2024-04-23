const mongoose = require('mongoose');

const orderModel = require('../order.model')
const getAnalyticForDriver = async (userId) => {
  try{
    
   
     const driverAssignedDelivery = await orderModel.countDocuments({active:true,deliveryStatus:1,driver: new mongoose.Types.ObjectId(userId)})

    const currentDelivery = await orderModel.countDocuments({active:true,deliveryStatus:2,driver: new mongoose.Types.ObjectId(userId)})

    const previousSuccessfullDelivery = await orderModel.countDocuments({active:true,deliveryStatus: { $in: [3, 5] },driver: new mongoose.Types.ObjectId(userId)})
    

    const failedDelivery = await orderModel.countDocuments({active:true,deliveryStatus:4,driver:new mongoose.Types.ObjectId(userId)})
    
    const totalDelivery = await orderModel.countDocuments({active:true, driver:new mongoose.Types.ObjectId(userId)})

    const data = {
        driverAssignedDelivery,
        currentDelivery,
        previousSuccessfullDelivery,
        totalDelivery,
        failedDelivery                                                                                                                                                                                                                       
    }
    if(  driverAssignedDelivery,
      currentDelivery
      ||
      previousSuccessfullDelivery||
      totalDelivery ||
      failedDelivery   ){
      return {data, status:true,code:200};
    }
    else{
      return {data:"User Not Found",status:false,code:400};
    }
  }catch(error){
    return{data:error.message,status:false,code:500};
  }
};

module.exports = getAnalyticForDriver
