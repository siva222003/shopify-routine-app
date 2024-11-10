import jwt from "jsonwebtoken";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { useActionData, useSubmit } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const PAYLOAD = {
    id: 7790335820029,
  };

  const JWT_SECRET = "jwt-secret-for-Doc-Backend-App";

  try {
    const token = jwt.sign(PAYLOAD, JWT_SECRET, { expiresIn: "7d" });

    return json({ success: true, token });
  } catch (error) {
    return json({ success: false, token: null, error });
  }
}

const Bro = () => {
  const submit = useSubmit();

  const actionData = useActionData<typeof action>();

  console.log({ actionData });

  return (
    <div>
      <h1>Hello</h1>

      <button
        onClick={() => {
          submit(null, {
            method: "POST",
          });
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Bro;
