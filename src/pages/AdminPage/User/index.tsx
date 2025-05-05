import { useState } from "react";
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

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
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
    perPage: 10,
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User management</h1>
        <p className="text-sm text-gray-500">
          Manage user accounts, roles, and access permissions efficiently.
        </p>
      </div>

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
      <div className="overflow-hidden rounded-lg bg-white shadow">
        {isLoading ? (
          <Loading entityName="users"></Loading>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left"></th>
                <th className="px-4 py-3 text-left">User name</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Created at</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user: User, index) => (
                <tr
                  key={user.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateUser(user);
                  }}
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="flex items-center gap-2 px-4 py-3">
                    <img
                      src={user?.avatar || DEFAULT_AVATAR_URL}
                      alt="avatar"
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="space-x-1 px-4 py-3">
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
                  <td className="px-4 py-3 text-center">{user?.location}</td>
                  <td className="px-4 py-3 text-center">
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

                    <ConfirmDeleteDialog
                      open={openConfirmDeleteUserDialog}
                      onClose={() => setOpenConfirmDeleteUserDialog(false)}
                      onConfirm={handleConfirmDelete}
                      entityName="user"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div>1–10 of {total}</div>
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
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            ‹
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={users.length < 10}
          >
            ›
          </button>
        </div>
      </div>

      {/* User Dialog */}
      <UserDialog
        open={openUserDetailDialog}
        onClose={() => setOpenUserDetailDialog(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;
