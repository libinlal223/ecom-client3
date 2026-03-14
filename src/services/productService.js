import { db, isSupabaseConfigured } from '../admin/services/mockDb';
import {
    MOCK_CATEGORIES,
    MOCK_SUBCATEGORIES,
    MOCK_PRODUCTS,
} from './mockFallback';

// ─── Online status ────────────────────────────────────────────────────────────
// null = not yet checked, true = online, false = offline/demo
let _supabaseOnline = null;
let _checkPromise = null;

const checkOnline = () => {
    if (!isSupabaseConfigured) return Promise.resolve(false);
    if (_supabaseOnline !== null) return Promise.resolve(_supabaseOnline);
    if (_checkPromise) return _checkPromise;

    _checkPromise = Promise.race([
        db.getCategories().then(res => {
            _supabaseOnline = Array.isArray(res) && res.length >= 0;
            return _supabaseOnline;
        }),
        new Promise(resolve => setTimeout(() => {
            if (_supabaseOnline === null) {
                console.warn('[productService] Supabase timeout — using demo data.');
                _supabaseOnline = false;
            }
            resolve(_supabaseOnline);
        }, 4000))
    ]).catch(() => {
        _supabaseOnline = false;
        return false;
    });

    return _checkPromise;
};

// Kick off the check immediately on module load, pre-warming
checkOnline();

// ─── In-memory cache ─────────────────────────────────────────────────────────
const cache = {
    categories: null,
    subcategories: {},
    products: {},
    productById: {},
    lastFetch: 0,
};

const CACHE_TTL = 5 * 60 * 1000;

const isCached = (key, ts) => cache[key] && ts && (Date.now() - ts) < CACHE_TTL;

// ─── Service ─────────────────────────────────────────────────────────────────
export const productService = {
    getCategories: async () => {
        if (isCached('categories', cache.lastFetch)) return cache.categories;

        // Show mock immediately if already known offline
        if (_supabaseOnline === false) {
            cache.categories = MOCK_CATEGORIES;
            cache.lastFetch = Date.now();
            return MOCK_CATEGORIES;
        }

        // Wait for the online check (already running since module load)
        const online = await checkOnline();
        let data;
        if (online) {
            try { data = await db.getCategories(); }
            catch { data = MOCK_CATEGORIES; }
        } else {
            data = MOCK_CATEGORIES;
        }

        cache.categories = data;
        cache.lastFetch = Date.now();
        return data;
    },

    getAllProducts: async (page = 1, limit = 10, categoryId = null, subcategoryId = null, search = '') => {
        const cacheKey = `${page}-${limit}-${categoryId || ''}-${subcategoryId || ''}-${search}`;
        if (cache.products[cacheKey] && (Date.now() - cache.products[cacheKey].timestamp) < CACHE_TTL) {
            return cache.products[cacheKey].data;
        }

        if (_supabaseOnline === false) {
            const result = buildMockProductResult(page, limit, categoryId, subcategoryId, search);
            cache.products[cacheKey] = { data: result, timestamp: Date.now() };
            return result;
        }

        const online = await checkOnline();
        let result;
        if (online) {
            try {
                const filters = {};
                if (categoryId) filters.category = categoryId;
                if (subcategoryId) filters.subcategory = subcategoryId;
                const res = await db.getProducts(page, limit, search, filters);
                result = {
                    data: res.data,
                    total: res.total,
                    page: res.page,
                    limit: res.limit,
                    hasMore: (res.page * res.limit) < res.total
                };
            } catch {
                result = buildMockProductResult(page, limit, categoryId, subcategoryId, search);
            }
        } else {
            result = buildMockProductResult(page, limit, categoryId, subcategoryId, search);
        }

        cache.products[cacheKey] = { data: result, timestamp: Date.now() };
        return result;
    },

    getProductById: async (id) => {
        if (cache.productById[id] && (Date.now() - cache.productById[id].timestamp) < CACHE_TTL) {
            return cache.productById[id].data;
        }

        if (_supabaseOnline === false) {
            const data = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
            cache.productById[id] = { data, timestamp: Date.now() };
            return data;
        }

        const online = await checkOnline();
        let data;
        if (online) {
            try { data = await db.getProduct(id); }
            catch { data = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0]; }
        } else {
            data = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
        }

        cache.productById[id] = { data, timestamp: Date.now() };
        return data;
    },

    getSubcategories: async (categoryId) => {
        if (cache.subcategories[categoryId] && (Date.now() - cache.subcategories[categoryId].timestamp) < CACHE_TTL) {
            return cache.subcategories[categoryId].data;
        }

        if (_supabaseOnline === false) {
            const data = categoryId
                ? MOCK_SUBCATEGORIES.filter(s => s.category_id === categoryId)
                : MOCK_SUBCATEGORIES;
            cache.subcategories[categoryId] = { data, timestamp: Date.now() };
            return data;
        }

        const online = await checkOnline();
        let data;
        if (online) {
            try { data = await db.getSubcategories(categoryId); }
            catch {
                data = categoryId
                    ? MOCK_SUBCATEGORIES.filter(s => s.category_id === categoryId)
                    : MOCK_SUBCATEGORIES;
            }
        } else {
            data = categoryId
                ? MOCK_SUBCATEGORIES.filter(s => s.category_id === categoryId)
                : MOCK_SUBCATEGORIES;
        }

        cache.subcategories[categoryId] = { data, timestamp: Date.now() };
        return data;
    },

    clearCache: () => {
        cache.categories = null;
        cache.subcategories = {};
        cache.products = {};
        cache.productById = {};
        cache.lastFetch = 0;
        _supabaseOnline = null;
        _checkPromise = null;
        checkOnline(); // pre-warm again
    }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function buildMockProductResult(page, limit, categoryId, subcategoryId, search = '') {
    let filtered = MOCK_PRODUCTS;
    if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s));
    }
    if (categoryId) filtered = filtered.filter(p => p.category === categoryId);
    if (subcategoryId) filtered = filtered.filter(p => p.subcategory === subcategoryId);
    const from = (page - 1) * limit;
    const paged = filtered.slice(from, from + limit);
    return {
        data: paged,
        total: filtered.length,
        page,
        limit,
        hasMore: from + limit < filtered.length
    };
}
