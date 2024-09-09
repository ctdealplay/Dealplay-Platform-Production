"use strict";

const mongoose = require("mongoose");
var Sys = require("../../Boot/Sys");
const moduleModel = mongoose.model("module")
const moduleSessionModel = mongoose.model("moduleSession")
const moduleDataModel = mongoose.model("moduleData")
module.exports = {
  createModule: async function (data) {
    console.log("createModule Data:", data);
    try {
      return await moduleModel.create(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  createModuleSession: async function(data){
    try{
      return await moduleSessionModel.create(data);
    }catch(e){
      console.log("Error", e);
    }
  },
  getModuleSessionDatatable: async function(query, length, start){
    try{
      return await moduleModel.aggregate([{$match:query},{$lookup:{from:'moduleSession',localField:'_id',foreignField:'moduleId',as:'moduleSession'}},{ "$limit": length },
        { "$skip": start }])
    }catch(e){
      console.log("Error", e);
    }
  },
  findSingleModuleLookup: async function(data){
    try{
      console.log("findSingleModuleLookup",data);
      
      return await moduleModel.aggregate([{$match:data},{$lookup:{from:'moduleSession',localField:'_id',foreignField:'moduleId',as:'moduleSession'}}])
    }catch(e){
      console.log("Error", e);
    }
  },
  findSingleModule: async function (data) {
    console.log("findSingleModule Data:", data);
    try {
      return await moduleModel.findOne(data).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },
  findSingleModuleSessionLookup: async function (data) {
    try{
      console.log("findSingleModuleLookup",data);
      
      return await moduleSessionModel.aggregate([{$match:data},{$lookup:{from:'module',localField:'moduleId',foreignField:'_id',as:'moduleData'}}])
    }catch(e){
      console.log("Error", e);
    }
  },
  findSingleModuleSession: async function (data) {
    try{
      return await moduleSessionModel.findOne(data)
    }catch(e){
      console.log("Error", e);
    }
  },
  findModuleSession: async function (data) {
    try{
      return await moduleSessionModel.find(data)
    }catch(e){
      console.log("Error", e);
    }
  },
  updateModule: async function (condition,data) {
    try{
      return await moduleModel.updateOne(condition,data)
    }catch(e){
      console.log("Error", e);
    }
  },
  findModuleSessionCount: async function (data) {
    try{
      console.log("findModuleSessionCount",data);
      
      return await moduleSessionModel.aggregate([{$match:data},{$group:{_id:null, totalAmount:{$sum:"$maxSession"}}}])
    }catch(e){
      console.log("Error", e);
    }
  },
  updateModuleSession: async function (condition,data) {
    try{
      return await moduleSessionModel.updateOne(condition,data)
    }catch(e){
      console.log("Error", e);
    }
  },
  findModule: async function (data) {
    console.log("findSingleModule Data:", data);
    try {
      return await moduleModel.find(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  deleteManyModule: async function (data) {
    try{
      return await moduleModel.deleteMany(data);
    }catch(e){
      console.log("Error", e);
    }
  },
  findDistinct: async function (data) {
    console.log("findSingleModule Data:", data);
    try {
      return await moduleModel.distinct(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  createModuleBuild: async function (data) {
    try{
      return await moduleDataModel.create(data)
    }catch(e){
      console.log("Error", e);
    }
  },
  getSingleModuleBuild: async function (data) {
    try{
      return await moduleDataModel.findOne(data)
    }catch(e){
      console.log("Error", e);
    }
  },
  updateModuleBulid: async function (condition,data) {
    try{
      return await moduleDataModel.updateOne(condition,data)
    }catch(e){
      console.log("Error", e);
    }
  },
  getAllModuleBuild: async function (data) {
    try{
      return await moduleDataModel.find(data)

    }catch(e){
      console.log("Error", e);
    }
  },
  deleteModuleBuild: async function (data) {
    try{
      return await moduleDataModel.deleteOne(data)
    }catch(e){
      console.log("Error", e);
    }
  },
  getModuleBuildData: async function (query, length, start) {
    try {
      return await moduleDataModel.find(query).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },
  getModuleBuildDataCount: async function (query) {
    try{
      return await moduleDataModel.countDocuments(query)
    }catch(e){
      console.log("Error", e);
    }
  },
  deleteModule: async function (condition,data) {
    console.log("deleteModule Data:", condition,data);
    try {
      return await moduleModel.deleteOne(condition,data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getModuleDatatable: async function (query, length, start) {
    try {
      return await moduleModel.find(query).skip(start).limit(length).lean();
    } catch (e) {
      console.log("Error", e);
    }
  },
  getModuleCount: async function (data) {
    try {
      return await moduleModel.countDocuments(data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getModuleDatatableLookup: async function (query, length, start) {
    try {
      return await moduleModel.aggregate([{$match:query},{$lookup:{from:'learner',localField:'learnerId',foreignField:'_id',as:'learner'}},{ "$limit": length },
        { "$skip": start }]);
    } catch (e) {
      console.log("Error", e);
    }
  },

  getModuleDatatableLookupCount: async function (query, length, start) {
    try {
      return await moduleModel.aggregate([{$match:query},{$lookup:{from:'learner',localField:'learnerId',foreignField:'_id',as:'learner'}}]);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getModuleSessionDatatableLookup: async function (query, length, start) {
    try {
      return await moduleModel.aggregate([{$match:query},{$lookup:{from:'user',localField:'userId',foreignField:'_id',as:'userData'}},{ "$limit": length },
        { "$skip": start }]);
    } catch (e) {
      console.log("Error", e);
    }
  },
  getModuleSessionDatatableLookupCount: async function (query) {
    try {
      return await moduleModel.aggregate([{$match:query},{$lookup:{from:'user',localField:'userId',foreignField:'_id',as:'userData'}}]);
    } catch (e) {
      console.log("Error", e);
    }
  },
    
};
