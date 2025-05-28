import React, { useState, useRef, useEffect } from "react";
import { MultiSelect } from "@mantine/core";
import { BsThreeDots } from "react-icons/bs";
import "@mantine/core/styles.css";
import useUsers from "../../../hooks/useUsers";
import Loading from "../../../components/Loading";
import { toast } from "react-toastify";
import { DEFAULT_AVATAR_URL } from "../../../constants/properties";
import { GetProductsRequestParam, Product, ProductStatus } from "../../../types/Products.ts";
import useAdminProduct from "../../../hooks/useAdminProduct.tsx";
import ContextMenuItem from "../../../components/ContextMenu/ContextMenuItem.tsx";
import ContextMenu from "../../../components/ContextMenu";
import { E_SkincareConcern, SkincareConcern } from "../../../types/SkincareConcern.ts";
import StarRating from "../../../components/StarRating";
import { Link, useNavigate } from "react-router-dom";
import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import { ROUTE_ADMIN_PRODUCTS } from "../../../constants/routes.ts";

const ProductManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus[]>([]);
  const [openUserDetailDialog, setOpenUserDetailDialog] = useState(false);
  const { createUser, updateUser } = useUsers();
  const {getProducts} = useAdminProduct();
  const {data, isLoading, refetch} = getProducts();
  const headerRef = useRef<HTMLTableElement>(null);
  const bodyRef = useRef<HTMLTableElement>(null);
  const navigate = useNavigate();

  // Đồng bộ chiều rộng các cột giữa header và body
  useEffect(() => {
    const syncColumnWidths = () => {
      if (!headerRef.current || !bodyRef.current) return;

      const headerCells = headerRef.current.querySelectorAll('th');
      const firstRowCells = bodyRef.current.querySelector('tr')?.querySelectorAll('td');

      if (headerCells && firstRowCells && headerCells.length === firstRowCells.length) {
        for (let i = 0; i < headerCells.length; i++) {
          const width = Math.max(headerCells[i].offsetWidth, firstRowCells[i].offsetWidth);
          headerCells[i].style.width = `${width}px`;
          if (firstRowCells[i]) firstRowCells[i].style.width = `${width}px`;
        }
      }
    };

    syncColumnWidths();
    window.addEventListener('resize', syncColumnWidths);

    return () => {
      window.removeEventListener('resize', syncColumnWidths);
    };
  }, [data?.data]);

  const params: GetProductsRequestParam = {
    search,
    status: selectedStatus,
    page,
    perPage: 10,
  };

  const products = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleSaveUser = async (userData: any) => { // Sử dụng any thay cho UserFormData
    const { isCreate, ...user } = userData;
    if (userData.isCreate) {
      createUser.mutate(userData, {
        onSuccess: (_data) => {
          toast.success("Create user successfully!");
          refetch();
        },
        onError: (error) => {
          toast.error(`Oops! Something went wrong:${error.message}`);
        },
      });
    } else {
      updateUser.mutate(userData, {
        onSuccess: (_data) => {
          toast.success("Update user successfully!");
          refetch();
        },
        onError: (error) => {
          toast.error(`Oops! Something went wrong:${error.message}`);
        },
      });
    }
    setOpenUserDetailDialog(false);
  };

  const ProductTableColGroup = () => (
    <colgroup>
      <col style={{ width: '5%' }} />
      <col style={{ width: '25%' }} />
      <col style={{ width: '15%' }} />
      <col style={{ width: '20%' }} />
      <col style={{ width: '15%' }} />
      <col style={{ width: '15%' }} />
      <col style={{ width: '5%' }} />
    </colgroup>
  );

  const handleRowClick = (productId: string) => {
    console.log("Row clicked", productId);
    navigate(`${ROUTE_ADMIN_PRODUCTS}/${productId}`);
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
                { value: ProductStatus.ACTIVE, label: "Active" },
                { value: ProductStatus.DRAF, label: "Draf" },
                { value: ProductStatus.ACHIVE, label: "Achive" },
              ]}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value as ProductStatus[])}
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
          </div>
        </div>

        {/* Table với cách xử lý đặc biệt để giữ các cột căn chỉnh */}
        <div className="rounded-lg bg-white shadow">
          {isLoading ? (
            <Loading entityName="Products"></Loading>
          ) : (
            <div className="overflow-hidden">
              {/* Container cho bảng */}
              <div className="w-full">
                {/* Table Header */}
                <div className="sticky top-0 z-10 w-full">
                  <table ref={headerRef} className="min-w-full table-fixed divide-y divide-gray-200">
                    <ProductTableColGroup/>
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skin Concerns</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory (Count)</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rattings</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                    </thead>
                  </table>
                </div>
                {/* Table Body - Scrollable Container */}
                <div className="overflow-y-auto max-h-[calc(100vh-400px)] min-h-[300px]">
                  <table ref={bodyRef} className="min-w-full table-fixed divide-y divide-gray-200">
                    <ProductTableColGroup/>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product: Product, index) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50"
                        onClick={() => handleRowClick(product.id)}
                      >
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
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

                        {/*{*/}
                        {/*  product?.skincareConcerns?.map(*/}
                        {/*    (concern, idx) => (*/}
                        {/*      <td key={idx} className="px-4 py-3 text-sm">*/}
                        {/*        {SkincareConcern.getLabel(concern as E_SkincareConcern)}*/}
                        {/*      </td>*/}
                        {/*  )*/}
                        {/*  )*/}
                        {/*}*/}
                        <td className="px-4 py-3 text-sm text-center">{0}</td>
                        <td className="px-4 py-3 text-sm text-center">{0}</td>
                        <td className="px-4 py-3 text-sm text-center">{product.sold || 0}</td>
                        <td className="px-4 py-3 text-sm text-center"><StarRating rating={product?.averageRating || 0} /></td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex justify-center">
                            <ContextMenu icon={<BsThreeDots size={24} />}>
                              <ContextMenuItem
                                label={"Details"}
                                onClick={() => {
                                  console.log("View details", product.id);
                                }}
                              />
                              <ContextMenuItem
                                label={"Delete"}
                                onClick={() => {
                                  console.log("Delete product", product.id);
                                }}
                              />
                            </ContextMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div>1–{Math.min(products.length, params.perPage)} of {total}</div>
          <div className="flex items-center gap-2">
            Rows per page:
            <select
              className="rounded border px-2 py-1 text-sm"
              value={params.perPage}
              onChange={(e) => {}}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>{page}</span>
            <button
              className="px-2 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              ‹
            </button>
            <button
              className="px-2 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={products.length < 10}
            >
              ›
            </button>
          </div>
        </div>
    </AdminContentLayout>
  );
};

export default ProductManagement;