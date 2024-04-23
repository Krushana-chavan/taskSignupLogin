const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const orderSerivices = require('../services');
const { generatePdf } = require('../../../utils/genreatePdf');

const getChemistPay = catchAsync(async (req, res) => {
    const { userId,toDate,fromDate } = await pick(req.body, ['userId','toDate','fromDate'])
   
  
  const getChemistPayResult = await orderSerivices.getChemistPay(userId,toDate,fromDate );
  if (getChemistPayResult.status) {
    await generatePdf()
    sendResponse(res, httpStatus.OK, getChemistPayResult, null);
  } else {
    if(getChemistPayResult.code == 400){
      sendResponse(res, httpStatus.BAD_REQUEST, null, getChemistPayResult.data);
    }
    else if(getChemistPayResult.code == 500){
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR,null,getChemistPayResult.data)
    }
    else{
      sendResponse(res,httpStatus.BAD_REQUEST,null,getChemistPayResult.data)
    }
  }
});

module.exports = getChemistPay
