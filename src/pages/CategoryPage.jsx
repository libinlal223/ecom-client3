
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import './CategoryPage.css';

// Subcategory data with AI-generated images
const getSubcategoriesForCategory = (categoryId) => {
    const images = [
        '/images/categories/drill.png',
        '/images/categories/grinder.png',
        '/images/categories/compressor.png'
    ];

    const subcategories = {
        'power-tools': [
            { name: 'Drills & Drivers', image: images[0] },
            { name: 'Power Saws', image: images[1] },
            { name: 'Grinders', image: images[2] },
            { name: 'Sanders', image: images[0] },
            { name: 'Polishers & Buffers', image: images[1] },
            { name: 'Rotary Tools', image: images[2] }
        ],
        'hand-tools': [
            { name: 'Wrenches', image: images[0] },
            { name: 'Hammers', image: images[1] },
            { name: 'Screwdrivers', image: images[2] },
            { name: 'Pliers', image: images[0] },
            { name: 'Cutting Tools', image: images[1] },
            { name: 'Measuring Tools', image: images[2] }
        ],
        'electrical': [
            { name: 'Multimeters', image: images[0] },
            { name: 'Wire Strippers', image: images[1] },
            { name: 'Circuit Testers', image: images[2] },
            { name: 'Soldering Tools', image: images[0] },
            { name: 'Cable Cutters', image: images[1] },
            { name: 'Electrical Tape', image: images[2] }
        ],
        'automotive': [
            { name: 'Socket Sets', image: images[0] },
            { name: 'Torque Wrenches', image: images[1] },
            { name: 'Impact Wrenches', image: images[2] },
            { name: 'Jacks & Stands', image: images[0] },
            { name: 'Diagnostic Tools', image: images[1] },
            { name: 'Oil Change Tools', image: images[2] }
        ],
        'safety-equipment': [
            { name: 'Hard Hats', image: images[0] },
            { name: 'Safety Glasses', image: images[1] },
            { name: 'Work Gloves', image: images[2] },
            { name: 'Ear Protection', image: images[0] },
            { name: 'Respirators', image: images[1] },
            { name: 'Safety Vests', image: images[2] }
        ],
        'measuring-tools': [
            { name: 'Tape Measures', image: images[0] },
            { name: 'Levels', image: images[1] },
            { name: 'Calipers', image: images[2] },
            { name: 'Laser Measures', image: images[0] },
            { name: 'Squares', image: images[1] },
            { name: 'Rulers', image: images[2] }
        ],
        'fasteners': [
            { name: 'Screws', image: images[0] },
            { name: 'Bolts & Nuts', image: images[1] },
            { name: 'Anchors', image: images[2] },
            { name: 'Washers', image: images[0] },
            { name: 'Rivets', image: images[1] },
            { name: 'Nails', image: images[2] }
        ],
        'welding-equipment': [
            { name: 'Welding Machines', image: images[0] },
            { name: 'Welding Helmets', image: images[1] },
            { name: 'Welding Gloves', image: images[2] },
            { name: 'Electrodes', image: images[0] },
            { name: 'Gas Torches', image: images[1] },
            { name: 'Welding Wire', image: images[2] }
        ],
        'pneumatic-tools': [
            { name: 'Air Compressors', image: images[0] },
            { name: 'Nail Guns', image: images[1] },
            { name: 'Impact Wrenches', image: images[2] },
            { name: 'Air Ratchets', image: images[0] },
            { name: 'Spray Guns', image: images[1] },
            { name: 'Air Hoses', image: images[2] }
        ],
        'storage-solutions': [
            { name: 'Tool Boxes', image: images[0] },
            { name: 'Tool Chests', image: images[1] },
            { name: 'Tool Bags', image: images[2] },
            { name: 'Organizers', image: images[0] },
            { name: 'Cabinets', image: images[1] },
            { name: 'Workbenches', image: images[2] }
        ],
        'ladders-scaffolding': [
            { name: 'Extension Ladders', image: images[0] },
            { name: 'Step Ladders', image: images[1] },
            { name: 'Platform Ladders', image: images[2] },
            { name: 'Scaffolding', image: images[0] },
            { name: 'Work Platforms', image: images[1] },
            { name: 'Ladder Accessories', image: images[2] }
        ],
        'outdoor-power': [
            { name: 'Lawn Mowers', image: images[0] },
            { name: 'String Trimmers', image: images[1] },
            { name: 'Leaf Blowers', image: images[2] },
            { name: 'Chainsaws', image: images[0] },
            { name: 'Hedge Trimmers', image: images[1] },
            { name: 'Pressure Washers', image: images[2] }
        ]
    };

    return subcategories[categoryId] || [];
};


