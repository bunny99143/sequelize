const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const {Customer,generateAuthToken} = require('../models/customer');
const auth = require("../middleware/auth");


router.post('/register', async (req, res) => {
  
    const options = {
        errors: {
            wrap: {
                label: ''
            }
        }
    };

    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body, options);
    if (error) return res.status(400).json({"status":'1',"message":error.details[0].message,"data":{}});
    
    let customer = await Customer.findOne({ where:{email: req.body.email} });
    if (customer) return res.status(400).send({"status":'1',"message":'Customer already registered.',"data":{}});
  
    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        customer = await Customer.create(req.body)  

    } catch (error) {
        if (error) return res.status(500).json({"status":'1',"message":error.message,"data":{}});
    }
    const token = generateAuthToken(customer.id);
    res.header('authtoken', token).send({"status":'1',"message":'Customer successfully registered.',"data":customer});
  
});




router.post('/login', async (req, res) => {
  
    const options = {
        errors: {
            wrap: {
                label: ''
            }
        }
    };

    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body, options);
    if (error) return res.status(400).json({"status":'1',"message":error.details[0].message,"data":{}});
    
    let customer = await Customer.findOne({ where:{email: req.body.email} });
    if (!customer) return res.status(400).json({"status":'1',"message":"Customer not found.","data":{}});

    const validPassword = await bcrypt.compare(req.body.password, customer.password);
    if (!validPassword) return res.status(400).send({"status":'1',"message":"Invalid email & password.","data":{}});

    const token = generateAuthToken(customer.id);
    res.header('authtoken', token).send({"status":'1',"message":"Login successfully.","data":customer});

});

router.get('/getCustomerDetail', auth, async (req, res) => {

    const token = req.token;
    const customer = await Customer.findByPk(req.customer.id,{attributes: {exclude: ['password','createdAt','updatedAt']}});
    res.header('authtoken', token).send({"status":'1','message':'User details fetch successfully', customer});
  
});


router.post('/update',auth, async (req, res) => {
  
    const options = {
        errors: {
            wrap: {
                label: ''
            }
        }
    };

    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email()
    });

    const { error } = schema.validate(req.body, options);
    if (error) return res.status(400).json({"status":'1',"message":error.details[0].message,"data":{}});
    

    try {
    let customer = await Customer.update(req.body,
                        {
                            where: { id: req.customer.id },
                            returning: true
                        }
                    );
    const customerUpdated = await Customer.findByPk(req.customer.id,{attributes: {exclude: ['password','createdAt','updatedAt']}});

    const token = generateAuthToken(customerUpdated.id);
    res.header('authtoken', token).send({"status":'1',"message":'Customer successfully registered.',"data":customerUpdated});
  
    } catch (error) {
        if (error) return res.status(500).json({"status":'1',"message":error.message,"data":{}});
    }
    
  
});

module.exports = router; 
