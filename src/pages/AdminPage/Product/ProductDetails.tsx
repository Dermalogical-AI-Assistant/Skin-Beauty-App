import React, { useEffect, useState } from "react";
import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import { Camera, X, Plus, AlertCircle, Edit, Save } from "lucide-react";
import useUploadImage from "../../../hooks/useUploadImage.ts";
import useProducts from "../../../hooks/useProducts.ts";
import { ReqCreateProduct, Product } from "../../../types/Products.ts";
import { E_SkincareConcern, SkincareConcern } from "../../../types/SkincareConcern";
import { useParams } from "react-router-dom";
import { ROUTE_ADMIN_PRODUCTS } from "../../../constants/routes.ts";
import { toast } from "react-toastify";

interface UploadError {
  message: string;
  type: 'thumbnail' | 'additional';
}

const ProductDetails: React.FC = () => {
  const { productId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

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
  const { isLoading: isUseProductLoading, getProductDetails, onRequestUpdateProduct } = useProducts();

  const { data: productDetails, refetch: refreshProductDetails, isLoading: isProductDetailsLoading } = getProductDetails(productId || "");

  // Load product details when data is available
  useEffect(() => {
    if (productDetails) {
      setProductData({
        thumbnail: productDetails.thumbnail || "",
        additionalImages: productDetails.additionalImages || [],
        title: productDetails.title || "",
        price: productDetails.price || 0,
        totalQuantity: 0, // Not available in Product type
        currency: productDetails.currency || "DOLLAR",
        description: productDetails.description || "",
        howToUse: productDetails.howToUse || "",
        ingredientBenefits: productDetails.ingredientBenefits || "",
        fullIngredientsList: productDetails.fullIngredientsList || "",
        skincareConcerns: productDetails.skincareConcerns || []
      });
    }
  }, [productDetails]);

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditMode) return;

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
    if (!isEditMode) return;

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
    if (!isEditMode) return;

    setProductData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  // Updated function to handle skincare concern selection with auto-add
  const handleSkincareConcernChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isEditMode) return;

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
    if (!isEditMode) return;

    setProductData(prev => ({
      ...prev,
      skincareConcerns: prev.skincareConcerns.filter(c => c !== concern)
    }));
  };

  const handleUpdate = () => {
    if(!productId) return ;
    onRequestUpdateProduct(
      {
        id:productId,
        data:{
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
        } as ReqCreateProduct
      },
      (response) => {
        // Handle success, e.g., show a success message or redirect
        console.log("Product update successfully");
        setIsEditMode(false);
        refreshProductDetails();
      },
      (error) => {
        console.error("Error updating product:", error);
        toast.error(error.message || "Error updating product. Please try again.");
      }
    )
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Reset to original data
    if (productDetails) {
      setProductData({
        thumbnail: productDetails.thumbnail || "",
        additionalImages: productDetails.additionalImages || [],
        title: productDetails.title || "",
        price: productDetails.price || 0,
        totalQuantity: 0,
        currency: productDetails.currency || "DOLLAR",
        description: productDetails.description || "",
        howToUse: productDetails.howToUse || "",
        ingredientBenefits: productDetails.ingredientBenefits || "",
        fullIngredientsList: productDetails.fullIngredientsList || "",
        skincareConcerns: productDetails.skincareConcerns || []
      });
    }
  };

  const isFormValid = productData.title.trim() && productData.thumbnail && productData.description.trim();

  // Get available options (exclude already selected ones)
  const availableSkincareConcerns = SkincareConcern.getAll().filter(
    option => !productData.skincareConcerns.includes(option.value)
  );

  if (isProductDetailsLoading) {
    return (
      <AdminContentLayout title={`Product | ID: ${productId}`} subtitle={"Loading Product Details..."}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminContentLayout>
    );
  }

  if (!productDetails && !isProductDetailsLoading) {
    return (
      <AdminContentLayout title={`Product | ID: ${productId}`} subtitle={"Product Not Found"}>
        <div className="text-center py-12">
          <p className="text-gray-500">Product not found or failed to load.</p>
        </div>
      </AdminContentLayout>
    );
  }

  return (
    <AdminContentLayout title={`Product | ID: ${productId}`} subtitle={isEditMode ? "Edit Product Details" : "Product Details"}>
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-primary-dark">Product Images</h2>
            {!isEditMode && (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-pink-light text-white rounded-md cursor-pointer hover:shadow-lg transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Product
              </button>
            )}
          </div>

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
            {/* Thumbnail Display/Upload */}
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
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => setProductData(prev => ({ ...prev, thumbnail: "" }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={isLoading}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  isEditMode && (
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
                  )
                )}

                {isEditMode && productData.thumbnail && (
                  <label className="cursor-pointer mt-2 block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
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
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={isLoading}
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                ))}

                {isEditMode && productData.additionalImages.length < 5 && (
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
              {isEditMode ? (
                <input
                  type="text"
                  value={productData.title}
                  onChange={(e) => setProductData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product title"
                  required
                />
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {productData.title || "No title"}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <div className="">
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  Quantity *
                </label>
                {isEditMode ? (
                  <input
                    type="number"
                    step="0"
                    value={productData.totalQuantity}
                    onChange={(e) => setProductData(prev => ({ ...prev, totalQuantity: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {productData.totalQuantity || 0}
                  </div>
                )}

              </div>
              <div className={`flex-1`}>
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  Price *
                </label>
                {isEditMode ? (
                  <input
                    type="number"
                    step="0.01"
                    value={productData.price}
                    onChange={(e) => setProductData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {productData.price || 0}
                  </div>
                )}
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                  Currency
                </label>
                {isEditMode ? (
                  <select
                    value={productData.currency}
                    onChange={(e) => setProductData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DOLLAR">USD</option>
                    <option value="VND">VND</option>
                    <option value="EUR">EUR</option>
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {productData.currency || "USD"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-primary-dark/70 mb-2">
              Description *
            </label>
            {isEditMode ? (
              <textarea
                value={productData.description}
                onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description"
                required
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-h-[100px]">
                {productData.description || "No description"}
              </div>
            )}
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
              {isEditMode ? (
                <textarea
                  value={productData.howToUse}
                  onChange={(e) => setProductData(prev => ({ ...prev, howToUse: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter usage instructions"
                />
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-h-[80px]">
                  {productData.howToUse || "No usage instructions"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Ingredient Benefits
              </label>
              {isEditMode ? (
                <textarea
                  value={productData.ingredientBenefits}
                  onChange={(e) => setProductData(prev => ({ ...prev, ingredientBenefits: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter ingredient benefits"
                />
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-h-[80px]">
                  {productData.ingredientBenefits || "No ingredient benefits"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Full Ingredients List
              </label>
              {isEditMode ? (
                <textarea
                  value={productData.fullIngredientsList}
                  onChange={(e) => setProductData(prev => ({ ...prev, fullIngredientsList: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter complete ingredients list"
                />
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-h-[100px]">
                  {productData.fullIngredientsList || "No ingredients list"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Skincare Concerns
              </label>
              {isEditMode && (
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
              )}
              <div className="flex flex-wrap gap-2">
                {productData.skincareConcerns.map((concern) => (
                  <span
                    key={concern}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {SkincareConcern.getLabel(concern as E_SkincareConcern)}
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => removeSkincareConcern(concern as E_SkincareConcern)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </span>
                ))}
                {productData.skincareConcerns.length === 0 && (
                  <span className="text-gray-500 text-sm">No skincare concerns specified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditMode && (
          <div className="sticky z-50 bottom-0  flex justify-center gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={!isFormValid || isLoading}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUseProductLoading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        )}
      </div>
    </AdminContentLayout>
  );
};

export default ProductDetails;