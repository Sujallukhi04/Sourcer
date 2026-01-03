"use client";

import { CardWrapper } from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HRRegisterSchema } from "@/lib";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, Loader2, Mail, Upload } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Register } from "@/actions/auth/signup";
import Image from "next/image";

export function RegisterForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(HRRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      companyName: "",
      phoneNumber: "",
      companyLogo: "",
    },
  });

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const uploadToastId = toast.loading("Uploading logo...");
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload/logo", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error("Failed to upload logo", { id: uploadToastId });
          return;
        }

        const data = await response.json();
        form.setValue("companyLogo", data.secure_url);
        toast.success("Logo uploaded successfully!", { id: uploadToastId });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Error uploading logo", { id: uploadToastId });
      }
    }
  };

  const onSubmit = (values: z.infer<typeof HRRegisterSchema>) => {
    const toastId = toast.loading("Registering in...");

    startTransition(() => {
      Register(values)
        .then((data: { success?: string; error?: string }) => {
          if (data.error) {
            toast.error(data.error, {
              closeButton: true,
              id: toastId,
            });
          } else {
            toast.success(data.success, {
              closeButton: true,
              id: toastId,
            });
            form.reset();
            setLogoPreview(null);
          }
        })
        .catch((error) => {
          toast.error("Something went wrong!", {
            closeButton: true,
            id: toastId,
          });
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an Account"
      headerdescription="Register with your Google account"
      backButtonHref="/auth/login"
      backButtonLable="Already have an account?"
      isDisabled={isPending}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="companyName"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Company Name"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyLogo"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Logo</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="logo-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-sm text-gray-500">
                            Click to upload logo
                          </p>
                        </div>
                        <input
                          id="logo-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoChange}
                          disabled={isPending}
                        />
                      </label>
                    </div>
                    {logoPreview && (
                      <div className="relative w-32 h-32">
                        <Image
                          src={logoPreview}
                          alt="Logo Preview"
                          fill
                          className="object-contain rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Name"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="xyz@gmail.com"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1234567890"
                    {...field}
                    disabled={isPending}
                    type="tel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter you Password"
                      {...field}
                      disabled={isPending}
                      type={isPasswordVisible ? "text" : "password"}
                    />
                    <button
                      className="absolute bottom-0 right-0 h-10 px-3 pt-1 text-center text-gray-500"
                      onClick={() => {
                        setIsPasswordVisible(!isPasswordVisible);
                      }}
                      type="button"
                    >
                      {isPasswordVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full space-y-0 py-0 mt-2"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Register with Mail
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
