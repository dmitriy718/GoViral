declare module '@prisma/client' {
  export class PrismaClient {
    [key: string]: any;
  }

  export type User = Record<string, unknown>;
  export type Post = Record<string, unknown>;
  export type Integration = Record<string, unknown>;
}
