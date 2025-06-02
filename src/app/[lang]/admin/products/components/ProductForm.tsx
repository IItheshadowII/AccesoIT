"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, type ProductInput } from '@/lib/schemas/product-schema';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  dictionary: Record<string, any>;
  currentLang: string;
  productToEdit?: ProductInput & { id: string };
  disabled?: boolean;
  onClose?: () => void;
}

export function ProductForm({ dictionary, currentLang, productToEdit, disabled = false, onClose }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: productToEdit?.name || '',
      description: productToEdit?.description || '',
      price: productToEdit?.price || '',
      stock: productToEdit?.stock || 0,
      categoryId: productToEdit?.categoryId || ''
    },
  });

  const onSubmit = async (data: ProductInput) => {
    if (disabled) return;

    setIsLoading(true);
    try {
      if (productToEdit) {
        // Actualizar producto existente
        await fetch(`/api/products/${productToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else {
        // Crear nuevo producto
        await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }
      
      // Actualizar y cerrar el formulario
      router.refresh();
      onClose?.();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            {dictionary?.products?.name || 'Name'}
          </label>
          <input
            {...register('name')}
            id="name"
            type="text"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            {dictionary?.products?.description || 'Description'}
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            {dictionary?.products?.price || 'Price'}
          </label>
          <input
            {...register('price')}
            id="price"
            type="text"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.price ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium">
            {dictionary?.products?.stock || 'Stock'}
          </label>
          <input
            {...register('stock')}
            id="stock"
            type="number"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.stock ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium">
            {dictionary?.products?.category || 'Category'}
          </label>
          <input
            {...register('categoryId')}
            id="categoryId"
            type="text"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.categoryId ? 'border-red-500' : ''}`}
            disabled={disabled}
          />
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading || disabled}
          className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Guardando...' : (productToEdit?.id ? dictionary?.products?.update || 'Update' : dictionary?.products?.add || 'Add')}
        </button>
      </div>
    </form>
  );
}
