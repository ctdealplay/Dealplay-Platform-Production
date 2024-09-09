"use strict";

const mongoose = require("mongoose");
var Sys = require("../../Boot/Sys");
const learnerModel = mongoose.model("learner")
module.exports = {
  createLearner: async function (data) {
    console.log("createLearner Data:", data);
    try {
      return await learnerModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  findLearner:async function (data) {
    try {
      return await learnerModel.find(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  deleteManyLearner:async function (data) {
    try {
      return await learnerModel.deleteMany(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  findSingleLearner: async function (data) {
    console.log("findSingleLearner Data:", data);
    try {
      return await learnerModel.findOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  updateLearner: async function (condition,data) {
    console.log("updateLearner Data:", condition,data);
    try {
      return await learnerModel.updateOne(condition,data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  deleteLearner: async function (data) {
    console.log("deleteLearner Data:", data);
    try {
      return await learnerModel.deleteOne(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  
    
};
