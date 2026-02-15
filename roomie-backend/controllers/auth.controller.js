import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const signUp = async(req, res, next) => {
  console.log("✅ /auth/sign-up HIT", new Date().toISOString());
  
  try {
    const { name, email, password, clerkUserId } = req.body;

    if(!clerkUserId){
      const error = new Error("clerkUserId is required");
      error.statusCode = 400;
      throw error;
    }

    let user = await User.findOne({ clerkUserId });
    if(user) {
        return res.status(200).json({
          status: "success",
          data: { user },
        });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      clerkUserId,
    });
    

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch(error){
    next(error);
  }
}

export const logIn = async(req, res, next) => {
   try {
    const { email, password } = req.body
    
    const user = await User.findOne({email});

    if(!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        const error = new Error('Invalid password');
        error.statusCode = 401;
        throw error;
    }

    res.status(200).json({
        success: true,
        data: { user }
    });
   } catch (error){
     next(error);
   }
}