const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const orderServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');
const { sendOrderCredentials } = require('../../../mailer/mailer');
const getUserById = require('../../admin/services/getUserById.service');

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
        notes,
        scheduleDelivery,
        customCreatedAt,
        totalAmount,
        product,
      
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
        'notes',
        'scheduleDelivery',
        'customCreatedAt',
        'totalAmount',
        'product',
        
    ])
    const chemist = req.user?._id;
    const insertResult = await orderServices.addOrder({
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
        notes,
        scheduleDelivery,
        customCreatedAt,
        doc,
        totalAmount,
        product,
      
    });
    if (insertResult.status) {

      let chemist = await getUserById(insertResult?.data?.chemist)

      let data ={
        chemist: chemist?.data?.name,
        streetAddress: chemist?.data?.streetAddress,
        orderId:insertResult?.data?.orderId

      }
       await sendOrderCredentials(data)
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
