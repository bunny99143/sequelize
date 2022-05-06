const jwt = require('jsonwebtoken');
const {Customer,generateAuthToken} = require('../models/customer');

module.exports =async function (req, res, next) {
  const token = req.header('authtoken');
  if (!token) return res.status(401).json({"status":'1',"message":'Access denied. No token provided.',"data":{}});
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    try {
      const customer = await Customer.findByPk(decoded._id);  
      if(customer){
        const token = generateAuthToken(customer.id); 
        req.customer = customer; 
        req.token = token; 
        next();  
      }else{
        res.status(400).send({"status":'1',"message":'Invalid Token',"data":{}});
      }      
    } catch (error) {
      return res.status(401).json({"status":'1',"message":error.message,"data":{}});  
    }
  }
  catch (ex) {
    res.status(400).send({"status":'1',"message":'Invalid Token',"data":{}});
  }
}