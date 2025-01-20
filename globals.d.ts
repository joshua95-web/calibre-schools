export {};

export type Roles = "admin" | "moderator" | "school_admin";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
