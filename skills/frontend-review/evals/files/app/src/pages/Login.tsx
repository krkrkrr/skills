import { useSearchParams } from "react-router-dom";
import { client } from "../api/client";

export function Login() {
  const [params] = useSearchParams();
  async function onSubmit(email: string, password: string) {
    const res = await client.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    window.location.href = params.get("next") ?? "/";
  }
  return <form onSubmit={(e) => { e.preventDefault(); onSubmit("a", "b"); }} />;
}
