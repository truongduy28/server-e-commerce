import CategoryModel from "../models/CategoryModel";

const addCategory = async (req: any, res: any) => {
    const body = req.body;
    const { parentId, title, description, slug } = body;

    try {
        const category = await CategoryModel.find({
            $and: [{ parentId: { $eq: parentId } }, { slug: { $eq: slug } }],
        });

        if (category.length > 0) {
            throw Error('Category is existing!!!!');
        }

        const newCate = new CategoryModel(body);

        await newCate.save();

        res.status(200).json({
            message: 'Products',
            data: newCate,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};


const getCategories = async (req: any, res: any) => {
    const { page, pageSize } = req.query;

    try {
        const skip = (page - 1) * pageSize;

        const categories = await CategoryModel.find({
            $or: [{ isDeleted: false }, { isDeleted: null }],
        })
            .skip(skip)
            .limit(pageSize);

        res.status(200).json({
            message: 'Products',
            data: categories,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};


export { addCategory, getCategories };
