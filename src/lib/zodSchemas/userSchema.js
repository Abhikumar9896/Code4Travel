import { z } from "zod";
export const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
 
  code: z.string().optional(), // OTP
});

// Login schema - Using userid instead of email
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// OTP verification schema
export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

// Password reset schema
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match", // friendlier wording
    path: ["confirmPassword"], // show error under confirmPassword input
  });


//forgate password schema

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});


// Update user schema (all fields optional, no mobile)
export const updateUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
 
    profilePhoto: z.string().optional(),
});
