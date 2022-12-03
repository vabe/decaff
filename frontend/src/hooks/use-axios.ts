import { useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function useAxios() {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URI;

  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      axios.defaults.headers["Authorization"] = `Bearer ${session.accessToken}`;
    } else {
      axios.defaults.headers["Authorization"] = "Bearer unauthorized";
    }
  }, [session, status]);

  return axios;
}
