import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts.ts";
import { SkincareConcern } from "../../types/SkincareConcern.ts";
import { ROUTE_PRODUCTS } from "../../constants/routes.ts";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import StarRating from "../../components/StarRating";
import { Currency } from "../../types/Currency.ts";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { getProductDetails } = useProducts();
  const { data: product, isLoading } = getProductDetails(id||"");

  // State for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for quantity
  const [quantity, setQuantity] = useState(1);

  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    howToUse: false,
    fullIngredientsList: false,
    ingredientBenefits: false
  });

  // Combine thumbnail with additional images
  const productImages = product ? [product.thumbnail, ...(product.additionalImages || [])] : [];

  // Handle navigation between images
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  // Function to select image by index
  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Quantity handlers
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Toggle expandable sections
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-primary relative flex min-h-screen flex-col">
      <div className="backdrop-blur-sm sticky top-20 z-1 flex h-full w-full flex-wrap justify-center py-2">
        {SkincareConcern.getAll().map((item, index) => (
          <Link
            to={`${ROUTE_PRODUCTS}?pageTitle=${item.label}&skincareConcerns=${item.value}`}
            key={index}
            className="p-3 text-nowrap text-primary-dark/50 hover:text-primary-dark/80 hover:scale-110"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Top section - Images and Product info */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Images */}
            <div className="md:w-1/2">
              {/* Main image with navigation buttons */}
              <div className="relative h-2/3 overflow-hidden rounded-lg mb-4">
                {/* Only show navigation buttons if there are multiple images */}
                {productImages.length > 1 && (
                  <button
                    onClick={goToPrevImage}
                    className="absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6 text-primary-dark" />
                  </button>
                )}
                <img
                  src={productImages[currentImageIndex]}
                  alt={`${product?.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                />

                {productImages.length > 1 && (
                  <button
                    onClick={goToNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6 text-primary-dark" />
                  </button>
                )}
              </div>

              {/* Thumbnails - only show if there are multiple images */}
              {productImages.length > 1 && (
                <div className="flex overflow-x-auto gap-2 py-2">
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`cursor-pointer w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden ${
                        currentImageIndex === index ? "border-primary-dark" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right side - Product info */}
            <div className="md:w-1/2">
              {/* Product title */}
              <div className="flex items-baseline mb-4">
                <h1 className="font-semibold text-2xl text-primary-dark/90 truncate">{product?.title}</h1>
                <span className="text-lg text-primary-dark/60 whitespace-nowrap flex-shrink-0 ml-4">
                  sold {product?.sold}
                </span>
              </div>

              <StarRating rating={product?.averageRating} />

              {/* Product description */}
              <div className="mb-6">
                <p className="text-primary-dark/80 leading-relaxed">{product?.description}</p>
              </div>

              {/* Skincare Concerns - Rounded pills */}
              {product?.skincareConcerns && product.skincareConcerns.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-primary-dark/90 mb-3">Skin Concerns</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.skincareConcerns.map((concern, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-dark/10 text-primary-dark rounded-full text-sm font-medium"
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-1 mb-6">
                <span className="text-primary-dark/70 text-xl">{product && Currency.getSymbol(product?.currency)}</span>
                <p className="text-primary-dark text-3xl font-semibold">{product?.price}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-primary-dark/90 font-medium mb-2">Quantity</label>
                <div className="flex items-center border border-primary-dark/20 rounded-lg w-fit">
                  <button
                    onClick={decreaseQuantity}
                    className="p-2 hover:bg-primary-dark/5 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-primary-dark" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 text-center py-2 border-none outline-none bg-transparent text-primary-dark"
                    min="1"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="p-2 hover:bg-primary-dark/5 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-primary-dark" />
                  </button>
                </div>
              </div>

              {/* Add to cart button */}
              <button className="w-full bg-primary-dark text-white py-3 px-6 rounded-lg hover:bg-primary-dark/90 transition-colors font-medium">
                Add to Cart
              </button>
            </div>
          </div>

          {/* Bottom section - Expandable Sections (Full Width) */}
          <div className="w-full mt-8">
            <div className="space-y-4">
              {/* How to Use */}
              <div className="border-b border-primary-dark/10">
                <button
                  onClick={() => toggleSection('howToUse')}
                  className="flex justify-between items-center w-full py-3 text-left"
                >
                  <span className="font-medium text-primary-dark/90">How to Use</span>
                  {expandedSections.howToUse ? (
                    <ChevronUp className="h-5 w-5 text-primary-dark/60" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary-dark/60" />
                  )}
                </button>
                {expandedSections.howToUse && (
                  <div className="pb-4">
                    <p className="text-primary-dark/70 leading-relaxed">
                      {product?.howToUse || "Apply a small amount to clean skin. Gently massage until absorbed. Use daily for best results."}
                    </p>
                  </div>
                )}
              </div>

              {/* Full Ingredients List */}
              <div className="border-b border-primary-dark/10">
                <button
                  onClick={() => toggleSection('fullIngredientsList')}
                  className="flex justify-between items-center w-full py-3 text-left"
                >
                  <span className="font-medium text-primary-dark/90">Full Ingredients List</span>
                  {expandedSections.fullIngredientsList ? (
                    <ChevronUp className="h-5 w-5 text-primary-dark/60" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary-dark/60" />
                  )}
                </button>
                {expandedSections.fullIngredientsList && (
                  <div className="pb-4">
                    <p className="text-primary-dark/70 leading-relaxed">
                      {product?.fullIngredientsList || "Water, Glycerin, Niacinamide, Hyaluronic Acid, Vitamin C, Retinol, Peptides, Ceramides, and other beneficial ingredients."}
                    </p>
                  </div>
                )}
              </div>

              {/* Ingredient Benefits */}
              <div className="border-b border-primary-dark/10">
                <button
                  onClick={() => toggleSection('ingredientBenefits')}
                  className="flex justify-between items-center w-full py-3 text-left"
                >
                  <span className="font-medium text-primary-dark/90">Ingredient Benefits</span>
                  {expandedSections.ingredientBenefits ? (
                    <ChevronUp className="h-5 w-5 text-primary-dark/60" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary-dark/60" />
                  )}
                </button>
                {expandedSections.ingredientBenefits && (
                  <div className="pb-4">
                    <p className="text-primary-dark/70 leading-relaxed">
                      {product?.ingredientBenefits || "Niacinamide helps minimize pores, Hyaluronic Acid provides deep hydration, Vitamin C brightens skin, and Peptides support skin elasticity."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;