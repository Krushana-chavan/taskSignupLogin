const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const orderServices = require('../services');

const orderPickedByDriver = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id'])
  const driverId = req.user._id;

  const updateResult = await orderServices.orderPickedByDriver(id,driverId);
  
  if (updateResult.status) {
    sendResponse(res, httpStatus.OK, updateResult, null);
  } else {
    if(updateResult.code == 400){
      sendResponse(res, httpStatus.BAD_REQUEST, null, updateResult.data);
    }
    else if(updateResult.code==500){
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR,null,updateResult.data)
    }
    else{
      sendResponse(res,httpStatus.BAD_REQUEST,null,updateResult.data)
    }
  }
});

module.exports = orderPickedByDriver
