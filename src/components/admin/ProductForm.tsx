
// src/components/admin/ProductForm.tsx
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, type ProductInput, type Product } from '@/lib/schemas/product-schema'; // Updated import
import { addProduct, updateProduct } from '@/app/[lang]/admin/products/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import type { Locale } from '@/lib/i18n-config';

interface ProductFormProps {
  dictionary: {
    titleCreate: string;
    titleEdit: string;
    nameLabel: string;
    namePlaceholder: string;
    priceLabel: string;
    pricePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    submitCreate: string;
    submitUpdate: string;
    successCreate: string;
    successUpdate: string;
    error: string;
    processing: string;
    disabledTooltip?: string;
  };
  currentLang: Locale;
  productToEdit?: Product | null;
  onSuccess?: () => void; // Callback after successful submission
  disabled?: boolean; // To disable the form if Firebase isn't configured
}

export default function ProductForm({ dictionary, currentLang, productToEdit, onSuccess, disabled = false }: ProductFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!productToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      price: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isEditing && productToEdit) {
      setValue('name', productToEdit.name);
      setValue('price', productToEdit.price);
      setValue('description', productToEdit.description || '');
    } else {
      reset({ name: '', price: '', description: '' });
    }
  }, [productToEdit, isEditing, setValue, reset]);

  const onSubmit: SubmitHandler<ProductInput> = async (data) => {
    if (disabled) {
        toast({ title: "Error", description: dictionary.disabledTooltip || "Product management is disabled.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    try {
      let result;
      if (isEditing && productToEdit) {
        result = await updateProduct(productToEdit.id, data, currentLang);
      } else {
        result = await addProduct(data, currentLang);
      }

      if (result.success) {
        toast({
          title: 'Success!',
          description: isEditing ? dictionary.successUpdate : dictionary.successCreate,
        });
        reset();
        if (onSuccess) onSuccess();
      } else {
        let errorMessage = result.error || 'An unknown error occurred';
        if (result.errors) {
            const fieldErrors = Object.entries(result.errors)
                .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
                .join('; ');
            errorMessage = `${errorMessage}. Details: ${fieldErrors}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || dictionary.error,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-xl font-semibold">{isEditing ? dictionary.titleEdit : dictionary.titleCreate}</h3>
      <fieldset disabled={disabled} className="space-y-6">
        <div>
          <Label htmlFor="name">{dictionary.nameLabel}</Label>
          <Input
            id="name"
            placeholder={dictionary.namePlaceholder}
            {...register('name')}
            className={`mt-1 ${errors.name ? 'border-destructive' : ''}`}
            readOnly={disabled}
          />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="price">{dictionary.priceLabel}</Label>
          <Input
            id="price"
            placeholder={dictionary.pricePlaceholder}
            {...register('price')}
            className={`mt-1 ${errors.price ? 'border-destructive' : ''}`}
            readOnly={disabled}
          />
          {errors.price && <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">{dictionary.descriptionLabel}</Label>
          <Textarea
            id="description"
            placeholder={dictionary.descriptionPlaceholder}
            {...register('description')}
            className="mt-1"
            rows={3}
            readOnly={disabled}
          />
          {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>}
        </div>
      </fieldset>
      <Button type="submit" className="w-full" disabled={isLoading || disabled} title={disabled ? (dictionary.disabledTooltip || "Product management is disabled due to configuration issues") : ""}>
        {isLoading ? (
            <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {dictionary.processing || 'Processing...'}
            </div>
        ) : (isEditing ? dictionary.submitUpdate : dictionary.submitCreate)}
      </Button>
      {disabled && <p className="mt-2 text-sm text-destructive text-center">{dictionary.disabledTooltip || "Product management functionality is currently disabled due to a configuration issue. Please check server logs."}</p>}
    </form>
  );
}
