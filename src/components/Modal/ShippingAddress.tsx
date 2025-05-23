import React, { useEffect, useState } from "react";
import { Check, MapPin } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import useShippingAddress from "../../hooks/useAddress.ts";
import { GetProductRequestParam } from "../../types/Products.ts";
import { ReqShippingAddress, ShippingAddress } from "../../types/ShippingAddress.ts";

interface CheckoutPageProps {
  defaultAddress?: ShippingAddress;
  onChangeOrderAddress: (shippingAddressId:string) => void;
  isChangeOrderAddressLoading?: boolean;
}

const CheckoutPage: React.FC<CheckoutPageProps> = (props) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(props?.defaultAddress?.id);
  const [address, setAddress] = useState<ShippingAddress[]>([]);
  const [newAddress, setNewAddress] = useState<ReqShippingAddress>(
    {
      title: "",
      phone: "",
      address: "",
      district: "",
      city: "",
      country: "",
      postalCode: "",
      isDefault: false,
    }
  );

  const shippingAddressParams: GetProductRequestParam = {
    page: 1,
    perPage: 30,
  };

  const{getMyShippingAddress, isLoading, onRequestAddShippingAdress}  = useShippingAddress();
  const {data: addressData, refetch:refreshShippingAddress} = getMyShippingAddress(shippingAddressParams);
  useEffect(() => {
    if (addressData) {
      setAddress(addressData.data);
    }
  }, [addressData]);

  useEffect(() => {
    console.log("hihi", newAddress);
  }, [newAddress]);

  const handleAddAddress = () => {
    onRequestAddShippingAdress(
      newAddress,
      (response) => {
        console.log("response", response);
        setShowAddressForm(false);
        refreshShippingAddress();
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const handleChangeOrderAddress = () => {
    props.onChangeOrderAddress(selectedAddress || "");
  }

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
      <div className={`sticky top-0 border-b-2 border-primary-dark/10 rounded-t-2xl bg-white`}>
        <div className={`px-10 py-5 flex justify-between`}>
          <div className={` flex items-center`}>
            <MapPin className="text-pink-light mr-2 h-5 w-5" />
            <h2 className={`text-primary-dark font-semibold`}>My Address</h2>
          </div>
          <button
            className={`flex items-center justify-center mt-4 rounded-lg bg-white/50 px-6 py-2 text-primary-dark hover:bg-white/70`}
            onClick={()=>setShowAddressForm(true)}
          >
            <FaPlus/>
            <span>Add New Address</span>
          </button>
        </div>
      </div>
      <div className={`flex flex-col items-center justify-center rounded-2xl text-center px-10`}>
        {/* Add Address Form */}
        {showAddressForm && (
          <div className="mt-4 rounded-lg p-4">
            <h3 className={`flex font-bold text-primary-dark`}>Add New Addres</h3>
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
              <div className={`flex items-center justify-center`}>
                <label className="text-gray-700 text-base">Default</label>
                <input
                  type="checkbox"
                  name="isDefault"
                  onChange={onChangeAddress}
                  className="rounded-lg border border-gray-300 p-1 m-3 focus:border-gray-300 focus:ring-0 outline-none focus:ring-primary-dark"
                />
              </div>

            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddressForm(false)}
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
        )}
      </div>

      {/* List Address */}
      <div className={`space-y-3 px-5 py-4`}>
        <div
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedAddress === props?.defaultAddress?.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedAddress(props?.defaultAddress?.id||"")}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-gray-500">{props?.defaultAddress?.title}</span>
                <span className="text-gray-500 mx-2">|</span>
                <span className="text-gray-500">{props?.defaultAddress?.phone}</span>
                {props?.defaultAddress?.isDefault && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Mặc định
                            </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {props.defaultAddress?.address || ""},{" "}
                {props.defaultAddress?.district || ""},{" "}
                {props.defaultAddress?.city || ""},{" "}
                {props.defaultAddress?.country || ""}
              </p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedAddress === props?.defaultAddress?.id
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}>
              {selectedAddress === props?.defaultAddress?.id && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
        </div>
        {address?.map((addr) => (
            addr.id !== props?.defaultAddress?.id && (
          <div
            key={addr.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedAddress === addr.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedAddress(addr.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-gray-500">{addr.title}</span>
                  <span className="text-gray-500 mx-2">|</span>
                  <span className="text-gray-500">{addr.phone}</span>
                  {addr.isDefault && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Mặc định
                            </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {addr?.address || ""},{" "}
                  {addr?.district || ""},{" "}
                  {addr?.city || ""},{" "}
                  {addr?.country || ""}
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAddress === addr.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedAddress === addr.id && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </div>
            )

        ))}
      </div>
      <div className={`sticky bottom-0 gap-5 p-3  flex items-center justify-center ${selectedAddress !== props?.defaultAddress?.id ?"":"hidden"} `}>
        <button className={`bg-white/70 p-3 rounded-lg drop-shadow-lg`}>Cancel</button>
        <button
          className={`bg-pink-light  text-white p-3 rounded-lg drop-shadow-lg`}
          onClick={handleChangeOrderAddress}
        >
          {props?.isChangeOrderAddressLoading ? (
            <div className="animate-spin h-5 w-5 border-2  border-white rounded-full border-t-transparent"></div>
          ) : (
            "Confirm"
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;