var Sys = require("../../Boot/Sys");
var bcrypt = require("bcryptjs");
var helper = require("../../Helper/helper");
var fs = require("fs");
var dateformat = require("dateformat");
let mongoose = require("mongoose");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const { log } = require("util");
// var modules = ['Player Management','Player Withdraw', 'User Management', "All User", "My Site Owner", 'Theme Master',  'Line Master', 'Symbol Reel Payout', 'Reports', 'CMS Management',
//     'Settings',
// ];
// var userModules = ['Player Management', 'User Management', 'Reports'];
// var permissions = ["add", "edit", "delete", "view", "chips"];
module.exports = {
  /**
   * Users Login Page
   * @param {*} req
   * @param {*} res
   * @returns Render Page
   */
  users: async function (req, res) {
    try {
      console.log("user page ");
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        userMangement: "active",
        // user: user,
        role: req.session.details.role,
      };
      return res.render("user/user", data);
    } catch (e) {
      console.log("Error", e);
    }
  },

  /**
   * Uaers Login Function
   * @param {email,password} req
   * @param {*} res
   * @returns Redirect page
   */
  getUsers: async function (req, res) {
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = (req.session.details.role == "superAdmin")?{
        role:"user"}:{
        role:"user",
        userId: mongoose.Types.ObjectId(req.session.details.id),
      };

      if (search != "") {
        query.firstName = { $regex: ".*" + search + ".*" };
      }
      let data = await Sys.App.Services.UserServices.getUserDatatable(
        query,
        length,
        start
      );

      let dataCount = await Sys.App.Services.UserServices.getUserCount(query);

      console.log("dataCount", dataCount);

      var obj = {
        draw: req.query.draw,
        recordsTotal: dataCount,
        recordsFiltered: dataCount,
        data: data,
      };

      res.send(obj);
    } catch (e) {
      console.log("Error", e);
    }
  },
  addCustomer: async function (req, res) {
    try {
      let admin = await Sys.App.Services.UserServices.getUserData({role:"admin"});
      let companyDetails = await Sys.App.Services.UserServices.getCompany({})
      let companyName = []
      for(let j=0 ; j<companyDetails.length; j++){
        for(let i=0;i<admin.length;i++){
          if(admin[i].company.companyName == companyDetails[j].companyName){
            companyName.push(companyDetails[j])
          }
        }
      }
      console.log("user page ");
      let password = generatePass();
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        userMangement: "active",
        password: password,
        company:companyName,
        // user: user,
        role: req.session.details.role,
      };
      return res.render("user/addUser", data);
    } catch (e) {
      console.log("UserControllers=====>addCustomer====>Error", e);
    }
  },
  addPostCustomer: async function (req, res) {
    try {
      console.log(
        "UserControllers====>addPostCustomer====>req.body",
        req.body,
        req.session.details
      );
      let company = {}
      let role = await Sys.App.Services.UserServices.getOneByData({
        _id: mongoose.Types.ObjectId(req.session.details.id),
      });
      let userId = ""
      if(role.role == "superAdmin"){
        company = await Sys.App.Services.UserServices.getSingleCompany({_id:mongoose.Types.ObjectId(req.body.companyName)})
        let admin = await Sys.App.Services.UserServices.getOneByData({"company.companyName":company.companyName})
        userId = admin._id
      }else{
        company.companyName = role.company.companyName
        company.companyAddress = role.company.companyAddress
      }
      await Sys.App.Services.UserServices.createUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        visibalePassword:req.body.password,
        company: {
          companyName: company.companyName,
          companyAddress: company.companyAddress,
        },
        businessUnit: (role.role == "superAdmin")?req.body.businessName:role.businessUnit,
        role: "user",
        userId: (userId != "")?userId:req.session.details.id,
        phoneNumber: req.body.number,
      });
      await Sys.App.Services.UserServices.updateUser({_id:(userId != "")?userId:req.session.details.id},{$inc:{userCount:1}})

      req.flash("success", "User created successfully.");
      return res.redirect("/userManagement");
    } catch (e) {
      console.log("UserControllers=====>addCustomer====>Error", e);
    }
  },
  deleteUser: async function (req, res) {
    try {
      console.log("req.body", req.params);
      await Sys.App.Services.UserServices.deleteUser({
        _id: req.params.id,
      });
      await Sys.App.Services.LearnerServices.deleteManyLearner({userId:mongoose.Types.ObjectId(req.params.id)})
      await Sys.App.Services.ModuleServices.deleteManyModule({userId:mongoose.Types.ObjectId(req.params.id)})
      await Sys.App.Services.UserServices.updateUser({_id:req.session.details.id},{$inc:{userCount:-1}})
      req.flash("success", "User removed successfully.");
      return res.redirect("/userManagement");
    } catch (e) {
      console.log("UserControllers=====>deleteCustomer====>Error", e);
    }
  },
  deleteAdmin: async function (req, res) {
    try {
      console.log("req.body", req.params);
      await Sys.App.Services.UserServices.deleteUser({
        _id: req.params.id,
      });
      await Sys.App.Services.LearnerServices.deleteManyLearner({userId:mongoose.Types.ObjectId(req.params.id)})
      await Sys.App.Services.ModuleServices.deleteManyModule({userId:mongoose.Types.ObjectId(req.params.id)})
      req.flash("success", "Admin removed successfully.");
      return res.redirect("/adminManagement");
    } catch (e) {
      console.log("UserControllers=====>deleteCustomer====>Error", e);
    }
  },
  userChangeStatus: async function (req, res) {
    try {
      console.log("req.body", req.body);
      let user = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.body.id,
      });
      let status;
      if (user) {
        if (user.status == "active") {
          status = "inactive";
        } else {
          status = "active";
        }
        await Sys.App.Services.UserServices.updateUser(
          { _id: req.body.id },
          { status: status }
        );
        return res.send("success");
      }
    } catch (e) {
      console.log("UserControllers=====>userChangeStatus====>Error", e);
    }
  },
  companyManagement: async function (req, res) {
    try{
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        companyManagement: "active",
        // user: user,
        role: req.session.details.role,
      };
      return res.render("company/company", data);
    }catch(e){
      console.log("error",e);
      
    }
  },
  addCompany:async function (req, res) {
    try{
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        companyManagement: "active",
        // user: user,
        role: req.session.details.role,
      };
      return res.render("company/addCompany", data);
    }catch(e){
      console.log("error",e);
      
    }
  },
  addPostCompany:async function (req, res) {
    try{
      console.log("addPostCompany" ,req.body);
      await Sys.App.Services.UserServices.createCompany({
        companyName:req.body.companyName,
        companyAddress:req.body.companyAddress
      })
      req.flash("success","Company created successfully.")
      return res.redirect("/companyManagement")
    }catch(e){
      console.log("error",e);
    }
  },
  getCompany:async function(req,res){
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {
      };

      if (search != "") {
        query.companyName = { $regex: ".*" + search + ".*" };
      }
      let data = await Sys.App.Services.UserServices.getCompanyDatatable(
        query,
        length,
        start
      );

      let dataCount = await Sys.App.Services.UserServices.getCompanyCount(query);

      console.log("dataCount", dataCount);

      var obj = {
        draw: req.query.draw,
        recordsTotal: dataCount,
        recordsFiltered: dataCount,
        data: data,
      };

      res.send(obj);
    } catch (e) {
      console.log("Error", e);
    }
  },
  editCompany:async function(req,res){
    try{
      let company = await Sys.App.Services.UserServices.getSingleCompany({_id:req.params.id})
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        companyManagement: "active",
        company:company,
        // user: user,
        role: req.session.details.role,
      };
      return res.render("company/addCompany", data);
    }catch(e){
      console.log("Error", e);
    }
  },
  editPostCompany: async function(req,res){
    try{
      console.log("editPostCompany" ,req.body);
      await Sys.App.Services.UserServices.updateCompany({_id:req.params.id},{
        companyName:req.body.companyName,
        companyAddress:req.body.companyAddress
      })
      req.flash("success","Company updated successfully.")
      return res.redirect("/companyManagement")
    }catch(e){
      console.log("Error", e);
    }
  },
  deleteCompany: async function(req,res){
    try{
      await Sys.App.Services.UserServices.deleteCompany({_id:req.params.id})
      req.flash("success","Company deleted successfully.")
      return res.redirect("/companyManagement")
    }catch(e){
      console.log("Error", e);
    }
  },
  validateName:async function (req, res) {
    try{
      console.log("validateName", req.body.email);
      let distributor = await Sys.App.Services.UserServices.getSingleCompany({
        companyName: req.body.email,
      });
      console.log("distributor", distributor);
      if (req.body.distributorId != "" && distributor) {
        if (distributor._id == req.body.distributorId) {
          return res.send("error");
        } else {
          return res.send("success");
        }
      } else {
        if (distributor) {
          return res.send("success");
        } else {
          return res.send("error");
        }
      }
    }catch(e){
      console.log("error",e);
    } 
  },
  editUser: async function (req, res) {
    try {
      let user = await Sys.App.Services.UserServices.getOneByData({
        _id: req.params.id,
      });
      let role = await Sys.App.Services.UserServices.getOneByData({
        _id: mongoose.Types.ObjectId(req.session.details.id),
      });
     
      let data = {}
      if(role.role == "superAdmin"){
        let admin = await Sys.App.Services.UserServices.getUserData({role:"admin"});
      let companyDetails = await Sys.App.Services.UserServices.getCompany({})
      let companyName = []
      for(let j=0 ; j<companyDetails.length; j++){
        for(let i=0;i<admin.length;i++){
          if(admin[i].company.companyName == companyDetails[j].companyName){
            companyName.push(companyDetails[j])
          }
        }
      }
        let companyId = await Sys.App.Services.UserServices.getSingleCompany({companyName:user.company.companyName})
         data = {
          App: Sys.Config.App.details,
          error: req.flash("error"),
          success: req.flash("success"),
          userMangement: "active",
          user: user,
          role: req.session.details.role,
          company:companyName,
          companyId:String(companyId._id),
        };
      }else{
         data = {
          App: Sys.Config.App.details,
          error: req.flash("error"),
          success: req.flash("success"),
          userMangement: "active",
          user: user,
          role: req.session.details.role,
        };
      }
      return res.render("user/addUser", data);
    } catch (e) {
      console.log("UserControllers=====>addCustomer====>Error", e);
    }
  },
  editPostUser: async function (req, res) {
    try {
      let company = {}
      let user = await Sys.App.Services.UserServices.getOneByData({_id: req.params.id})
      let role = await Sys.App.Services.UserServices.getOneByData({
        _id: mongoose.Types.ObjectId(req.session.details.id),
      });
      let userId = ""
      if(role.role == "superAdmin"){
        company = await Sys.App.Services.UserServices.getSingleCompany({_id:mongoose.Types.ObjectId(req.body.companyName)})
        if(user.company.companyName != company.companyName){
          let admin = await Sys.App.Services.UserServices.getOneByData({"company.companyName":company.companyName})
          userId = admin._id
        }
      }else{
        company.companyName = role.company.companyName
        company.companyAddress = role.company.companyAddress
      }
      await Sys.App.Services.UserServices.updateUser(
        { _id: req.params.id },
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          company: {
            companyName: company.companyName,
            companyAddress: company.companyAddress,
          },
          businessUnit: (role.role == "superAdmin")?req.body.businessName:role.businessUnit,
          phoneNumber: req.body.number,
          userId:(userId != "")?userId:req.session.details.id,
         
        }
      );
      if(user.company.companyName != company.companyName){
        await Sys.App.Services.UserServices.updateUser({_id:(userId != "")?userId:req.session.details.id},{$inc:{userCount:1}})
      }
      req.flash("success", "User Updated successfully.");
      return res.redirect("/userManagement");
    } catch (e) {
      console.log("UserControllers=====>addCustomer====>Error", e);
    }
  },
  validateEmail: async function (req, res) {
    try {
      console.log("validateEmail", req.body.email);
      let distributor = await Sys.App.Services.UserServices.getSingleUserData({
        email: req.body.email,
      });
      console.log("distributor", distributor);
      if (req.body.distributorId != "" && distributor) {
        if (distributor._id == req.body.distributorId) {
          return res.send("error");
        } else {
          return res.send("success");
        }
      } else {
        if (distributor) {
          return res.send("success");
        } else {
          return res.send("error");
        }
      }
    } catch (e) {
      console.log("distributorController validateEmail Error", e);
      return new Error("distributorController validateEmail Error", e);
    }
  },
  bulkCreate: async function (req, res) {
    try {
      let file = req.files.img_logo;
      console.log("req.body", req.files);
      let user = await Sys.App.Services.UserServices.getOneByData({_id:req.session.details.id})

      if(file){
      await file.mv("public/dist/img/" + file.name, async (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        console.log("File path:", "/public/dist/img");

        // Now, you can retrieve the full path and insert the data into MongoDB
        const filePath = "public/dist/img" + "/" + file.name;
        if (file.mimetype == "text/csv") {
          insertCSVDataIntoMongoDB(filePath,req.session.details.id,req.session.details.name,user.company.companyName,user.company.companyAddress,user.businessUnit);

        } else if (
          file.mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          insertExcellDataIntoMongoDB(
            filePath,
            req.session.details.id,
            req.session.details.name
          );
        }
      });
      setTimeout(() => {
      res.redirect("/userManagement");
      },1000)
    }
    else{
      req.flash("error","Please check your file!")
      res.redirect("/userManagement");

    }
      // const fileStream = fs.createReadStream(file.data);
      // fileStream.pipe(csv())
      // .on('data', async (row) => {
      //   // Insert each row into MongoDB
      // console.log("row Data",row);
      // })
      // .on('end', () => {
      //   console.log('CSV file processed and data inserted into MongoDB');
      // });
      
    } catch (e) {
      console.log("Error", e);
    }
  },
  
  learner: async function (req, res) {
    try {
      let user = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.params.id,
      });
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        // userMangement: "active",
        user: user,
        role: req.session.details.role,
      };
      return res.render("user/learner", data);
    } catch (e) {
      console.log("UserControllers=====>learner====>Error", e);
    }
  },
  getAdminUsers:async function (req, res){
    try{

      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        // userMangement: "active",
        userId:req.params.id,
        role: req.session.details.role,
      };
      return res.render("admin/userList", data);
    }catch(e){
      console.log("UserControllers=====>getAdminUsers====>Error", e);

    }
  },
  getAllAdminUser: async function (req, res) {
    try{
      console.log("getLearner req.querdsafasdfasdfy", req.params);
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {
        userId: mongoose.Types.ObjectId(req.query.userId),
      };

      if (search != "") {
        query.name = { $regex: ".*" + search + ".*" };
      }
      let data = await Sys.App.Services.UserServices.getUserDatatable(
        query,
        length,
        start
      );
      console.log("data",data);
      
      let dataCount = await Sys.App.Services.UserServices.getUserCount(
        query
      );

      console.log("dataCounasdfat", dataCount);

      var obj = {
        draw: req.query.draw,
        recordsTotal: dataCount,
        recordsFiltered: dataCount,
        data: data,
      };

      res.send(obj);
    }catch(e){
      console.log("Error", e);
    }
  },
  getLearner: async function (req, res) {
    try {
      console.log("getLearner req.query", req.query);
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {
        userId: req.query.userId,
      };

      if (search != "") {
        query.name = { $regex: ".*" + search + ".*" };
      }
      let data = await Sys.App.Services.UserServices.getLearnerDatatable(
        query,
        length,
        start
      );

      let dataCount = await Sys.App.Services.UserServices.getLearnerCount(
        query
      );

      console.log("dataCount", dataCount);

      var obj = {
        draw: req.query.draw,
        recordsTotal: dataCount,
        recordsFiltered: dataCount,
        data: data,
      };

      res.send(obj);
    } catch (e) {
      console.log("Error", e);
    }
  },
  forgotPassword: async function (req, res) {
    try {
      var data = {
        App: Sys.Config.App.details,
      };
      return res.render("forgot-password", data);
    } catch (e) {
      console.log("Error", e);
    }
  },
  forgotPasswordPost: async function (req, res) {
    var emailId = req.body.email;
    try {
      if (emailId != "" && emailId != null) {
        var userDetail = await Sys.App.Services.UserServices.getByData({
          email: emailId,
        });
        console.log("userDetail", userDetail);
        if (userDetail.length > 0) {
          var uid = userDetail[0]._id.toString();
          var pswd = userDetail[0].password;
          var dt = new Date();

          var resetId = helper.enc(pswd, uid, dt);
          var resetLink = Sys.Config.Database.baseUrl + "/reset?id=" + resetId;
          console.log("resetLink", resetLink);
          var mailOptions = {
            to_email: emailId,
            subject: "Planet Sweep Slot : Password Reset Request",
            message:
              "<p>Dear " +
              userDetail[0].name +
              ',<br><br>We have received a request to reset the password for your account. If you did not make this request, please disregard this email.<br><br>To reset your password, please click on the following link:<br><br>Click <a href="' +
              resetLink +
              '">Here</a><br><br>If you have any questions or need further assistance, please contact our support team at ' +
              Sys.Config.social_media_login.smtp_sender_mail_id +
              ".<br><br>Thank you,<br>Planet Sweep Slot.</p>",
          };
          console.log("resetId", resetId);
          await helper.sendMail(mailOptions);

          req.flash(
            "success",
            "Password reset link sent to your email address"
          );
          if (req.query && req.query.type == "resend") {
            res.send("/");
          } else {
            res.redirect("/");
          }
        } else {
          req.flash("error", "Email-id is wrong.");
          res.redirect("/");
        }
      } else {
        req.flash("error", "Please enter email-id.");
        if (req.query && req.query.type == "resend") {
          res.send("/forgot-password");
        } else {
          res.redirect("/forgot-password");
        }
      }
    } catch (err) {
      console.log("forgot password:::::::::::>> err:", err);
      req.flash("error", "Email-id is wrong.");
      if (req.query && req.query.type == "resend") {
        res.send("/forgot-password");
      } else {
        res.redirect("/forgot-password");
      }
    }
  },
  logout: async function (req, res) {
    console.log("Logout");
    try {
      req.session.destroy(function (err) {
        req.logout();
        return res.redirect("/");
      });
    } catch (e) {
      console.log("Error", e);
    }
  },

  profile: async function (req, res) {
    console.log("profileeee");
    
    // console.log("session details id----------->",req.session.details.id);
    try {
      let user = await Sys.App.Services.UserServices.getByData({
        _id: req.session.details.id,
      });
      console.log("user ===========>",user[0].name);
      
      var data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        user: user[0],
        role: req.session.details.role,
      };
      console.log(user.image);
      
      if (req.session.details.role == "admin" || req.session.details.role == "user") {
        return res.render("adminProfile", data);
      } else {
        return res.render("profile", data);
      }
    } catch (e) {}
  },

  profileUpdate: async function (req, res) {
    try {
      user = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.session.details.id,
      });
      if (user) {
        console.log(req.files);
        // let image
        // if (req.files.profileImage) {
        //     // if (user.image != '/dist/img/user123.png' || user.image != null) {
        //     //     fs.unlink('public/' + user.image, function(err) {
        //     //         if (err) {
        //     //             console.log('profile >> update :::::::::>>>error: ', err);
        //     //         } else {
        //     //             console.log('File deleted!');
        //     //         }
        //     //     });
        //     // }

        //     var profileImage = req.files.profileImage;
        //     console.log("profileImage", profileImage);
        //     var tempNum = helper.randomNumber(4);
        //     var datetime = dateformat(new Date(), 'yyyymmddHHMMss');
        //     var imageName = '/dist/img/' + datetime + tempNum + ".jpg";
        //     await profileImage.mv('public/' + imageName);
        //     image = imageName;
        //     imagePath = imageName;
        // }
        await Sys.App.Services.UserServices.updateUserData(
          {
            _id: req.body.id,
          },
          {
            email: req.body.email,
            name: req.body.name,
            city: req.body.city,
            // image: image
          }
        );
        // req.session.details.image = image

        req.flash("success", "Profile update successfully");
        res.redirect("/profile");
      } else {
        req.flash("error", "profile not update successfully");
        return res.redirect("/profile");
      }
    } catch (e) {
      console.log("Error", e);
    }
  },

  ChangePassword: async function (req, res) {
    try {
      let user = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.session.details.id,
      });
      if (bcrypt.compareSync(req.body.currentPassword, user.password)) {
        if (user) {
          await Sys.App.Services.UserServices.updateUser(
            {
              _id: req.session.details.id,
            },
            {
              password: bcrypt.hashSync(
                req.body.pass_confirmation,
                bcrypt.genSaltSync(8),
                null
              ),
              visibalePassword:req.body.pass_confirmation
            }
          );
          req.flash("success", "Password update successfully");
          res.redirect("/profile");
        } else {
          req.flash("error", "Password not update successfully");
          return res.redirect("/profile");
        }
      } else {
        req.flash("error", "Password does not match");
        return res.redirect("/profile");
      }
    } catch (e) {
      console.log("Error", e);
    }
  },
  validateCurrentPassword: async function (req, res) {
    try {
      let user = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.session.details.id,
      });
      console.log("userPassword",user.password,req.body.password);
      
      if (bcrypt.compareSync(req.body.password, user.password)) {
        console.log("asdfasdfasd");
        
        return res.send("success")
      }else{
        console.log("111111111111");

        return res.send("error")
      }
    }catch(e){
      console.log("Error", e);
    }
  },
  frontWebglRequest: async function (req, res) {
    try {
      console.log("frontWebglRequest is called with parameters", req.body);
      let user;
      if (req.body.loginCode) {
        user = await Sys.App.Services.PlayerServices.getByData({
          loginCode: req.body.loginCode,
        });
      } else {
        res.send({
          status: "error",
          message:
            "Something Went Wrong, Please Re-Initialte the process to Play Game",
        });
      }
      if (
        user &&
        req.body.loginCode &&
        req.body.global_ip &&
        req.body.login_id &&
        req.body.themeId
      ) {
        await Sys.App.Services.UserServices.createWebglData({
          // email     : req.body.email,
          global_ip: req.body.global_ip,
          userId: req.body.login_id,
          themeId: req.body.themeId,
        });
        res.send({ status: "success" });
        // res.send('success','Webgl Data Created successfully');
        // res.redirect('/profile');
      } else {
        res.send({
          status: "error",
          message:
            "Something Went Wrong, Please Re-Initialte the process to Play Game",
        });
        // res.send('error', 'profile not update successfully');
        // return res.redirect('/profile');
      }
    } catch (e) {
      console.log("Error", e);
    }
  },
  resetPassword: async function (req, res) {
    var txt = req.query.id;

    if (txt && txt != "") {
      var obj = helper.dec(txt);

      if (obj && obj.id && obj.pswd && obj.time) {
        var dt = new Date();
        var linkDate = new Date(parseInt(obj.time));

        var diff = helper.getTimeDiff(linkDate, dt, "minute");
        if (diff <= 55) {
          //if link clicked within 5 minutes else link expires
          var userDetail = await Sys.App.Services.UserServices.getByData({
            _id: obj.id,
            password: obj.pswd,
          });

          if (userDetail) {
            res.render("resetPassword", {
              title: "Reset Password",
              error: req.flash("error"),
              success: req.flash("success"),
              vErrors: req.flash("vErrors"),
              session: req.session,
              // config: Sys.Config,
              id: req.query.id,
            });
          } else {
            //user not found
            console.log('resetPassword---11------>>>"user not found"');
            res.send("link is invalid or expired");
          }
        } else {
          //link expires
          console.log('resetPassword---22------>>>>"user not found"');
          res.send("link expired");
        }
      } else {
        //invalid link
        console.log('resetPassword--------->>>>"invalid link"');
        res.send("invalid link");
      }
    } else {
      //broken link
      console.log('resetPassword--------->>>"broken link"');
      res.send("broken link");
    }
  },
  resetPasswordPost: async function (req, res) {
    console.log("resetPasswordPost------------>>>req.query: ", req.query);
    var resetId = req.query.id;
    if (resetId) {
      var obj = helper.dec(resetId);
      console.log("userDetail", obj);
      if (obj && obj.id && obj.pswd && obj.time) {
        var dt = new Date();
        var linkDate = new Date(parseInt(obj.time));

        var diff = helper.getTimeDiff(linkDate, dt, "minute");
        console.log("userDetail", obj.id);
        console.log(
          "resetPasswordPost--------->>>diff: ",
          diff,
          " dt: ",
          dt,
          " linkDate: ",
          linkDate
        );
        if (diff <= 55) {
          //if link clicked within 5 minutes else link expires
          var userDetail = await Sys.App.Services.UserServices.getByData({
            _id: obj.id,
          });
          console.log("userDetail", userDetail);
          if (userDetail) {
            let newPassword = bcrypt.hashSync(req.body.newPassword);
            var updateData = await Sys.App.Services.UserServices.updateUserData(
              { _id: obj.id },
              { password: newPassword }
            );

            req.flash("success", "Password change successfully.");
            res.redirect("/");
          } else {
            //user not found
            req.flash("error", "Link is invalid or expired");
            res.redirect("/reset?id=" + resetId);
          }
        } else {
          //link expires
          req.flash("error", "Sorry! link is expired");
          res.redirect("/reset?id=" + resetId);
        }
      } else {
        req.flash("error", "Something went wrong...");
        res.redirect("/reset?id=" + resetId);
      }
    } else {
      req.flash("error", "Oops! something went wrong...");
      res.redirect("/reset");
    }
  },
  auditLog:async function (req, res) {
    try{
      // let role = await Sys.App.Services.UserServices.getOneByData({
      //   _id: mongoose.Types.ObjectId(req.session.details.id),
      // });
      let learner
      let moduleData
      let company
      if(req.session.details.role == "superAdmin"){
       learner = await Sys.App.Services.LearnerServices.findLearner({})
       moduleData = await Sys.App.Services.ModuleServices.getAllModuleBuild({})
       company  = await Sys.App.Services.UserServices.getUserData({role:"admin"})
      }else{
        learner = await Sys.App.Services.LearnerServices.findLearner({userId:mongoose.Types.ObjectId(req.session.details.id)})
        moduleData = await Sys.App.Services.ModuleServices.getAllModuleBuild({})
        company = await Sys.App.Services.UserServices.getOneByData({
            _id: mongoose.Types.ObjectId(req.session.details.id),
          });
      }
      console.log("learner",company);
      let data = {}
      if(req.session.details.role == "superAdmin"){
       data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        learner:learner,
        moduleData:moduleData,
        // company:company,
        auditLog:"active",
        // userMangement: "active",
        role: req.session.details.role,
      };
    }else{
      data = {
        App: Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        learner:learner,
        moduleData:moduleData,
        auditLog:"active",
        company:company,
        // userMangement: "active",
        role: req.session.details.role,
      };
    }
      return res.render("user/auditLog", data);
    }catch(e){
      console.log("auditLog error",e);
      
    }
  },
  getAllReport:async function (req, res) {
    try{

      console.log("req.query",req.query );
      let learner
      let moduleData
      let company
      let game
      let users = []
      let uniqueUsers = []
      let learnerDetails = []
     
      if(req.query.learnerId != "all"){
        console.log("yesssssssssssssssss");
        
        if(req.session.details.role == "superAdmin"){
          learner = await Sys.App.Services.LearnerServices.findLearner({_id:mongoose.Types.ObjectId(req.query.learnerId)})
          moduleData = await Sys.App.Services.ModuleServices.getAllModuleBuild({})
          company  = await Sys.App.Services.UserServices.getUserData({role:"admin"})
          game = await Sys.App.Services.ModuleServices.findModule({ learnerId:mongoose.Types.ObjectId(req.query.learnerId)})
          
          for (let userId = 0; userId < learner.length; userId++) {
            let user = await Sys.App.Services.UserServices.getSingleUserData({
              _id: learner[userId].userId,
              role: "admin",
            });
            if (user != null) {
              users.push(user);
            }
          }
          // console.log("users",users);
          if (req.query.gameId != "all") {
            let gameDetails = [];
            let gameData =
              await Sys.App.Services.ModuleServices.findSingleModule({
                _id: mongoose.Types.ObjectId(req.query.gameId),
                learnerId: learner[0]._id,
              });
            // if(gameData.length > 0){
            //   console.log("gameData.length",gameData);

            //   for(let gameTitle = 0 ; gameTitle < gameData.length ; gameTitle++){
            //     if(String(gameData._id) == req.query.gameId){

            //       gameDetails.push(gameData[gameTitle].title)
            //     }
            //   }
            if(gameData){
            learnerDetails.push({
              name: learner[0].firstName,
              gameName: [gameData.title],
            });
          }
            // }
          } else {
            let gameDetails = [];
            let gameData = await Sys.App.Services.ModuleServices.findModule({
              learnerId: learner[0]._id,
            });
            if (gameData.length > 0) {
              console.log("gameData.length", gameData.length);

              for (
                let gameTitle = 0;
                gameTitle < gameData.length;
                gameTitle++
              ) {
                gameDetails.push(gameData[gameTitle].title);
              }
              learnerDetails.push({
                name: learner[0].firstName,
                gameName: gameDetails,
              });
            }
          }
          // for(let learnerData = 0 ; learnerData < game.length ; learnerData++){
          //   if(req.query.gameId != "all"){
          //     if(req.query.gameId == game[learnerData]._id){
          //       learnerDetails.push({
          //         name:learner[0].firstName,
          //         gameName:game[learnerData].title
          //     })
          //   }
           
          //   }
          //   else{
          //     learnerDetails.push({
          //       name:learner[0].firstName,
          //       gameName:game[learnerData].title
          //   })
          //   }
          // }
          
           uniqueUsers = Array.from(new Map(users.map(users => [users.company.companyName, users])).values());


          

         }else{
           learner = await Sys.App.Services.LearnerServices.findLearner({userId:mongoose.Types.ObjectId(req.session.details.id)})
           moduleData = await Sys.App.Services.ModuleServices.getAllModuleBuild({})
          company  = await Sys.App.Services.UserServices.getSingleUserData({_id:mongoose.Types.ObjectId(req.session.details.id)})
          for (let userId = 0; userId < learner.length; userId++) {
            let user = await Sys.App.Services.UserServices.getSingleUserData({
              _id: learner[userId].userId,
              role: "admin",
            });
            if (user != null) {
              users.push(user);
            }
          }
           game = await Sys.App.Services.ModuleServices.findModule({ learnerId: { $exists: true },userId:mongoose.Types.ObjectId(req.session.details.id) })
          //  for (let userId = 0; userId < learner.length; userId++) {
          //   let user = await Sys.App.Services.UserServices.getSingleUserData({
          //     _id: learner[userId].userId,
          //     role: "admin",
          //   });
          //   if (user != null) {
          //     users.push(user);
          //   }
          // }
          // console.log("users",users);
          if (req.query.gameId != "all") {
            let gameDetails = [];
            let gameData =
              await Sys.App.Services.ModuleServices.findSingleModule({
                _id: mongoose.Types.ObjectId(req.query.gameId),
                learnerId: learner[0]._id,
              });
            // if(gameData.length > 0){
            //   console.log("gameData.length",gameData);

            //   for(let gameTitle = 0 ; gameTitle < gameData.length ; gameTitle++){
            //     if(String(gameData._id) == req.query.gameId){

            //       gameDetails.push(gameData[gameTitle].title)
            //     }
            //   }
            learnerDetails.push({
              name: learner[0].firstName,
              gameName: [gameData.title],
            });
            // }
          } else {
            let gameDetails = [];
            let gameData = await Sys.App.Services.ModuleServices.findModule({
              learnerId: learner[0]._id,
            });
            if (gameData.length > 0) {
              console.log("gameData.length", gameData.length);

              for (
                let gameTitle = 0;
                gameTitle < gameData.length;
                gameTitle++
              ) {
                gameDetails.push(gameData[gameTitle].title);
              }
              learnerDetails.push({
                name: learner[0].firstName,
                gameName: gameDetails,
              });
            }
          }
         }
         uniqueUsers = Array.from(new Map(users.map(users => [users.company.companyName, users])).values());

      }
      if(req.query.learnerId == "all" && req.query.gameId != "all"){
        console.log("yesssssssssssssssss");
        
        if(req.session.details.role == "superAdmin"){
          learner = await Sys.App.Services.LearnerServices.findLearner({})
          moduleData = await Sys.App.Services.ModuleServices.getAllModuleBuild({})
          company  = await Sys.App.Services.UserServices.getUserData({role:"admin"})
          game = await Sys.App.Services.ModuleServices.findModule({learnerId: { $exists: true }})
          
          for(let userId = 0 ;userId < learner.length;userId++){
            let user = await Sys.App.Services.UserServices.getSingleUserData({
              _id: learner[userId].userId,role:'admin'
            })
            if(user != null){
            users.push(user)
            }
          }
          // console.log("users",users);
            let gameData = await Sys.App.Services.ModuleServices.findSingleModule({_id:mongoose.Types.ObjectId(req.query.gameId)})
            console.log("gameData----------->",gameData);
            
            // if(gameData.length > 0){
            //   console.log("gameData.length",gameData);
              
              
            //     if(String(gameData._id) == req.query.gameId){

            //       gameDetails.push(gameData[gameTitle].title)
            //     }
             
            let gameDetails = await Sys.App.Services.ModuleServices.findModule({learnerId:gameData.learnerId})
            console.log("gameDetails==========>",gameData);
            
              for(let gameTitle = 0 ; gameTitle < gameDetails.length ; gameTitle++){
                let learnerData = await Sys.App.Services.LearnerServices.findSingleLearner({_id:gameDetails[gameTitle].learnerId})
                learnerDetails.push({
                  name:learnerData.firstName,
                  gameName:[gameData.title]
                })
              }
          // }
        
          // for(let learnerData = 0 ; learnerData < game.length ; learnerData++){
          //   if(req.query.gameId != "all"){
          //     if(req.query.gameId == game[learnerData]._id){
          //       learnerDetails.push({
          //         name:learner[0].firstName,
          //         gameName:game[learnerData].title
          //     })
          //   }
           
          //   }
          //   else{
          //     learnerDetails.push({
          //       name:learner[0].firstName,
          //       gameName:game[learnerData].title
          //   })
          //   }
          // }
          
           uniqueUsers = Array.from(new Map(users.map(users => [users.company.companyName, users])).values());


          

         }else{
           learner = await Sys.App.Services.LearnerServices.findLearner({userId:mongoose.Types.ObjectId(req.session.details.id)})
           moduleData = await Sys.App.Services.ModuleServices.getAllModuleBuild({})
           game = await Sys.App.Services.ModuleServices.findModule({ learnerId: { $exists: true },userId:mongoose.Types.ObjectId(req.session.details.id) })
           let gameData = await Sys.App.Services.ModuleServices.findSingleModule({_id:mongoose.Types.ObjectId(req.query.gameId)})
           console.log("gameData----------->",gameData);
           
           // if(gameData.length > 0){
           //   console.log("gameData.length",gameData);
             
             
           //     if(String(gameData._id) == req.query.gameId){

           //       gameDetails.push(gameData[gameTitle].title)
           //     }
            
           let gameDetails = await Sys.App.Services.ModuleServices.findModule({learnerId:gameData.learnerId})
           console.log("gameDetails==========>",gameData);
           
             for(let gameTitle = 0 ; gameTitle < gameDetails.length ; gameTitle++){
               let learnerData = await Sys.App.Services.LearnerServices.findSingleLearner({_id:gameDetails[gameTitle].learnerId})
               learnerDetails.push({
                 name:learnerData.firstName,
                 gameName:[gameData.title]
               })
             }
         }
      }
      if(req.query.learnerId == "all" && req.query.gameId == "all"){
        // console.log("asdfasdfasdfasdf");
        
        if(req.session.details.role == "superAdmin"){
          learner = await Sys.App.Services.LearnerServices.findLearner({})
          moduleData = await Sys.App.Services.ModuleServices.getAllModuleBuild({})
          company  = await Sys.App.Services.UserServices.getUserData({role:"admin"})
          game = await Sys.App.Services.ModuleServices.findModule({ learnerId: { $exists: true } })
          // console.log("game==============>",game);
          for(let userId = 0 ;userId < learner.length;userId++){
            let user = await Sys.App.Services.UserServices.getSingleUserData({
              _id: learner[userId].userId,role:'admin'
            })
            if(user != null){
            users.push(user)
            }
          }
          // console.log("users",users);
          
           uniqueUsers = Array.from(new Map(users.map(users => [users.company.companyName, users])).values());
          console.log("uniqueUsers",uniqueUsers);
          for(let learnerData = 0 ; learnerData < learner.length ; learnerData++){
            // console.log("learner",learner[learnerData].firstName);
            let gameDetails = []
              let gameData = await Sys.App.Services.ModuleServices.findModule({learnerId:learner[learnerData]._id})
             
              if(gameData.length > 0){
                console.log("gameData.length",gameData.length);
                
                for(let gameTitle = 0 ; gameTitle < gameData.length ; gameTitle++){
                  
                  gameDetails.push(gameData[gameTitle].title)
                }
                learnerDetails.push({
                  name:learner[learnerData].firstName,
                  gameName:gameDetails
              })
            }
          }
          
          // console.log("learnerDetails",learnerDetails);
          
         }else{
           learner = await Sys.App.Services.LearnerServices.findLearner({userId:mongoose.Types.ObjectId(req.session.details.id)})
           moduleData = await Sys.App.Services.ModuleServices.getAllModuleBuild({})
           company  = await Sys.App.Services.UserServices.getSingleUserData({_id:mongoose.Types.ObjectId(req.session.details.id)})
           game = await Sys.App.Services.ModuleServices.findModule({ learnerId: { $exists: true },userId:mongoose.Types.ObjectId(req.session.details.id) })
           for(let userId = 0 ;userId < learner.length;userId++){
            let user = await Sys.App.Services.UserServices.getSingleUserData({
              _id: learner[userId].userId,role:'admin'
            })
            if(user != null){
            users.push(user)
            }
          }
          uniqueUsers = Array.from(new Map(users.map(users => [users.company.companyName, users])).values());
           for(let learnerData = 0 ; learnerData < learner.length ; learnerData++){
            // console.log("learner",learner[learnerData].firstName);
            let gameDetails = []
              let gameData = await Sys.App.Services.ModuleServices.findModule({learnerId:learner[learnerData]._id})
             
              if(gameData.length > 0){
                console.log("gameData.length",gameData.length);
                
                for(let gameTitle = 0 ; gameTitle < gameData.length ; gameTitle++){
                  
                  gameDetails.push(gameData[gameTitle].title)
                }
                learnerDetails.push({
                  name:learner[learnerData].firstName,
                  gameName:gameDetails
              })
            }
          }
         }
      }
      // console.log("user",user);
      
      return res.send({"status":"success",data:{game:game,uniqueUsers:uniqueUsers,learnerDetails:learnerDetails}})
    }catch(e){
      console.log("error",e);
      
    }
  },
  // roleView: async function(req, res) {

  //     console.log("user", user);
  //     res.render('role/view', {
  //         error: req.flash("error"),
  //         success: req.flash("success"),
  //         vErrors: req.flash("vErrors"),
  //         auth: req.session,
  //         roleManagement: "active",
  //         modules: modules,
  //         permissions: permissions,
  //         user: user
  //     });
  // },
  // role: async function(req, res) {
  //     console.log(req.query);

  //     let user = await Sys.App.Services.UserServices.getByData({ role: req.query.typeOfRole })
  //     let userChips = await Sys.App.Services.UserServices.getByData({_id : req.session.details.id})
  //     req.session.details.chips = parseFloat(userChips[0].chips).toFixed(2)
  //     console.log(user);
  //     res.render('role/add', {
  //         error: req.flash("error"),
  //         success: req.flash("success"),
  //         vErrors: req.flash("vErrors"),
  //         auth: req.session,
  //         addRoleManagement: "active",
  //         roleManagement: "active",
  //         modules: modules,
  //         permissions: permissions,
  //         user: user
  //     });
  // },
  // roleTypeGet: async function(req,res){
  //     try{
  //         if(req.query.typeOfRole){
  //     console.log("req.query",req.query);

  //     let user = await Sys.App.Services.UserServices.getByData({ role: req.query.typeOfRole })
  //     console.log(user);

  //     if(req.query.typeOfRole == 'agent'){
  //         userModules = ['Player Management', 'Reports'];
  //     }
  //     else if(req.query.typeOfRole == 'master'){
  //         userModules = ['Player Management', 'Agent Management', 'Reports'];
  //     } else if(req.query.typeOfRole == 'grand-master'){
  //         userModules = ['Player Management', 'Master Management', 'Reports'];
  //     } else if(req.query.typeOfRole == 'site-owner'){
  //         userModules = ['Player Management', 'Grand Master Management', 'Reports'];
  //     }
  //     else if(req.query.typeOfRole == 'sub-admin'){
  //         userModules = ['Player Management','Player Withdraw', 'User Management', "All User", "My Site Owner", 'Theme Master',  'Line Master', 'Symbol Reel Payout', 'Reports', 'CMS Management',
  //         'Settings',
  //     ];
  //     }

  //     let obj = {
  //         user:user,
  //         modules: userModules,
  //         permissions:permissions,
  //         role:req.query.typeOfRole
  //     }
  //     res.send(obj)
  // }
  // else{
  //     req.flash('error', "Please select type.");
  //         res.redirect('/role');
  // }
  // }
  // catch(e){
  //     console.log("name render error",e);
  // }
  // },
  userView: async function (req, res) {
    console.log(req.query);
    let user = await Sys.App.Services.UserServices.getAllRole({
      role: req.query.type,
    });
    console.log("user", user);
    let obj = {
      user: user,
    };
    res.send(obj);
  },
  validPassword: async function (req, res) {
    try {
      let user = await Sys.App.Services.UserServices.getSingleUserData({
        _id: req.body.userId,
      });
      if (bcrypt.compareSync(req.body.password, user.password)) {
        return res.send("success");
      } else {
        return res.send("error");
      }
    } catch (e) {
      console.log("error", e);
    }
  },
  getCompanies: async function (req, res){
    try{
      let company = await Sys.App.Services.UserServices.getSingleCompany({_id:req.body.id})
      return res.send({status:"success",company:company})
    }catch(e){
      console.log("error", e);
    }
  },
  logIn: async function (req, res) {
    try {
      console.log("data",req.body);
      // let data = JSON.parse(req.body)
      let data = req.body
      if(!data.email){
          return  res.send({
              status: 'error',
              result: null,
              message: 'Please enter email.',
              statusCode: 400
          })
      }
      if(!data.password){
          return  res.send({
              status: 'error',
              result: null,
              message: 'Please enter password.',
              statusCode: 400
          })
      }
      let player = await Sys.App.Services.LearnerServices.findSingleLearner({ email: data.email });
     
      // await Sys.Game.Common.Services.PlayerServices.updateCoustomer({uniqueId: data.pin},{freeSpinCount:0,freeSpin:false,bonusValue:false})
      console.log("player",player);

      if( player && bcrypt.compareSync(data.password, player.password)){
          // if(player.login){
          //     return {
          //         status: 'error',
          //         result: null,
          //         message: 'This player is already login!',
          //         statusCode: 400
          //     }
          // }
          // await Sys.Game.Common.Services.PlayerServices.updateCoustomer({ uniqueId: data.pin },{socketId:socket.id,login:true})
          let game = await Sys.App.Services.ModuleServices.findModule({learnerId:player._id})
          console.log("game",game);
          
let gameData = {FeaturedModules:[],ActionModules:[],StoredModules:[],AllModules:[]}
          for(let gameCount=0 ;gameCount<game.length;gameCount++){
              console.log("gameCount",game[gameCount]);
              
              if(game[gameCount].tag == "featured"){
                  gameData.FeaturedModules.push({
                      ModuleName: game[gameCount].title,
                      BundleUrl:game[gameCount].buildUrl,
                      ImageUrl:game[gameCount].image
                  })
              } if(game[gameCount].tag == "action"){
                  gameData.ActionModules.push({
                      ModuleName: game[gameCount].title,
                      BundleUrl:game[gameCount].buildUrl,
                      ImageUrl:game[gameCount].image
                  })
              } if(game[gameCount].tag == "store"){
                  gameData.StoredModules.push({
                      ModuleName: game[gameCount].title,
                      BundleUrl:game[gameCount].buildUrl,
                      ImageUrl:game[gameCount].image
                  })
              }
              gameData.AllModules.push({
                  ModuleName: game[gameCount].title,
                  BundleUrl:game[gameCount].buildUrl,
                  ImageUrl:game[gameCount].image
              })
          }
          console.log("game-------->",game);
          return  res.send({
              status: 'success',
              result: {
                  ModuleData:gameData,
                  PlayerData:player
              },
              message: 'You are logged in successfully',
              statusCode: 200
          })
      }else{
          return  res.send({
              status: 'error',
              result: null,
              message: 'Please enter valid email and password.',
              statusCode: 400
          })
      }
     
  } catch (e) {
      console.log("Game-->Common-->PlayerController-->pinAuth", e);
  }
  }
 
  // roleSave: async function(req, res) {
  //     try {
  //         console.log("req.body",req.body);
  //         let user = await Sys.App.Services.UserServices.getByData({ name: req.body.role })
  //         console.log("user",user);
  //         let role = await Sys.App.Services.UserServices.getRole({ name: req.body.role })
  //         console.log("role",role);
  //         if(req.body.type == 'agent'){
  //             userModules = ['Player Management', 'Reports'];
  //         }
  //         else if(req.body.type == 'master'){
  //             userModules = ['Player Management', 'Agent Management', 'Reports'];
  //         } else if(req.body.type == 'grand-master'){
  //             userModules = ['Player Management', 'Master Management', 'Reports'];
  //         } else if(req.body.type == 'site-owner'){
  //             userModules = ['Player Management', 'Grand Master Management', 'Reports'];
  //         }
  //         else if(req.body.type == 'sub-admin'){
  //             userModules = ['Player Management','Player Withdraw', 'User Management', "All User", "My Site Owner", 'Theme Master',  'Line Master', 'Symbol Reel Payout', 'Reports', 'CMS Management',
  //             'Settings',
  //         ];
  //         }

  //         modules = userModules

  //         if (role) {
  //             let input = req.body;
  //             let permObj = {};

  //             modules.forEach(function(moduleName) {
  //                 permissions.forEach(function(permission) {
  //                     if (input[moduleName + permission]) {
  //                         if (!permObj[moduleName]) {
  //                             permObj[moduleName] = [];
  //                         }
  //                         permObj[moduleName].push(permission);
  //                     } else {
  //                         if (!permObj[moduleName]) {
  //                             permObj[moduleName] = [];
  //                         }
  //                         permObj[moduleName].push(null);
  //                     }
  //                 });
  //             });
  //             var condition = {
  //                 name: req.body.role
  //             }
  //             var inputData = {
  //                 permission: permObj,
  //             };
  //             await Sys.App.Services.UserServices.roleUpdate(condition, inputData);
  //             req.flash('success', "Role detail save.");
  //             res.redirect('/role');
  //         } else {
  //             let input = req.body;
  //             let permObj = {};

  //             modules.forEach(function(moduleName) {
  //                 permissions.forEach(function(permission) {
  //                     if (input[moduleName + permission]) {
  //                         if (!permObj[moduleName]) {
  //                             permObj[moduleName] = [];
  //                         }
  //                         permObj[moduleName].push(permission);
  //                     } else {
  //                         if (!permObj[moduleName]) {
  //                             permObj[moduleName] = [];
  //                         }
  //                         permObj[moduleName].push(null);
  //                     }
  //                 });
  //             });
  //             var inputData = {
  //                 name: req.body.role.trim(),
  //                 permission: permObj,
  //                 role:user[0].role
  //             };
  //             await Sys.App.Services.UserServices.roleAdd(inputData)
  //             req.flash('success', "Role detail save.");
  //             res.redirect('/role');
  //         }
  //     } catch (error) {
  //         console.log("role >> save:::::::::::::::>>> error: ", error);
  //         req.flash('error', "Role detail not save.");
  //         res.redirect('/role');
  //     }
  // },
  // getRole: async function(req, res) {
  //     try {
  //         let user = await Sys.App.Services.UserServices.getAllRole({})
  //         console.log("req.body.name", req.params.id);
  //         var roleId = req.params.id;
  //         console.log("roleId",roleId);

  //         let userChips = await Sys.App.Services.UserServices.getByData({_id : req.session.details.id})
  //         req.session.details.chips = parseFloat(userChips[0].chips).toFixed(2)
  //         if (roleId != "" && roleId != 0) {
  //             var roleDetail = await Sys.App.Services.UserServices.getRole({ name: req.body.name });
  //             // console.log("edit-------------->>>>roleDetail: ", roleDetail);

  //                 res.render('role/view', {
  //                     error: req.flash("error"),
  //                     success: req.flash("success"),
  //                     vErrors: req.flash("vErrors"),
  //                     auth: req.session,
  //                     // config: config,
  //                     role: roleDetail,
  //                     modules: modules,
  //                     permissions: permissions,
  //                     roleManagementView: 'active',
  //                     roleManagement: "active",
  //                     user: user
  //                 });

  //         } else {
  //             req.flash('error', "Role detail not available.");
  //             res.redirect('/roleView');
  //         }
  //     } catch (error) {
  //         console.log("role >> edit ::::::::::::::>> error: ", error);
  //         req.flash('error', "Role detail not available.");
  //         res.redirect('/roleView');
  //     }
  // },
  // getRolePost: async function(req, res) {
  //     try {
  //         // let user = await Sys.App.Services.UserServices.getAllRole({})
  //         var roleDetail = await await Sys.App.Services.UserServices.getRole({ name: req.body.name });
  //         console.log("roleDetail", roleDetail);
  //         // console.log("edit-------------->>>>roleDetail: ", roleDetail);
  //         if(roleDetail.role == 'agent'){
  //             userModules = ['Player Management', 'Reports'];
  //         }
  //         else if(roleDetail.role == 'master'){
  //             userModules = ['Player Management', 'Agent Management', 'Reports'];
  //         } else if(roleDetail.role == 'grand-master'){
  //             userModules = ['Player Management', 'Master Management', 'Reports'];
  //         } else if(roleDetail.role == 'site-owner'){
  //             userModules = ['Player Management', 'Grand Master Management', 'Reports'];
  //         }
  //         else if(roleDetail.role == 'sub-admin'){
  //             userModules = ['Player Management','Player Withdraw', 'User Management', "All User", "My Site Owner", 'Theme Master',  'Line Master', 'Symbol Reel Payout', 'Reports', 'CMS Management',
  //             'Settings',
  //         ];
  //         }
  //         let obj = {
  //             roleDetail: roleDetail,
  //             modules: userModules,
  //             permissions: permissions
  //         }
  //         res.json(obj)

  //     } catch (error) {
  //         console.log("role >> edit ::::::::::::::>> error: ", error);
  //         req.flash('error', "Role detail not available.");
  //         res.redirect('/roleView');
  //     }
  // },
  /* frontWebglRequest: async function(req,res){
      try{
        console.log("frontWebglRequest is called with parameters", req.body);
        let user;
        if (req.body.email) {
          user = await Sys.App.Services.PlayerServices.getByData({ email: req.body.email });
        }else if (req.body.mobile && req.body.countryCode) {
          user = await Sys.App.Services.PlayerServices.getByData({ mobile: req.body.countryCode + req.body.mobile });
        }else {
          res.send({ status:"error", message: "Something Went Wrong, Please Re-Initialte the process to Play Game" })
        }
          if( user && ( req.body.email || req.body.mobile ) && req.body.global_ip && req.body.login_id && req.body.themeId ){
          await Sys.App.Services.UserServices.createWebglData(
              {
                // email     : req.body.email,
                global_ip : req.body.global_ip,
                userId    : req.body.login_id,
                themeId   : req.body.themeId
              }
            )
            res.send({status:"success"})
            // res.send('success','Webgl Data Created successfully');
            // res.redirect('/profile');

          }else{
            res.send({ status:"error", message: "Something Went Wrong, Please Re-Initialte the process to Play Game" })
            // res.send('error', 'profile not update successfully');
          // return res.redirect('/profile');
          }
      }catch (e){
          console.log("Error",e);
      }
    }, */
};
async function insertCSVDataIntoMongoDB(file,id,name,companyName,companyAddress,businessUnit) {
  try{
  let rows = []
  await new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
  // console.log("row Data", rows);
    for(let i=0;i<rows.length;i++){
    let user = await Sys.App.Services.UserServices.getOneByData({email:rows[i].email})
    console.log("user",user);
    let company  = await Sys.App.Services.UserServices.getOneByData({"company.companyName":rows[i].companyName})
    if(!user){
    let password = generatePass();
  await Sys.App.Services.UserServices.insertUserData({
    userId: company._id,
    firstName: rows[i].firstName,
    lastName: rows[i].lastName,
    email: rows[i].email,
    password: bcrypt.hashSync(password, 10),
    visibalePassword:password,
    role: rows[i].role,
    "company.companyName": rows[i].companyName,
    "company.companyAddress": rows[i].companyAddress,
    businessUnit: businessUnit,
    phoneNumber: rows[i].phoneNumber,
  });
  await Sys.App.Services.UserServices.updateUser({_id:company._id},{$inc:{userCount:1}})

}
}
  }
  catch(e){
    console.log("insertCSVDataIntoMongoDB========>",e);
    
  }
}
async function insertExcellDataIntoMongoDB(filePath, id, name) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  for (let i = 0; i < sheetData.length; i++) {
    let user = await Sys.App.Services.UserServices.getOneByData({email:sheetData[i].email})
    if(!user){
      let password = generatePass();
    await Sys.App.Services.UserServices.insertUserData({
      userId: id,
      firstName: sheetData[i].firstName,
      lastName: sheetData[i].lastName,
      email: sheetData[i].email,
      password: bcrypt.hashSync(password, 10),
      visibalePassword:password,
      role: sheetData[i].role,
      companyName: sheetData[i].companyName,
      companyAddress: sheetData[i].companyAddress,
      businessUnit: sheetData[i].businessUnit,
      phoneNumber: sheetData[i].phoneNumber,
    });
  await Sys.App.Services.UserServices.updateUser({_id:id},{$inc:{userCount:1}})

  }
  }

  console.log("XLSX Data:", sheetData);
}
function generatePass() {
  let pass = "";
  let str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

  for (let i = 1; i <= 8; i++) {
    let char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
}

function validateEmail(email) {
  console.log("email", email);
  let regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let result = regex.test(email);
  return result;
}
