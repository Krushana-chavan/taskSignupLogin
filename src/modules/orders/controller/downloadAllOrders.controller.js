const httpStatus = require('http-status');
const { sendResponse } = require('../../../utils/responseHandler');
const { downloadAllOrders } = require('../services');
const xlsx = require('xlsx');
const moment = require('moment');
const pick = require('../../../utils/pick');
const { convertToJSON } = require('../../../utils/helper');
const fs = require('fs');
const { addImage } = require('xlsx');

const downloadOrders = async (req, res) => {
    const {filter } = await pick(req.query, ['filter', 'sort'])

    let filter_Json_data = filter ? convertToJSON(filter) : undefined;
    try {
        const result = await downloadAllOrders(filter_Json_data);

        if (!result.status) {
            return sendResponse(res, httpStatus.OK, null, result.data);
        }

        const ordersData = result.data;

        if (!Array.isArray(ordersData) || ordersData.length === 0 || typeof ordersData[0] !== 'object') {
            throw new Error('Invalid data format');
        }

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet([[
            'Order ID', 'Customer Name', 'Customer Mobile No.', 'Customer Address', 'Chemist Name',
            'Chemist Mobile No.', 'Chemist Address', 'Driver Name', 'Driver Mobile No.', 'Driver Address',
            'Delivery Status', 'No. of Medications', 'Quantity', 'Price', 'Payable Amount',
            'Payment Status', 'Charges', 'Total Amount To Pay', 'Date',
        ]]);
        ordersData.forEach(order => {
            const product = order.product[0];
            xlsx.utils.sheet_add_aoa(worksheet, [[
                order?.orderId,
                order?.customer?.name,
                order?.customer?.phoneNo,
                order.customer ? `${order?.customer?.streetAddress}, ${order?.customer?.city}, ${order?.customer?.province} - ${order?.customer?.postalCode}` : '',
                order?.chemist?.name,
                order?.chemist?.phoneNo,
                order?.chemist ? `${order?.chemist?.streetAddress}, ${order?.chemist?.city}, ${order?.chemist?.province} - ${order?.chemist?.postalCode}` : '',
                order?.driver?.name,
                order?.driver?.phoneNo,
                order.driver ? `${order?.driver?.streetAddress}, ${order?.driver?.city}, ${order?.driver?.province} - ${order?.driver?.postalCode}` : "",
                order?.deliveryStatus === 0 ? "Pending" : order.deliveryStatus === 1 ? "Delivery Assigned" : order.deliveryStatus === 2 ? "Picked By Driver" : order.deliveryStatus === 3 ? "Delivered" : "",
                order?.product[0].noOfPersons,
                order?.product[0].quantity,
                order?.product[0].price,
                order?.paybleAmount,
                order?.paymentStatus,
                order?.charges,
                order?.totalAmountToPay,
                moment(order?.customCreatedAt).format('YYYY-MM-DD HH:mm:ss')
            ]], { origin: -1 });
        });

        xlsx.utils.book_append_sheet(workbook, worksheet, 'Orders');

        const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');

        res.send(excelBuffer);
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Error downloading orders');
    }
};

module.exports = downloadOrders;