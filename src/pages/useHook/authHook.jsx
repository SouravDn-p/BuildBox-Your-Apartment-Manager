import { useContext } from "react";
import { AuthContexts } from "../../authProvider/AuthProvider";

export default function authHook() {
  const auth = useContext(AuthContexts);
  return auth;
}
