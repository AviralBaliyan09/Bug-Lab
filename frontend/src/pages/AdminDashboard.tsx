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

import {
  getUsers,
} from "../services/auth";

import type {
  Bug,
} from "../types/bug";

import type {
  User,
} from "../types/auth";

import ThemeToggle from "../components/ThemeToggle";


function AdminDashboard() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  const [bugs, setBugs] =
    useState<Bug[]>([]);

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState("ALL");


  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          bugList,
          userList,
        ] = await Promise.all([
          getBugs(
            search,
            statusFilter,
            priorityFilter
          ),
          getUsers(),
        ]);

        setBugs(bugList);
        setUsers(userList);

      } catch {
        setError(
          "Failed to load admin dashboard"
        );

      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

  }, [
    search,
    statusFilter,
    priorityFilter,
  ]);


  if (loading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
          text-slate-900
          transition-colors
          duration-300

          dark:bg-slate-950
          dark:text-white
        "
      >
        <div className="text-center">

          <div
            className="
              mx-auto
              mb-4
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-slate-200
              border-t-indigo-600

              dark:border-slate-700
              dark:border-t-indigo-400
            "
          />

          <p
            className="
              text-sm
              text-slate-500

              dark:text-slate-400
            "
          >
            Loading admin command center...
          </p>

        </div>
      </div>
    );
  }


  const totalBugs =
    bugs.length;

  const openBugs =
    bugs.filter(
      (bug) =>
        bug.status === "OPEN"
    ).length;

  const activeBugs =
    bugs.filter(
      (bug) =>
        bug.status === "IN_PROGRESS"
    ).length;

  const resolvedBugs =
    bugs.filter(
      (bug) =>
        bug.status === "RESOLVED"
    ).length;

  const unassignedBugs =
    bugs.filter(
      (bug) =>
        bug.assigned_to === null
    ).length;

  const developers =
    users.filter(
      (item) =>
        item.role === "DEVELOPER"
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


  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-900
        transition-colors
        duration-300

        dark:bg-slate-950
        dark:text-white
      "
    >

      {/* ================= SIDEBAR ================= */}

      <aside
        className="
          fixed
          left-0
          top-0
          hidden
          h-screen
          w-64
          flex-col
          bg-[#111827]
          text-white
          lg:flex
        "
      >

        {/* Logo */}

        <div
          className="
            flex
            h-20
            items-center
            border-b
            border-white/10
            px-6
          "
        >

          <div
            className="
              mr-3
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-indigo-500
              font-black
              shadow-lg
              shadow-indigo-950/30
            "
          >
            B
          </div>

          <div>

            <h1 className="font-bold">
              BugLab
            </h1>

            <p
              className="
                text-[10px]
                uppercase
                tracking-widest
                text-slate-500
              "
            >
              Admin Center
            </p>

          </div>

        </div>


        {/* Navigation */}

        <nav
          className="
            flex-1
            px-4
            py-7
          "
        >

          <p
            className="
              mb-3
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-widest
              text-slate-500
            "
          >
            Management
          </p>


          {/* Dashboard */}

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              bg-indigo-500/15
              px-3
              py-3
              text-sm
              font-semibold
              text-indigo-300
              transition
              hover:bg-indigo-500/20
            "
          >

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-indigo-500
                text-xs
              "
            >
              A
            </span>

            Admin Dashboard

          </button>


          {/* All Bugs */}

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="
              mt-1
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              text-slate-400
              transition
              hover:bg-white/5
              hover:text-white
            "
          >

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-white/5
                text-xs
              "
            >
              B
            </span>

            All Bugs

          </button>


          {/* Users */}

          <button
            onClick={() =>
              navigate("/users")
            }
            className="
              mt-1
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-left
              text-sm
              font-semibold
              text-slate-400
              transition
              hover:bg-white/5
              hover:text-white
            "
          >

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-white/5
                text-xs
              "
            >
              U
            </span>

            Users

            <span
              className="
                ml-auto
                rounded-full
                bg-white/10
                px-2
                py-0.5
                text-[10px]
                font-bold
              "
            >
              {users.length}
            </span>

          </button>


          {/* System */}

          <div className="mt-8">

            <p
              className="
                mb-3
                px-3
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-slate-500
              "
            >
              System
            </p>


            <div className="space-y-1 px-3">

              <div
                className="
                  flex
                  justify-between
                  py-2
                  text-sm
                  text-slate-400
                "
              >
                <span>
                  Total Users
                </span>

                <span className="font-bold text-white">
                  {users.length}
                </span>
              </div>


              <div
                className="
                  flex
                  justify-between
                  py-2
                  text-sm
                  text-slate-400
                "
              >
                <span>
                  Developers
                </span>

                <span className="font-bold text-white">
                  {developers}
                </span>
              </div>


              <div
                className="
                  flex
                  justify-between
                  py-2
                  text-sm
                  text-slate-400
                "
              >
                <span>
                  Unassigned
                </span>

                <span className="font-bold text-white">
                  {unassignedBugs}
                </span>
              </div>

            </div>

          </div>

        </nav>


        {/* Profile */}

        <div
          className="
            border-t
            border-white/10
            p-4
          "
        >

          <div
            className="
              mb-3
              rounded-xl
              bg-white/5
              p-3
            "
          >

            <p className="text-sm font-bold">
              {user?.name}
            </p>

            <p
              className="
                mt-1
                text-xs
                text-indigo-300
              "
            >
              ADMIN
            </p>

          </div>


          <button
            onClick={handleLogout}
            className="
              w-full
              rounded-xl
              px-3
              py-3
              text-left
              text-sm
              text-slate-400
              transition
              hover:bg-red-500/10
              hover:text-red-300
            "
          >
            Sign out →
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="lg:ml-64">

        <div
          className="
            mx-auto
            max-w-[1500px]
            px-5
            py-7
            sm:px-8
            lg:px-10
          "
        >


          {/* ================= TOP BAR ================= */}

          <div
            className="
              mb-8
              flex
              items-center
              justify-end
            "
          >

            <ThemeToggle />

          </div>


          {/* ================= HEADER ================= */}

          <div className="mb-8">

            <div
              className="
                mb-2
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-indigo-500
                "
              />

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-widest
                  text-indigo-600

                  dark:text-indigo-400
                "
              >
                Administrator Workspace
              </span>

            </div>


            <div
              className="
                flex
                flex-col
                justify-between
                gap-5
                md:flex-row
                md:items-end
              "
            >

              <div>

                <h2
                  className="
                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-900

                    dark:text-white

                    sm:text-4xl
                  "
                >
                  System Overview
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Monitor bugs, developers and project activity from one place.
                </p>

              </div>


              <button
                onClick={() =>
                  navigate("/create-bug")
                }
                className="
                  rounded-xl
                  bg-indigo-600
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-indigo-700
                  hover:shadow-md

                  dark:bg-indigo-500
                  dark:hover:bg-indigo-600
                "
              >
                + Create Bug
              </button>

            </div>

          </div>


          {/* ================= ERROR ================= */}

          {error && (
            <div
              className="
                mb-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-600

                dark:border-red-900/50
                dark:bg-red-950/30
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}


          {/* ================= STATS ================= */}

          <div
            className="
              mb-8
              grid
              grid-cols-2
              gap-4
              xl:grid-cols-5
            "
          >

            {/* Total */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-colors

                dark:border-slate-800
                dark:bg-slate-900
                dark:shadow-black/20
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Total Bugs
              </p>

              <p
                className="
                  mt-3
                  text-3xl
                  font-black
                  text-slate-900

                  dark:text-white
                "
              >
                {totalBugs}
              </p>

            </div>


            {/* Open */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-colors

                dark:border-slate-800
                dark:bg-slate-900
                dark:shadow-black/20
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Open
              </p>

              <p
                className="
                  mt-3
                  text-3xl
                  font-black
                  text-blue-600

                  dark:text-blue-400
                "
              >
                {openBugs}
              </p>

            </div>


            {/* In Progress */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-colors

                dark:border-slate-800
                dark:bg-slate-900
                dark:shadow-black/20
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                In Progress
              </p>

              <p
                className="
                  mt-3
                  text-3xl
                  font-black
                  text-amber-600

                  dark:text-amber-400
                "
              >
                {activeBugs}
              </p>

            </div>


            {/* Resolved */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-colors

                dark:border-slate-800
                dark:bg-slate-900
                dark:shadow-black/20
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Resolved
              </p>

              <p
                className="
                  mt-3
                  text-3xl
                  font-black
                  text-emerald-600

                  dark:text-emerald-400
                "
              >
                {resolvedBugs}
              </p>

            </div>


            {/* Unassigned */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition-colors

                dark:border-slate-800
                dark:bg-slate-900
                dark:shadow-black/20
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Unassigned
              </p>

              <p
                className="
                  mt-3
                  text-3xl
                  font-black
                  text-red-600

                  dark:text-red-400
                "
              >
                {unassignedBugs}
              </p>

            </div>

          </div>


          {/* ================= MANAGEMENT CARDS ================= */}

          <div
            className="
              mb-8
              grid
              gap-5
              md:grid-cols-2
            "
          >

            {/* Developer card */}

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-900
                p-6
                text-white

                dark:border-slate-800
                dark:bg-slate-900
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-widest
                  text-indigo-300
                "
              >
                Team
              </p>

              <h3
                className="
                  mt-2
                  text-2xl
                  font-black
                "
              >
                {developers} Developers
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-400
                "
              >
                Manage assignments and keep work distributed across the team.
              </p>

            </div>


            {/* Users card */}

            <button
              onClick={() =>
                navigate("/users")
              }
              className="
                group
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                text-left
                transition

                hover:-translate-y-0.5
                hover:border-indigo-200
                hover:shadow-lg
                hover:shadow-indigo-100/50

                dark:border-slate-800
                dark:bg-slate-900
                dark:hover:border-indigo-800
                dark:hover:bg-slate-900
                dark:hover:shadow-black/30
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-widest
                      text-slate-400
                    "
                  >
                    Users
                  </p>

                  <h3
                    className="
                      mt-2
                      text-2xl
                      font-black
                      text-slate-900

                      dark:text-white
                    "
                  >
                    {users.length} Members
                  </h3>

                </div>


                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-sm
                    font-black
                    text-indigo-600
                    transition

                    group-hover:bg-indigo-600
                    group-hover:text-white

                    dark:bg-indigo-950/50
                    dark:text-indigo-400

                    dark:group-hover:bg-indigo-500
                    dark:group-hover:text-white
                  "
                >
                  →
                </div>

              </div>


              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500

                  dark:text-slate-400
                "
              >
                View and manage registered users, roles and access.
              </p>


              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  text-indigo-600

                  dark:text-indigo-400
                "
              >
                Manage Users

                <span
                  className="
                    transition
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>

              </div>

            </button>

          </div>


          {/* ================= BUG SECTION ================= */}

          <section
            className="
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-sm
              transition-colors

              dark:border-slate-800
              dark:bg-slate-900
              dark:shadow-black/20
            "
          >

            {/* Section Header */}

            <div
              className="
                border-b
                border-slate-200
                px-6
                py-5

                dark:border-slate-800
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >

                <div>

                  <h3
                    className="
                      text-xl
                      font-black
                      text-slate-900

                      dark:text-white
                    "
                  >
                    All Issues
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-400
                    "
                  >
                    Admin control over every reported bug.
                  </p>

                </div>


                {/* Filters */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search bugs..."
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      text-slate-900
                      outline-none
                      transition

                      placeholder:text-slate-400

                      focus:border-indigo-400
                      focus:ring-4
                      focus:ring-indigo-50

                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-white
                      dark:placeholder:text-slate-500

                      dark:focus:border-indigo-500
                      dark:focus:ring-indigo-950/50
                    "
                  />


                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value
                      )
                    }
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-slate-700
                      outline-none
                      transition

                      focus:border-indigo-400

                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-slate-200

                      dark:focus:border-indigo-500
                    "
                  >

                    <option value="ALL">
                      All Status
                    </option>

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


                  <select
                    value={priorityFilter}
                    onChange={(event) =>
                      setPriorityFilter(
                        event.target.value
                      )
                    }
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-slate-700
                      outline-none
                      transition

                      focus:border-indigo-400

                      dark:border-slate-700
                      dark:bg-slate-950
                      dark:text-slate-200

                      dark:focus:border-indigo-500
                    "
                  >

                    <option value="ALL">
                      All Priority
                    </option>

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

                </div>

              </div>

            </div>


            {/* Table */}

            <div className="overflow-x-auto">

              <table
                className="
                  w-full
                  min-w-[800px]
                "
              >

                <thead>

                  <tr
                    className="
                      border-b
                      border-slate-100

                      dark:border-slate-800
                    "
                  >

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-[10px]
                        font-black
                        uppercase
                        tracking-widest
                        text-slate-400
                      "
                    >
                      Issue
                    </th>

                    <th
                      className="
                        px-4
                        py-4
                        text-left
                        text-[10px]
                        font-black
                        uppercase
                        tracking-widest
                        text-slate-400
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        px-4
                        py-4
                        text-left
                        text-[10px]
                        font-black
                        uppercase
                        tracking-widest
                        text-slate-400
                      "
                    >
                      Priority
                    </th>

                    <th
                      className="
                        px-4
                        py-4
                        text-left
                        text-[10px]
                        font-black
                        uppercase
                        tracking-widest
                        text-slate-400
                      "
                    >
                      Assigned
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-right
                        text-[10px]
                        font-black
                        uppercase
                        tracking-widest
                        text-slate-400
                      "
                    >
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody
                  className="
                    divide-y
                    divide-slate-100

                    dark:divide-slate-800
                  "
                >

                  {bugs.length === 0 ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="
                          px-6
                          py-12
                          text-center
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-slate-500

                            dark:text-slate-400
                          "
                        >
                          No bugs found.
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400

                            dark:text-slate-500
                          "
                        >
                          Try changing your search or filters.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    bugs.map(
                      (bug) => (

                        <tr
                          key={bug.id}
                          className="
                            transition

                            hover:bg-indigo-50/30

                            dark:hover:bg-indigo-950/20
                          "
                        >

                          {/* Issue */}

                          <td
                            className="
                              px-6
                              py-5
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-3
                              "
                            >

                              <span
                                className="
                                  rounded-lg
                                  bg-slate-100
                                  px-2
                                  py-1
                                  text-[10px]
                                  font-bold
                                  text-slate-500

                                  dark:bg-slate-800
                                  dark:text-slate-400
                                "
                              >
                                #{bug.id}
                              </span>


                              <div>

                                <p
                                  className="
                                    max-w-xs
                                    truncate
                                    text-sm
                                    font-bold
                                    text-slate-900

                                    dark:text-slate-100
                                  "
                                >
                                  {bug.title}
                                </p>

                                <p
                                  className="
                                    max-w-xs
                                    truncate
                                    text-xs
                                    text-slate-400

                                    dark:text-slate-500
                                  "
                                >
                                  {bug.description}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* Status */}

                          <td
                            className="
                              px-4
                              py-5
                            "
                          >

                            <span
                              className="
                                rounded-full
                                bg-slate-100
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold
                                text-slate-600

                                dark:bg-slate-800
                                dark:text-slate-300
                              "
                            >
                              {bug.status}
                            </span>

                          </td>


                          {/* Priority */}

                          <td
                            className="
                              px-4
                              py-5
                            "
                          >

                            <span
                              className="
                                rounded-full
                                bg-indigo-50
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold
                                text-indigo-600

                                dark:bg-indigo-950/50
                                dark:text-indigo-400
                              "
                            >
                              {bug.priority}
                            </span>

                          </td>


                          {/* Assigned */}

                          <td
                            className="
                              px-4
                              py-5
                              text-sm
                              text-slate-500

                              dark:text-slate-400
                            "
                          >
                            {bug.assigned_to
                              ? `User #${bug.assigned_to}`
                              : "Unassigned"}
                          </td>


                          {/* Action */}

                          <td
                            className="
                              px-6
                              py-5
                              text-right
                            "
                          >

                            <button
                              onClick={() =>
                                navigate(
                                  `/bugs/${bug.id}`
                                )
                              }
                              className="
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2
                                text-xs
                                font-bold
                                text-slate-600
                                transition

                                hover:border-indigo-200
                                hover:bg-indigo-50
                                hover:text-indigo-600

                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:text-slate-300

                                dark:hover:border-indigo-800
                                dark:hover:bg-indigo-950/40
                                dark:hover:text-indigo-400
                              "
                            >
                              Manage →
                            </button>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


export default AdminDashboard;