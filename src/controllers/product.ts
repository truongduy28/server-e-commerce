import ProductModel from "../models/ProductModel";
import SubProductModel from "../models/SubProductModel";

// MAIN PRODUCT CONTROLLERS
const addProduct = async (req: any, res: any) => {
  const body = req.body;

  try {
    const newProduct = new ProductModel(body);

    await newProduct.save();

    res.status(200).json({
      message: "Added new product successfully!!!",
      data: newProduct,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const getProducts = async (req: any, res: any) => {
  const { page, pageSize } = req.query;

  const filter: any = {};

  filter.isDeleted = false;

  try {
    const skip = (page - 1) * pageSize;

    const products = await ProductModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .populate("categories", "title");

    const total = products.length;

    const items: any = [];

    res.status(200).json({
      message: "Products",
      data: {
        total,
        items: products,
      },
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const getProductDetail = async (req: any, res: any) => {
  const { id } = req.query;
  try {
    const item = await ProductModel.findById(id).populate(
      "categories",
      "title"
    );
    const subProducts = await SubProductModel.find({
      productId: id,
      isDeleted: false,
    });

    res.status(200).json({
      message: "Products",
      data: {
        product: item,
        subProducts,
      },
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req: any, res: any) => {
  const { id } = req.query;
  const body = req.body;

  try {
    await ProductModel.findByIdAndUpdate(id, body);

    res.status(200).json({
      message: "Product updated!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const handleRemoveSubProduct = async (items: any[]) => {
  items.forEach(async (item) => {
    await SubProductModel.findByIdAndUpdate(item._id, {
      isDeleted: true,
    });
  });
};

const removeProduct = async (req: any, res: any) => {
  const { id } = req.query;

  try {
    const subItems = await SubProductModel.find({ productId: id });

    if (subItems.length > 0) {
      await handleRemoveSubProduct(subItems);
    }

    await ProductModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });

    res.status(200).json({
      message: "Product removed!!",
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// SUB PRODUCT CONTROLLERS

const addSubProduct = async (req: any, res: any) => {
  const body = req.body;

  try {
    const subProduct = new SubProductModel(body);

    await subProduct.save();

    res.status(200).json({
      message: "Add sub product successfully!!!",
      data: subProduct,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export {
  addProduct,
  addSubProduct,
  getProductDetail,
  getProducts,
  removeProduct,
  updateProduct,
};
