import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

export default function RequireAdmin({
  children,
}) {
  const [status, setStatus] =
    useState("checking");

  useEffect(() => {
    let cancelled = false;

    const checkRole = async () => {
      try {
        const response =
          await fetch(
            `${API_URL}/api/users/profile`,
            {
              credentials:
                "include",
            }
          );

        if (!response.ok) {
          if (!cancelled) {
            setStatus(
              "unauthorized"
            );
          }

          return;
        }

        const user =
          await response.json();

        if (cancelled) {
          return;
        }

        if (
          user.role === "admin"
        ) {
          setStatus(
            "allowed"
          );
        } else {
          setStatus(
            "forbidden"
          );
        }

      } catch (error) {
        console.log(
          "ADMIN CHECK ERROR:",
          error
        );

        if (!cancelled) {
          setStatus(
            "unauthorized"
          );
        }
      }
    };

    checkRole();

    return () => {
      cancelled = true;
    };
  }, []);

  if (
    status === "checking"
  ) {
    return null;
  }

  if (
    status === "allowed"
  ) {
    return children;
  }

  return (
    <Navigate
      to="/login"
      replace
    />
  );
}