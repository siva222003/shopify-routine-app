import { LoaderFunctionArgs } from "@remix-run/node";
import React from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return {
    message: "Hello",
  };
}

const Bro = () => {
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

export default Bro;
