export {};

export type Roles = "org:admin" | "moderator" | "school_admin";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
