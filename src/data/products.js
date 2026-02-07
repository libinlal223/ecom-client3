
const CATEGORIES = [
    { id: 'power-tools', name: 'Power Tools', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=1000' },
    { id: 'hand-tools', name: 'Hand Tools', image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=1000' },
    { id: 'measuring-tools', name: 'Measuring Tools', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=1000' },
    { id: 'electrical-tools', name: 'Electrical Tools', image: 'https://images.unsplash.com/photo-1621905430543-95553646c2d0?auto=format&fit=crop&q=80&w=1000' },
    { id: 'plumbing-tools', name: 'Plumbing Tools', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=1000' },
    { id: 'automotive-tools', name: 'Automotive Tools', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1000' },
    { id: 'hardware-fasteners', name: 'Hardware & Fasteners', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=1000' },
    { id: 'storage-organization', name: 'Storage & Organization', image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=1000' },
    { id: 'garden-outdoor', name: 'Garden & Outdoor', image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=1000' },
    { id: 'safety-equipment', name: 'Safety Equipment', image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&q=80&w=1000' },
    { id: 'industrial-tools', name: 'Industrial Tools', image: 'https://images.unsplash.com/photo-1531297461136-82lw8e8e0e3e?auto=format&fit=crop&q=80&w=1000' },
];

const ADJECTIVES = ['Heavy Duty', 'Professional', 'Industrial', 'Precision', 'Compact', 'Cordless', 'Electric', 'Hydraulic', 'Multi-Purpose', 'Advanced'];
const BRANDS = ['Titan', 'Forge', 'Apex', 'Obsidian', 'Vanguard', 'Stealth', 'IronClad', 'Volt', 'Secure', 'Maxwell'];

// Helper to vary names
function getBaseName(catId, index) {
    const names = {
        'power-tools': ['Drill Driver', 'Impact Wrench', 'Circular Saw', 'Angle Grinder', 'Jigsaw', 'Rotary Hammer', 'Heat Gun', 'Power Sander', 'Reciprocating Saw', 'Router'],
        'hand-tools': ['Hammer', 'Screwdriver Set', 'Wrench', 'Pliers', 'Tape Measure', 'Utility Knife', 'Chisel', 'Hand Saw', 'Level', 'Crowbar'],
        'measuring-tools': ['Digital Caliper', 'Laser Level', 'Measuring Tape', 'Steel Ruler', 'Angle Finder', 'Micrometer', 'Square', 'Marking Gauge', 'Spirit Level', 'Depth Gauge'],
        'electrical-tools': ['Multimeter', 'Wire Stripper', 'Voltage Tester', 'Crimping Tool', 'Soldering Iron', 'Cable Cutter', 'Conduit Bender', 'Circuit Finder', 'Insulated Screwdriver', 'Phase Tester'],
        'plumbing-tools': ['Pipe Wrench', 'Basin Wrench', 'Pipe Cutter', 'Threader', 'Flaring Tool', 'Internal Wrench', 'Hacksaw', 'Pliers Set', 'Tube Bender', 'Drains Auger'],
        'automotive-tools': ['Socket Set', 'Torque Wrench', 'Oil Filter Wrench', 'Jack Stand', 'Creepers', 'Brake Bleeder', 'Spark Plug Socket', 'Battery Tester', 'Timing Light', 'OBD2 Scanner'],
        'hardware-fasteners': ['Wood Screws', 'Machine Bolts', 'Wall Anchors', 'Self-Tapping Screws', 'Nails Bulk', 'Rivets', 'Washers Set', 'Hex Nuts', 'Structural Screws', 'Concrete Bolts'],
        'storage-organization': ['Tool Chest', 'Modular Box', 'Wall Rack', 'Parts Bin', 'Tool Belt', 'Workbench', 'Pegboard Set', 'Rolling Cabinet', 'Magnetic Strip', 'Storage Tote'],
        'garden-outdoor': ['Pruning Shears', 'Garden Rake', 'Shovel', 'Lawn Mower', 'Hedge Trimmer', 'Wheelbarrow', 'Trowel', 'Loppers', 'Fork', 'Spade'],
        'safety-equipment': ['Safety Helmet', 'Protective Gloves', 'Safety Goggles', 'Ear Defenders', 'Respirator Mask', 'Safety Boots', 'High-Vis Vest', 'Knee Pads', 'Face Shield', 'Fall Arrest Harness'],
        'industrial-tools': ['Hydraulic Press', 'Bench Grinder', 'Shop Vac', 'Air Compressor', 'Welding Machine', 'Pallet Jack', 'Chain Hoist', 'Generator', 'Pressure Washer', 'Sheet Metal Brake']
    };
    const list = names[catId] || ['Tool'];
    return list[index % list.length];
}

const generateProducts = () => {
    const products = [];
    let idCounter = 1;

    for (const category of CATEGORIES) {
        // Generate 200 products per category to reach 1000 total
        for (let i = 0; i < 20; i++) { // Let's reduce for now to save space/memory if needed, or keep 200 as original
            const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
            const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
            const baseName = getBaseName(category.id, i);

            products.push({
                id: `PROD-${category.id}-${idCounter}`,
                name: `${brand} ${adj} ${baseName}`,
                category: category.id,
                price: (Math.random() * 500 + 20).toFixed(2),
                description: `A high-quality ${baseName.toLowerCase()} designed for professional use. Features durable construction and superior performance. Ideal for ${category.name.toLowerCase()} applications.`,
                features: [
                    'High durability material',
                    'Ergonomic grip design',
                    'Weather resistant coating',
                    'Industry standard compliance',
                    '1-year warranty inclusion'
                ],
                images: [
                    category.image, // Main image (placeholder)
                    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
                    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=1000'
                ],
                stock: Math.floor(Math.random() * 100),
                rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
                reviews: Math.floor(Math.random() * 500)
            });
            idCounter++;
        }
    }
    return products;
};

export const products = generateProducts();
export const categories = CATEGORIES;
