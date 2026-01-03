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
import { EmployeeAddSchema } from "@/lib";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AddEmployee } from "@/actions/auth/add-employee";

export function AddEmployeeForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(EmployeeAddSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof EmployeeAddSchema>) => {
    const toastId = toast.loading("Adding employee...");

    startTransition(() => {
      AddEmployee(values)
        .then(
          (data: { success?: string; error?: string; employeeId?: string }) => {
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
            }
          }
        )
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
      headerLabel="Add New Employee"
      headerdescription="Create a new employee account"
      isDisabled={isPending}
      backButtonHref="/auth/login"
      backButtonLable="Already have account?"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
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
                    placeholder="employee@company.com"
                    {...field}
                    disabled={isPending}
                    type="email"
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Employee credentials will be auto-generated
              and sent via email. The employee can change the password after
              first login.
            </p>
          </div>

          <Button
            disabled={isPending}
            type="submit"
            className="w-full space-y-0 py-0 mt-2"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Add Employee
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
