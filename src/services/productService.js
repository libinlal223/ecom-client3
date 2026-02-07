
import { db } from '../admin/services/mockDb';

export const productService = {
    getCategories: async () => {
        return await db.getCategories();
    },

    getAllProducts: async (page = 1, limit = 10, categoryId = null) => {
        const res = await db.getProducts(page, limit, '', { category: categoryId });
        return {
            data: res.data,
            total: res.total,
            page: res.page,
            limit: res.limit,
            hasMore: (res.page * res.limit) < res.total
        };
    },

    getProductById: async (id) => {
        return await db.getProduct(id);
    },

    getSubcategories: async (categoryId) => {
        return await db.getSubcategories(categoryId);
    }
};
