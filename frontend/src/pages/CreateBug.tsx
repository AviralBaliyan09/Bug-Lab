import {
  FormEvent,
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
  createBug,
} from "../services/bug";

import type {
  BugPriority,
} from "../types/bug";

import toast from "react-hot-toast";

function CreateBug() {
  const navigate = useNavigate();

  const {
    user,
    loading,
  } = useAuth();


  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<BugPriority>("MEDIUM");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading...
          </p>

        </div>
      </div>
    );
  }


  if (
    !user ||
    (
      user.role !== "ADMIN" &&
      user.role !== "DEVELOPER"
    )
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");


    try {
      const bug =
        await createBug({
          title,
          description,
          priority,
        });

        toast.success("Bug created successfully!")
      navigate(
        `/bugs/${bug.id}`
      );

    } catch {
      toast.error("Failed to create bug.")
      setError(
        "Failed to create bug. Please try again."
      );

    } finally {
      setSaving(false);
    }
  }


  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* Background decoration */}

      <div className="pointer-events-none fixed -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="pointer-events-none fixed -bottom-32 -right-32 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl" />


      <main className="relative mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-3 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-indigo-500" />

              <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                Issue Management
              </span>

            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Create New Bug
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Report an issue with enough detail for the development team to investigate and resolve it.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            ← Dashboard
          </button>

        </div>


        {/* USER INFO */}

        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-black text-indigo-600">
            {user.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reporting as
            </p>

            <p className="text-sm font-bold text-slate-800">
              {user.name}
              <span className="ml-2 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-black text-indigo-700">
                {user.role}
              </span>
            </p>

          </div>

        </div>


        {/* FORM CARD */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">

          {/* Card header */}

          <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5 sm:px-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-200">
                +
              </div>

              <div>

                <h2 className="font-black text-slate-900">
                  Issue Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Provide the details of the bug below.
                </p>

              </div>

            </div>

          </div>


          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8"
          >

            {/* Error */}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">

                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs">
                  !
                </span>

                <span>
                  {error}
                </span>

              </div>
            )}


            {/* TITLE */}

            <div>

              <label
                htmlFor="bug-title"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Bug Title
              </label>

              <input
                id="bug-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. Login button is not working"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

              <p className="mt-2 text-xs text-slate-400">
                Keep the title short and describe the main problem.
              </p>

            </div>


            {/* DESCRIPTION */}

            <div>

              <label
                htmlFor="bug-description"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="bug-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe what happened, what you expected, and how the issue can be reproduced..."
                rows={8}
                required
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

              <p className="mt-2 text-xs text-slate-400">
                Include reproduction steps or relevant context when possible.
              </p>

            </div>


            {/* PRIORITY */}

            <div>

              <label
                htmlFor="bug-priority"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Priority
              </label>

              <div className="relative">

                <select
                  id="bug-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value as BugPriority
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
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

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  ▼
                </span>

              </div>

            </div>


            {/* DIVIDER */}

            <div className="h-px bg-slate-100" />


            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard")
                }
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Creating Bug..."
                  : "Create Bug →"}
              </button>

            </div>

          </form>

        </section>


        {/* FOOTER */}

        <p className="mt-6 text-center text-xs text-slate-400">
          BugLab · Issue Management System
        </p>

      </main>

    </div>
  );
}


export default CreateBug;