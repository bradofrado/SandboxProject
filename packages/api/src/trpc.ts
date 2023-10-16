/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { initTRPC, TRPCError } from "@trpc/server";
import type { PrismaClient } from "db/lib/prisma";
import { prisma } from "db/lib/prisma";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Container } from "inversify";
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from "@clerk/nextjs";
import type { AuthContext } from "model/src/auth";
import { DocumentService} from "./services/documents/document-service";
import { testContainer } from "./containers/inversify.test.config";
import 'reflect-metadata'
import { PatientService } from "./services/patient/patient-service";
import { MedicalRegistry } from "./services/medical/medical-registry";
import { AttorneyRegistry } from "./services/attorney/attorney-registry";
import { ProviderAccountRepository } from "./repository/provider-account";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
interface CreateContextOptions {
	container: Container,
	auth: AuthContext
}

export interface TRPCContext {
	prisma: PrismaClient,
	medicalRegistry: MedicalRegistry,
	attorneyRegistry: AttorneyRegistry,
	documentService: DocumentService,
	patientService: PatientService,
	providerAccountRepository: ProviderAccountRepository,
	auth: AuthContext
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = ({container, auth}: CreateContextOptions): TRPCContext => {
  return {
    prisma,
		medicalRegistry: container.get<MedicalRegistry>(MedicalRegistry.$),
		attorneyRegistry: container.get<AttorneyRegistry>(AttorneyRegistry.$),
		documentService: container.get<DocumentService>(DocumentService.$),
		patientService: container.get<PatientService>(PatientService.$),
		providerAccountRepository: container.get<ProviderAccountRepository>(ProviderAccountRepository.$),
		auth
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions): Promise<TRPCContext> => {
	const {req, res: _2} = opts;

	
	//TODO: Get the needed apis from the user session
	const container = testContainer;
	const {userId} = getAuth(req);
	const user = userId ? await clerkClient.users.getUser(userId) : undefined;
	const ourAuth = !userId || !user ? null : {userId, user: {id: user.id, name: `${user.firstName} ${user.lastName}`, image: user.imageUrl}}

	return createInnerTRPCContext({container, auth: ourAuth});
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

// check if the user is signed in, otherwise throw a UNAUTHORIZED CODE
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  })
})

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
