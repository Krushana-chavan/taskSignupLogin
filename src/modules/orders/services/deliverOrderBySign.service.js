const mongoose = require('mongoose');
const orderModel = require('../order.model');

const deliverOrderBySign = async (id,driverId,sign) => {
  try{
    const seriesearchQuery = { active: true, _id: new mongoose.Types.ObjectId(id) };
    const findOrder = await orderModel.findById(seriesearchQuery)
    if(!findOrder){
      return {status:false,data:"Order not found", code:400}
    }
    // const orderDriverId = mongoose.Types.ObjectId(findOrder?.driver);
    // console.log(orderDriverId,driverId);
    // if (!orderDriverId.equals(mongoose.Types.ObjectId(driverId))) {
    //   return { status: false, data: "You are not allowed to pick this order", code: 200 };
    // }
    const updateResult = await orderModel.findOneAndUpdate(seriesearchQuery, {deliveryStatus:3 ,sign:sign}, { new: true });
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

module.exports = deliverOrderBySign
