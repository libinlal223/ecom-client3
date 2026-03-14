// ─── Mock Fallback Data ─────────────────────────────────────────────────────
// Used when Supabase is unavailable (demo mode)

import catProtective from '../assets/catogeries/protective equipments.png';
import catStorage from '../assets/catogeries/industrial storage.jpeg';
import catSpill from '../assets/catogeries/spill control.jpeg';
import catRoadSafety from '../assets/catogeries/road safety and signgage.jpeg';
import catLifting from '../assets/catogeries/lifting eqp.jpeg';
import catMeasurement from '../assets/catogeries/fire estinguishers.jpeg'; // apostrophe in filename fallback
import catFire from '../assets/catogeries/fire estinguishers.jpeg';
import catPowerTools from '../assets/catogeries/power tools.png';
import prd1 from '../assets/prd1.png';
import prd2 from '../assets/prd2.png';
import prd3 from '../assets/prd3.png';
import prd4 from '../assets/prd4.png';

export const MOCK_CATEGORIES = [
    { id: 'protective-equipments', name: 'Protective Equipments', image_url: catProtective },
    { id: 'industrial-storage', name: 'Industrial Storage', image_url: catStorage },
    { id: 'spill-control', name: 'Spill Control Solutions', image_url: catSpill },
    { id: 'road-safety', name: 'Road Safety & Signage', image_url: catRoadSafety },
    { id: 'lifting', name: 'Lifting Equipments', image_url: catLifting },
    { id: 'measurement', name: 'Precision Measurement Tools', image_url: catMeasurement },
    { id: 'fire-extinguishers', name: 'Fire Extinguishers', image_url: catFire },
    { id: 'power-tools', name: 'Power Tools', image_url: catPowerTools },
    { id: 'hand-tools', name: 'Hand Tools', image_url: catPowerTools },
    { id: 'adhesives', name: 'Adhesives & Sealants', image_url: catStorage },
    { id: 'tapes', name: 'Tapes & Surface Protection', image_url: catSpill },
    { id: 'packaging', name: 'Packaging Tools & Accessories', image_url: catStorage },
    { id: 'wd40', name: 'WD-40 Products', image_url: catFire },
    { id: 'surface-protection', name: 'Surface & Dust Protection', image_url: catRoadSafety },
];

export const MOCK_SUBCATEGORIES = [
    { id: 'helmets', name: 'Safety Helmets', category_id: 'protective-equipments' },
    { id: 'gloves', name: 'Safety Gloves', category_id: 'protective-equipments' },
    { id: 'vests', name: 'Hi-Vis Vests', category_id: 'protective-equipments' },
    { id: 'goggles', name: 'Safety Goggles', category_id: 'protective-equipments' },
    { id: 'shelving', name: 'Shelving Systems', category_id: 'industrial-storage' },
    { id: 'lockers', name: 'Storage Lockers', category_id: 'industrial-storage' },
    { id: 'pallets', name: 'Spill Pallets', category_id: 'spill-control' },
    { id: 'absorbents', name: 'Absorbent Materials', category_id: 'spill-control' },
    { id: 'cones', name: 'Traffic Cones', category_id: 'road-safety' },
    { id: 'barriers', name: 'Safety Barriers', category_id: 'road-safety' },
    { id: 'chain-hoists', name: 'Chain Hoists', category_id: 'lifting' },
    { id: 'pallet-trucks', name: 'Pallet Trucks', category_id: 'lifting' },
    { id: 'drills', name: 'Power Drills', category_id: 'power-tools' },
    { id: 'grinders', name: 'Angle Grinders', category_id: 'power-tools' },
    { id: 'hammers', name: 'Hammers', category_id: 'hand-tools' },
    { id: 'spanners', name: 'Spanners & Wrenches', category_id: 'hand-tools' },
];

const IMGS = [prd1, prd2, prd3, prd4];

const makeProduct = (id, name, price, category, sub, imgIndex, description, stock = 50, featured = false) => ({
    id,
    name,
    price,
    category,
    subcategory: sub,
    description,
    stock,
    is_featured: featured,
    images: [IMGS[imgIndex % 4], IMGS[(imgIndex + 1) % 4]],
    features: ['High quality material', 'Industry certified', 'Easy to use', 'Durable build'],
    created_at: new Date().toISOString(),
});

