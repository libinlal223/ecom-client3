-- Add missing columns to products table
alter table products add column if not exists stock integer default 0;
alter table products add column if not exists rating numeric default 0;
alter table products add column if not exists reviews integer default 0;
