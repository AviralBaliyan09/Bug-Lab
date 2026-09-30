import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
              B
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight">
                BugLab
              </p>

              <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Mini Bug Tracker
              </p>
            </div>
          </Link>

          {/* Navigation */}

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
            >
              About
            </a>
          </nav>

          {/* Actions */}

          <div className="flex items-center gap-3">

            <ThemeToggle />

            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Register
            </Link>

          </div>
        </div>
      </header>


      {/* ================= HERO ================= */}

      <main>

        <section className="relative overflow-hidden">

          {/* Background blobs */}

          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20" />

          <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl dark:bg-purple-900/20" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">

            {/* Hero content */}

            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-green-500" />

                Simple bug tracking for teams
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
                Track bugs.
                <br />

                <span className="text-slate-500 dark:text-slate-400">
                  Fix faster.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                BugLab is a simple and powerful bug
                tracking platform that helps teams
                report, assign, track and resolve
                software issues in one place.
              </p>

              {/* CTA */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="rounded-xl bg-slate-900 px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Create Free Account
                </Link>

                <Link
                  to="/login"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>

              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
                <span>✓ Role-based access</span>
                <span>✓ Bug assignment</span>
                <span>✓ Status tracking</span>
              </div>

            </div>


            {/* Dashboard preview */}

            <div className="relative">

              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">

                {/* Fake browser bar */}

                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">

                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />

                  <div className="ml-3 h-7 flex-1 rounded-lg bg-slate-100 dark:bg-slate-800" />

                </div>

                {/* Dashboard */}

                <div className="grid gap-4 sm:grid-cols-3">

                  <div className="rounded-2xl bg-slate-100 p-5 dark:bg-slate-800">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Total Bugs
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      128
                    </p>
                  </div>

                  <div className="rounded-2xl bg-blue-50 p-5 dark:bg-blue-950/40">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      In Progress
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      24
                    </p>
                  </div>

                  <div className="rounded-2xl bg-green-50 p-5 dark:bg-green-950/40">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400">
                      Resolved
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      91
                    </p>
                  </div>

                </div>

                {/* Issues */}

                <div className="mt-5 rounded-2xl border border-slate-200 p-5 dark:border-slate-700">

                  <div className="mb-5 flex items-center justify-between">

                    <div>
                      <p className="font-bold">
                        Recent Issues
                      </p>

                      <p className="text-xs text-slate-500">
                        Latest reported bugs
                      </p>
                    </div>

                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold dark:bg-slate-800">
                      View All
                    </span>

                  </div>

                  <div className="space-y-3">

                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">

                      <div>
                        <p className="text-sm font-semibold">
                          Login button not working
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          BUG-1024
                        </p>
                      </div>

                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        Critical
                      </span>

                    </div>


                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">

                      <div>
                        <p className="text-sm font-semibold">
                          Dashboard loading issue
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          BUG-1023
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        In Progress
                      </span>

                    </div>


                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">

                      <div>
                        <p className="text-sm font-semibold">
                          Profile image missing
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          BUG-1022
                        </p>
                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600 dark:bg-green-950/40 dark:text-green-400">
                        Resolved
                      </span>

                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ================= FEATURES ================= */}

        <section
          id="features"
          className="border-y border-slate-200 bg-white py-24 dark:border-slate-800 dark:bg-slate-900"
        >

          <div className="mx-auto max-w-7xl px-6">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                Features
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to manage bugs
              </h2>

              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Keep your development workflow organized
                from bug reporting to resolution.
              </p>

            </div>


            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              <FeatureCard
                icon="🐞"
                title="Bug Tracking"
                description="Create and track issues with title, description, priority and status."
              />

              <FeatureCard
                icon="👥"
                title="Team Management"
                description="Admins can manage users and assign bugs to developers."
              />

              <FeatureCard
                icon="🔐"
                title="Role Based Access"
                description="Different permissions for administrators, developers and viewers."
              />

              <FeatureCard
                icon="📊"
                title="Dashboard"
                description="Get a clear overview of bugs, priorities and team activity."
              />

            </div>

          </div>

        </section>


        {/* ================= ABOUT / CTA ================= */}

        <section
          id="about"
          className="py-24"
        >

          <div className="mx-auto max-w-5xl px-6">

            <div className="rounded-3xl bg-slate-900 px-8 py-16 text-center text-white shadow-2xl dark:bg-white dark:text-slate-950 sm:px-16">

              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to organize your bugs?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-slate-300 dark:text-slate-600">
                Create your account and start managing
                your development issues with BugLab.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-200 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
              >
                Get Started
              </Link>

            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">

        <div className="mx-auto max-w-7xl px-6 py-12">

          <div className="grid gap-10 md:grid-cols-4">

            {/* Brand */}

            <div className="md:col-span-2">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                  B
                </div>

                <span className="text-lg font-bold">
                  BugLab
                </span>

              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                A simple mini bug tracking platform built
                for modern development teams.
              </p>

            </div>


            {/* Product */}

            <div>

              <h3 className="text-sm font-bold">
                Product
              </h3>

              <div className="mt-4 space-y-3">

                <a
                  href="#features"
                  className="block text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Features
                </a>

                <Link
                  to="/login"
                  className="block text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="block text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Register
                </Link>

              </div>

            </div>


            {/* Project */}

            <div>

              <h3 className="text-sm font-bold">
                Project
              </h3>

              <div className="mt-4 space-y-3">

                <a
                  href="#about"
                  className="block text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  About
                </a>

                <span className="block text-sm text-slate-500 dark:text-slate-400">
                  React + TypeScript
                </span>

                <span className="block text-sm text-slate-500 dark:text-slate-400">
                  FastAPI + PostgreSQL
                </span>

              </div>

            </div>

          </div>


          <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              © 2026 BugLab. Built as a portfolio project.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}


function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm dark:bg-slate-900">
        {icon}
      </div>

      <h3 className="mt-5 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

    </div>
  );
}

export default Home;