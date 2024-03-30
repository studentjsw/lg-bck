const UserModal=require('../Modals/user.modal')
const express = require('express');
const UserRouter=express.Router()
// USER EDIT PASSWORD -POST METHOD
UserRouter.post('/userpasswordreset',async (request,response,next)=>{
  try {
    const { userEmail, password } = request.body;
    const userExistingData = await UserModal.findOne({
      userEmail:userEmail
      });
    if (userExistingData?._id) {
      console.log(userExistingData.id);
      const updatedDocument = await UserModal.findOneAndUpdate(
        {       userEmail:userEmail
        }, // query to find the document to update
        {  password: password }, // fields to update
        { new: true, upsert: true }
      );
      if (updatedDocument) {
        response.status(200).json({ message: "Updated successfully!!!" });
      }
    } else {
      response.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).send('An error occurred');
  }
})
// VIEW USER PROFILE -GET METHOD
UserRouter.get('/viewprofile/:userEmail',async (request,response,next)=>
{
  try{
    const {userEmail}=request.params;
    const User = await UserModal.find({userEmail:userEmail});
        response.status(200).json(User);
  }
  catch(error)
  {
    console.error('Error updating data in MongoDB:', error);
    response.status(500).json({ error: 'Error fetchinhg user' });
  }
})
// UPDATE USER PROFILE -POST METHOD
UserRouter.post('/updateprofile',async(request,response)=>{
  const { userEmail, userAge,userDOB, userMobile,  userGender } = request.body;
  try {
    const userExistingData = await UserModal.findOne({ userEmail });
  
    if (userExistingData) {
      await UserModal.findOneAndUpdate(
        { userEmail },
        {
          userAge,
          userDOB,
          userGender,
          userMobile,
        },
        { new: true, upsert: true }
      );
  
      response.status(200).json({ message: 'Profile updated successfully.' });
    } else {
      response.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    console.error('Error querying the collections:', error);
    response.status(500).json({ error: 'Database query error' });
  }
  
})
module.exports=UserRouter;