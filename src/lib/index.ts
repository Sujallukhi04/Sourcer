import * as z from "zod";

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$#!%*?&]{8,}$/
);

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password should be minmum 8 characters" })
    .regex(passwordValidation, {
      message:
        "Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters",
    }),
});

// HR Registration Schema
export const HRRegisterSchema = z.object({
  email: z.string().email({ message: "Email field is empty!" }),
  password: z
    .string()
    .min(8, { message: "password should be minmum 8 characters" })
    .regex(passwordValidation, {
      message:
        "Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters",
    }),
  name: z.string().min(1, {
    message: "Name field is empty!",
  }),
  companyName: z.string().min(1, {
    message: "Company name is required!",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits!",
  }),
  companyLogo: z.string().optional(),
});

// Employee Registration Schema (for HR to add employees)
export const EmployeeAddSchema = z.object({
  email: z.string().email({ message: "Email field is empty!" }),
  name: z.string().min(1, {
    message: "Name field is empty!",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits!",
  }),
});

// Old RegisterSchema (kept for backward compatibility, now for employees)
export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email field is empty!" }),
  password: z
    .string()
    .min(8, { message: "password should be minmum 8 characters" })
    .regex(passwordValidation, {
      message:
        "Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters",
    }),
  name: z.string().min(1, {
    message: "Name field is empty!",
  }),
  companyName: z.string().min(1, {
    message: "Company name is required!",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits!",
  }),
  companyLogo: z.string().optional(),
});

// Change Password Schema
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required!" }),
    newPassword: z
      .string()
      .min(8, { message: "password should be minmum 8 characters" })
      .regex(passwordValidation, {
        message:
          "Password should include digits(0-9),special symbols(@,#,&...),Uppercase (A-Z),lowercase(a-z) letters",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required!" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
