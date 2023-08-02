import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import protect from "../middlewares/authMiddleware.js";



//REGISTER
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body); 
  const { first_name, last_name, email, password } = req.body;

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await userModel.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } else {
    if (!first_name) {
      res.status(400);
      throw new Error("Please add your first name");
    }
    if (!last_name) {
      res.status(400);
      throw new Error("Please add your last name");
    }

    if (!email) {
      res.status(400);
      throw new Error("Please add your email");
    }

    if (!password) {
      res.status(400);
      throw new Error("Please add your password");
    }

    res.status(400);
    throw new Error("Invalid user data");
  }
});



//GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const all_users = await userModel.find();

    res.json({
      message: "All users",
      status: 200,
      data: all_users,
    });
  } catch (err) {
    return res.status(500).json({
      data: err,
    });
  }
};



//LOGIN
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const loginUser = await userModel.findOne({ email });

  if (loginUser && (await bcrypt.compare(password, loginUser.password))) {
    const token = jwt.sign(
      {
        user_id: loginUser._id,
        email: loginUser.email,
        // first_name: loginUser.first_name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d", 
      }
    );
    res.json({
      _id: loginUser.id,
      // first_name: loginUser.first_name,
      email: loginUser.email,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email Data");
  }
});



//LOGOUT
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out" });
});



//GET ME
const getMe = asyncHandler(async (req, res) => {
const currentUser = req.user;
  console.log(req.user, "lol");
  res.json({
    message: "User data retrieved successfully",
    status: 200,
    data: currentUser,
  });
});

//GET BY ID
const getUserById = asyncHandler(async (req, res) => {
  const User = await userModel.findById(req.params.id);

  if (User) {
    res.json({
      message: "User data retrieved",
      User,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedUser = await userModel.findByIdAndDelete(id);

  if (deletedUser) {
    res.json({
      message: "User deleted successfully",
      status: 200,
      data: deletedUser,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//EDIT USER
const editUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password } = req.body;

  try {
    const userToUpdate = await userModel.findById(id);

    if (!userToUpdate) {
      res.status(404);
      throw new Error("User not found");
    }

    userToUpdate.first_name = first_name || userToUpdate.first_name;
    userToUpdate.last_name = last_name || userToUpdate.last_name;
    userToUpdate.email = email || userToUpdate.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      userToUpdate.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await userToUpdate.save();

    res.json({
      message: "User updated successfully",
      status: 200,
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message, status: 400 });
  }
});

export default {
  registerUser,
  loginUser,
  getUserById,
  getMe,
  deleteUser,
  editUser,
  getUsers,
  logoutUser,
};
