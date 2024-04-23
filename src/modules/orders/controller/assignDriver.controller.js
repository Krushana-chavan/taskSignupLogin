const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const orderServices = require('../services')
const { sendResponse } = require('../../../utils/responseHandler');
const { sendOrderCredentials, assignedDriver } = require('../../../mailer/mailer');

const assignDriver = catchAsync(async (req, res) => {
	
    const { driverId,chemistPay, driverPayout } = await pick(req.body,["driverId",'chemistPay','driverPayout'])
    const {orderId} = await pick(req.params,['orderId']);
	let updateRes = await orderServices.assignDriver({ orderId,driverId,chemistPay, driverPayout  });
	
	if (updateRes?.status) {
		sendResponse(res, httpStatus.OK, updateRes?.data, null)

		let order = await orderServices.getOrderById(orderId);

		let data ={
			drivermail: order?.data[0]?.driver?.email,
			drivername: order?.data[0]?.driver?.name,
			customer: order?.data[0]?.customer?.name,
			customerstreetAddress: order?.data[0]?.customer?.streetAddress,
			customerpostalCode: order?.data[0]?.customer?.postalCode,
            customerprovince: order?.data[0]?.customer?.province,
            customerphoneNo: order?.data[0]?.customer?.phoneNo,
            customercity: order?.data[0]?.customer?.city,
			chemist: order?.data[0]?.chemist?.name,
			chemiststreetAddress: order?.data[0]?.chemist?.streetAddress,
			chemistpostalCode: order?.data[0]?.chemist?.postalCode,
            chemistprovince: order?.data[0]?.chemist?.province,
            chemistcity: order?.data[0]?.chemist?.city,
            chemistphoneNo: order?.data[0]?.chemist?.phoneNo,
		  }
		  await assignedDriver(data)
	} else {
		sendResponse(res,
			updateRes?.code == 404 ? httpStatus.NOT_FOUND
				: updateRes?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST, 
			null,
			updateRes?.data || 'Something went wrong'
		);
	}
})

module.exports = assignDriver