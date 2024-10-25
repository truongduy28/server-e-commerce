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

export { addProduct };
