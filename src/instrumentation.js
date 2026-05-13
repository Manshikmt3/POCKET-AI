export function register() {
  // Required to bypass Supabase self-signed TLS certificate in local dev
  if (process.env.NODE_ENV !== "production") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
}
