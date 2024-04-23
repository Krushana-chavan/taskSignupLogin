const mongoose = require('mongoose');
const orderModel = require('../order.model');

const deleteOrder = async (orderId) => {
  try{
    const seriesearchQuery = { active: true, _id: new mongoose.Types.ObjectId(orderId) };
   
    const deleteResult = await orderModel.findOneAndUpdate(seriesearchQuery, { active:false }, { new: true });
    if(deleteResult){
      return {data:"Order Deleted succefully", status:true,code:200};
    }
    else{
      return {data:"Order Not Found",status:false,code:400};
    }
  }catch(error){
    return{data:error.message,status:false,code:500};
  }
};

module.exports = deleteOrder
