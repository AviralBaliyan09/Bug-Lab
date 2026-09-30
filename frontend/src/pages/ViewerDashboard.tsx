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


function ViewerDashboard() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  const [bugs, setBugs] =
    useState<Bug[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
    async function loadBugs() {
      try {
        const bugList =
          await getBugs();

        setBugs(bugList);
      } finally {
        setLoading(false);
      }
    }

    loadBugs();
  }, []);


  const filteredBugs =
    bugs.filter(
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading issues...
        </p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">

          <div>

            <p className="text-lg font-black text-slate-900">
              BugLab
            </p>

            <p className="text-xs text-slate-400">
              Read-only workspace
            </p>

          </div>


          <div className="flex items-center gap-4">

            <div className="text-right">

              <p className="text-sm font-bold text-slate-800">
                {user?.name}
              </p>

              <p className="text-xs text-slate-400">
                VIEWER
              </p>

            </div>


            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      <main className="mx-auto max-w-6xl px-5 py-10">


        <div className="mb-8">

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Issue Explorer
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Browse Issues
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View reported bugs and their current status.
          </p>

        </div>


        <div className="mb-6">

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search issues..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm outline-none focus:border-indigo-400"
          />

        </div>


        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {filteredBugs.map(
            (bug) => (

              <button
                key={bug.id}
                onClick={() =>
                  navigate(
                    `/bugs/${bug.id}`
                  )
                }
                className="flex w-full items-center justify-between gap-5 border-b border-slate-100 px-6 py-5 text-left transition last:border-0 hover:bg-slate-50"
              >

                <div>

                  <p className="text-xs font-bold text-slate-400">
                    #{bug.id}
                  </p>

                  <h3 className="mt-1 font-bold text-slate-900">
                    {bug.title}
                  </h3>

                  <p className="mt-1 max-w-xl truncate text-xs text-slate-400">
                    {bug.description}
                  </p>

                </div>


                <div className="flex shrink-0 items-center gap-2">

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600">
                    {bug.status}
                  </span>

                  <span className="hidden rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-indigo-600 sm:inline-block">
                    {bug.priority}
                  </span>

                </div>

              </button>

            )
          )}

        </div>

      </main>

    </div>
  );
}


export default ViewerDashboard;