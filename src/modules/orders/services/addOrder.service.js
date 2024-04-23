const mongoose = require('mongoose');
const OrderModel = require('../order.model');
const addCustomer = require('../../customer/services/addCustomer.service');


/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const addOrder = async (orderData) => {

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
        let response = await addCustomer(customerObj)
        
        if (response?.status ) {
            let orderObj = {
                product:orderData?.product,
                chemist:orderData?.chemist,
                notes:orderData?.notes,
                scheduleDelivery:orderData?.scheduleDelivery,
                customCreatedAt:orderData?.customCreatedAt,
                paybleAmount:orderData?.paybleAmount,
                totalAmountToPay:orderData?.totalAmountToPay,
                customer:response?.data?._id,
                paymentStatus:orderData?.paymentStatus
            }
            const addResult = await OrderModel.create({...orderObj});
            if (addResult) {
              return {data:addResult,status:true,code:200};
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

module.exports = addOrder
