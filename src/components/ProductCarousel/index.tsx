export const ProductCarousel = () => {
  const products = [
    { name: "Skin Facial LED Mask", volume: "100ml" },
    { name: "Skin Facial LED Mask", volume: "100ml" },
    { name: "Skin Facial LED Mask", volume: "100ml" },
    { name: "Skin Facial LED Mask", volume: "100ml" },
  ];

  return (
    <div className="mt-6">
      <p className="text-md mb-2 font-semibold">Best Solution Products</p>
      <div className="flex gap-4 overflow-x-auto">
        {products.map((p, index) => (
          <div
            key={index}
            className="flex h-[140px] min-w-[120px] flex-col items-center justify-center rounded-xl bg-[#F5F5F5] text-center shadow-sm"
          >
            <div className="mb-2 h-14 w-14 rounded-full bg-gray-200"></div>
            <p className="text-sm">{p.name}</p>
            <p className="text-xs text-gray-500">{p.volume}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
