"use strict";

const mongoose = require("mongoose");
var Sys = require("../../Boot/Sys");
const userModel = mongoose.model("user");
const learnerModel = mongoose.model("learner")
const companyModel = mongoose.model("company")
module.exports = {
  createUser: async function (data) {
    console.log("createUser Data:", data);
    try {
      return await userModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  createCompany: async function(data){
    try{
        return await companyModel.create(data)
    }catch(e){
      console.log("Error", e);
    }
  },
  getSingleCompany: async function(data){
    try{
      return await companyModel.findOne(data)
  }catch(e){
    console.log("Error", e);
  }
  },
  getByData: async function (data) {
    console.log("Find By Data:", data);
    try {
      return await userModel.find(data).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },
  getUserCount: async function (data) {
    try {
      return await userModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getCompanyDatatable: async function (query, length, start) {
    try{
      return await companyModel.find(query).skip(start).limit(length).lean();
    }catch(e){
      console.log("Error", e);
    }
  },
  getCompany:async function (data){
    try{
      return await companyModel.find(data)
    }catch(e){
      console.log("Error", e);
    }
  },
  updateCompany: async function(condition,data){
    try{
      return await companyModel.updateOne(condition,data)
    }
    catch(e){
      console.log("Error", e);
    }
  },
  deleteCompany: async function(data){
    try{
      return await companyModel.deleteOne(data)
    }catch(e){
      console.log("Error", e);
    }
  },
  getCompanyCount: async function (data) {
    try{
      return await companyModel.countDocuments(data);
    }catch(e){
      console.log("Error", e);
    }
  },
  getOneByData: async function (data) {
    console.log("Find By Data:", data);
    try {
      return await userModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getUserData: async function (data) {
    try {
      return await userModel.find(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getSingleUserData: async function (data) {
    try {
      return await userModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
 
  getUserDatatable: async function (query, length, start) {
    try {
      console.log("calll", query);
      return await userModel.find(query).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },
  getLearnerDatatable: async function (query, length, start) {
    try {
      console.log("calll", query);
      return await learnerModel.find(query).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },
  getLearnerCount: async function (data) {
    try {
      return await learnerModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
 
  insertUserData: async function (data) {
    try {
      await userModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  updateUser: async function (condition, data) {
    try {
      await userModel.updateOne(condition, data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  deleteUser: async function (data) {
    try {
      console.log("deleteUser",data);
      await userModel.deleteOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  

  getfindOneAndUpdate: async function (condition, data) {
    try {
      await userModel.findOneAndUpdate(condition, data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getAdminDatatable: async function (query, length, start) {
    try{
      console.log("getAdminDatatable",query, length, start);
      return await userModel.find(query).skip(start).limit(length).lean();
    }catch(e){
      console.log("Error", e);
    }
  },

  getAdminCount: async function (data) {
    try{
      return await userModel.countDocuments(data);
    }catch(e){
      console.log("Error", e);
    }
  }

    
};
