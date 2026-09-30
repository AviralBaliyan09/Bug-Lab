import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  getBug,
  updateBug,
  deleteBug,
  updateBugStatus,
  updateBugPriority,
  assignBug,
} from "../services/bug";

import {
  getUsers,
} from "../services/auth";

import type {
  Bug,
  BugPriority,
  BugStatus,
} from "../types/bug";

import type {
  User,
} from "../types/auth";
import toast from "react-hot-toast";


function BugDetails() {
  const navigate = useNavigate();

  const { bugId } = useParams();

  const {
    user: currentUser,
  } = useAuth();


  const [bug, setBug] =
    useState<Bug | null>(null);

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [editing, setEditing] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [assigning, setAssigning] =
    useState(false);


  // ==================================================
  // LOAD BUG
  // ==================================================

  useEffect(() => {
    async function loadBug() {
      try {
        if (!bugId) {
          setError("Bug ID is missing");
          return;
        }

        const bugData =
          await getBug(Number(bugId));

        setBug(bugData);

        setTitle(
          bugData.title
        );

        setDescription(
          bugData.description
        );

      } catch {
        setError(
          "Failed to load bug"
        );

      } finally {
        setLoading(false);
      }
    }

    loadBug();
  }, [bugId]);


  // ==================================================
  // LOAD USERS
  // ADMIN ONLY
  // ==================================================

  useEffect(() => {
    async function loadUsers() {
      if (
        !currentUser ||
        currentUser.role !== "ADMIN"
      ) {
        return;
      }

      try {
        const userList =
          await getUsers();

        setUsers(userList);

      } catch {
        setError(
          "Failed to load users"
        );
      }
    }

    loadUsers();
  }, [currentUser]);


  // ==================================================
  // PERMISSIONS
  // ==================================================

  const isAdmin =
    currentUser?.role === "ADMIN";

  const isAssignedDeveloper =
    currentUser?.role === "DEVELOPER" &&
    bug?.assigned_to === currentUser.id;

  const canEdit =
    isAdmin;

  const canDelete =
    isAdmin;

  const canAssign =
    isAdmin;

  const canChangeStatus =
    isAdmin ||
    isAssignedDeveloper;

  const canChangePriority =
    isAdmin ||
    isAssignedDeveloper;


  // ==================================================
  // UPDATE BUG
  // ==================================================

  async function handleUpdate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!bugId) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const updatedBug =
        await updateBug(
          Number(bugId),
          {
            title,
            description,
          }
        );
      toast.success("Bug updated successfully!")
      setBug(updatedBug);
      setEditing(false);

    } catch {
      toast.error("Failed to update bug.")
      setError(
        "Failed to update bug"
      );

    } finally {
      setSaving(false);
    }
  }


  // ==================================================
  // DELETE BUG
  // ==================================================

  async function handleDelete() {
    if (!bugId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this bug?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBug(
        Number(bugId)
      );
      toast.success("Bug deleted successfully!")
      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch {
      toast.error("Failed to delete bug.")
      setError(
        "Failed to delete bug"
      );
    }
  }


  // ==================================================
  // UPDATE STATUS
  // ==================================================

  async function handleStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!bugId || !bug) {
      return;
    }

    const newStatus =
      event.target.value as BugStatus;

    setError("");

    try {
      const updatedBug =
        await updateBugStatus(
          Number(bugId),
          newStatus
        );
      toast.success(
        "Status updated successfully!"
      );
      setBug(updatedBug);

    } catch {
      toast.error("Failed to update status.")
      setError(
        "Failed to update status"
      );
    }
  }


  // ==================================================
  // UPDATE PRIORITY
  // ==================================================

  async function handlePriorityChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!bugId || !bug) {
      return;
    }

    const newPriority =
      event.target.value as BugPriority;

    setError("");

    try {
      const updatedBug =
        await updateBugPriority(
          Number(bugId),
          newPriority
        );
      toast.success("priority updated successfully!")
      setBug(updatedBug);

    } catch {
      toast.error("Failed to update priority.")
      setError(
        "Failed to update priority"
      );
    }
  }


  // ==================================================
  // ASSIGN BUG
  // ==================================================

  async function handleAssignChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!bugId || !bug) {
      return;
    }

    const value =
      event.target.value;

    const assignedTo =
      value === ""
        ? null
        : Number(value);

    setAssigning(true);
    setError("");

    try {
      const updatedBug =
        await assignBug(
          Number(bugId),
          assignedTo
        );
      toast.success("Bug assigned successfully!")
      setBug(updatedBug);

    } catch {
      toast.error("Failed to assign bug.")
      setError(
        "Failed to assign bug"
      );

    } finally {
      setAssigning(false);
    }
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading bug details...
          </p>

        </div>

      </div>
    );
  }


  // ==================================================
  // ERROR / NOT FOUND
  // ==================================================

  if (error && !bug) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5">

        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-xl font-black text-red-500">
            !
          </div>

          <h2 className="text-xl font-black text-slate-900">
            Unable to load bug
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }


  if (!bug) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5">

        <div className="text-center">

          <h2 className="text-2xl font-black text-slate-900">
            Bug not found
          </h2>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }


  // ==================================================
  // HELPERS
  // ==================================================

  function getStatusClass(
    status: BugStatus
  ) {
    if (status === "OPEN") {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }

    if (status === "IN_PROGRESS") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    if (status === "RESOLVED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    return "bg-slate-100 text-slate-600 border-slate-200";
  }


  function getPriorityClass(
    priority: BugPriority
  ) {
    if (priority === "CRITICAL") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    if (priority === "HIGH") {
      return "bg-orange-50 text-orange-700 border-orange-100";
    }

    if (priority === "MEDIUM") {
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    }

    return "bg-slate-100 text-slate-600 border-slate-200";
  }


  const assignedUser =
    users.find(
      (user) =>
        user.id === bug.assigned_to
    );


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* Background */}

      <div className="pointer-events-none fixed -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="pointer-events-none fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-100/40 blur-3xl" />


      <main className="relative mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:px-10">

        {/* TOP BAR */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="mb-3 text-sm font-bold text-slate-400 transition hover:text-indigo-600"
            >
              ← Back to Dashboard
            </button>

            <div className="flex items-center gap-3">

              <span className="rounded-lg bg-slate-200 px-2.5 py-1 text-xs font-black text-slate-500">
                BUG #{bug.id}
              </span>

              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${getStatusClass(
                  bug.status
                )}`}
              >
                {bug.status}
              </span>

            </div>

          </div>


          {isAdmin && !editing && (
            <div className="flex gap-2">

              <button
                onClick={() =>
                  setEditing(true)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Edit Bug
              </button>

              <button
                onClick={handleDelete}
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                Delete
              </button>

            </div>
          )}

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}


        {!editing ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

            {/* MAIN CONTENT */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">

              <div className="border-b border-slate-100 px-6 py-6 sm:px-8">

                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                  Issue Details
                </p>

                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {bug.title}
                </h1>

              </div>


              <div className="px-6 py-7 sm:px-8">

                <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  Description
                </p>

                <div className="rounded-2xl bg-slate-50 p-5">

                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {bug.description}
                  </p>

                </div>

              </div>

            </section>


            {/* SIDE PANEL */}

            <aside className="space-y-5">

              {/* Status */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  Status
                </p>


                {canChangeStatus ? (
                  <select
                    value={bug.status}
                    onChange={
                      handleStatusChange
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  >

                    <option value="OPEN">
                      Open
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>

                    <option value="RESOLVED">
                      Resolved
                    </option>

                    <option value="CLOSED">
                      Closed
                    </option>

                  </select>
                ) : (
                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-black ${getStatusClass(
                      bug.status
                    )}`}
                  >
                    {bug.status}
                  </span>
                )}

              </div>


              {/* Priority */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  Priority
                </p>


                {canChangePriority ? (
                  <select
                    value={bug.priority}
                    onChange={
                      handlePriorityChange
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  >

                    <option value="LOW">
                      Low
                    </option>

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="HIGH">
                      High
                    </option>

                    <option value="CRITICAL">
                      Critical
                    </option>

                  </select>
                ) : (
                  <span
                    className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-black ${getPriorityClass(
                      bug.priority
                    )}`}
                  >
                    {bug.priority}
                  </span>
                )}

              </div>


              {/* Assignment */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  Assigned Developer
                </p>


                {canAssign ? (
                  <select
                    value={
                      bug.assigned_to ?? ""
                    }
                    onChange={
                      handleAssignChange
                    }
                    disabled={assigning}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:opacity-60"
                  >

                    <option value="">
                      Not assigned
                    </option>

                    {users.map(
                      (user) => (
                        <option
                          key={user.id}
                          value={user.id}
                        >
                          {user.name} (
                          {user.role}
                          )
                        </option>
                      )
                    )}

                  </select>
                ) : (
                  <div className="rounded-xl bg-slate-50 px-4 py-3">

                    <p className="text-sm font-bold text-slate-700">
                      {assignedUser
                        ? assignedUser.name
                        : bug.assigned_to
                          ? `User #${bug.assigned_to}`
                          : "Not assigned"}
                    </p>

                  </div>
                )}


                {assigning && (
                  <p className="mt-2 text-xs font-semibold text-indigo-500">
                    Updating assignment...
                  </p>
                )}

              </div>


              {/* Reporter */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
                  Reporter
                </p>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-black text-indigo-600">
                    #{bug.reporter_id}
                  </div>

                  <div>

                    <p className="text-sm font-bold text-slate-700">
                      User #{bug.reporter_id}
                    </p>

                    <p className="text-xs text-slate-400">
                      Bug reporter
                    </p>

                  </div>

                </div>

              </div>

            </aside>

          </div>
        ) : (

          /* ==================================================
             EDIT MODE
             ================================================== */

          <section className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">

            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5 sm:px-8">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                Administrator
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Edit Bug
              </h2>

            </div>


            <form
              onSubmit={handleUpdate}
              className="space-y-6 p-6 sm:p-8"
            >

              <div>

                <label
                  htmlFor="edit-title"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Title
                </label>

                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />

              </div>


              <div>

                <label
                  htmlFor="edit-description"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="edit-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  required
                  rows={9}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />

              </div>


              <div className="h-px bg-slate-100" />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setEditing(false)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes →"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* FOOTER */}

        <p className="mt-8 text-center text-xs text-slate-400">
          BugLab · Issue Management System
        </p>

      </main>

    </div>
  );
}


export default BugDetails;