const CategoryPage = () => {
    const { categoryId, subcategoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // Store all products
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    useEffect(() => {
        const init = async () => {
            // Scroll to top when navigating to category page
            window.scrollTo(0, 0);

            setLoading(true);
            const cats = await productService.getCategories();
            const cat = cats.find(c => c.id === categoryId);
            setCategory(cat);

            const res = await productService.getAllProducts(1, 20, categoryId);
            setAllProducts(res.data);

            // Filter by subcategory if subcategoryId exists
            if (subcategoryId) {
                const subcategoryName = subcategoryId.replace(/-/g, ' ');
                const filtered = res.data.filter(product =>
                    product.name.toLowerCase().includes(subcategoryName.toLowerCase().split(' ')[0]) ||
                    product.subcategory?.toLowerCase().includes(subcategoryName.toLowerCase())
                );
                setProducts(filtered.length > 0 ? filtered : res.data);
            } else {
                setProducts(res.data);
            }

            setHasMore(res.hasMore);
            setPage(1);
            setSelectedSubcategory(null);
            setLoading(false);
        };
        init();
    }, [categoryId, subcategoryId]);

    const handleSubcategoryClick = (subcategoryName) => {
        // Scroll to products section
        const productsSection = document.querySelector('.category-products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Toggle filter
        if (selectedSubcategory === subcategoryName) {
            // Deselect - show all products
            setSelectedSubcategory(null);
            setProducts(allProducts);
        } else {
            // Select subcategory - filter products
            setSelectedSubcategory(subcategoryName);
            // Filter products by subcategory name (simple matching)
            const filtered = allProducts.filter(product =>
                product.name.toLowerCase().includes(subcategoryName.toLowerCase().split(' ')[0]) ||
                product.subcategory?.toLowerCase().includes(subcategoryName.toLowerCase())
            );
            setProducts(filtered.length > 0 ? filtered : allProducts);
        }
    };

    useEffect(() => {
        const init = async () => {
            // Scroll to top when navigating to category page
            window.scrollTo(0, 0);

            setLoading(true);
            const cats = await productService.getCategories();
            const cat = cats.find(c => c.id === categoryId);
            setCategory(cat);

            const res = await productService.getAllProducts(1, 20, categoryId);
            setProducts(res.data);
            setHasMore(res.hasMore);
            setPage(1);
            setLoading(false);
        };
        init();
    }, [categoryId]);

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);
        const nextPage = page + 1;
        const res = await productService.getAllProducts(nextPage, 20, categoryId);
        setProducts(prev => [...prev, ...res.data]);
        setPage(nextPage);
        setHasMore(res.hasMore);
        setLoading(false);
    };

    if (!category && !loading) {
        return <div className="loading-page">Category not found</div>;
    }

    if (loading && page === 1) {
        return <div className="loading-page">Loading...</div>;
    }

    return (
        <div className="category-page">
            {/* Category Header */}
            <section className="category-hero">
                <div className="container">
                    {subcategoryId ? (
                        <>
                            <Link to={`/category/${categoryId}`} className="back-link">← Back to {category?.name}</Link>
                            <h1>{subcategoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
                            <p>Browse our selection of {subcategoryId.replace(/-/g, ' ')}</p>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="back-link">← Back to Home</Link>
                            <h1>{category?.name}</h1>
                            <p>Explore our complete range of {category?.name?.toLowerCase()}</p>
                        </>
                    )}
                </div>
            </section>

            {/* Subcategories Section - Only show on main category page */}
            {!subcategoryId && (
                <section className="subcategories-section">
                    <div className="container">
                        <div className="subcategories-grid">
                            {getSubcategoriesForCategory(categoryId).map((subcat, index) => {
                                // Create URL-friendly subcategory slug
                                const subcategorySlug = subcat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                                return (
                                    <Link
                                        key={index}
                                        to={`/category/${categoryId}/${subcategorySlug}`}
                                        className="subcategory-card"
                                    >
                                        <div className="subcat-image-wrapper">
                                            <img src={subcat.image} alt={subcat.name} loading="lazy" />
                                        </div>
                                        <h3>{subcat.name}</h3>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Products Grid */}
            <section className="category-products">
                <div className="container">
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {loading && <div className="loader">Loading more products...</div>}

                    {!loading && hasMore && (
                        <div className="load-more-container">
                            <button onClick={loadMore} className="btn btn-primary">
                                Load More Products
                            </button>
                        </div>
                    )}

                    {!loading && !hasMore && products.length > 0 && (
                        <div className="end-message">
                            You've viewed all products in this category
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CategoryPage;
