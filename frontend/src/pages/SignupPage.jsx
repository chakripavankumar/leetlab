import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { z } from "zod";

const SignupSchema = z.object({
  email: z.string().email("Enter a valid Email"),
  password: z.string().min(6, "Password should be atleast 6 characters"),
  name: z.string().min(3, "Name should be atleast 3 characters long"),
});

const SignupPage = () => {
  const [showPassword, SetShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { error },
  } = useForm({ resolver: zodResolver(SignupSchema) });

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <div className="h-screen grid ld:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md  space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10  flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className=" w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
