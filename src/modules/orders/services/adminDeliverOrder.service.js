const mongoose = require('mongoose');
const orderModel = require('../order.model');

const adminDeliverOrder = async (id) => {
  try{
    const seriesearchQuery = { active: true, _id: new mongoose.Types.ObjectId(id) };
    const findOrder = await orderModel.findById(seriesearchQuery)
    if(!findOrder){
      return {status:false,data:"Order not found", code:400}
    }
   
    if(findOrder?.deliveryStatus<1){
        return {status:false,data:"Assign driver to complete order", code:400}
    }
  
    const updateResult = await orderModel.findOneAndUpdate(seriesearchQuery, {deliveryStatus:3 }, { new: true });
    if(updateResult){
      return {data:"Order Delivered successfully!", status:true,code:200};
    }
    else{
      return {data:"Order Not Found",status:false,code:400};
    }
  }catch(error){
    return{data:error.message,status:false,code:500};
  }
};

module.exports = adminDeliverOrder
