import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const cookie = serialize("customUser", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  res.setHeader("Set-Cookie", cookie);
  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
}
