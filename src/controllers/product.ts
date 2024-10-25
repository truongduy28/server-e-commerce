import ProductModel from "../models/ProductModel";

const addProduct = async (req: any, res: any) => {
    const body = req.body;

    try {
        const newProduct = new ProductModel(body);

        await newProduct.save();

        res.status(200).json({
            message: 'Added new product successfully!!!',
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

        const products = await ProductModel.find(filter).skip(skip).limit(pageSize).populate('categories', 'title');

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


export { addProduct, getProducts };
