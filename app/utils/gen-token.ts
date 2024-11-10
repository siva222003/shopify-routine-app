import jwt from "jsonwebtoken";

export const genToken = (PAYLOAD: { id: number }) => {
  //   const PAYLOAD = {
  //     id: 7790335820029,
  //   };


  console.log("Payload:", PAYLOAD);

  const JWT_SECRET = "jwt-secret-for-Doc-Backend-App";

  try {
    const token = jwt.sign(PAYLOAD, JWT_SECRET, { expiresIn: "7d" });

    return token;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  return jwt.verify(token, "jwt-secret-for-Doc-Backend-App", (err, decoded) => {
    if (err) {
      return true;
    }
    return false;
  });
};