export const MOCK_PRODUCTS = [
    // ── Protective Equipments ──────────────────────────────────────────────────
    makeProduct('m1', 'Construction Safety Helmet', 45.99, 'protective-equipments', 'helmets', 0, 'Professional grade helmet with adjustable ratchet suspension.', 80, true),
    makeProduct('m2', 'Cut-Resistant Safety Gloves', 19.99, 'protective-equipments', 'gloves', 1, 'Level-5 cut protection, ideal for metalwork and glass handling.', 120, true),
    makeProduct('m3', 'Hi-Visibility Safety Vest', 12.99, 'protective-equipments', 'vests', 2, 'ANSI Class 2 reflective vest with 2 chest pockets.', 200, false),
    makeProduct('m4', 'Anti-Scratch Safety Goggles', 15.99, 'protective-equipments', 'goggles', 3, 'Indirect ventilation, anti-fog coating.', 150, false),
    makeProduct('m5', 'Safety Boot Steel Toe Cap', 89.00, 'protective-equipments', 'helmets', 0, 'S3-rated safety boot with slip-resistant sole.', 60, true),
    makeProduct('m6', 'Full-Face Respirator Mask', 34.99, 'protective-equipments', 'goggles', 1, 'Dual cartridge respirator for dust and chemical vapors.', 75, false),

    // ── Industrial Storage ─────────────────────────────────────────────────────
    makeProduct('m7', 'Heavy-Duty Metal Shelving Unit', 199.00, 'industrial-storage', 'shelving', 2, '5-tier boltless shelving, 500kg capacity per shelf.', 30, true),
    makeProduct('m8', 'Warehouse Storage Bin Set (12pk)', 55.00, 'industrial-storage', 'shelving', 3, 'Stackable polypropylene bins in 4 sizes.', 90, false),
    makeProduct('m9', 'Steel Storage Cabinet Locker', 249.00, 'industrial-storage', 'lockers', 0, 'Double-door locker with ventilation slots and hasp.', 20, false),
    makeProduct('m10', 'Mobile Parts Trolley', 179.00, 'industrial-storage', 'shelving', 1, '5-drawer mobile workshop trolley, ball-bearing slides.', 25, true),

    // ── Spill Control ──────────────────────────────────────────────────────────
    makeProduct('m11', 'Spill Containment Pallet IBC', 349.00, 'spill-control', 'pallets', 2, '1100L IBC containment pallet, yellow polyethylene.', 15, true),
    makeProduct('m12', 'Oil-Only Absorbent Socks 8pk', 29.00, 'spill-control', 'absorbents', 3, 'Absorbs oil while repelling water. 3" × 4ft.', 200, false),
    makeProduct('m13', 'Universal Spill Kit 30L', 65.00, 'spill-control', 'absorbents', 0, 'Pads, socks and bags in a portable bag. HAZCHEM rated.', 50, false),

    // ── Road Safety ───────────────────────────────────────────────────────────
    makeProduct('m14', 'Traffic Safety Cone 36"', 12.99, 'road-safety', 'cones', 1, 'PVC traffic cone with reflective collar, heavy base.', 300, false),
    makeProduct('m15', 'Road Speed Bump Kit', 89.00, 'road-safety', 'barriers', 2, 'Rubber modular speed bump with reflectors and bolts.', 40, true),
    makeProduct('m16', 'Retractable Safety Barrier', 45.00, 'road-safety', 'barriers', 3, '3m retractable belt post with weighted base.', 60, false),
    makeProduct('m17', 'Pedestrian Warning Sign Pack', 22.00, 'road-safety', 'cones', 0, 'A-frame "Caution Wet Floor" double-sided sign.', 110, false),

    // ── Lifting Equipments ────────────────────────────────────────────────────
    makeProduct('m18', 'Lifting Chain Block 1-Ton', 109.00, 'lifting', 'chain-hoists', 1, 'Grade-80 alloy chain hoist, 3m lift height, CE marked.', 35, true),
    makeProduct('m19', 'Electric Chain Hoist 500kg', 259.00, 'lifting', 'chain-hoists', 2, '8m lifting height, single-phase 220V motor.', 12, true),
    makeProduct('m20', 'Manual Pallet Truck 2500kg', 299.00, 'lifting', 'pallet-trucks', 3, 'Straddle-leg hydraulic pallet truck, 48" forks.', 20, false),
    makeProduct('m21', 'Lifting Sling 2-Ton Webbing', 39.00, 'lifting', 'chain-hoists', 0, 'EN1492 rated, 2m yellow polyester webbing sling.', 80, false),

    // ── Measurement Tools ─────────────────────────────────────────────────────
    makeProduct('m22', 'Laser Distance Measure 50m', 79.99, 'measurement', null, 1, 'Accurate ±1.5mm, backlit display, area & volume modes.', 65, true),
    makeProduct('m23', 'Digital Vernier Caliper 150mm', 34.00, 'measurement', null, 2, '0.01mm resolution, IP54 waterproof, stainless steel.', 90, false),
    makeProduct('m24', 'Digital Torque Wrench 1/2"', 129.00, 'measurement', null, 3, '20–200Nm range, ±3% accuracy, audio-visual alert.', 30, false),
    makeProduct('m25', 'Infrared Thermometer -50~550°C', 39.99, 'measurement', null, 0, 'Non-contact, 12:1 D:S ratio, laser pointer.', 75, false),

    // ── Fire Extinguishers ────────────────────────────────────────────────────
    makeProduct('m26', 'ABC Dry Powder Extinguisher 6kg', 64.99, 'fire-extinguishers', null, 1, 'Rated 34A:233B:C. Suitable for most fire types.', 55, true),
    makeProduct('m27', 'CO2 Fire Extinguisher 2kg', 79.00, 'fire-extinguishers', null, 2, 'For electrical and liquid fires. Zero residue.', 45, false),
    makeProduct('m28', 'Foam AFFF Extinguisher 9L', 69.00, 'fire-extinguishers', null, 3, 'Class A & B fires. Aqueous film-forming foam.', 35, false),

    // ── Power Tools ───────────────────────────────────────────────────────────
    makeProduct('m29', 'Cordless Power Drill 18V 2-Battery', 129.00, 'power-tools', 'drills', 0, 'Brushless motor, 2×2Ah batteries, belt clip.', 40, true),
    makeProduct('m30', 'Angle Grinder 4.5" 900W', 89.00, 'power-tools', 'grinders', 1, 'Anti-vibration handle, tool-free guard adjustment.', 55, true),
    makeProduct('m31', 'Jigsaw 650W Variable Speed', 95.00, 'power-tools', 'drills', 2, 'Orbital action, laser guide, dust blower.', 30, false),
    makeProduct('m32', 'Rotary Hammer Drill SDS+ 800W', 149.00, 'power-tools', 'drills', 3, '3-mode (drill/hammer/chisel), 4J impact energy.', 25, false),
    makeProduct('m33', 'Corded Circular Saw 7¼" 1200W', 115.00, 'power-tools', 'grinders', 0, '5500 RPM, 45° bevel, rip fence included.', 22, false),

    // ── Hand Tools ────────────────────────────────────────────────────────────
    makeProduct('m34', 'Combination Spanner Set 12pc', 49.99, 'hand-tools', 'spanners', 1, 'Chrome vanadium, sizes 8–19mm, mirror finish.', 70, true),
    makeProduct('m35', 'Claw Hammer 16oz Fiberglass', 18.99, 'hand-tools', 'hammers', 2, 'Shock-absorbing grip, magnetic nail starter.', 110, false),
    makeProduct('m36', 'Screwdriver Set 32pc', 29.99, 'hand-tools', 'hammers', 3, 'Phillips, flathead, Torx, hex. Magnetic tips.', 90, false),
    makeProduct('m37', 'Adjustable Wrench 12"', 14.99, 'hand-tools', 'spanners', 0, 'Chrome-vanadium steel, 32mm jaw capacity.', 130, false),
    makeProduct('m38', 'Needle-Nose Pliers 8"', 12.99, 'hand-tools', 'spanners', 1, 'Spring-loaded, rubberised grip handles.', 140, false),

    // ── Adhesives & Sealants ──────────────────────────────────────────────────
    makeProduct('m39', 'Heavy-Duty Epoxy Adhesive 50ml', 19.99, 'adhesives', null, 2, '5-minute cure, bonds metal, wood, ceramics.', 80, false),
    makeProduct('m40', 'Silicone Sealant Neutral 300ml', 11.99, 'adhesives', null, 3, 'Weatherproof, -40°C to 200°C range, clear.', 120, false),
    makeProduct('m41', 'Threadlocker Blue 50ml', 15.99, 'adhesives', null, 0, 'Medium strength, removable with hand tools.', 65, false),

    // ── Tapes ─────────────────────────────────────────────────────────────────
    makeProduct('m42', 'Duct Tape 48mm × 50m', 8.99, 'tapes', null, 1, 'High-tack, water-resistant, silver.', 200, false),
    makeProduct('m43', 'Caution Floor Marking Tape 50mm', 12.99, 'tapes', null, 2, 'Yellow/black chevron, anti-slip, 33m roll.', 150, false),
    makeProduct('m44', 'Double-Sided Foam Tape 25mm × 10m', 9.99, 'tapes', null, 3, 'High-bond PE foam, indoor/outdoor use.', 110, false),

    // ── WD-40 Products ────────────────────────────────────────────────────────
    makeProduct('m45', 'WD-40 Multi-Use 450ml', 10.99, 'wd40', null, 0, 'Lubricates, cleans, protects, displaces moisture.', 250, true),
    makeProduct('m46', 'WD-40 Specialist Penetrant 400ml', 13.99, 'wd40', null, 1, 'Rapid penetration of rusted bolts and seized parts.', 180, false),
    makeProduct('m47', 'WD-40 Dry PTFE Lubricant 400ml', 14.99, 'wd40', null, 2, 'Non-stick, clean dry film, repels dust.', 130, false),

    // ── Packaging ─────────────────────────────────────────────────────────────
    makeProduct('m48', 'Stretch Wrap Film 500mm × 400m', 22.00, 'packaging', null, 3, 'Machine-grade, 23-micron, 6 rolls per box.', 60, false),
    makeProduct('m49', 'Box Sealing Tape 48mm × 100m', 6.99, 'packaging', null, 0, 'Crystal clear, strong adhesive.', 300, false),
    makeProduct('m50', 'Bubble Wrap Roll 1.2m × 100m', 45.00, 'packaging', null, 1, 'Small bubble, perforated every 300mm.', 25, false),
];
