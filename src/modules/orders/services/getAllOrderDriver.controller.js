const mongoose = require('mongoose');
const OrderModal = require('../order.model');
const moment = require('moment');

const getAllOrderDriver = async (page, limit, filter, sort, userId) => {
    try {
       

        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;

        let filterQuery = { active: true, driver: new mongoose.Types.ObjectId(userId) };
        let sortQuery = { createdAt: -1 }

        for (let key in sort) {
            if (sort.hasOwnProperty(key)) {
                let value = sort[key];
                let numericValue = Number(value);
                if (!isNaN(numericValue)) {
                    sort[key] = numericValue;
                }
            }
        }
        if (sort != null) {
            sortQuery = sort
        }

        if (filter?.deliveryStatus) {

            filterQuery = { ...filterQuery, deliveryStatus: Number(filter?.deliveryStatus) };
        }
        if (filter?.orderId) {
            let capitalizedOrderId = "";
            for (let i = 0; i < filter.orderId.length; i++) {
                const char = filter.orderId[i];
                if (/[a-zA-Z]/.test(char)) {
                    capitalizedOrderId += char.toUpperCase();
                } else {
                    capitalizedOrderId += char;
                }
            }
            var searchRegex = new RegExp(`.*${filter?.orderId}.*`, "i");
            filterQuery = { ...filterQuery, orderId: { $regex: searchRegex } };
        }
      
     
        if (filter?.fromDate && filter?.toDate) {
       
            filter = { ...filter, fromDate: moment.utc(filter?.fromDate, 'YYYY/DD/MM').format('YYYY-MM-DDT00:00:00.000[Z]') };
            const fromDate = new Date(`${filter.fromDate}`);
        
         
            filter = { ...filter, toDate: moment.utc(filter?.toDate, 'YYYY/DD/MM').format('YYYY-MM-DDT23:59:59.999[Z]') };
            const toDate = new Date(`${filter.toDate}`);
        
            filterQuery = {
                ...filterQuery,
                customCreatedAt: { $gte: fromDate, $lte: toDate }
            };
        }
        
        const aggregate = [
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
                    localField: 'chemist',
                    foreignField: '_id',
                    as: 'chemist'
                }
            },
            {
                $unwind: {
                    path: '$chemist',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    'chemist.password': 0,
                    'chemist.profilePic':0, 
                    'customer.createdAt':0,
                    'customer.updatedAt':0,
                    'chemist.createdAt':0,
                    'chemist.updatedAt':0,
                    'customer.seqId':0,
                    'chemist.seqId':0,
                    'chemist.chemistPay':0,
                    'order.sign':0,

                }
            },
          
            {
                $skip: skip
            },
            {
                $limit: length
            },
           
        ]



        const listResult = await OrderModal.aggregate(aggregate)
        const totalResults = await OrderModal.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalResults / length);
        if (listResult || totalResults ) {
            return { data: listResult, totalResults, totalPages, page: start, limit: length, status: true, code: 200 };
        }
        else {
            return { data: "User not found", status: false, code: 400 };
        }
    } catch (error) {
        console.log(error)
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getAllOrderDriver
