import { Prisma } from "@/lib/prisma";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { User } from "next-auth";
import { hasPermissions } from "@/lib/utils/permissions";
import { Permission } from "@/types";

/**
 * The users router
 */
export const usersRouter = {
  /**
   * Get all users
   *
   * @returns All the users
   */
  getAllUsers: publicProcedure.mutation(async () => {
    const users = await Prisma.getAllUsers();

    return { users, success: true, message: "Success" };
  }),

  /**
   * Check if a user exists
   *
   * @param email - The email to get the user by
   * @returns The user
   */
  userExists: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      const exists = await Prisma.userExists(input.email);

      return {
        exists,
        success: true,
        message: "Success",
      };
    }),

  /**
   * Get a user by their email
   *
   * @param email - The email to get the user by
   * @returns The user
   */
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      const user = await Prisma.getUserByEmail(input.email);

      if (!user) {
        return {
          user: null,
          success: false,
          message: "User not found",
        };
      }

      return {
        user,
        success: true,
        message: "Success",
      };
    }),

  /**
   * Get a user by their email (unsecure)
   *
   * @param email - The email to get the user by
   * @returns The user
   */
  getUserByEmailUnsecure: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      /**
       * Get the user by their email
       */
      const user = await Prisma.getUserByEmailUnsecure(input.email);
      if (!user) {
        return {
          user: null,
          success: false,
          message: "User not found",
        };
      }

      /**
       * Return the user
       */
      return {
        user,
        success: true,
        message: "Success",
      };
    }),

  /**
   * Update an user
   *
   * @param input - The input to update the user
   * @returns The updated user
   */
  updateUser: publicProcedure
    .input(
      z.object({
        auth: z.string(),
        id: z.string(),
        user: z.object({
          name: z.string().optional(),
          permissions: z.array(z.string()),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      // Verify that the user is an admin
      const userAuth = await Prisma.getUserBySecret(input.auth);
      if (
        !userAuth ||
        !hasPermissions(userAuth.permissions, [Permission.ADMIN])
      ) {
        return {
          user: null,
          success: false,
          message: "Unauthorized",
        };
      }

      // Update the user
      const user = await Prisma.updateUserById(input.id, input.user as User);

      if (!user) {
        return {
          user: null,
          success: false,
          message: "Failed to update user",
        };
      }

      return {
        user,
        success: true,
        message: "Success",
      };
    }),
};
