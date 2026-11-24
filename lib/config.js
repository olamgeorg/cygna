// Publishable key is designed to be public (protected by RLS). NEVER put a service_role key here.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qoyyfjaxxhjrpkgzkuby.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Qc1hUwDlf90V3WNSzxBpog_ddx5HpQG";
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "2349134088925";
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cygna.com.ng";
export const naira = (n) => "₦" + Number(n || 0).toLocaleString("en-NG");
// Fallback payment details (editable in /admin > Settings, stored in site_settings table)
export const PAY_DEFAULT = { bank: "OPay", account_number: "9159163729", account_name: "Olamide George Ajibade", phone: "09134088925" };
