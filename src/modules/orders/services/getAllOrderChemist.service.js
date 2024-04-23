const mongoose = require('mongoose');
const OrderModal = require('../order.model');
const moment = require('moment');

const getAllOrderChemist = async (page, limit, filter, sort,userId) => {
    try{
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
    
        let filterQuery = {  active: true, chemist: new mongoose.Types.ObjectId(userId) };
        let sortQuery = { _id: -1 }
        
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
            filterQuery = { ...filterQuery, deliveryStatus: Number(filter.deliveryStatus) };
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
            var orderIdsearch = new RegExp(`.*${filter.orderId}.*`, "i");
            filterQuery = { ...filterQuery, orderId: { $regex: orderIdsearch } };
        }

        if (filter?.customerName) {
            var chemistNameRegex = new RegExp(`.*${filter.customerName}.*`, "i");
            filterQuery = { ...filterQuery, 'customer.name': { $regex: chemistNameRegex } };
        }

        if (filter?.driverName) {
            var driverNameRegex = new RegExp(`.*${filter.driverName}.*`, "i");
            filterQuery = { ...filterQuery, 'driver.name': { $regex: driverNameRegex } };
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
                    'driver.password': 0,
                    'driver.profilePic': 0,
                    'chemist.profilePic': 0,
                    'chemist.password': 0,
                    'chemist.seqId': 0,
                    'driver.seqId': 0,
                    'driver.driverPayout': 0,
                    
                }
            },
            {
                $match: filterQuery
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    data: { $push: "$$ROOT" } 
                }
            },
            {
                $sort:{
                    _id:1
                }
            }
        ];

        const result = await OrderModal.aggregate(aggregate);

        if (result.length > 0) {
            const { count, data } = result[0];
            const totalResults = count;
            const totalPages = Math.ceil(totalResults / length);
            const paginatedData = data.slice(skip, skip + length); 
            return { data: paginatedData, totalResults, totalPages, page: start, limit: length, status: true, code: 200 };
        } else {
            return { data: [], totalResults: 0, totalPages: 0, page: start, limit: length, status: true, code: 200 }; 
        }
    }catch(error){
        return { data: error.message, status:false,code:500 };
    } 
};

module.exports = getAllOrderChemist
