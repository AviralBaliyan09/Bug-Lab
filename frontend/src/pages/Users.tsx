import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  deleteUser,
  getUsers,
  updateUserRole,
} from "../services/auth";

import type {
  User,
  UserRole,
} from "../types/auth";


function Users() {
  const navigate = useNavigate();

  const {
    user: currentUser,
    loading: authLoading,
  } = useAuth();

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [updatingUserId, setUpdatingUserId] =
    useState<number | null>(null);

  const [deletingUserId, setDeletingUserId] =
    useState<number | null>(null);


  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getUsers(
          search,
          roleFilter
        );

      setUsers(data);

    } catch {
      setError(
        "Failed to load users"
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (
      !currentUser ||
      currentUser.role !== "ADMIN"
    ) {
      return;
    }

    loadUsers();
  }, [
    currentUser,
    search,
    roleFilter,
  ]);


  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500">
          Loading users...
        </p>
      </div>
    );
  }


  if (
    !currentUser ||
    currentUser.role !== "ADMIN"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  async function handleRoleChange(
    userId: number,
    role: UserRole
  ) {
    try {
      setUpdatingUserId(userId);
      setError("");

      const updatedUser =
        await updateUserRole(
          userId,
          role
        );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id
            ? updatedUser
            : user
        )
      );

    } catch {
      setError(
        "Failed to update user role"
      );

    } finally {
      setUpdatingUserId(null);
    }
  }


  async function handleDelete(
    user: User
  ) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${user.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUserId(user.id);
      setError("");

      await deleteUser(
        user.id
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (currentUser) =>
            currentUser.id !== user.id
        )
      );

    } catch {
      setError(
        "Failed to delete user"
      );

    } finally {
      setDeletingUserId(null);
    }
  }


  function getRoleBadgeClass(
    role: UserRole
  ) {
    if (role === "ADMIN") {
      return "bg-violet-100 text-violet-700";
    }

    if (role === "DEVELOPER") {
      return "bg-indigo-100 text-indigo-700";
    }

    return "bg-slate-100 text-slate-600";
  }


  return (
    <div className="min-h-screen bg-slate-50">

      <div className="flex min-h-screen">

        {/* Sidebar */}

        <aside className="hidden w-64 shrink-0 bg-slate-950 px-5 py-6 text-white lg:flex lg:flex-col">

          <div className="mb-10">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-black">
                B
              </div>

              <div>
                <p className="font-black tracking-wide">
                  BUGLAB
                </p>

                <p className="text-xs text-slate-500">
                  Issue Management
                </p>
              </div>

            </div>

          </div>


          <nav className="space-y-2">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span>⌂</span>
              Overview
            </button>


            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span>◈</span>
              Issues
            </button>


            <button
              className="flex w-full items-center gap-3 rounded-xl bg-indigo-600 px-4 py-3 text-left text-sm font-semibold text-white shadow-lg shadow-indigo-950/30"
            >
              <span>♙</span>
              Users
            </button>

          </nav>


          <div className="mt-auto">

            <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">

              <p className="text-xs text-slate-500">
                Signed in as
              </p>

              <p className="mt-1 truncate text-sm font-bold">
                {currentUser.name}
              </p>

              <p className="mt-1 text-xs text-indigo-400">
                Administrator
              </p>

            </div>

            <button
              onClick={() => {
                localStorage.removeItem(
                  "access_token"
                );

                navigate("/login");
              }}
              className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              Logout
            </button>

          </div>

        </aside>


        {/* Main */}

        <main className="min-w-0 flex-1">

          <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">

            {/* Header */}

            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                  Administration
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  User Management
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Manage workspace users and their access roles.
                </p>

              </div>


              <button
                onClick={() =>
                  navigate("/dashboard")
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
              >
                ← Back to Dashboard
              </button>

            </div>


            {/* Error */}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}


            {/* Filters */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="grid gap-4 md:grid-cols-[1fr_220px]">

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Search Users
                  </label>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search by name or email..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Role
                  </label>

                  <select
                    value={roleFilter}
                    onChange={(event) =>
                      setRoleFilter(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  >
                    <option value="ALL">
                      All Roles
                    </option>

                    <option value="ADMIN">
                      Admin
                    </option>

                    <option value="DEVELOPER">
                      Developer
                    </option>

                    <option value="VIEWER">
                      Viewer
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* User Count */}

            <div className="mb-4 flex items-center justify-between">

              <p className="text-sm font-semibold text-slate-600">
                {users.length}{" "}
                {users.length === 1
                  ? "user"
                  : "users"}{" "}
                found
              </p>

            </div>


            {/* Table */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {loading ? (
                <div className="flex min-h-64 items-center justify-center">
                  <p className="text-sm font-medium text-slate-500">
                    Loading users...
                  </p>
                </div>
              ) : users.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                    ♙
                  </div>

                  <h2 className="font-black text-slate-800">
                    No users found
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or role filter.
                  </p>

                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[760px]">

                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80">

                        <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                          User
                        </th>

                        <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                          Email
                        </th>

                        <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                          Role
                        </th>

                        <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">
                          Actions
                        </th>

                      </tr>
                    </thead>


                    <tbody className="divide-y divide-slate-100">

                      {users.map((user) => (

                        <tr
                          key={user.id}
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-black text-indigo-600">
                                {user.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>

                                <p className="text-sm font-bold text-slate-800">
                                  {user.name}
                                </p>

                                <p className="text-xs text-slate-400">
                                  ID #{user.id}
                                </p>

                              </div>

                            </div>

                          </td>


                          <td className="px-6 py-5">

                            <p className="text-sm text-slate-600">
                              {user.email}
                            </p>

                          </td>


                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-black ${getRoleBadgeClass(
                                  user.role
                                )}`}
                              >
                                {user.role}
                              </span>


                              {user.id !==
                                currentUser.id && (
                                <select
                                  value={user.role}
                                  disabled={
                                    updatingUserId ===
                                    user.id
                                  }
                                  onChange={(event) =>
                                    handleRoleChange(
                                      user.id,
                                      event.target.value as UserRole
                                    )
                                  }
                                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none focus:border-indigo-400"
                                >
                                  <option value="ADMIN">
                                    Admin
                                  </option>

                                  <option value="DEVELOPER">
                                    Developer
                                  </option>

                                  <option value="VIEWER">
                                    Viewer
                                  </option>

                                </select>
                              )}

                            </div>

                          </td>


                          <td className="px-6 py-5 text-right">

                            {user.id ===
                            currentUser.id ? (
                              <span className="text-xs font-semibold text-slate-400">
                                Current account
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  handleDelete(
                                    user
                                  )
                                }
                                disabled={
                                  deletingUserId ===
                                  user.id
                                }
                                className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingUserId ===
                                user.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            )}

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>
              )}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}


export default Users;