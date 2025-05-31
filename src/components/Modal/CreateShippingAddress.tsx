import React, { useEffect, useState } from "react";
import { Check, MapPin } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import useShippingAddress from "../../hooks/useAddress.ts";
import { GetProductRequestParam } from "../../types/Products.ts";
import { ReqShippingAddress, ShippingAddress } from "../../types/ShippingAddress.ts";

interface CreateAddressProps {
  onClose: () => void;
  onAddressAdded: () => void;
}

const CreateShippingAddress: React.FC<CreateAddressProps> = (props) => {
  const [newAddress, setNewAddress] = useState<ReqShippingAddress>(
    {
      title: "",
      phone: "",
      address: "",
      district: "",
      city: "",
      country: "",
      postalCode: "",
      isDefault: true,
    }
  );


  const{isLoading, onRequestAddShippingAdress}  = useShippingAddress();

  const handleAddAddress = () => {
    onRequestAddShippingAdress(
      newAddress,
      (response) => {
        console.log("response", response);
        props.onAddressAdded();
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "isDefault") {
      setNewAddress({ ...newAddress, [name]: e.target.checked });
      return;
    }
    setNewAddress( {...newAddress, [name]: value });
  }
  return (
    <div className="relative bg-white/50 rounded-2xl backdrop-blur-lg w-full h-full">
      <div className={`flex flex-col items-center justify-center rounded-2xl text-center px-10`}>
        {/* Add Address Form */}
          <div className="mt-4 rounded-lg p-4">
            <h2 className={`flex font-bold text-2xl py-6 text-primary-dark`}>Add New Addres</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <input
                type="text"
                placeholder="Your Name"
                name="title"
                onChange={onChangeAddress}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-gray-300 focus:ring-3 outline-none focus:ring-primary-dark"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                name="phone"
                onChange={onChangeAddress}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-gray-300 focus:ring-3 outline-none focus:ring-primary-dark"
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                onChange={onChangeAddress}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-gray-300 focus:ring-3 outline-none focus:ring-primary-dark"
              />
              <input
                type="text"
                placeholder="District"
                name="district"
                onChange={onChangeAddress}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-gray-300 focus:ring-3 outline-none focus:ring-primary-dark"
              />
              <input
                type="text"
                placeholder="City"
                name="city"
                onChange={onChangeAddress}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-gray-300 focus:ring-3 outline-none focus:ring-primary-dark"
              />
              <input
                type="text"
                placeholder="Country"
                name="country"
                onChange={onChangeAddress}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-gray-300 focus:ring-3 outline-none focus:ring-primary-dark"
              />
              <input
                type="text"
                placeholder="PostalCode"
                name="postalCode"
                onChange={onChangeAddress}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-gray-300 focus:ring-3 outline-none focus:ring-primary-dark"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => props.onClose?.()}
                className="px-4 py-2 text-gray-600 bg-white/60 rounded-lg hover:shadow-lg hover:bg-red-700  hover:text-white hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAddress}
                className="rounded-lg bg-pink-light px-6 py-2 text-white hover:cursor-pointer hover:drop-shadow-lg"
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default CreateShippingAddress;