"use strict";

//const { response } = require('express');
//var express = require('express');
//var router = express.Router();

//const axiosBase = require('axios');
const axios = require("axios").default;
/* const axios = axiosBase.create({
  baseURL: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'text'
}); */

module.exports = {
  real: (req, res) => {
    console.log(req.body);
    console.log("wwwww");
    var data = {
      title: 'Ajax!',
    }
    //req.send(data.body);
    /* res.render('./cart.ejs', {
      data,
      body: [],
    }); */

    

    
  },
      
}