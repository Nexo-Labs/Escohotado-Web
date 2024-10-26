import { signOut } from "@/plugins/authjs/plugin";

export function SignOutButtonAuthjs() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign Out (auth.js)</button>
    </form>
  );
}
