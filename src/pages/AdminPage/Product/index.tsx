import React, { useState } from "react";
import { MultiSelect } from "@mantine/core";
import { BsThreeDots } from "react-icons/bs";
import "@mantine/core/styles.css";
import Loading from "../../../components/Loading";
import { DEFAULT_AVATAR_URL } from "../../../constants/properties";
import { GetProductsRequestParam, Product, E_ProductStatus } from "../../../types/Products.ts";
import useAdminProduct from "../../../hooks/useAdminProduct.tsx";
import ContextMenuItem from "../../../components/ContextMenu/ContextMenuItem.tsx";
import ContextMenu from "../../../components/ContextMenu";
import StarRating from "../../../components/StarRating";
import { Link, useNavigate } from "react-router-dom";
import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import { ROUTE_ADMIN_PRODUCTS } from "../../../constants/routes.ts";
import { convertDate } from "../../../utils/date.ts";
import { Upload } from "lucide-react";
import { AiOutlineCloudUpload } from "react-icons/ai";

const ProductManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<E_ProductStatus[]>([]);
  const {getProducts} = useAdminProduct();
  const navigate = useNavigate();

  const params: GetProductsRequestParam = {
    search,
    status: selectedStatus,
    page,
    perPage,
  };

  const {data, isLoading, refetch: refreshProducts} = getProducts(params);

  const products = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleRowClick = (productId: string) => {
    console.log("Row clicked", productId);
    navigate(`${ROUTE_ADMIN_PRODUCTS}/${productId}`);
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(0)
    refreshProducts();
  }

  return (
    <AdminContentLayout title={"Product Management"} subtitle="Manage your products effectively">
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">All products</div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-transparent bg-gray-100 px-3 text-xs"
          />

          <MultiSelect
            data={[
              { value: E_ProductStatus.ACTIVE, label: "Active" },
              { value: E_ProductStatus.DRAFT, label: "Draft" },
              { value: E_ProductStatus.ACHIVE, label: "Achive" },
            ]}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value as E_ProductStatus[])}
            placeholder="Select Status(s)"
            className="min-w-[160px]"
            size="xs"
          />

          <Link
            className="inline-flex items-center rounded-md bg-pink-light px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            to="/admin/products/new-product"

          >
            + New Product
          </Link>

          <Link
            className="inline-flex items-center rounded-md bg-purple-500 px-4 py-2 gap-2 text-xs font-semibold text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            to="/admin/products/import"

          >
            <AiOutlineCloudUpload size={24}/>
            <span>Import file</span>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow overflow-hidden">
        {isLoading ? (
          <Loading entityName="Products"></Loading>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <colgroup>
                  <col className="w-[5%]" />
                  <col className="w-[25%]" />
                  <col className="w-[15%]" />
                  <col className="w-[20%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[5%]" />
                </colgroup>
                <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In Stock
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sold
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ratings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product: Product, index) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(product.id)}
                  >
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      { ( (params?.page ?? 0) * (params?.perPage ?? 1) ) + index + 1 }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          src={product?.thumbnail || DEFAULT_AVATAR_URL}
                          alt="avatar"
                          className="h-8 w-8 rounded-full mr-2"
                        />
                        <div className="font-medium text-sm">{product.title}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.totalQuantity || 0}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {product.soldQuantity || 0}
                        </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <StarRating rating={product?.averageRating || 0} />
                        <span className="ml-2 text-xs text-gray-500">
                            ({product?.averageRating?.toFixed(1) || '0.0'})
                          </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-500">
                      {convertDate(product.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                      <div
                        className="flex justify-center"
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking menu
                      >
                        <ContextMenu icon={<BsThreeDots size={16} />}>
                          <ContextMenuItem
                            label={"Details"}
                            onClick={() => {
                              console.log("View details", product.id);
                              navigate(`${ROUTE_ADMIN_PRODUCTS}/${product.id}`);
                            }}
                          />
                          <ContextMenuItem
                            label={"Edit"}
                            onClick={() => {
                              console.log("Edit product", product.id);
                              navigate(`${ROUTE_ADMIN_PRODUCTS}/${product.id}/edit`);
                            }}
                          />
                          <ContextMenuItem
                            label={"Delete"}
                            onClick={() => {
                              console.log("Delete product", product.id);
                              if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
                                // Add delete logic here
                              }
                            }}
                          />
                        </ContextMenu>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-medium mb-2">No products found</div>
                        <div className="text-sm">Try adjusting your search or filter criteria</div>
                      </div>
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing { (params?.page ?? 0) * (params?.perPage ?? 1) + 1 } - { Math.min((params?.page ?? 0) * (params?.perPage ?? 1) + (params?.perPage ?? 1), total) }
          {" "}of{" "}
          {total} results
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              className="rounded border border-gray-300 bg-white px-2 text-sm"
              value={params?.perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>Page {page+1}</span>
            <div className="flex gap-1">
              <button
                className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                Previous
              </button>
              <button
                className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={
                  Math.round(total / (params?.perPage ?? 1)) <= ((params?.page ?? 0) + 1)
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminContentLayout>
  );
};

export default ProductManagement;