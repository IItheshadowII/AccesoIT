"use client";

// src/app/[lang]/admin/products/page.tsx
import type { Locale } from '@/lib/i18n-config';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product, type ProductInput } from '@/lib/schemas/product-schema';
import { getDictionary } from '@/lib/dictionaries';
import { getProducts, deleteProduct } from './actions';
import { ProductForm } from './components/ProductForm';

export default function AdminProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = (pathname.split('/')[1] || 'en') as Locale;
  if (!['en', 'es'].includes(currentLang)) {
    router.push('/en/login');
    return null;
  }
  const [dictionary, setDictionary] = useState<any>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductInput & { id?: string } | null>(null);

  useEffect(() => {
    if (!currentLang) {
      console.error('Language not found in URL');
      router.push('/en/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const dict = await getDictionary(currentLang as string);
        setDictionary(dict);
        
        const result = await getProducts();
        if (Array.isArray(result)) {
          setProducts(result);
        } else {
          console.error('Error in AdminProductsPage fetching products:', result.error);
        }
      } catch (error) {
        console.error('Error in AdminProductsPage fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentLang]);

  const handleDelete = async (id: string) => {
    if (confirm(dictionary?.products?.confirmDelete)) {
      try {
        await deleteProduct(id, currentLang);
        router.refresh();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setProductToEdit({
      ...product,
      price: product.price.toString()
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setProductToEdit(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{dictionary.products.title}</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder={dictionary.products.searchPlaceholder}
            className="border p-2 rounded mr-2"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {dictionary.products.search}
          </button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {dictionary.products.add}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">{dictionary.products.name}</th>
              <th className="px-6 py-3 text-left">{dictionary.products.description}</th>
              <th className="px-6 py-3 text-left">{dictionary.products.price}</th>
              <th className="px-6 py-3 text-left">{dictionary.products.stock}</th>
              <th className="px-6 py-3 text-left">{dictionary.products.actions}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.description}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    {dictionary.products.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    {dictionary.products.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            {productToEdit && dictionary && (
              <ProductForm
                dictionary={dictionary}
                currentLang={currentLang}
                productToEdit={productToEdit || { id: '', name: '', description: '', price: '', stock: 0, categoryId: '' }}
                disabled={false}
                onClose={handleCloseForm}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
