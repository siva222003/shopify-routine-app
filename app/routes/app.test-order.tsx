import { useActionData, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import TestModel from "../models/TestModel";
import { db } from "../db.server";
import mongoose from "mongoose";
import { authenticate } from "~/shopify.server";
import { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    query {
      orders(first: 10) {
        edges {
          node {
            id
            updatedAt
          }
        }
      }
  }`,
  );

  const data = await response.json();

  return Response.json({ data });
}

const Test = () => {
  const submit = useSubmit();

  const data = useActionData();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      <h1>Hello Test</h1>
      <button
        onClick={() => {
          submit({}, { method: "POST" });
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Test;
