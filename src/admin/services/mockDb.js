
// Mock Database Service simulating Supabase/PostgreSQL structure
// This structure is designed to be easily replaced with real Supabase calls later.

// Initial Data Seeding
const INITIAL_CATEGORIES = [
    { id: 'power-tools', name: 'Power Tools', created_at: new Date().toISOString() },
    { id: 'hand-tools', name: 'Hand Tools', created_at: new Date().toISOString() },
    { id: 'electrical', name: 'Electrical', created_at: new Date().toISOString() },
    { id: 'automotive', name: 'Automotive', created_at: new Date().toISOString() },
    { id: 'safety-equipment', name: 'Safety Equipment', created_at: new Date().toISOString() },
    { id: 'measuring-tools', name: 'Measuring Tools', created_at: new Date().toISOString() },
    { id: 'fasteners', name: 'Fasteners', created_at: new Date().toISOString() },
    { id: 'welding-equipment', name: 'Welding Equipment', created_at: new Date().toISOString() },
    { id: 'pneumatic-tools', name: 'Pneumatic Tools', created_at: new Date().toISOString() },
    { id: 'storage-solutions', name: 'Storage Solutions', created_at: new Date().toISOString() },
    { id: 'ladders-scaffolding', name: 'Ladders & Scaffolding', created_at: new Date().toISOString() },
    { id: 'outdoor-power', name: 'Outdoor Power Equipment', created_at: new Date().toISOString() }
];

const INITIAL_SUBCATEGORIES = [
    { id: 'drills', category_id: 'power-tools', name: 'Drills & Drivers' },
    { id: 'saws', category_id: 'power-tools', name: 'Saws' },
    { id: 'hammers', category_id: 'hand-tools', name: 'Hammers' },
    { id: 'wrenches', category_id: 'hand-tools', name: 'Wrenches' },
    { id: 'meters', category_id: 'electrical', name: 'Multimeters' },
    { id: 'sockets', category_id: 'automotive', name: 'Socket Sets' }
];

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MockDatabase {
    constructor() {
        // Load from localStorage or initialize
        this.categories = JSON.parse(localStorage.getItem('db_categories')) || INITIAL_CATEGORIES;
        this.subcategories = JSON.parse(localStorage.getItem('db_subcategories')) || INITIAL_SUBCATEGORIES;
        this.products = JSON.parse(localStorage.getItem('db_products')) || [];

        // If products are empty, migrate from the flat file (one-time logic)
        if (this.products.length === 0) {
            import('../../data/products').then(module => {
                this.products = module.products.map(p => ({
                    ...p,
                    subcategory_id: null, // Default to null for legacy data
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }));
                this._save();
            });
        }
    }

    _save() {
        localStorage.setItem('db_categories', JSON.stringify(this.categories));
        localStorage.setItem('db_subcategories', JSON.stringify(this.subcategories));
        localStorage.setItem('db_products', JSON.stringify(this.products));
    }

    // --- Categories ---
    async getCategories() {
        await delay(300);
        return [...this.categories];
    }

    async createCategory(data) {
        await delay(300);
        const newCat = {
            id: data.name.toLowerCase().replace(/\s+/g, '-'),
            ...data,
            created_at: new Date().toISOString()
        };
        this.categories.push(newCat);
        this._save();
        return newCat;
    }

    async deleteCategory(id) {
        await delay(300);
        this.categories = this.categories.filter(c => c.id !== id);
        this._save();
        return true;
    }

    // --- Subcategories ---
    async getSubcategories(categoryId = null) {
        await delay(300);
        if (categoryId) {
            return this.subcategories.filter(s => s.category_id === categoryId);
        }
        return [...this.subcategories];
    }

    // --- Products ---
    async getProducts(page = 1, limit = 20, search = '', filters = {}) {
        await delay(500);
        let filtered = [...this.products];

        if (search) {
            const lower = search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lower) ||
                p.id.toLowerCase().includes(lower)
            );
        }

        if (filters.category) {
            filtered = filtered.filter(p => p.category === filters.category);
        }

        const total = filtered.length;
        const start = (page - 1) * limit;
        const data = filtered.slice(start, start + limit);

        return { data, total, page, limit };
    }

    async getProduct(id) {
        await delay(300);
        return this.products.find(p => p.id === id);
    }

    async createProduct(data) {
        await delay(500);
        const newProd = {
            ...data,
            id: `PROD-${Date.now()}`, // Simple ID generation
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        this.products.unshift(newProd);
        this._save();
        return newProd;
    }

    async updateProduct(id, data) {
        await delay(500);
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Product not found');

        this.products[index] = { ...this.products[index], ...data, updated_at: new Date().toISOString() };
        this._save();
        return this.products[index];
    }

    async deleteProduct(id) {
        await delay(500);
        this.products = this.products.filter(p => p.id !== id);
        this._save();
        return true;
    }

    // --- Images (Simulated Storage) ---
    async uploadImage(file) {
        await delay(1000);
        // In a real app, this would upload to Supabase Storage and return a URL
        // Here we mock it by returning a fake URL or object URL if needed locally
        return URL.createObjectURL(file);
    }
}

export const db = new MockDatabase();
