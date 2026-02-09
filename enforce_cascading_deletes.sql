-- Enforce Cascading Deletes on All Foreign Key Relationships

-- 1. Sub-categories -> Categories checking
-- Deleting a category should delete its sub-categories
ALTER TABLE sub_categories
DROP CONSTRAINT IF EXISTS sub_categories_category_id_fkey;

ALTER TABLE sub_categories
ADD CONSTRAINT sub_categories_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE CASCADE;

-- 2. Products -> Sub-categories checking
-- Deleting a sub-category should delete its products
-- (Previously this might have been SET NULL)
ALTER TABLE products
DROP CONSTRAINT IF EXISTS products_sub_category_id_fkey;

ALTER TABLE products
ADD CONSTRAINT products_sub_category_id_fkey
FOREIGN KEY (sub_category_id)
REFERENCES sub_categories(id)
ON DELETE CASCADE;

-- 3. Product Images -> Products checking
-- Deleting a product should delete its images
ALTER TABLE product_images
DROP CONSTRAINT IF EXISTS product_images_product_id_fkey;

ALTER TABLE product_images
ADD CONSTRAINT product_images_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;
