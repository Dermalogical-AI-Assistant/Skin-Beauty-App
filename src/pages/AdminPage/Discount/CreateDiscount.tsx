import React, { useState } from "react";
import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import { X } from "lucide-react";
import { E_SkincareConcern, SkincareConcern } from "../../../types/SkincareConcern";
import { useNavigate } from "react-router-dom";
import { ROUTE_ADMIN_DISCOUNTS } from "../../../constants/routes.ts";
import useDiscount from "../../../hooks/useDisscount.ts";
import { E_DisscountType, ReqCreateDiscount } from "../../../types/Discount.ts";
import { toast } from "react-toastify";

const CreateDiscount: React.FC = () => {
  const navigate = useNavigate();
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

  const [isCreatingDiscount, ] = useState(false);

  // Updated function to handle skincare concern selection with auto-add
  const handleSkincareConcernChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
    setDiscountData(prev => ({
      ...prev,
      skincareConcerns: prev.skincareConcerns.filter(c => c !== concern)
    }));
  };

  const { onRequestCreateDiscount } = useDiscount();
  const handleSubmit = async () => {
    onRequestCreateDiscount(
      discountData,
      () => {
        toast.success("Discount created successfully!");
        navigate(ROUTE_ADMIN_DISCOUNTS);
      },
      (error) => {
        console.error("Error creating discount:", error);
        toast.error("Failed to create discount. Please try again.")

      }
    );
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

  return (
    <AdminContentLayout title={"Create Discount"} subtitle={"Add a new discount to your catalog"}>
      <div className="space-y-8">
        {/* Discount Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-primary-dark/90 mb-6">Discount Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Discount Title *
              </label>
              <input
                type="text"
                value={discountData.title}
                onChange={(e) => setDiscountData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter discount title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Discount Type *
              </label>
              <select
                value={discountData.discountType}
                onChange={(e) => setDiscountData(prev => ({ ...prev, discountType: e.target.value as E_DisscountType }))}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="PERCENT">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-primary-dark/70 mb-2">
              Description *
            </label>
            <textarea
              value={discountData.description}
              onChange={(e) => setDiscountData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter discount description"
              required
            />
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
              <input
                type="number"
                step="0.01"
                value={discountData.discountValue}
                onChange={(e) => setDiscountData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={discountData.discountType === "PERCENT" ? "0.00%" : "0.00"}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Minimum Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={discountData.minPrice}
                onChange={(e) => setDiscountData(prev => ({ ...prev, minPrice: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Currency *
              </label>
              <select
                value={discountData.currency}
                onChange={(e) => setDiscountData(prev => ({ ...prev, currency: e.target.value as "DOLLAR" | "POUND" }))}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="DOLLAR">Dollar ($)</option>
                <option value="POUND">Pound (£)</option>
              </select>
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
              <input
                type="date"
                value={discountData.startTime}
                onChange={(e) => setDiscountData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={discountData.endTime}
                onChange={(e) => setDiscountData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark/70 mb-2">
                Publish Date *
              </label>
              <input
                type="date"
                value={discountData.publishDate}
                onChange={(e) => setDiscountData(prev => ({ ...prev, publishDate: e.target.value }))}
                className="w-full px-3 py-2 border border-primary-dark/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
              {discountData.skincareConcerns.map((concern) => (
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

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(ROUTE_ADMIN_DISCOUNTS)}
            className="px-6 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-300/30 transition-colors"
            disabled={isCreatingDiscount}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isCreatingDiscount}
            className="px-6 py-2 bg-pink-light text-white rounded-md disabled:bg-pink-light/50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreatingDiscount ? 'Creating...' : 'Create Discount'}
          </button>
        </div>
      </div>
    </AdminContentLayout>
  );
};

export default CreateDiscount;