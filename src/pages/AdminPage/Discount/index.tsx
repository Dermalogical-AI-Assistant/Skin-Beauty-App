import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import { MultiSelect } from "@mantine/core";
import { Product, ProductStatus } from "../../../types/Products.ts";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import { DEFAULT_AVATAR_URL } from "../../../constants/properties.ts";
import StarRating from "../../../components/StarRating";
import { convertDate } from "../../../utils/date.ts";
import ContextMenu from "../../../components/ContextMenu";
import { BsThreeDots } from "react-icons/bs";
import ContextMenuItem from "../../../components/ContextMenu/ContextMenuItem.tsx";
import React, { useEffect } from "react";
import useDiscount from "../../../hooks/useDisscount.ts";
import { Discount } from "../../../types/Discount.ts";
import { ROUTE_ADMIN_DISCOUNTS, ROUTE_ADMIN_PRODUCTS } from "../../../constants/routes.ts";

const DiscountPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<ProductStatus[]>([]);
  const [perPage, setPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);

  const {getDiscounts} = useDiscount();
  const {data: discounts, isLoading: isDiscountsLoading, refetch: refreshDiscounts} = getDiscounts({
    search,
    status: selectedStatus,
    page,
    perPage: perPage,
  });

  useEffect(() => {
    console.log("Discounts data:", discounts);
  }, [discounts])

  const handleRowClick = (discountId: string) => {
    console.log("Row clicked", discountId);
    navigate(`${ROUTE_ADMIN_DISCOUNTS}/${discountId}`);
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(0)
    refreshDiscounts();
  }

  return (
    <AdminContentLayout
      title={"Discounts"}
      subtitle={"Manage your products effectively"}
    >
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
            to="/admin/discounts/new"

          >
            + Create Discount
          </Link>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        {isDiscountsLoading ? (
          <Loading entityName="Discounts"></Loading>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <colgroup>
                  <col className="w-[5%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[5%]" />
                </colgroup>
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Start Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      End Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Publish Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {discounts?.data.map((discount: Discount, index) => (
                    <tr
                      key={discount.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(discount.id)}
                    >
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {discounts?.meta?.page * discounts?.meta?.perPage + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {discount.title}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            discount.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : discount.status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {discount.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {convertDate(discount.startTime)}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {convertDate(discount.endTime)}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {convertDate(discount.publishDate)}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {convertDate(discount.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                        <div className="flex justify-center">
                          <ContextMenu icon={<BsThreeDots size={16} />}>
                            <ContextMenuItem
                              label={"Details"}
                              onClick={() => {
                                console.log("View details", discount.id);
                              }}
                            />
                            <ContextMenuItem
                              label={"Delete"}
                              onClick={() => {
                                console.log("Delete discount", discount.id);
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
        )}
      </div>
      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing { discounts?.meta?.page * discounts?.meta?.perPage + 1} - {Math.min(discounts?.meta?.page * discounts?.meta?.perPage + discounts?.meta?.perPage, discounts?.meta?.total)}
          {" "}of{" "}
          {discounts?.meta?.total} results
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              className="rounded border border-gray-300 bg-white px-2 text-sm"
              value={discounts?.meta?.perPage}
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
                  Math.round(
                    discounts?.meta?.total / discounts?.meta?.perPage,
                  ) <=
                  discounts?.meta?.page +1
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
}

export default DiscountPage;