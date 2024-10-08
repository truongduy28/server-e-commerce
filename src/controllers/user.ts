import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import { getToken } from "../utils/token";

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

    const { _id, email: userEmail, role } = newUser._doc
    res.status(200).json({
      message: "Register",
      data: {
        ...newUser._doc,
        token: getToken({ _id, email: userEmail, role: role || 1 }),
      },
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const login = async (req: any, res: any) => {
  const body = req.body;
  const { email, password } = body;
  try {
    const user: any = await UserModel.findOne({ email });

    if (!user) {
      throw new Error(`Email or password incorrect!!!`);
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      throw new Error(
        'Email or password incorrect!!!'
      );
    }

    delete user._doc.password;

    res.status(200).json({
      message: 'Login successfully!!!',
      data: {
        ...user._doc,
        token: await getToken({
          _id: user._id,
          email: user.email,
          role: user.role ?? 1,
        }),
      },
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};


export { register, login };
