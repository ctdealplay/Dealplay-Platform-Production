var express = require('express'),
    router = express.Router();
var Sys = require('../../Boot/Sys');
// Load Your Cutom Middlewares




/**
 * Auth Router
 */
router.get('/', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Controllers.Auth.login);
router.post('/', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Middlewares.Validator.loginPostValidate, Sys.App.Controllers.Auth.postLogin);
router.get('/userManagement',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.users)
router.get('/users/getUser',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.getUsers)
router.get('/addUser',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.addCustomer)
router.post('/addUser',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.addPostCustomer)
router.post('/validateEmail',Sys.App.Controllers.UserControllers.validateEmail)
router.post('/bulkUsersCreate',Sys.App.Controllers.UserControllers.bulkCreate)
router.get('/logout',Sys.App.Controllers.Auth.logout)
router.get('/editUser/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.editUser)
router.post('/editUser/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.editPostUser)
router.get('/deleteUser/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.deleteUser)
router.get('/deleteAdmin/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.deleteAdmin)
router.get('/learner/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.learner)
router.post('/user/changeStatus',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.userChangeStatus)
router.get('/getLearner',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.getLearner)
router.get('/user/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.getAdminUsers)
router.get('/getAllAdminUser',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.getAllAdminUser)
router.get('/companyManagement',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.companyManagement)
router.get('/getCompany',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.getCompany)
router.get('/addCompany',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.addCompany)
router.post('/addCompany',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.addPostCompany)
router.get('/editCompany/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.editCompany)
router.post('/editCompany/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.editPostCompany)
router.get('/deleteCompany/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.deleteCompany)
router.post('/validateName',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.validateName)
router.post('/getCompanies',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.getCompanies)

router.get('/learnerManagement',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.LearnerControllers.learnerManagement)
router.get('/getAllLearner',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.LearnerControllers.getAllLearner)
router.get('/addLearner',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.LearnerControllers.addLearner)
router.post('/addLearner',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.LearnerControllers.addPostLearner)
router.post('/bulkLearnersCreate',Sys.App.Controllers.LearnerControllers.bulkCreate)
router.get('/editLearner/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.LearnerControllers.editLearner)
router.post('/editLearner/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.LearnerControllers.editPostLearner)
router.get('/deleteLearner/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.LearnerControllers.deleteLearner)
router.post('/learnerStatus',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.LearnerControllers.learnerStatus)

router.get('/moduleManagement',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.moduleMangement)
router.get('/getAllModule',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.getAllModules)
router.get('/addModule',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.addModule)
router.post('/addModule',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.addPostModule)
router.get('/editModule/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.editModule)
router.post('/editModule/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.editPostModule)
router.get('/deleteModule/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.deleteModule)
router.post('/moduleStatus',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.moduleStatus)
router.get('/moduleBuild',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.moduleBuild)
router.get('/getAllModuleBuild',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.getAllModuleBuild)
router.get('/addModuleBuild',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.addModuleBuild)
router.post('/addModuleBuild',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.addPostModuleBuild)
router.get('/editModuleBuild/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.editModuleBuild)
router.post('/editModuleBuild/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.editPostModuleBuild)
router.get('/deleteModuleBuild/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ModuleControllers.deleteModuleBuild)

router.get('/adminManagement',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.adminMangement);
router.get('/getAdmin',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.getAdmin)
router.get('/addAdmin',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.addAdmin)
router.post('/addAdmin',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.addPostAdmin)
router.get('/editUserModule',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.editUserModule)
router.post('/editUserModule',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.editUserPostModule)
router.post('/getModuleData',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.getModuleData)
router.get('/getAdminModule',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.getAdminData)
router.post('/moduleAdminStatus',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.moduleAdminStatus)
router.post('/bulkAdminCreate',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.bulkAdminCreate)
router.get('/editAdmin/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.editAdmin)
router.post('/editAdmin/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.AdminControllers.editPostAdmin)

router.get('/profile',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.profile)
router.post('/profile/changePwd',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.ChangePassword)
router.post('/validateCurrentPassword',Sys.App.Controllers.UserControllers.validateCurrentPassword)

router.get('/auditLog',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.auditLog)
router.get('/getAllReport',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserControllers.getAllReport)

router.post('/logIn',Sys.App.Controllers.UserControllers.logIn)
router.get('/forgot-password', Sys.App.Controllers.Auth.forgotPassword);
router.post('/forgotPassword', Sys.App.Controllers.Auth.forgotPasswordPost);
router.get('/reset',Sys.App.Controllers.Auth.resetPassword)
router.post('/resetPassword',Sys.App.Controllers.Auth.resetPasswordPost)
module.exports = router