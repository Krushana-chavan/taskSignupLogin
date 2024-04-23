const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const orderServices = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");
const { convertToJSON } = require("../../../utils/helper");

const getAllDriver = catchAsync(async (req, res) => {
  const list = await orderServices.getAllDriver();

  if (list.status) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    if (list.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    } else if (list.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, list.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    }
  }
});

module.exports = getAllDriver;
