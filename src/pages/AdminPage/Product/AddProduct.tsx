import React, { useState } from "react";
import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import { Camera, X, Plus, AlertCircle } from "lucide-react";
import useUploadImage from "../../../hooks/useUploadImage.ts";
import useProducts from "../../../hooks/useProducts.ts";
import { ReqCreateProduct } from "../../../types/Products.ts";
import { E_SkincareConcern, SkincareConcern } from "../../../types/SkincareConcern";
import { useNavigate } from "react-router-dom";
import { ROUTE_ADMIN_PRODUCTS } from "../../../constants/routes.ts";

interface UploadError {
  message: string;
  type: 'thumbnail' | 'additional';
}

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState<ReqCreateProduct>({
    thumbnail: "",
    additionalImages: [],
    title: "",
    price: 0,
    totalQuantity: 0,
    currency: "DOLLAR",
    description: "",
    howToUse: "",
    ingredientBenefits: "",
    fullIngredientsList: "",
    skincareConcerns: []
  });

  const [uploadError, setUploadError] = useState<UploadError | null>(null);

  const { isLoading, onRequestUploadImage } = useUploadImage();

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear any previous errors
      setUploadError(null);

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError({ message: "File size must be less than 5MB", type: 'thumbnail' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError({ message: "Please select a valid image file", type: 'thumbnail' });
        return;
      }

      onRequestUploadImage(
        { file },
        (response) => {
          console.log("Upload response:", response);
          if (response.url) {
            setProductData(prev => ({ ...prev, thumbnail: response.url! }));
            setUploadError(null);
          } else {
            setUploadError({
              message: response.message || "Upload failed. Please try again.",
              type: 'thumbnail'
            });
          }
        },
        (error) => {
          console.error("Upload failed:", error);
          setUploadError({
            message: "Network error. Please check your connection and try again.",
            type: 'thumbnail'
          });
        }
      );
    }

    // Reset the input value to allow uploading the same file again
    event.target.value = '';
  };

  const handleAdditionalImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clear any previous errors
      setUploadError(null);

      // Check if we already have 5 additional images
      if (productData.additionalImages.length >= 5) {
        setUploadError({ message: "Maximum 5 additional images allowed", type: 'additional' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError({ message: "File size must be less than 5MB", type: 'additional' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError({ message: "Please select a valid image file", type: 'additional' });
        return;
      }

      onRequestUploadImage(
        { file },
        (response) => {
          if (response.success && response.url) {
            setProductData(prev => ({
              ...prev,
              additionalImages: [...prev.additionalImages, response.secureUrl!]
            }));
            setUploadError(null);
          } else {
            setUploadError({
              message: response.message || "Upload failed. Please try again.",
              type: 'additional'
            });
          }
        },
        (error) => {
          console.error("Upload failed:", error);
          setUploadError({
            message: "Network error. Please check your connection and try again.",
            type: 'additional'
          });
        }
      );
    }

    // Reset the input value
    event.target.value = '';
  };

  const removeAdditionalImage = (index: number) => {
    setProductData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  // Updated function to handle skincare concern selection with auto-add
  const handleSkincareConcernChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as E_SkincareConcern;

    if (selectedValue && !productData.skincareConcerns.includes(selectedValue)) {
      setProductData(prev => ({
        ...prev,
        skincareConcerns: [...prev.skincareConcerns, selectedValue]
      }));
    }

    // Reset the select to show placeholder
    event.target.value = "";
  };

  const removeSkincareConcern = (concern: E_SkincareConcern) => {
    setProductData(prev => ({
      ...prev,
      skincareConcerns: prev.skincareConcerns.filter(c => c !== concern)
    }));
  };

  const{ isLoading: isUseProductLoading, onRequestCreateProduct } = useProducts();

  const handleSubmit = () => {
    onRequestCreateProduct(
      {
        thumbnail: productData.thumbnail,
        additionalImages: productData.additionalImages,
        title: productData.title,
        price: productData.price,
        totalQuantity: 0,
        currency: productData.currency,
        description: productData.description,
        howToUse: productData.howToUse,
        ingredientBenefits: productData.ingredientBenefits,
        fullIngredientsList: productData.fullIngredientsList,
        skincareConcerns: productData.skincareConcerns
      } as ReqCreateProduct,
      (response) => {
        // Handle success, e.g., show a success message or redirect
        console.log("Product created successfully");
        navigate(`${ROUTE_ADMIN_PRODUCTS}/${response.id}`);
      },
      (error) => {
        // Handle error, e.g., show an error message
        console.error("Error creating product:", error);
      }
    )

  };

  const isFormValid = productData.title.trim() && productData.thumbnail && productData.description.trim();

  // Get available options (exclude already selected ones)
  const availableSkincareConcerns = SkincareConcern.getAll().filter(
    option => !productData.skincareConcerns.includes(option.value)
  );

  return (
    <AdminContentLayout title={"Create Product"} subtitle={"Add a new product to your inventory"}>
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-primary-dark mb-6">Product Images</h2>
          {/* Error Display */}
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{uploadError.message}</span>
              <button
                onClick={() => setUploadError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Thumbnail Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Main Product Image *
              </label>
              <div className="relative">
                {productData.thumbnail ? (
                  <div className="relative w-64 h-64 rounded-lg overflow-hidden border-2 border-primary-dark/20">
                    <img
                      src={productData.thumbnail}
                      alt="Product thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProductData(prev => ({ ...prev, thumbnail: "" }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={isLoading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <div className={`w-64 h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
                      uploadError?.type === 'thumbnail'
                        ? 'border-red-300 bg-red-50'
                        : 'border-primary-dark/30 hover:border-blue-400 hover:bg-blue-50'
                    }`}>
                      {isLoading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <p className="mt-2 text-sm text-primary-dark/50">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <Camera className="w-12 h-12 text-primary-dark/40 mb-2" />
                          <p className="text-sm text-primary-dark/50 text-center">
                            Click to upload main image
                          </p>
                          <p className="text-xs text-primary-dark/30 text-center mt-1">
                            Max 5MB • JPG, PNG, WebP
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Additional Images */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Additional Images ({productData.additionalImages.length}/5)
              </label>
              <div className="flex flex-wrap gap-4">
                {productData.additionalImages.map((image, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-primary-dark/20">
                    <img
                      src={image}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={isLoading}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {productData.additionalImages.length < 5 && (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAdditionalImageUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <div className={`w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 ${
                      uploadError?.type === 'additional'
                        ? 'border-red-300 bg-red-50'
                        : 'border-primary-dark/30 hover:border-blue-400 hover:bg-blue-50'
                    }`}>
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      ) : (
                        <Plus className="w-6 h-6 text-primary-dark/40" />
                      )}
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-primary-dark/90 mb-6">Product Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                value={productData.title}
                onChange={(e) => setProductData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product title"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="">
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  step="0"
                  value={productData.totalQuantity}
                  onChange={(e) => setProductData(prev => ({ ...prev, totalQuantity: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>
              <div className="">
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productData.price}
                  onChange={(e) => setProductData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  Currency
                </label>
                <select
                  value={productData.currency}
                  onChange={(e) => setProductData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="DOLLAR">USD</option>
                  <option value="VND">VND</option>
                  <option value="EURO">EUR</option>
                  <option value="POUND">POUND</option>
                </select>

              </div>
            </div>

          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-primary-dark/70 mb-2">
              Description *
            </label>
            <textarea
              value={productData.description}
              onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
              required
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-primary-dark/90 mb-6">Product Details</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                How to Use
              </label>
              <textarea
                value={productData.howToUse}
                onChange={(e) => setProductData(prev => ({ ...prev, howToUse: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter usage instructions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Ingredient Benefits
              </label>
              <textarea
                value={productData.ingredientBenefits}
                onChange={(e) => setProductData(prev => ({ ...prev, ingredientBenefits: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter ingredient benefits"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Full Ingredients List
              </label>
              <textarea
                value={productData.fullIngredientsList}
                onChange={(e) => setProductData(prev => ({ ...prev, fullIngredientsList: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter complete ingredients list"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Skincare Concerns
              </label>
              <div className="mb-3">
                <select
                  onChange={handleSkincareConcernChange}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={availableSkincareConcerns.length === 0}
                  defaultValue=""
                >
                  <option value="">
                    {availableSkincareConcerns.length === 0 ? "All concerns added" : "Select skincare concern to add"}
                  </option>
                  {availableSkincareConcerns.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                {productData.skincareConcerns.map((concern) => (
                  <span
                    key={concern}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {SkincareConcern.getLabel(concern as E_SkincareConcern)}
                    <button
                      type="button"
                      onClick={() => removeSkincareConcern(concern as E_SkincareConcern)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-300/30 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="px-6 py-2 bg-pink-light text-white rounded-md disabled:bg-pink-light/50 disabled:cursor-not-allowed transition-colors"
          >
            {isUseProductLoading ? 'Uploading...' : 'Create Product'}
          </button>
        </div>
      </div>
    </AdminContentLayout>
  );
};

export default CreateProduct;