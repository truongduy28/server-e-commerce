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

  const filter: any = { isDeleted: false };

  try {
    const skip = (page - 1) * pageSize;
    const products = await ProductModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .populate("categories", "title")
      .lean();

    const items = await Promise.all(
      products.map(async (product) => {
        const subProducts = await SubProductModel.find({
          productId: product._id,
          isDeleted: false,
        }).lean();

        return { ...product, subProducts };
      })
    );

    const total = await ProductModel.find({
      isDeleted: false,
    }).countDocuments();

    res.status(200).json({
      message: "Products",
      data: {
        total,
        items,
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


const getSubProductFilters = async (req: any, res: any) => {
  try {
    // Get distinct sizes, colors, and price range for subproducts
    const [sizes, colors, priceRange] = await Promise.all([
      SubProductModel.distinct('size', { isDeleted: false }),
      SubProductModel.distinct('color', { isDeleted: false }),
      SubProductModel.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ])
    ]);

    // Prepare the response data
    const filters = {
      sizes,
      colors,
      prices: {
        start: priceRange[0]?.minPrice || 0,
        end: priceRange[0]?.maxPrice || 0
      }
    };

    return res.json({ message: "success", data: filters });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return res.status(500).json({ message: "Error fetching filters" });
  }
};


export {
  addProduct,
  addSubProduct,
  getProductDetail,
  getProducts,
  removeProduct,
  updateProduct, getSubProductFilters
};
