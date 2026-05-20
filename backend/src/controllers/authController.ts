import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Model } from "mongoose";
import Admin from "../models/Admin";
import Lecturer from "../models/Lecturer";
import Student from "../models/Student";
import { connectDB } from "../utils/db";
import { handleEmailVerification } from "../functions/handleEmailVerification";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const isProduction = process.env.NODE_ENV === "production";

type BaseUser = {
  password?: string | null;
  emailAddress: string;
};

type UserModel = Model<BaseUser>;

export const checkAuth = async (req: Request, res: Response) => {
    await connectDB(); // ensures connection before any query
  
  try {
    let user = null;
    let role = null;

    if ((user = await Admin.findById(req.user.id).select("-password"))) {
      role = "admin";
    } else if (
      (user = await Student.findById(req.user.id).select("-password"))
    ) {
      role = "student";
    } else if (
      (user = await Lecturer.findById(req.user.id).select("-password"))
    ) {
      role = "lecturer";
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ id: user._id, emailAddress: user.emailAddress, role });
  } catch (err) {
    console.log("Error!");
    res.status(500).json({ message: "Server error" });
  }
};

export const registerAdmins = async (req: Request, res: Response) => {
    await connectDB();
  
  const { emailAddress, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ emailAddress });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ emailAddress, password: hashedPassword });
    await newAdmin.save();
    return res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error registering admin:", error);
    return res
      .status(500)
      .json({
        message: "An error occured in registering the admin. Please try again",
      });
  }
};

export const verify = async (req: Request, res: Response) => {
    await connectDB();
  
  const { emailAddress } = req.body;
  const { role, forgotPassword } = req.query;

  console.log("verify hit:", { emailAddress, role, forgotPassword });

  try {
    const findUserType: Record<ValidRole, UserModel> = {
      admin: Admin,
      lecturer: Lecturer,
      student: Student,
    } as const;

    const validRoles = ["lecturer", "student", "admin"] as const;
    type ValidRole = (typeof validRoles)[number];

    if (typeof role !== "string" || !validRoles.includes(role as ValidRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const model = findUserType[role as ValidRole];

    console.log("the model and email: ", model, emailAddress);

    const user = await model.findOne({ emailAddress });

    if (!user) {
      return res.status(404).json({
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found`,
      });
    }

    await handleEmailVerification(
      user.emailAddress,
      user._id.toString(),
      role,
      forgotPassword === "true",
      res,
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createPassword = async (req: Request, res: Response) => {
  await connectDB();
  
  const { password } = req.body;
  const { userId, role } = req.query;

  try {
    const findUserType: Record<ValidRole, UserModel> = {
      admin: Admin,
      lecturer: Lecturer,
      student: Student,
    } as const;

    const validRoles = ["admin", "lecturer", "student"] as const;
    type ValidRole = (typeof validRoles)[number];

    if (typeof role !== "string" || !validRoles.includes(role as ValidRole)) {
      return res.status(400).json({ message: "Invalid role!" });
    }

    const model = findUserType[role as ValidRole];

    const user = await model.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: `This ${role} account does not exist!`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)}'s password has been successfully created`,
    });
  } catch (error) {
    console.error("Error creating password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  await connectDB();
  
  const { emailAddress, password } = req.body;
  const { role } = req.query;

  try {
    const findUserType: Record<ValidRole, UserModel> = {
      admin: Admin,
      lecturer: Lecturer,
      student: Student,
    };

    const validRoles = ["admin", "lecturer", "student"] as const;
    type ValidRole = (typeof validRoles)[number];

    if (typeof role !== "string" || !validRoles.includes(role as ValidRole)) {
      return res.status(400).json({ message: "Invalid role!" });
    }

    const model = findUserType[role as ValidRole];

    const user = await model.findOne({ emailAddress });

    if (!user) {
      return res.status(404).json({
        message: `This ${role} account does not exist!`,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.emailAddress,
        role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  await connectDB();
  
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
  });
  return res.status(200).json({ message: "Logout successful" });
};
