import bcrypt from "bcrypt";
import CustomerModel from "../models/CustomerModel";
import { sendMail } from "../utils/mailler";
import { generateVerificationCode } from "../utils/generators";
import { getToken } from "../utils/token";

const create = async (req: any, res: any) => {
  const body = req.body;

  try {
    const user = await CustomerModel.findOne({ email: body.email });
    console.log(user);
    if (user) {
      throw new Error("User is existing!!!!");
    }
    const code = generateVerificationCode();
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(body.password, salt);

    body.password = hashpassword;

    const newCustomer: any = new CustomerModel({ ...body, verifyCode: code });
    await newCustomer.save();

    delete newCustomer._doc.password;
    delete newCustomer._doc.verifyCode;

    await sendMail({
      from: "Truong Duy E-Commerce (no-reply)",
      to: body.email,
      subject: "Verify account in Truong Duy E-Commerce System",
      text: "",
      html: `<h1>Code: <b>${code}</b></h1>`,
    });

    res.status(200).json({
      message: "Register successfully!!!",
      data: newCustomer,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
      error,
    });
  }
};

const verifyCode = async (req: any, res: any) => {
  const { id, code } = req.body;

  try {
    const customer: any = await CustomerModel.findById(id);
    if (!customer) {
      throw new Error("User is not found!!");
    }
    const verifyCode = customer._doc.verifyCode;
    if (code !== verifyCode) {
      throw new Error("Code is invalid!!!");
    }

    await CustomerModel.findByIdAndUpdate(id, {
      isVerify: true,
      verifyCode: "",
      isDeleted: false,
    });

    const accessToken = await getToken({
      _id: customer._id,
      email: customer._doc.email,
      role: 0,
    });

    delete customer._doc.password;
    delete customer._doc.verifyCode;

    res.status(200).json({
      message: "Create customer successfully!!!",
      data: {
        ...customer._doc,
        token: accessToken,
      },
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const resendCode = async (req: any, res: any) => {
  const { id, email } = req.body;

  try {
    const code = generateVerificationCode();

    await sendMail({
      from: "Truong Duy E-Commerce (no-reply)",
      to: email,
      subject: "Verify account in Truong Duy E-Commerce System",
      text: "",
      html: `<h1>Code: <b>${code}</b></h1>`,
    });

    await CustomerModel.findByIdAndUpdate(id, { verifyCode: code });

    res.status(200).json({
      message: "Verify code was sent to your email, please check inbox!!!",
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
    const customer: any = await CustomerModel.findOne({
      email,
    });

    if (!customer) {
      throw new Error("Email or password incorrect!!!");
    }

    const isMatchPassword = await bcrypt.compare(password, customer.password);

    if (!isMatchPassword) {
      throw new Error("Email or password incorrect!!!");
    }

    const item = customer._doc;

    delete item.password;
    const accesstoken = await getToken({ _id: item._id, email, role: 0 });
    item.accesstoken = accesstoken;

    res.status(200).json({
      message: `Hi ${item.lastName}, welcome to my store!!!`,
      data: item,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export { create, verifyCode, resendCode, login };
