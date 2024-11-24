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

const deleteCategories = async (req: any, res: any) => {
    const { id, isDeleted } = req.query;
    try {
        // await findAndRemoveCategoryInProducts(id);
        await CategoryModel.findByIdAndUpdate(id, { isDeleted });
        await res.status(200).json({
            message: 'Category deleted!!!',
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const updateCategory = async (req: any, res: any) => {
    const { id } = req.query;
    try {
        await CategoryModel.findByIdAndUpdate(id, { ...req.body });
        await res.status(200).json({
            message: 'Category updated!!!',
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};

const getCategoryFilters = async (req: any, res: any) => {
    try {
        const categories = await CategoryModel.find({
            $or: [{ isDeleted: false }, { isDeleted: null }],
        }).select('_id title parentId');

        res.status(200).json({
            message: 'Get category filters is successfully',
            data: categories,
        });
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
        });
    }
};


export { addCategory, getCategories, deleteCategories, updateCategory, getCategoryFilters };

// 22/10/2024 
// TODO: not yet have Product-Model in server so can't remove category in products

// const findAndRemoveCategoryInProducts = async (id: string) => {
//     // const item = await CategoryModel.findById(id);
//     const items = await CategoryModel.find({ parentId: id });

//     if (items.length > 0) {
//         items.forEach(
//             async (item: any) => await findAndRemoveCategoryInProducts(item._id)
//         );
//     }

//     await handleRemoveCategoryInProducts(id);
   
// };


// const handleRemoveCategoryInProducts = async (id: string) => {
//     await CategoryModel.findByIdAndDelete(id);
//     const products = await ProductModel.find({ categories: { $all: id } });

//     if (products && products.length > 0) {
//         products.forEach(async (item: any) => {
//             const cats = item._doc.categories;

//             const index = cats.findIndex((element: string) => element === id);

//             if (index !== -1) {
//                 cats.splice(index, 1);
//             }

//             await ProductModel.findByIdAndUpdate(item._id, {
//                 categories: cats,
//             });
//         });
//     }
// };
