import { Request } from "express";
import { GetMinAndMaxPrice, ProductFilterParams } from "../interfaces/product";
import ProductModel from "../models/ProductModel";
import SubProductModel from "../models/SubProductModel";
import { toArray, toJson } from "../utils/type";

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


const getProducts = async (req: Request<any, any, any, ProductFilterParams, any>, res: any) => {
  const { page = 1, pageSize = 10, categories, colors, sizes, price, title } = req.query;
  const rangePriceDB = await getMinAndMaxPrice();

  // Parsing filters from query
  const parsedCategories = categories ? toArray(categories) : [];
  const parsedColors = colors ? toArray(colors) : [];
  const parsedSizes = sizes ? toArray(sizes) : [];
  const parsedPrice = price ? toJson(price) : null;
  const parsedTitle = title || "";

  const subProductFilter: any = {};
  const productFilter: any = { isDeleted: false };

  // Set filters for colors, sizes, and price range
  if (parsedColors.length) subProductFilter.color = { $in: parsedColors };
  if (parsedSizes.length) subProductFilter.size = { $in: parsedSizes };
  if (parsedPrice && parsedPrice.start && parsedPrice.end) {
    subProductFilter.price = { $gte: parsedPrice.start, $lte: parsedPrice.end };
  }

  // Retrieve product IDs that match sub-product filters if needed
  let productIds: string[] = [];
  if (parsedColors.length || parsedSizes.length || parsedPrice) {
    const matchingSubProducts = await SubProductModel.find(subProductFilter).distinct('productId');
    if (matchingSubProducts.length) {
      productIds = [...new Set(matchingSubProducts)];
    } else {
      return res.status(200).json({
        message: "Products",
        data: {
          total: 0,
          items: [],
          rangePrice: {
            min: rangePriceDB.minPrice,
            max: rangePriceDB.maxPrice,
          },
        },
      });
    }
  }

  // Apply filters to products
  if (productIds.length) productFilter._id = { $in: productIds };
  if (parsedCategories.length) productFilter.categories = { $in: parsedCategories };
  if (parsedTitle) productFilter.slug = { $regex: parsedTitle };

  try {
    const skip = (page - 1) * pageSize;

    // Fetch filtered products with pagination
    const products = await ProductModel.find(productFilter)
      .skip(skip)
      .limit(pageSize)
      .populate("categories", "title")
      .lean();

    // Fetch and attach subproducts for each product in a single query
    const productIdsForSubProducts = products.map(product => product._id);
    const subProducts = await SubProductModel.find({ productId: { $in: productIdsForSubProducts }, isDeleted: false }).lean();

    // Map subProducts to their respective products
    const productsWithSubProducts = products.map(product => ({
      ...product,
      subProducts: subProducts.filter(sub => sub.productId.toString() === product._id.toString()),
    }));

    // Get the total count for pagination
    const total = await ProductModel.countDocuments(productFilter);

    res.status(200).json({
      message: "Get products with sub-products from DB",
      data: {
        total,
        items: productsWithSubProducts,
        rangePrice: {
          min: rangePriceDB.minPrice,
          max: rangePriceDB.maxPrice,
        },
      },
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
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

const getSubProduct = async (req: any, res: any) => {
  const { id } = req.query;
  try {
    const item = await SubProductModel.findById(id)
    if (!item) throw new Error("Not found sub product with id: " + id);
    res.status(200).json({
      message: "Get successfully sub product",
      item,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const updateSubProduct = async (req: any, res: any) => {
  const { id } = req.query;
  const body = req.body;
  try {
    await SubProductModel.findByIdAndUpdate(id, body);

    res.status(200).json({
      message: 'Sub product updated successfully!!!',
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

const getMinAndMaxPrice = async (): Promise<GetMinAndMaxPrice> => {

  const priceRange = await SubProductModel.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);

  return {
    minPrice: priceRange[0]?.minPrice || 0,
    maxPrice: priceRange[0]?.maxPrice || 0
  } as unknown as GetMinAndMaxPrice
}


export {
  addProduct,
  addSubProduct,
  getProductDetail,
  getProducts, getSubProduct, getSubProductFilters, removeProduct,
  updateProduct, updateSubProduct
};

