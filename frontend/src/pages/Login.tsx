import {
  FormEvent,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  login,
} from "../services/auth";

import {
  useAuth,
} from "../context/AuthContext";


import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const {
    refreshUser,
  } = useAuth();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data =
        await login({
          email,
          password,
        });

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      await refreshUser();
      toast.success("Welcome back!")
      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch {
      toast.error("Invalid email or password")
      setError(
        "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <div
      className="
        relative min-h-screen
        overflow-hidden
        bg-slate-50
        text-slate-900
        transition-colors duration-300

        dark:bg-slate-950
        dark:text-white
      "
    >

      {/* ================= THEME TOGGLE ================= */}

      {/* <div className="absolute right-5 top-5 z-20 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div> */}


      {/* ================= BACKGROUND DECORATION ================= */}

      <div
        className="
          pointer-events-none
          fixed
          -right-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-indigo-200/40
          blur-3xl

          dark:bg-indigo-900/20
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          -bottom-32
          -left-32
          h-80
          w-80
          rounded-full
          bg-blue-200/40
          blur-3xl

          dark:bg-blue-900/20
        "
      />


      {/* ================= MAIN ================= */}

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">

        <div className="w-full max-w-md">


          {/* ================= BRAND ================= */}

          <div className="mb-7 text-center">

            <div
              className="
                mx-auto
                mb-4
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-indigo-600
                text-xl
                font-black
                text-white
                shadow-lg
                shadow-indigo-200

                dark:shadow-indigo-950/40
              "
            >
              B
            </div>

            <h1
              className="
                text-2xl
                font-black
                tracking-tight
                text-slate-900

                dark:text-white
              "
            >
              Welcome back
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-slate-500

                dark:text-slate-400
              "
            >
              Sign in to your BugLab workspace.
            </p>

          </div>


          {/* ================= LOGIN CARD ================= */}

          <div
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-xl
              shadow-slate-200/50
              transition-colors

              dark:border-slate-800
              dark:bg-slate-900
              dark:shadow-black/30

              sm:p-8
            "
          >


            {/* ================= HEADER ================= */}

            <div className="mb-6">

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-indigo-600

                      dark:text-indigo-400
                    "
                  >
                    Secure Access
                  </p>

                  <h2
                    className="
                      mt-2
                      text-xl
                      font-black
                      text-slate-900

                      dark:text-white
                    "
                  >
                    Login to continue
                  </h2>

                </div>


                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-indigo-50
                    text-sm
                    font-black
                    text-indigo-600

                    dark:bg-indigo-950/50
                    dark:text-indigo-400
                  "
                >
                  →
                </div>

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
                  font-medium
                  text-red-600

                  dark:border-red-900/50
                  dark:bg-red-950/30
                  dark:text-red-400
                "
              >
                {error}
              </div>
            )}


            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >


              {/* EMAIL */}

              <div>

                <label
                  htmlFor="login-email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700

                    dark:text-slate-300
                  "
                >
                  Email address
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3.5
                    text-sm
                    text-slate-900
                    outline-none
                    transition

                    placeholder:text-slate-400

                    focus:border-indigo-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-indigo-50

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                    dark:placeholder:text-slate-500

                    dark:focus:border-indigo-500
                    dark:focus:bg-slate-950
                    dark:focus:ring-indigo-950/50
                  "
                />

              </div>


              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="login-password"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700

                    dark:text-slate-300
                  "
                >
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3.5
                    text-sm
                    text-slate-900
                    outline-none
                    transition

                    placeholder:text-slate-400

                    focus:border-indigo-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-indigo-50

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                    dark:placeholder:text-slate-500

                    dark:focus:border-indigo-500
                    dark:focus:bg-slate-950
                    dark:focus:ring-indigo-950/50
                  "
                />

              </div>


              {/* ================= SECURITY INFO ================= */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-slate-50
                  px-4
                  py-3

                  dark:bg-slate-800/70
                "
              >

                <span
                  className="
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-emerald-100
                    text-xs
                    font-black
                    text-emerald-600

                    dark:bg-emerald-950/50
                    dark:text-emerald-400
                  "
                >
                  ✓
                </span>

                <p
                  className="
                    text-xs
                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Your session is protected with
                  secure authentication.
                </p>

              </div>


              {/* ================= LOGIN BUTTON ================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  bg-indigo-600
                  px-4
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition

                  hover:bg-indigo-700
                  hover:shadow-md

                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  dark:bg-indigo-500
                  dark:hover:bg-indigo-600
                "
              >
                {loading
                  ? "Logging in..."
                  : "Sign In"}
              </button>

            </form>


            {/* ================= DIVIDER ================= */}

            <div className="my-6 flex items-center gap-3">

              <div
                className="
                  h-px
                  flex-1
                  bg-slate-100

                  dark:bg-slate-800
                "
              />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                New to BugLab?
              </span>

              <div
                className="
                  h-px
                  flex-1
                  bg-slate-100

                  dark:bg-slate-800
                "
              />

            </div>


            {/* ================= REGISTER ================= */}

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                font-bold
                text-slate-700
                transition

                hover:border-indigo-200
                hover:bg-indigo-50
                hover:text-indigo-700

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-200

                dark:hover:border-indigo-800
                dark:hover:bg-indigo-950/40
                dark:hover:text-indigo-400
              "
            >
              Create New Account
            </button>

          </div>


          {/* ================= FOOTER ================= */}

          <div className="mt-6 flex items-center justify-center gap-2">

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-500
              "
            />

            <p
              className="
                text-xs
                text-slate-400

                dark:text-slate-500
              "
            >
              BugLab Issue Management System
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Login;