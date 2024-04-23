const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const orderSerivices = require('../services');

const analytics = catchAsync(async (req, res) => {
  const userId = req?.user?._id;
  const analyticsResult = await orderSerivices.getAnalyticForDriver(userId);
  if (analyticsResult.status) {
    sendResponse(res, httpStatus.OK, analyticsResult, null);
  } else {
    if(analyticsResult.code == 400){
      sendResponse(res, httpStatus.BAD_REQUEST, null, analyticsResult.data);
    }
    else if(analyticsResult.code == 500){
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR,null,analyticsResult.data)
    }
    else{
      sendResponse(res,httpStatus.BAD_REQUEST,null,analyticsResult.data)
    }
  }
});

module.exports = analytics
