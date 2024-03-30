const express = require('express');
const LoginRouter = express.Router();
const LoginModal=require('../Modals/user.modal')
const {generateRandomString}=require('../generateRandom')
const Transporter=require('../Transporter/mailTransporter')
// NEW USER -SIGN UP -POST METHOD
LoginRouter.post("/createUsers", async (request, response,next) => {
    const { userEmail,userName, password } = request.body;
    
    /**
     * CHECKING WHETHER USER ALREADY HAVE ACCOUNT WITH US
     */
  
    const userExistingData = await LoginModal.findOne({
      userEmail:userEmail
    });
    if (userExistingData?._id) {
      return response.status(409).json({
        success: false,
        message: "User account already exists",
      });
    } else {
      //CONSTRUCTING NEW SIGNUP OBJECT
      const newUser = new LoginModal({
        userName:userName,
        userEmail:userEmail,        
        password: password,
      });
      // TRYING TO SAVE USER IN DATABASE
      newUser
        .save()
        .then((res) => {
          if (res._id) {
            response.status(200).json({
              success: true,
              message: "Account created successfully!!!",
              data: res,
            });
          } else {
            response.status(500).json({
              success: false,
              message: "Something went wrong internally!!!",
              data: res,
            });
          }
        })
        .catch((error) => {
          return response.status(400).json({
            success: false,
            message: "Bad Request!!!",
            error: error,
          });
        });
    }
  });
  // EXISTING USER - SIGN IN -POST METHOD
LoginRouter.post("/checkUser",async(req,response,next)=>{
    const{userEmail,password}=req.body;
    const userExistingData = await LoginModal.findOne({
userEmail:userEmail      });
      if(userExistingData?._id)
      {
        const match= (password===userExistingData.password)
        if(match)
        {
            return response.status(200).json({
                success: true,
                message: "Logged in successfully!!!",
                userEmail:userEmail
              });
        }
        else{
            return response.status(401).json({
                success: false,
                message: "EmailId or Password is In-correct!!!",
              });
        }
      }
      else{
        return response.status(404).json({
            success: false,
            message: "User account doesnt exists, create new account!!!",
          });
      }

})
//FORGOT PASSWORD  - SEND TOKEN - POST METHOD
LoginRouter.post('/requestPasswordReset',async (req, res) => {
  const { userEmail } = req.body;
try{
  const user = await LoginModal.findOne({ userEmail });
  // Check if the email exists in the MongoDB collection
  if (!user) {
    return res.status(404).json({ error: 'Email not found' });
  }
   // Generate a random token
   const token = generateRandomString(10);
   console.log(token);  // Output: "7bT3cD1rL9"
   // Save the token to the database
await LoginModal.findOneAndUpdate({ userEmail }, { resetToken: token }, { new: true, upsert: true });
// Compose the email
const mailOptions = {
  from: `${process.env.EMAIL}`,
  to: userEmail,
  subject: 'Password Reset',
  text: `Your random string: ${token}`,
};

      // Send the email with the random string
      Transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Failed to send the random string.' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Random string sent successfully to the email address.' });
      });

}
catch(error)
{
  console.error('Error querying the collections:', error);
      res.status(500).json({ error: 'Database query error' });
} 
});
// RESET PASSWORD - NEW PASSWORD -POST METHOD
LoginRouter.post('/reset-password', async (req, res) => {
  const {userEmail, resetToken, newPassword } = req.body;

  try {
    // Find the user with the matching email and token
    const user = await LoginModal.findOne({ userEmail, resetToken: resetToken });

    if (!user) {
      return res.status(404).json({ error: 'Invalid email or token.' });
    }

    // Update the user's password
    user.password = newPassword;
    user.resetToken = null; // Remove the reset token from the user document
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update password.' });
  }
});
 module.exports=LoginRouter;