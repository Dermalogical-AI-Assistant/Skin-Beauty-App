import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MultiSelect } from "@mantine/core";
import "@mantine/core/styles.css";
import useUsers from "../../../hooks/useUsers";
import {
  Gender,
  GetUsersRequestParam,
  RoleType,
  User,
  UserFormData,
} from "../../../types/Users";
import { convertDate } from "../../../utils/date";
import Loading from "../../../components/Loading";
import UserDialog from "../../../components/UserDialog";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { DEFAULT_AVATAR_URL } from "../../../constants/properties";
import ConfirmDeleteDialog from "../../../components/ConfirmDeleteDialog";
import AdminContentLayout from "../../../layouts/Admin/ContentLayout.tsx";

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [selectedGenders, setSelectedGenders] = useState<Gender[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openUserDetailDialog, setOpenUserDetailDialog] = useState(false);
  const [openConfirmDeleteUserDialog, setOpenConfirmDeleteUserDialog] =
    useState(false);
  const { getUsers, createUser, updateUser, deleteUser } = useUsers();

  const params: GetUsersRequestParam = {
    page,
    perPage: perPage,
    search,
    roleTypes: selectedRoles,
    genders: selectedGenders,
  };

  const { data, isLoading, refetch } = getUsers(params);
  const users = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleDeleteUser = (
    userId: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenConfirmDeleteUserDialog(true);
    setSelectedUserId(userId);
  };

  const handleConfirmDelete = () => {
    if (!selectedUserId) return;
    deleteUser.mutate(selectedUserId, {
      onSuccess: () => {
        toast.success("Delete user successfully!");
        refetch();
      },
      onError: (err: any) => {
        toast.error(`Failed to delete user: ${err.message}`);
      },
    });
    setOpenConfirmDeleteUserDialog(false);
  };

  const handleUpdateUser = (user: User) => {
    setSelectedUser(user);
    setOpenUserDetailDialog(true);
  };


  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
    refetch();
  };

  const handleCreateUser = () => {
    setOpenUserDetailDialog(true);
  };

  const handleSaveUser = async (userData: UserFormData) => {
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
        onSuccess: (data) => {
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

  return (
      <AdminContentLayout title={"User management"} subtitle="Manage user accounts, roles, and access permissions efficiently.">

      {/* Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">All users</div>
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
              { value: RoleType.ADMIN, label: "Admin" },
              { value: RoleType.USER, label: "User" },
            ]}
            value={selectedRoles}
            onChange={(value) => setSelectedRoles(value as RoleType[])}
            placeholder="Select role(s)"
            className="min-w-[160px]"
            size="xs"
          />

          <MultiSelect
            data={[
              { value: Gender.MALE, label: "Male" },
              { value: Gender.FEMALE, label: "Female" },
              { value: Gender.OTHER, label: "Other" },
            ]}
            value={selectedGenders}
            onChange={(value) => setSelectedGenders(value as Gender[])}
            placeholder="Select gender(s)"
            className="min-w-[160px]"
            size="xs"
          />

          <Button
            onClick={handleCreateUser}
            variant="contained"
            sx={{
              backgroundColor: "#45556C",
              "&:hover": {
                backgroundColor: "#37465A",
              },
              fontWeight: 500,
              fontSize: "0.75rem",
              padding: "1px 15px",
              borderRadius: "6px",
              textTransform: "none",
              color: "#fff",
              boxShadow: "none",
            }}
          >
            + Add user
          </Button>
        </div>
      </div>
        {/* Table */}
        <div className="rounded-lg bg-white/10 shadow overflow-hidden">
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created at</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                  </thead>
                  <tbody className="bg-white/20 divide-y divide-gray-200">
                  {users.map((user: User, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer text-sm "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateUser(user);
                      }}
                    >
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        { ((params?.page ?? 1) - 1) * (params?.perPage ?? 1) + index + 1 }
                      </td>
                      <td className="flex items-center gap-2 px-4 py-3">
                          <div className="flex items-center">
                            <img
                              src={user?.avatar || DEFAULT_AVATAR_URL}
                              alt="avatar"
                              className="h-8 w-8 rounded-full mr-2"
                            />
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-left text-xs font-semibold ${
                            user.role === RoleType.ADMIN
                              ? "bg-green-100 text-green-700"
                              : user.role === RoleType.USER
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">{user.gender}</td>
                      <td className="px-4 py-3">{user?.location|| "N/A"}</td>
                      <td className="px-4 py-3">
                        {convertDate(user.createdAt)}
                      </td>
                      <td className="flex justify-start px-4 py-3 text-right">
                        <button
                          className="p-2 text-blue-400 hover:text-blue-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateUser(user);
                          }}
                        >
                          <FaEdit className="text-lg" /> {/* Edit Icon */}
                        </button>
                        <button
                          className="p-2 text-red-400 hover:text-red-200"
                          onClick={(e) => handleDeleteUser(user.id, e)}
                        >
                          <FaTrash className="text-lg" /> {/* Trash Icon */}
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
                <ConfirmDeleteDialog
                  open={openConfirmDeleteUserDialog}
                  onClose={() => setOpenConfirmDeleteUserDialog(false)}
                  onConfirm={handleConfirmDelete}
                  entityName="user"
                />
              </div>
            </div>
          )}
        </div>


        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing { (params?.page && params?.page > 1 ? params?.page : 0) * (params?.perPage ?? 1)+1} - { Math.min((params?.page && params?.page > 1 ? params?.page : 0) * (params?.perPage ?? 1) + (params?.perPage ?? 1), total) }
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
              <span>Page {page}</span>
              <div className="flex gap-1">
                <button
                  className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setPage(page-1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button
                  className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setPage(page+1)}
                  disabled={page >= Math.ceil(total / (params?.perPage||1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      {/* User Dialog */}
      <UserDialog
        open={openUserDetailDialog}
        onClose={() => setOpenUserDetailDialog(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
      </AdminContentLayout>
  );
};

export default UserManagement;
