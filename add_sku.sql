-- Add sku column to products table
alter table products add column if not exists sku text;
