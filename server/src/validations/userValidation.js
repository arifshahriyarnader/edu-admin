import { z } from "zod";

export const userValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  userType: z.enum(["admin", "user"]).optional().default("user"),
});
