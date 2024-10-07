import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";

const register = async (req: any, res: any) => {
  const body = req.body;
  const { email, name, password } = body;
  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      throw new Error(`Account already registered`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    body.password = hashpassword;

    const newUser: any = new UserModel(body);
    await newUser.save();

    delete newUser._doc.password;

    res.status(200).json({
      message: "Register",
      data: {
        ...newUser._doc,
      },
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export { register };
