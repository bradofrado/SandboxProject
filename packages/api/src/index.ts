import { documentRouter } from "./routers/documents";
import { patientsRouter } from "./routers/patients";
import { setupRoute } from "./routers/setup";
import { trackingRouter } from "./routers/tracking";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  patients: patientsRouter,
	documents: documentRouter,
	setup: setupRoute,
	tracking: trackingRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
