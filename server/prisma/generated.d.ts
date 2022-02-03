import type { Prisma, User } from "/home/dmitry/Projects/world-domination/server/node_modules/.pnpm/@prisma+client@3.9.1_prisma@3.9.1/node_modules/@prisma/client";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: never;
        Where: Prisma.UserWhereUniqueInput;
        Fields: never;
        ListRelations: never;
        Relations: {};
    };
}