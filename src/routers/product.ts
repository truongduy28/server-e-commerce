import { Router } from "express";
import * as productControllers from "../controllers/product";
import ProductModel from "../models/ProductModel";
import SubProductModel from "../models/SubProductModel";
const router = Router();

router.post("/add-new", productControllers.addProduct);
router.get("/", productControllers.getProducts);
router.get("/detail", productControllers.getProductDetail);
router.put("/update", productControllers.updateProduct);
router.delete("/delete", productControllers.removeProduct);

router.post("/add-sub-product", productControllers.addSubProduct);
router.get('/sub-product-filters', productControllers.getSubProductFilters)
router.get('/sub-product', productControllers.getSubProduct)
router.put('/update-sub-product', productControllers.updateSubProduct)
router.delete('/delete-sub-product', productControllers.removeSubProduct)

export default router;

// example seeder

export async function createExampleProducts(req: any, res: any) {
    try {
        const products = [];
        const subProducts = [];

        // Sample data for variation
        const categories = ['6717611c062bc4f636b348bc', '67176171062bc4f636b348c5', '671765a3549909c05a98f61b', '671b10683ea8d3d790e9cb63', '6719ffac40ba8d4c7ba9b7fd'];
        const suppliers = ['6708afa22a5beff1fbf4878d', '6708c5bf2a5beff1fbf487a1'];
        const sizes = ['Small', 'Medium', 'Large', 'XL', 'XXL'];
        const colors = ['#e71818', '#3d1717', '#af65bf', '#8bf179', '#79f1dd', '#f9ffd0'];

        for (let i = 1; i <= 30; i++) {
            const product = new ProductModel({
                title: `Product ${i}`,
                slug: `product-${i}`,
                description: `This is a description for Product ${i}`,
                categories: [categories[Math.floor(Math.random() * categories.length)]], // Random ObjectId for category
                supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
                content: `Detailed content for Product ${i}`,
                expiryDate: new Date(Date.now() + Math.random() * 10000000000),
                images: [`https://example.com/image${i}.jpg`],
            });

            products.push(product);

            // Create 2-4 sub-products for each product
            const numSubProducts = Math.floor(Math.random() * 3) + 2;
            for (let j = 1; j <= numSubProducts; j++) {
                const subProduct = new SubProductModel({
                    size: sizes[Math.floor(Math.random() * sizes.length)],
                    color: colors[Math.floor(Math.random() * colors.length)],
                    price: Math.floor(Math.random() * 10000) / 100, // Random price between 0 and 100
                    qty: Math.floor(Math.random() * 100),
                    discount: Math.floor(Math.random() * 50),
                    productId: product._id,
                    images: [`https://example.com/subimage${i}-${j}.jpg`],
                });

                subProducts.push(subProduct);
            }
        }

        // Save all products and sub-products
        await ProductModel.insertMany(products);
        await SubProductModel.insertMany(subProducts);

        res.status(201).json({
            message: "Example products and sub-products created successfully",
            productsCreated: products.length,
            subProductsCreated: subProducts.length
        });

    } catch (error) {
        console.error('Error creating example products:', error);
        res.status(500).json({ message: "Error creating example products" });
    }
}
