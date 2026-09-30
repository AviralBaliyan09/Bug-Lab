import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  getBugs,
} from "../services/bug";

import type {
  Bug,
} from "../types/bug";


function DeveloperDashboard() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  const [bugs, setBugs] =
    useState<Bug[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");


  useEffect(() => {
    async function loadBugs() {
      try {
        setLoading(true);

        const bugList =
          await getBugs();

        setBugs(bugList);

      } catch {
        setError(
          "Failed to load your bugs"
        );
      } finally {
        setLoading(false);
      }
    }

    loadBugs();
  }, []);


  const myBugs =
    bugs.filter(
      (bug) =>
        bug.assigned_to === user?.id
    );


  const filteredBugs =
    myBugs.filter(
      (bug) =>
        bug.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        bug.description
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  const activeBugs =
    myBugs.filter(
      (bug) =>
        bug.status === "IN_PROGRESS"
    ).length;


  const openBugs =
    myBugs.filter(
      (bug) =>
        bug.status === "OPEN"
    ).length;


  const resolvedBugs =
    myBugs.filter(
      (bug) =>
        bug.status === "RESOLVED"
    ).length;


  const criticalBugs =
    myBugs.filter(
      (bug) =>
        bug.priority === "CRITICAL"
    ).length;


  function handleLogout() {
    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <p className="text-sm text-slate-500">
          Loading your workspace...
        </p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f5f7fb]">


      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-[#0f172a] text-white lg:flex">

        <div className="flex h-20 items-center border-b border-white/10 px-6">

          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-black">
            B
          </div>

          <div>

            <h1 className="font-bold">
              BugLab
            </h1>

            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              Developer Space
            </p>

          </div>

        </div>


        <nav className="flex-1 px-4 py-7">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            My Workspace
          </p>


          <div className="flex w-full items-center gap-3 rounded-xl bg-emerald-500/10 px-3 py-3 text-sm font-semibold text-emerald-400">

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-xs text-white">
              M
            </span>

            My Work

          </div>


          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-xs">
              B
            </span>

            All Bugs

          </button>


          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">

            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Your Queue
            </p>

            <p className="mt-2 text-3xl font-black">
              {myBugs.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Assigned issues
            </p>

          </div>

        </nav>


        <div className="border-t border-white/10 p-4">

          <div className="mb-3 rounded-xl bg-white/5 p-3">

            <p className="text-sm font-bold">
              {user?.name}
            </p>

            <p className="mt-1 text-xs text-emerald-400">
              DEVELOPER
            </p>

          </div>


          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-3 py-3 text-left text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-300"
          >
            Sign out →
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="lg:ml-64">

        <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8 lg:px-10">


          {/* HEADER */}

          <div className="mb-8">

            <div className="mb-2 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Developer Workspace
              </span>

            </div>


            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Your Work.
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Focus on the bugs currently assigned to you.
            </p>

          </div>


          {/* PERSONAL STATS */}

          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">


            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned
              </p>

              <p className="mt-3 text-3xl font-black text-slate-900">
                {myBugs.length}
              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Open
              </p>

              <p className="mt-3 text-3xl font-black text-blue-600">
                {openBugs}
              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                In Progress
              </p>

              <p className="mt-3 text-3xl font-black text-amber-600">
                {activeBugs}
              </p>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Critical
              </p>

              <p className="mt-3 text-3xl font-black text-red-600">
                {criticalBugs}
              </p>

            </div>

          </div>


          {/* FOCUS CARD */}

          <div className="mb-8 overflow-hidden rounded-3xl bg-slate-900 p-7 text-white">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Current Focus
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  {activeBugs > 0
                    ? `${activeBugs} issue${activeBugs > 1 ? "s" : ""} in progress`
                    : "Nothing currently in progress"}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Keep your assigned issues moving toward resolution.
                </p>

              </div>


              {criticalBugs > 0 && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-red-300">
                    Attention
                  </p>

                  <p className="mt-1 text-sm font-bold text-red-200">
                    {criticalBugs} critical issue
                    {criticalBugs > 1 ? "s" : ""}

                  </p>

                </div>
              )}

            </div>

          </div>


          {/* BUG LIST */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">

              <div>

                <h3 className="text-xl font-black text-slate-900">
                  My Issues
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Issues assigned specifically to you.
                </p>

              </div>


              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search my issues..."
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
              />

            </div>


            {error && (
              <div className="bg-red-50 px-6 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            {filteredBugs.length === 0 ? (

              <div className="px-6 py-20 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 font-black text-emerald-500">
                  ✓
                </div>

                <h3 className="font-bold text-slate-900">
                  No assigned issues
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  You're all clear for now.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-slate-100">

                {filteredBugs.map(
                  (bug) => (

                    <button
                      key={bug.id}
                      onClick={() =>
                        navigate(
                          `/bugs/${bug.id}`
                        )
                      }
                      className="flex w-full flex-col gap-4 px-6 py-5 text-left transition hover:bg-emerald-50/40 md:flex-row md:items-center md:justify-between"
                    >

                      <div className="flex items-start gap-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-500">
                          #{bug.id}
                        </div>


                        <div>

                          <h4 className="font-bold text-slate-900">
                            {bug.title}
                          </h4>

                          <p className="mt-1 max-w-xl truncate text-xs text-slate-400">
                            {bug.description}
                          </p>

                        </div>

                      </div>


                      <div className="flex items-center gap-2">

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600">
                          {bug.status}
                        </span>

                        <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-indigo-600">
                          {bug.priority}
                        </span>

                        <span className="ml-2 text-sm font-bold text-emerald-600">
                          Open →
                        </span>

                      </div>

                    </button>

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}


export default DeveloperDashboard;