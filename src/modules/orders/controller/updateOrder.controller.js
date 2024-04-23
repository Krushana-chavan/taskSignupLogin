const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const orderServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const addOrder = catchAsync(async (req, res) => {
    const { 

        customerName, 
        streetAddress,
        city,
        postalCode,
        province,
        phoneNo,
        paymentStatus,
        paybleAmount,
        packageId,
        doc,
        totalAmount,
        notes,
        scheduleDelivery,
        product,
        customerId
      
     } = await pick(req.body, [
     
        'customerName', 
        'streetAddress',
        'city',
        'postalCode',
        'province',
        'phoneNo',
        'paymentStatus',
        'paybleAmount',
        'packageId',
        'doc',  
        'totalAmount',
        "notes",
        "scheduleDelivery",
        'product',
        'customerId'
        
    ])
    const {orderId} = await pick(req.params,['orderId']);
    const chemist = req.user?._id;
    const insertResult = await orderServices.updateOrder({
        chemist,
        customerName, 
        streetAddress,
        city,
        postalCode,
        province,
        phoneNo,
        paymentStatus,
        paybleAmount,
        packageId,
        doc,
        totalAmount,
        notes,
        scheduleDelivery,
        product,
        customerId
    },orderId);
    if (insertResult.status) {
        sendResponse(res, httpStatus.OK, insertResult, null);
      } else {
        if (insertResult.code == 400) {
          sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
        else if (insertResult.code == 500) {
          sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult.data);
        }
        else {
          sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
      }
});

module.exports = addOrder
