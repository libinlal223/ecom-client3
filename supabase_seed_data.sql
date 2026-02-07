DO $$
DECLARE
  -- Category IDs
  c_power_tools uuid;
  c_accessories uuid;
  c_hand_tools uuid;
  c_storage uuid;
  c_outdoor uuid;

  -- Subcategory IDs
  s_drills uuid;
  s_grinders uuid;
  s_saws uuid;
  s_impact uuid;
  s_batteries uuid;
  s_drill_acc uuid;
  s_wrenches uuid;
  s_hammers uuid;
  s_pliers uuid;
  s_safety uuid;
  s_storage_box uuid;
  s_mowers uuid;
  s_trimmers uuid;

  -- Product IDs (captured for image linking if needed, but we'll insert images directly via subqueries if we were advanced, 
  -- but for now we'll skip image table population or just insert basic image URLs into a hypothetical 'images' column if I had one.
  -- Wait, I created a product_images table.
  -- To populate images, I need the product ID.
  p_drill_1 uuid;
  p_drill_2 uuid;
  p_grinder_1 uuid;
  p_mower_1 uuid;

BEGIN
  -- 1. Insert Categories
  INSERT INTO categories (name) VALUES ('Power Tools') RETURNING id INTO c_power_tools;
  INSERT INTO categories (name) VALUES ('Accessories') RETURNING id INTO c_accessories;
  INSERT INTO categories (name) VALUES ('Hand Tools') RETURNING id INTO c_hand_tools;
  INSERT INTO categories (name) VALUES ('Storage & Safety') RETURNING id INTO c_storage;
  INSERT INTO categories (name) VALUES ('Outdoor Power Equipment') RETURNING id INTO c_outdoor;

  -- 2. Insert Subcategories
  
  -- Power Tools
  INSERT INTO sub_categories (category_id, name) VALUES (c_power_tools, 'Drills') RETURNING id INTO s_drills;
  INSERT INTO sub_categories (category_id, name) VALUES (c_power_tools, 'Grinders & Polishers') RETURNING id INTO s_grinders;
  INSERT INTO sub_categories (category_id, name) VALUES (c_power_tools, 'Saws') RETURNING id INTO s_saws;
  INSERT INTO sub_categories (category_id, name) VALUES (c_power_tools, 'Impact Drivers') RETURNING id INTO s_impact;
  INSERT INTO sub_categories (category_id, name) VALUES (c_power_tools, 'Sanders');
  INSERT INTO sub_categories (category_id, name) VALUES (c_power_tools, 'Combo Kits');

  -- Accessories
  INSERT INTO sub_categories (category_id, name) VALUES (c_accessories, 'Batteries & Chargers') RETURNING id INTO s_batteries;
  INSERT INTO sub_categories (category_id, name) VALUES (c_accessories, 'Drilling Accessories') RETURNING id INTO s_drill_acc;
  INSERT INTO sub_categories (category_id, name) VALUES (c_accessories, 'Driving Accessories');

  -- Hand Tools
  INSERT INTO sub_categories (category_id, name) VALUES (c_hand_tools, 'Wrenches') RETURNING id INTO s_wrenches;
  INSERT INTO sub_categories (category_id, name) VALUES (c_hand_tools, 'Hammers') RETURNING id INTO s_hammers;
  INSERT INTO sub_categories (category_id, name) VALUES (c_hand_tools, 'Pliers') RETURNING id INTO s_pliers;
  INSERT INTO sub_categories (category_id, name) VALUES (c_hand_tools, 'Measuring Tools');

  -- Storage & Safety
  INSERT INTO sub_categories (category_id, name) VALUES (c_storage, 'Safety Gear') RETURNING id INTO s_safety;
  INSERT INTO sub_categories (category_id, name) VALUES (c_storage, 'Tool Boxes') RETURNING id INTO s_storage_box;
  INSERT INTO sub_categories (category_id, name) VALUES (c_storage, 'Soft Storage');

  -- Outdoor
  INSERT INTO sub_categories (category_id, name) VALUES (c_outdoor, 'Lawn Mowers') RETURNING id INTO s_mowers;
  INSERT INTO sub_categories (category_id, name) VALUES (c_outdoor, 'String Trimmers') RETURNING id INTO s_trimmers;
  INSERT INTO sub_categories (category_id, name) VALUES (c_outdoor, 'Blowers');
  INSERT INTO sub_categories (category_id, name) VALUES (c_outdoor, 'Chainsaws');

  -- 3. Insert Products and Images
  
  -- Drill 1
  INSERT INTO products (name, description, price, features, sub_category_id, is_featured, stock) 
  VALUES ('20V MAX* XR Brushless Hammer Drill', 'Built for heavy-duty applications. The brushless motor delivers up to 57% more run time over brushed.', 199.00, '["Brushless Motor", "3-Speed Transmission", "LED Light"]', s_drills, true, 45)
  RETURNING id INTO p_drill_1;
  
  INSERT INTO product_images (product_id, image_url) VALUES (p_drill_1, 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=1000');
  INSERT INTO product_images (product_id, image_url) VALUES (p_drill_1, 'https://images.unsplash.com/photo-1622079782500-1c05d7b00344?auto=format&fit=crop&q=80&w=1000');

  -- Drill 2
  INSERT INTO products (name, description, price, features, sub_category_id, is_featured, stock) 
  VALUES ('Compact 12V Drill Driver', 'Compact and lightweight, designed for tight spaces.', 99.00, '["Lightweight", "15 Clutch Settings"]', s_drills, false, 30)
  RETURNING id INTO p_drill_2;
  
  INSERT INTO product_images (product_id, image_url) VALUES (p_drill_2, 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=1000');

  -- Grinder
  INSERT INTO products (name, description, price, features, sub_category_id, is_featured, stock) 
  VALUES ('Small Angle Grinder', '11 Amp AC/DC 11,000 RPM motor which provides the best power to weight/size ratio available.', 89.00, '["11 Amp Motor", "Dust Ejection System"]', s_grinders, false, 25)
  RETURNING id INTO p_grinder_1;

  INSERT INTO product_images (product_id, image_url) VALUES (p_grinder_1, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000');

  -- Saw
  INSERT INTO products (name, description, price, features, sub_category_id, is_featured, stock) 
  VALUES ('Circular Saw 7-1/4 in.', 'Lightweight magnesium shoe and robust metal cutting sight.', 159.00, '["Electric Brake", "Bevel Capacity"]', s_saws, false, 15);
  -- (Skipping image insert for brevity on bulk items, frontend should handle missing images gracefully or use placeholder)

  -- Wrench
  INSERT INTO products (name, description, price, features, sub_category_id, is_featured, stock) 
  VALUES ('Combination Wrench Set', 'Metric combination wrench set.', 49.00, '["Chrome Vanadium", "Anti-Slip"]', s_wrenches, false, 100);

  -- Battery
  INSERT INTO products (name, description, price, features, sub_category_id, is_featured, stock) 
  VALUES ('20V MAX* Lithium Ion Battery', 'Premium XR Li-Ion pack provides up to 33% more capacity.', 89.00, '["Fuel Gauge", "3-Year Warranty"]', s_batteries, false, 200);

  -- Mower
  INSERT INTO products (name, description, price, features, sub_category_id, is_featured, stock) 
  VALUES ('21 in. Self-Propelled Mower', 'Brushless motor provides gas-like performance.', 399.00, '["Self-Propelled", "Mulching"]', s_mowers, true, 8)
  RETURNING id INTO p_mower_1;

  INSERT INTO product_images (product_id, image_url) VALUES (p_mower_1, 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=1000');

  -- Safety
  INSERT INTO products (name, description, price, features, sub_category_id, is_featured, stock) 
  VALUES ('Construction Safety Helmet', 'Impact protection and comfort.', 25.00, '["Adjustable Fit", "Vented"]', s_safety, false, 50);

  -- More Drills for volume
  INSERT INTO products (name, description, price, features, sub_category_id, is_featured, stock) 
  VALUES ('Heavy Duty Impact Driver', '1/4 in. hex chuck.', 139.00, '["3 LED Lights", "Belt Hook"]', s_impact, true, 40);

  INSERT INTO products (name, description, price, features, sub_category_id, is_featured, stock) 
  VALUES ('Cordless Oscillating Tool', 'Universal accessory adapter.', 129.00, '["Variable Speed", "Quick Change"]', s_drills, false, 12);

END $$;
