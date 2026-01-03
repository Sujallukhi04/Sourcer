"use server";

import { ChangePasswordSchema } from "@/lib";
import { db } from "@/lib/db";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export const ChangePassword = async (
  values: z.infer<typeof ChangePasswordSchema>
) => {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Unauthorized! Please login first.", success: "" };
  }

  const validation = ChangePasswordSchema.safeParse(values);

  if (validation.error) {
    return {
      error: validation.error.errors[0]?.message || "Validation error!",
      success: "",
    };
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return { error: "User not found!", success: "" };
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      values.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return { error: "Current password is incorrect!", success: "" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    // Update password
    await db.user.update({
      where: { email: session.user.email },
      data: {
        password: hashedPassword,
        isPasswordChanged: true,
      },
    });

    return { success: "Password changed successfully!" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Error changing password. Please try again.", success: "" };
  }
};
