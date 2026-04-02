import { getProfile } from "@/lib/api";
import SettingsAccountUI from "./UI";

export default async function AccountSettingsPage() {
  const profile = await getProfile();
  if (!profile.data || profile.error)
    return <div>프로필이 존재하지 않습니다.</div>;
  return <SettingsAccountUI profile={profile.data} />;
}
