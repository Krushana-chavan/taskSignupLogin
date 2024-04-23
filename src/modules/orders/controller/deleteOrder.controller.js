const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const orderService = require('../services');

const deleteOrder = catchAsync(async (req, res) => {
  const { id,  } = await pick(req.params, ['id'])
  const deleteResult = await orderService.deleteOrder(id);
  if (deleteResult.status) {
    sendResponse(res, httpStatus.OK, deleteResult, null);
  } else {
    if(deleteResult.code==400){
      sendResponse(res, httpStatus.BAD_REQUEST, null, deleteResult.data);
    }
    else if(deleteResult.code==500){
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR,null,deleteResult.data)
    }
    else{
      sendResponse(res,httpStatus.BAD_REQUEST,null,deleteResult.data)
    }
  }
});

module.exports = deleteOrder
