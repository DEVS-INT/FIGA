import { redirect } from "next/navigation";

export default function StaffRootRedirect() {
  redirect("/staff/dashboard");
}
