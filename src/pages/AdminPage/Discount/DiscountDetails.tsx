import React, { useEffect, useState } from "react";
import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import { X, Edit, Save } from "lucide-react";
import { E_SkincareConcern, SkincareConcern } from "../../../types/SkincareConcern";
import { useParams } from "react-router-dom";
import { ROUTE_ADMIN_DISCOUNTS } from "../../../constants/routes.ts";
import useDiscount from "../../../hooks/useDisscount.ts";
import { E_DisscountType, ReqCreateDiscount } from "../../../types/Discount.ts";
import { toast } from "react-toastify";

const DiscountDetails: React.FC = () => {
  const { discountId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

  const [discountData, setDiscountData] = useState<ReqCreateDiscount>({
    title: "",
    description: "",
    discountType: E_DisscountType.PERCENT,
    discountValue: 0,
    startTime: "",
    endTime: "",
    skincareConcerns: [],
    minPrice: 0,
    currency: "POUND",
    publishDate: ""
  });

  const {
    isLoading,
    getDiscountDetails,
    onRequestUpdateDiscount
  } = useDiscount();

  const {
    data: discountDetails,
    refetch: refreshDiscountDetails,
    isLoading: isDiscountDetailsLoading
  } = getDiscountDetails(discountId || "");

  // Load discount details when data is available
  useEffect(() => {
    if (discountDetails) {
      setDiscountData({
        title: discountDetails.title || "",
        description: discountDetails.description || "",
        discountType: discountDetails.discountType || E_DisscountType.PERCENT,
        discountValue: discountDetails.discountValue || 0,
        startTime: discountDetails.startTime || "",
        endTime: discountDetails.endTime || "",
        skincareConcerns: discountDetails.skincareConcerns || [],
        minPrice: discountDetails.minPrice || 0,
        currency: discountDetails.currency || "POUND",
        publishDate: discountDetails.publishDate || ""
      });
    }
  }, [discountDetails]);

  // Updated function to handle skincare concern selection with auto-add
  const handleSkincareConcernChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isEditMode) return;

    const selectedValue = event.target.value as E_SkincareConcern;

    if (selectedValue && !discountData.skincareConcerns.includes(selectedValue)) {
      setDiscountData(prev => ({
        ...prev,
        skincareConcerns: [...prev.skincareConcerns, selectedValue]
      }));
    }

    // Reset the select to show placeholder
    event.target.value = "";
  };

  const removeSkincareConcern = (concern: E_SkincareConcern) => {
    if (!isEditMode) return;

    setDiscountData(prev => ({
      ...prev,
      skincareConcerns: prev.skincareConcerns.filter(c => c !== concern)
    }));
  };

  const handleUpdate = () => {
    if (!discountId) return;

    onRequestUpdateDiscount(
      {
        id: discountId,
        data: discountData
      },
      (response) => {
        console.log("Discount updated successfully");
        toast.success("Discount updated successfully!");
        setIsEditMode(false);
        refreshDiscountDetails();
      },
      (error) => {
        console.error("Error updating discount:", error);
        toast.error(error.message || "Error updating discount. Please try again.");
      }
    );
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Reset to original data
    if (discountDetails) {
      setDiscountData({
        title: discountDetails.title || "",
        description: discountDetails.description || "",
        discountType: discountDetails.discountType || E_DisscountType.PERCENT,
        discountValue: discountDetails.discountValue || 0,
        startTime: discountDetails.startTime || "",
        endTime: discountDetails.endTime || "",
        skincareConcerns: discountDetails.skincareConcerns || [],
        minPrice: discountDetails.minPrice || 0,
        currency: discountDetails.currency || "POUND",
        publishDate: discountDetails.publishDate || ""
      });
    }
  };

  const isFormValid = discountData.title.trim() &&
    discountData.description.trim() &&
    discountData.discountValue > 0 &&
    discountData.startTime &&
    discountData.endTime &&
    discountData.publishDate;

  // Get available options (exclude already selected ones)
  const availableSkincareConcerns = SkincareConcern.getAll().filter(
    option => !discountData.skincareConcerns.includes(option.value)
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  if (isDiscountDetailsLoading) {
    return (
      <AdminContentLayout title={`Discount | ID: ${discountId}`} subtitle={"Loading Discount Details..."}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminContentLayout>
    );
  }

  if (!discountDetails && !isDiscountDetailsLoading) {
    return (
      <AdminContentLayout title={`Discount | ID: ${discountId}`} subtitle={"Discount Not Found"}>
        <div className="text-center py-12">
          <p className="text-gray-500">Discount not found or failed to load.</p>
        </div>
      </AdminContentLayout>
    );
  }

  return (
    <AdminContentLayout
      title={`Discount | ID: ${discountId}`}
      subtitle={isEditMode ? "Edit Discount Details" : "Discount Details"}
    >
      <div className="space-y-8">
        {/* Discount Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-primary-dark">Discount Information</h2>
            {!isEditMode && (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-pink-light text-white rounded-md cursor-pointer hover:shadow-lg transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Discount
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Discount Title *
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={discountData.title}
                  onChange={(e) => setDiscountData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter discount title"
                  required
                />
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {discountData.title || "No title"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Discount Type *
              </label>
              {isEditMode ? (
                <select
                  value={discountData.discountType}
                  onChange={(e) => setDiscountData(prev => ({ ...prev, discountType: e.target.value as "PERCENT" | "FIXED_AMOUNT" }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                </select>
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {discountData.discountType === "PERCENT" ? "Percentage (%)" : "Fixed Amount"}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-primary-dark/70 mb-2">
              Description *
            </label>
            {isEditMode ? (
              <textarea
                value={discountData.description}
                onChange={(e) => setDiscountData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter discount description"
                required
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-h-[100px]">
                {discountData.description || "No description"}
              </div>
            )}
          </div>
        </div>

        {/* Discount Value & Currency */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-primary-dark/90 mb-6">Discount Value</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Discount Value *
              </label>
              {isEditMode ? (
                <input
                  type="number"
                  step="0.01"
                  value={discountData.discountValue}
                  onChange={(e) => setDiscountData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={discountData.discountType === "PERCENT" ? "0.00%" : "0.00"}
                  required
                />
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {discountData.discountValue || 0}
                  {discountData.discountType === "PERCENT" ? "%" : ""}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Minimum Price *
              </label>
              {isEditMode ? (
                <input
                  type="number"
                  step="0.01"
                  value={discountData.minPrice}
                  onChange={(e) => setDiscountData(prev => ({ ...prev, minPrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {discountData.currency === "POUND" ? "£" : "$"}{discountData.minPrice || 0}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Currency *
              </label>
              {isEditMode ? (
                <select
                  value={discountData.currency}
                  onChange={(e) => setDiscountData(prev => ({ ...prev, currency: e.target.value as "DOLLAR" | "POUND" }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="DOLLAR">Dollar ($)</option>
                  <option value="POUND">Pound (£)</option>
                </select>
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {discountData.currency === "POUND" ? "Pound (£)" : "Dollar ($)"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-primary-dark/90 mb-6">Date Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Start Date *
              </label>
              {isEditMode ? (
                <input
                  type="date"
                  value={discountData.startTime}
                  onChange={(e) => setDiscountData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {formatDate(discountData.startTime)}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                End Date *
              </label>
              {isEditMode ? (
                <input
                  type="date"
                  value={discountData.endTime}
                  onChange={(e) => setDiscountData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {formatDate(discountData.endTime)}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Publish Date *
              </label>
              {isEditMode ? (
                <input
                  type="date"
                  value={discountData.publishDate}
                  onChange={(e) => setDiscountData(prev => ({ ...prev, publishDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              ) : (
                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                  {formatDate(discountData.publishDate)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skincare Concerns */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-primary-dark/90 mb-6">Target Skincare Concerns</h2>

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
              {discountData.skincareConcerns.map((concern) => (
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
              {discountData.skincareConcerns.length === 0 && (
                <span className="text-gray-500 text-sm">No skincare concerns specified</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditMode && (
          <div className="sticky z-50 bottom-0 flex justify-center gap-4">
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
              {isLoading ? 'Updating...' : 'Update Discount'}
            </button>
          </div>
        )}
      </div>
    </AdminContentLayout>
  );
};

export default DiscountDetails;