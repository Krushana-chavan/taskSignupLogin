const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const adminServices = require('../services');

const driverAnalytics = catchAsync(async (req, res) => {
  
    const userId = req?.user?._id
  const driverAnalyticsResult = await adminServices.driverAnalytics(userId);
  if (driverAnalyticsResult.status) {
    sendResponse(res, httpStatus.OK, driverAnalyticsResult, null);
  } else {
    if(driverAnalyticsResult.code == 400){
      sendResponse(res, httpStatus.BAD_REQUEST, null, driverAnalyticsResult.data);
    }
    else if(driverAnalyticsResult.code == 500){
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR,null,driverAnalyticsResult.data)
    }
    else{
      sendResponse(res,httpStatus.BAD_REQUEST,null,driverAnalyticsResult.data)
    }
  }
});

module.exports = driverAnalytics
