const mongoose = require('mongoose');
const OrderModal = require('../order.model');
const moment = require('moment');

const getChemistPay = async (userId, toDate, fromDate) => {
    console.log(userId);
    try {
        let filterQuery = { active: true, deliveryStatus: 3, chemist: new mongoose.Types.ObjectId(userId) };
        if (fromDate && fromDate) {
            filter = { ...filter, fromDate: moment.utc(fromDate, 'YYYY/DD/MM').format('YYYY-MM-DDT00:00:00.000[Z]') };
            const newfromDate = new Date(`${filter?.fromDate}`);

            filter = { ...filter, toDate: moment.utc(toDate, 'YYYY/DD/MM').format('YYYY-MM-DDT23:59:59.999[Z]') };
            const newtoDate = new Date(`${filter?.toDate}`);

            filterQuery = {
                ...filterQuery,
                customCreatedAt: { $gte: newfromDate, $lte: newtoDate }
            };
        }

        console.log(filterQuery);
        const dataAggregate = [
            {
                $match: filterQuery
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            {
                $unwind: {
                    path: '$customer',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'driver'
                }
            },
            {
                $unwind: {
                    path: '$driver',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    'customer.name': 1,
                    'driver.name': 1,
                    'orderId': 1,
                    'chemistPay': 1,
                    '_id': 0
                }
            },
            {
                $group: {
                    _id: null,
                    data: { $push: '$$ROOT' },
                    sumOfTotalChemistPay: { $sum: '$chemistPay' }
                }
            },
            {
                $project: {
                    _id: 0,
                    data: 1,
                    sumOfTotalChemistPay: 1
                }
            }
        ];

        const result = await OrderModal.aggregate(dataAggregate);

        return {
            data: result.length > 0 ? result[0].data : [],
            sumOfTotalChemistPay: result.length > 0 ? result[0].sumOfTotalChemistPay : 0,
            status: true,
            code: 200
        };
    } catch (error) {
        console.log(error);
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getChemistPay;
