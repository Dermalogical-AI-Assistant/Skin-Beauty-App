import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";
import { MultiSelect } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import { convertDate } from "../../../utils/date.ts";
import ContextMenu from "../../../components/ContextMenu";
import { BsThreeDots } from "react-icons/bs";
import ContextMenuItem from "../../../components/ContextMenu/ContextMenuItem.tsx";
import React, { useEffect, useState } from "react";
import useDiscount from "../../../hooks/useDisscount.ts";
import { Discount, E_DisscountStatus } from "../../../types/Discount.ts";
import { ROUTE_ADMIN_DISCOUNTS } from "../../../constants/routes.ts";
import { E_SkincareConcern } from "../../../types/SkincareConcern.ts";
import ConfirmDeleteDialog from "../../../components/ConfirmDeleteDialog";
import { toast } from "react-toastify";

const DiscountPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [selectedStatus, setSelectedStatus] = useState<E_DisscountStatus[]>([]);
  const [perPage, setPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [skincareConcerns, setSkincareConcerns] = useState<E_SkincareConcern[]>([]);
  const [openConfirmDeleteDiscountDialog, setOpenConfirmDeleteDiscountDialog] = useState(false);
  const [deleteDiscountId, setDeleteDiscountId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDiscountDialog(false);
    setDeleteDiscountId(null);
  };


  const handleOpenConfirmDeleteDialog = () => {
    if (deleteDiscountId) {
      setIsDeleting(true);
      onDeleteDiscount(deleteDiscountId, () => {
        setOpenConfirmDeleteDiscountDialog(false);
        setDeleteDiscountId(null);
        refreshDiscounts();
        setIsDeleting(false);
        toast.success("Product deleted successfully.");
      }, () => {
        setOpenConfirmDeleteDiscountDialog(false);
        setDeleteDiscountId(null);
        toast.error("Failed to delete product. Please try again.");
        setIsDeleting(false);
      });
    }
  }



  const { useFetchDiscounts, onDeleteDiscount } = useDiscount();
  const {
    data: discounts,
    isLoading: isDiscountsLoading,
    refetch: refreshDiscounts,
  } = useFetchDiscounts({
    search,
    statuses: selectedStatus,
    skincareConcerns:skincareConcerns,
    page,
    perPage: perPage,
  });

  useEffect(() => {
    refreshDiscounts();
  }, [search, selectedStatus, page, perPage, refreshDiscounts]);

  useEffect(() => {
    console.log("Discounts data:", discounts);
  }, [discounts]);

  const handleRowClick = (discountId: string) => {
    console.log("Row clicked", discountId);
    navigate(`${ROUTE_ADMIN_DISCOUNTS}/${discountId}`);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(0);
    refreshDiscounts();
  };

  return (
    <AdminContentLayout
      title={"Discounts"}
      subtitle={"Manage your products effectively"}
    >
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">All Discounts</div>
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
              { value: E_DisscountStatus.ACTIVE, label: "Active" },
              { value: E_DisscountStatus.UPCOMING, label: "Upcoming" },
              { value: E_DisscountStatus.EXPIRED, label: "Expired" },
            ]}
            value={selectedStatus}
            onChange={(value) =>
              setSelectedStatus(value as E_DisscountStatus[])
            }
            placeholder="Select Status(s)"
            className="min-w-[160px]"
            size="xs"
          />
          <MultiSelect
            data={[
              { value: E_SkincareConcern.DARK_CIRCLES, label: "Dark Circles" },
              { value: E_SkincareConcern.PIGMENTATION, label: "Pigmentation" },
              { value: E_SkincareConcern.DRY_SKIN, label: "Dry Skin" },
              { value: E_SkincareConcern.DULL_SKIN, label: "Dull Skin" },
              { value: E_SkincareConcern.OILY_SKIN, label: "Oily Skin" },
              { value: E_SkincareConcern.REDNESS, label: "Redness" },
              { value: E_SkincareConcern.SENSITIVE_SKIN, label: "Sensitive Skin" },
              { value: E_SkincareConcern.ACNE_BLEMISHES, label: "Acne & Blemishes" },
              { value: E_SkincareConcern.ANTI_AGING, label: "Anti-Aging" },
              { value: E_SkincareConcern.BLACKHEADS_PORES, label: "Blackheads & Pores" },
              { value: E_SkincareConcern.COMBINATION_SKIN, label: "Combination Skin" },
              { value: E_SkincareConcern.DAMAGED_SKIN_BARRIER, label: "Damaged Skin Barrier" }
            ]}
            value={skincareConcerns}
            onChange={(value) =>
              setSkincareConcerns(value as E_SkincareConcern[])
            }
            placeholder="Select skincare concerns"
            className="min-w-[160px]"
            size="xs"
          />

          <Link
            className="bg-pink-light inline-flex items-center rounded-md px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            to="/admin/discounts/new"
          >
            + Create Discount
          </Link>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-hidden rounded-lg shadow">
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
                <tbody className="divide-y divide-gray-200 bg-white/10">
                  {discounts?.data.map((discount: Discount, index) => (
                    <tr
                      key={discount.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRowClick(discount.id)}
                    >
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {discounts?.meta?.page * discounts?.meta?.perPage +
                          index +
                          1}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {discount.title}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            discount.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : discount.status === "UPCOMING"
                                ? "bg-yellow-100 text-yellow-800"
                                : discount.status === "EXPIRED"
                                  ? "bg-red-100 text-red-800"
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
                        <div
                          className="flex justify-center"
                          onClick={(e) => e.stopPropagation()} // Prevent row click when clicking menu
                        >
                          <ContextMenu icon={<BsThreeDots size={16} />}>
                            <ContextMenuItem
                              label={"Details"}
                              onClick={() => {
                                navigate(`${ROUTE_ADMIN_DISCOUNTS}/${discount.id}`);
                              }}
                            />
                            {
                              (discount.status === E_DisscountStatus.ACTIVE || discount.status === E_DisscountStatus.UPCOMING)  && (
                                <ContextMenuItem
                                  label={"Edit"}
                                  onClick={() => {
                                    navigate(`${ROUTE_ADMIN_DISCOUNTS}/${discount.id}?edit=true`);
                                  }}
                                />
                              )
                            }
                            <ContextMenuItem
                              label={"Delete"}
                              onClick={() => {
                                  setDeleteDiscountId(discount.id);
                                  setOpenConfirmDeleteDiscountDialog(true);
                                }
                              }
                            />
                          </ContextMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ConfirmDeleteDialog
                open={openConfirmDeleteDiscountDialog}
                onClose={handleCloseConfirmDeleteDialog}
                onConfirm={handleOpenConfirmDeleteDialog}
                entityName="Discount"
                confirmText="Delete"
                cancelText="Cancel"
                isDeleting={isDeleting}
              />
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing{" "}
          {(discounts?.meta?.page ?? 0) * (discounts?.meta?.perPage ?? 0) + 1} -{" "}
          {Math.min(
            (discounts?.meta?.page ?? 0) * (discounts?.meta?.perPage ?? 0) +
              (discounts?.meta?.perPage ?? 0),
            discounts?.meta?.total ?? 0,
          )}{" "}
          of {discounts?.meta?.total} results
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
            <span>Page {page + 1}</span>
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
                    (discounts?.meta?.total ?? 0) /
                      (discounts?.meta?.perPage ?? 1),
                  ) <=
                  (discounts?.meta?.page ?? 0) + 1
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

export default DiscountPage;