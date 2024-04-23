const mongoose = require('mongoose');
const User = require('../../user/user.model');


const getAllDriver = async () => {
  try{
    const seriesearchQuery = { active: true, role: "driver" };
    const allDriver = await User.find(seriesearchQuery)
    if(!allDriver){
      return {status:false,data:"Driver not found", code:400}
    }
    return {status:true,data:allDriver,code:200}
   
  
  }catch(error){
    return{data:error.message,status:false,code:500};
  }
};

module.exports = getAllDriver
