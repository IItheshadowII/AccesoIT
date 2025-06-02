
// src/components/admin/ProductList.tsx
'use client';

import { useState, useEffect } from 'react';
import { type Product, deleteProduct, getProducts } from '@/app/[lang]/admin/products/actions';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';
import ProductForm from './ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import type { Locale } from '@/lib/i18n-config';

interface ProductListProps {
  initialProducts: Product[];
  dictionary: {
    nameHeader: string;
    priceHeader: string;
    descriptionHeader: string;
    actionsHeader: string;
    editButton: string;
    deleteButton: string;
    confirmDeleteTitle: string;
    confirmDeleteMessage: string;
    cancelButton: string;
    confirmButton: string;
    deleteSuccess: string;
    deleteError: string;
    noProducts: string;
    disabledTooltip?: string;
  };
  formDictionary: any; // Pass the dictionary for ProductForm
  currentLang: Locale;
  disabled?: boolean; // To disable actions if Firebase isn't up
}

export default function ProductList({ initialProducts, dictionary, formDictionary, currentLang, disabled = false }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const refreshProducts = async () => {
    if (disabled) return; // Don't attempt to refresh if disabled
    const result = await getProducts();
    if (Array.isArray(result)) {
      setProducts(result);
    } else {
      setProducts([]); // Clear products if there was an error
      toast({ title: 'Error', description: result.error || 'Failed to refresh products.', variant: 'destructive' });
    }
  };

  const handleEdit = (product: Product) => {
    if (disabled) {
        toast({ title: "Error", description: dictionary.disabledTooltip || "Product management is disabled.", variant: "destructive"});
        return;
    }
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteInitiate = (product: Product) => {
    if (disabled) {
        toast({ title: "Error", description: dictionary.disabledTooltip || "Product management is disabled.", variant: "destructive"});
        return;
    }
    setProductToDelete(product);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete || disabled) return;
    const result = await deleteProduct(productToDelete.id, currentLang);
    if (result.success) {
      toast({ title: 'Success', description: dictionary.deleteSuccess });
      refreshProducts();
    } else {
      toast({ title: 'Error', description: result.error || dictionary.deleteError, variant: 'destructive' });
    }
    setIsConfirmDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingProduct(null);
    refreshProducts();
  };

  if (disabled && products.length === 0) {
    return <p className="text-destructive">{dictionary.disabledTooltip || "Product list is unavailable due to configuration issues."}</p>;
  }

  if (products.length === 0) {
    return <p>{dictionary.noProducts}</p>;
  }


  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{dictionary.nameHeader}</TableHead>
            <TableHead>{dictionary.priceHeader}</TableHead>
            <TableHead>{dictionary.descriptionHeader}</TableHead>
            <TableHead className="text-right">{dictionary.actionsHeader}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(product)} disabled={disabled} title={disabled ? dictionary.disabledTooltip : dictionary.editButton}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">{dictionary.editButton}</span>
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteInitiate(product)} disabled={disabled} title={disabled ? dictionary.disabledTooltip : dictionary.deleteButton}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{dictionary.deleteButton}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isFormModalOpen} onOpenChange={(isOpen) => {
        setIsFormModalOpen(isOpen);
        if (!isOpen) setEditingProduct(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? formDictionary.titleEdit : formDictionary.titleCreate}</DialogTitle>
          </DialogHeader>
          <ProductForm
            dictionary={formDictionary}
            currentLang={currentLang}
            productToEdit={editingProduct}
            onSuccess={handleFormSuccess}
            disabled={disabled} // Pass disabled state
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dictionary.confirmDeleteTitle}</DialogTitle>
          </DialogHeader>
          <p>{dictionary.confirmDeleteMessage.replace('{productName}', productToDelete?.name || '')}</p>
          <div className="mt-4 flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setProductToDelete(null)}>{dictionary.cancelButton}</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={disabled}>{dictionary.confirmButton}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
