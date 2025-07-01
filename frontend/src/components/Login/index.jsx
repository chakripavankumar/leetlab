import { Input } from "../common";
import { Mail, Lock, LogIn, Code2 } from "lucide-react";
import { useAuthLogin } from "../../hooks/ReactQuery/useAuthApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodLoginSchema } from "../../utils/zodSchema";
import { useAuthStore } from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { PLATFORM_FEATURES } from "../../constants/PlatformFeatures";

const Login = () => {
  const { mutate: loginUser, isLoading } = useAuthLogin();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(zodLoginSchema),
  });
  const myLoginHandler = (data) => {
    loginUser(data, {
      onSuccess: (res) => {
        // console.log(res);
        toast.success(res?.message || "Login successful");
        setAuth({ user: res?.data });
        navigate("/problems");
      },
      onError: (err) => {
        // console.log(err);
        toast.error(err.response.data?.error || "Something went wrong");
      },
    });
  };
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Login Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Side - Login Form */}
              <div className="flex-1 p-8 lg:p-12 flex items-center">
                <div className="w-full max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                      <LogIn className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Sign In</h2>
                    <p className="text-base-content/60">
                      Continue your coding journey
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit(myLoginHandler)}
                    className="space-y-6"
                  >
                    <Input
                      {...register("email")}
                      placeHolder="john.doe@gmail.com"
                      icon={Mail}
                      label="Email Address"
                      type="email"
                      classNames={errors.email && "input-error"}
                      errorMsg={errors.email && errors.email.message}
                    />

                    <Input
                      {...register("password")}
                      placeHolder="Enter your password"
                      icon={Lock}
                      label="Password"
                      type="password"
                      classNames={errors.password && "input-error"}
                      errorMsg={errors.password && errors.password.message}
                    />

                    <div className="flex items-center justify-between">
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm"
                        />
                        <span className="label-text ml-2">Remember me</span>
                      </label>
                      {/* <a href="#" className="link link-primary text-sm">
                        Forgot password?
                      </a> */}
                    </div>

                    <button
                      disabled={isLoading}
                      type="submit"
                      className={`btn btn-primary w-full gap-2 ${
                        isLoading && "btn-disabled"
                      }`}
                    >
                      {isLoading && (
                        <span className="loading loading-spinner loading-sm"></span>
                      )}
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                  </form>

                  <p className="text-center mt-8 text-base-content/60">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="link link-primary font-medium"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              </div>

              {/* Right Side - Hero Content */}
              <div className="rounded-r-2xl flex-1 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 lg:p-12 flex items-center">
                <div className="max-w-md mx-auto text-center lg:text-left">
                  <div className="p-4 bg-primary/20 rounded-full w-fit mx-auto lg:mx-0 mb-6">
                    <Code2 className="w-12 h-12 text-primary" />
                  </div>

                  <h3 className="text-3xl font-bold mb-4 text-secondary">
                    Master Coding{" "}
                  </h3>

                  <p className="text-lg text-base-content/70 mb-8">
                    Practice with 2,800+ curated problems, from easy arrays to
                    complex dynamic programming. Build the skills top tech
                    companies are looking for.
                  </p>

                  <div className="max-w-lg mx-auto">
                    <h3 className="text-xl font-bold mb-6">
                      Why Choose DSA CodeLab?
                    </h3>
                    <ul className="space-y-4">
                      {PLATFORM_FEATURES.slice(0, 4).map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex gap-4 items-start text-sm"
                        >
                          <div>{feature.icon}</div>
                          <div>
                            <h4 className="font-semibold">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 text-sm text-muted-foreground text-center lg:text-left">
                    <Link to="/" className="underline text-primary">
                      ← Back to Homepage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
