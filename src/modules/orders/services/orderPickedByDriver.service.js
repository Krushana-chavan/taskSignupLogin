const mongoose = require('mongoose');
const orderModel = require('../order.model');

const orderPickedByDriver = async (id,driverId) => {
  try{
    const seriesearchQuery = { active: true, _id: new mongoose.Types.ObjectId(id) };
    const findOrder = await orderModel.findById(seriesearchQuery)
    if(!findOrder){
      return {status:false,data:"Order not found", code:400}
    }
    if(findOrder?.deliveryStatus == 3 ){
      return {status:false,data:"Order already delivered", code:400}
    }
    if(findOrder?.deliveryStatus == 2){
      return {status:false,data:"Order already picked by driver", code:400}
    }
    const orderDriverId = new mongoose.Types.ObjectId(findOrder.driver);

    if (!orderDriverId.equals( new mongoose.Types.ObjectId(driverId))) {
      return { status: false, data: "You are not allowed to pick this order", code: 400 };
    }
    const updateResult = await orderModel.findOneAndUpdate(seriesearchQuery, {deliveryStatus:2 }, { new: true });
    if(updateResult){
      return {data:updateResult, status:true,code:200};
    }
    else{
      return {data:"Order Not Found",status:false,code:400};
    }
  }catch(error){
    return{data:error.message,status:false,code:500};
  }
};

module.exports = orderPickedByDriver
