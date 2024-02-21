import { Prisma } from "@/lib/prisma";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { hasPermissions } from "@/lib/utils/permissions";
import { Permission } from "@/types";
import { del, put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { imgb64ToFile } from "./utils/images";
import { eventConfig } from "@/lib/config";

/**
 * The events router
 */
export const eventsRouter = {
  getEvent: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const event = await Prisma.getEventById(input.id);

      if (!event) {
        return {
          success: false,
          message: "Event not found",
          event: null,
        };
      }

      return {
        success: true,
        message: "Success",
        event,
      };
    }),

  getEvents: publicProcedure.mutation(async () => {
    const events = await Prisma.getAllEvents();

    return {
      success: true,
      message: "Success",
      events,
    };
  }),

  createEvent: publicProcedure
    .input(
      z.object({
        auth: z.string(),
        event: z.object({
          title: z.string(),
          description: z.string(),
          location: z.string(),
          visible: z.boolean(),
          formUrl: z.string(),
          date: z.string(),
          price: z.number(),
          image: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const authUser = await Prisma.getUserBySecret(input.auth);
      if (!authUser) {
        return {
          success: false,
          message: "User not found",
          event: null,
        };
      }

      if (!hasPermissions(authUser.permissions, [Permission.CREATE_EVENT])) {
        return {
          success: false,
          message: "User does not have permission",
          event: null,
        };
      }

      let eventImageUrl = input.event.image || eventConfig.event.image;

      if (input.event.image && input.event.image !== eventConfig.event.image) {
        try {
          if (eventImageUrl && eventImageUrl !== eventConfig.event.image) {
            const file = await imgb64ToFile(eventImageUrl, "event-image");
            const fileId = uuidv4();
            const blob = await put(fileId, file, {
              access: "public",
            });

            eventImageUrl = blob.url;
          }
        } catch (e) {
          return {
            success: false,
            message: "Internal error",
            event: null,
          };
        }
      }

      const event = await Prisma.createEvent({
        ...input.event,
        id: uuidv4(),
        image: eventImageUrl,
      });

      if (!event) {
        return {
          success: false,
          message: "Internal error",
          event: null,
        };
      }

      return {
        success: true,
        message: "Success",
        event,
      };
    }),

  updateEvent: publicProcedure
    .input(
      z.object({
        id: z.string(),
        auth: z.string(),
        event: z.object({
          title: z.string(),
          description: z.string(),
          location: z.string(),
          visible: z.boolean(),
          formUrl: z.string(),
          date: z.string(),
          price: z.number(),
          image: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const authUser = await Prisma.getUserBySecret(input.auth);
      if (!authUser) {
        return {
          success: false,
          message: "User not found",
          event: null,
        };
      }

      if (!hasPermissions(authUser.permissions, [Permission.EDIT_EVENT])) {
        return {
          success: false,
          message: "User does not have permission",
          event: null,
        };
      }

      const prevEvent = await Prisma.getEventById(input.id);
      if (!prevEvent) {
        return {
          success: false,
          message: "Event not found",
          event: null,
        };
      }

      let eventImageUrl = input.event.image || prevEvent.image;

      if (input.event.image && input.event.image !== prevEvent.image) {
        try {
          if (prevEvent.image !== eventConfig.event.image) {
            await del(prevEvent.image);
          }

          if (eventImageUrl && eventImageUrl !== eventConfig.event.image) {
            const file = await imgb64ToFile(eventImageUrl, "event-image");
            const fileId = uuidv4();
            const blob = await put(fileId, file, {
              access: "public",
            });

            eventImageUrl = blob.url;
          }
        } catch (e) {
          return {
            success: false,
            message: "Internal error",
            event: null,
          };
        }
      }

      const event = await Prisma.updateEvent(input.id, {
        ...input.event,
        id: input.id,
        image: eventImageUrl,
      });

      if (!event) {
        return {
          success: false,
          message: "Internal error",
          event: null,
        };
      }

      return {
        success: true,
        message: "Success",
        event,
      };
    }),

  deleteEvent: publicProcedure
    .input(z.object({ id: z.string(), auth: z.string() }))
    .mutation(async ({ input }) => {
      const authUser = await Prisma.getUserBySecret(input.auth);
      if (!authUser) {
        return {
          success: false,
          message: "User not found",
          event: null,
        };
      }

      if (!hasPermissions(authUser.permissions, [Permission.DELETE_EVENT])) {
        return {
          success: false,
          message: "User does not have permission",
          event: null,
        };
      }

      const event = await Prisma.getEventById(input.id);
      if (!event) {
        return {
          success: false,
          message: "Event not found",
          event: null,
        };
      }

      try {
        if (event.image.length && event.image !== eventConfig.event.image) {
          await del(event.image);
        }
      } catch (e) {
        return {
          success: false,
          message: "Internal error",
          event: null,
        };
      }

      const deleted = await Prisma.deleteEvent(input.id);
      if (!deleted) {
        return {
          success: false,
          message: "Internal error",
          event: null,
        };
      }

      return {
        success: true,
        message: "Success",
        event,
      };
    }),
};
