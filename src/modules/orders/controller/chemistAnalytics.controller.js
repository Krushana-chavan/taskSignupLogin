const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const adminServices = require('../services');

const chemistAnalytics = catchAsync(async (req, res) => {
  
  const chemistAnalyticsResult = await adminServices.chemistAnalytics();
  if (chemistAnalyticsResult.status) {
    sendResponse(res, httpStatus.OK, chemistAnalyticsResult, null);
  } else {
    if(chemistAnalyticsResult.code == 400){
      sendResponse(res, httpStatus.BAD_REQUEST, null, chemistAnalyticsResult.data);
    }
    else if(chemistAnalyticsResult.code == 500){
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR,null,chemistAnalyticsResult.data)
    }
    else{
      sendResponse(res,httpStatus.BAD_REQUEST,null,chemistAnalyticsResult.data)
    }
  }
});

module.exports = chemistAnalytics
