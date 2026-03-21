import * as api from "@/lib/api";
import Client from "./client";

export default async function ApiTestPage() {
  const apiResult = await api.getUserTest();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p>server API Result: {apiResult}</p>
      </div>
      <div>
        <Client />
      </div>
    </div>
  );
}
