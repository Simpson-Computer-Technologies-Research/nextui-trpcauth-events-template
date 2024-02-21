import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { emailRouter } from "./routers/email";
import { usersRouter } from "./routers/users";
import { eventsRouter } from "./routers/events";

export const appRouter = router({
  ...authRouter,
  ...emailRouter,
  ...usersRouter,
  ...eventsRouter,
});

export type AppRouter = typeof appRouter;
