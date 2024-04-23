const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const orderServices = require('../services');

const getMyRoute = catchAsync(async (req, res) => {

  const driverId = req.user._id;

  const getResult = await orderServices.getMyRoute(driverId);
  
  if (getResult.status) {
    sendResponse(res, httpStatus.OK, getResult, null);
  } else {
    if(getResult.code == 400){
      sendResponse(res, httpStatus.BAD_REQUEST, null, getResult.data);
    }
    else if(getResult.code==500){
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR,null,getResult.data)
    }
    else{
      sendResponse(res,httpStatus.BAD_REQUEST,null,getResult.data)
    }
  }
});

module.exports = getMyRoute
