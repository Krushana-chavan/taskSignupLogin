const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const orderServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');
const { convertToJSON } = require("../../../utils/helper");

const getAllOrderChemist = catchAsync(async (req, res) => {
    const {page, limit,  filter, sort} = await pick(req.query, ['page', 'limit', 'filter', 'sort'])

    let filter_Json_data = filter ? convertToJSON(filter) : undefined;

    const userId = req.user?._id
    const list = await orderServices.getAllOrderChemist(page, limit, filter_Json_data, sort,userId);
  
    if (list.status) {
      sendResponse(res, httpStatus.OK, list, null);
    } else {
      if(list.code==400){
        sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
      }
      else if(list.code==500){
        sendResponse(res,httpStatus.INTERNAL_SERVER_ERROR,null,list.data)
      }
      else{
        sendResponse(res,httpStatus.BAD_REQUEST,null,list.data)
      }
    }
});

module.exports = getAllOrderChemist
