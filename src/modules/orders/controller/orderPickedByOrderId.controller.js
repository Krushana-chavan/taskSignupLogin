const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const orderServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const orderPickedByOrderId = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id']);
  const driverId = req.user._id;
  const order = await orderServices.orderPickedByOrderId(id,driverId);
  if (order.status) {
    sendResponse(res, httpStatus.OK, order, null);
  } else {
    if(order.code==400){
      sendResponse(res, httpStatus.BAD_REQUEST, null, order.data);
    }
    else if(order.code==500){
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR,null,order.data)
    }
    else{
      sendResponse(res, httpStatus.BAD_REQUEST,null,order.data)
    }
  }
});

module.exports = orderPickedByOrderId
