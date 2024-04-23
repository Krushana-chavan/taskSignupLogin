const mongoose = require('mongoose');
const OrderModel = require('../order.model');
const updateCustomer = require('../../customer/services/updateCustomer.service');


/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const updateOrder = async (orderData,orderId) => {

        let customerObj = {
            chemist: orderData?.chemist,
            name: orderData?.customerName,
            streetAddress: orderData?.streetAddress,
            city: orderData?.city,
            postalCode: orderData?.postalCode,
            province: orderData?. province,
            phoneNo: orderData?.phoneNo,
            
        }
       
    try {
        let response = await updateCustomer(customerObj,customerId= orderData?.customerId)
        
        if (response?.status ) {
            let orderObj = {
                product:orderData?.product,
                chemist:orderData?.chemist,
                notes:orderData?.notes,
                scheduleDelivery:orderData?.scheduleDelivery,
                paybleAmount:orderData?.paybleAmount,
                totalAmountToPay:orderData?.totalAmount,
                customer:response?.data?._id,
                paymentStatus:orderData?.paymentStatus
            }
            const updateResult = await OrderModel.findOneAndUpdate({active:true,_id:new mongoose.Types.ObjectId(orderId)},{...orderObj},{new:true});
            if (updateResult) {
              return {data:updateResult,status:true,code:200};
            }
            else{
              return {data:"Unable to add Order",status:false,code:400};
            }
         
        }
          else{
            return {data:response?.data,status:false,code:400};
          }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = updateOrder
