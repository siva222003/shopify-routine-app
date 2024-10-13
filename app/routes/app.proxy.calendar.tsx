import React from "react";
import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";
import fs from "fs/promises"; // Use 'fs/promises' for async file operations
import path from "path";
import { fileURLToPath } from "url";
import { json } from "@remix-run/node";
import { useActionData, useSubmit } from "@remix-run/react";
import { authenticate as bro } from "../shopify.server";

// Convert ES module's file URL to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function action({ request }) {
  const { session, admin } = await bro.public.appProxy(request);

  if (!session) {
    return json({ success: "UnAuthorized" });
  }

  console.log("Action called");

  const CREDENTIALS_PATH = path.join(__dirname, "../data/credentials.json");
  const TOKEN_PATH = path.join(__dirname, "../data/token.json");
  const SCOPES = [
    "https://www.googleapis.com/auth/tasks",
    "https://www.googleapis.com/auth/calendar",
  ];

  async function loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH, "utf8");
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      console.error("Error loading saved credentials:", err.message);
      return null;
    }
  }

  async function saveCredentials(client) {
    try {
      const content = await fs.readFile(CREDENTIALS_PATH, "utf8");
      const keys = JSON.parse(content);
      const key = keys.installed || keys.web;
      const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
      });
      await fs.writeFile(TOKEN_PATH, payload);
    } catch (error) {
      console.error("Error saving credentials:", error.message);
    }
  }

  async function authorize() {
    try {
      let client = await loadSavedCredentialsIfExist();
      if (client) {
        return client;
      }
      client = await authenticate({
        keyfilePath: CREDENTIALS_PATH,
        scopes: SCOPES,
      });
      if (client.credentials) {
        await saveCredentials(client);
      }
      return client;
    } catch (error) {
      console.error("Error during authorization:", error.message);
      throw error; // Propagate the error to the caller
    }
  }

  async function createTask(auth, title, notes, dueDate) {
    try {
      const service = google.tasks({ version: "v1", auth });
      const task = {
        title: title,
        notes: notes,
        due: dueDate,
      };
      const res = await service.tasks.insert({
        tasklist: "@default",
        requestBody: task,
      });
      console.log("Task created successfully:", res.data);
    } catch (error) {
      console.error("Error creating task:", error.message);
    }
  }

  async function createReminderEvent(
    auth,
    summary,
    description,
    reminderDateTime,
  ) {
    try {
      const calendar = google.calendar({ version: "v3", auth });
      const event = {
        summary: summary,
        description: description,
        start: {
          dateTime: reminderDateTime,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: reminderDateTime,
          timeZone: "Asia/Kolkata",
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 0 },
            { method: "popup", minutes: 0 },
          ],
        },
      };
      const res = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });
      console.log("Reminder event created:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error creating reminder event:", error.message);
      return null;
    }
  }

  async function main() {
    try {
      const auth = await authorize();

      const reminderSummary = "Task Reminder";
      const reminderDescription = "Don't forget to finish your task!";
      const reminderDateTime = new Date(
        new Date().getTime() + 10000,
      ).toISOString(); // Reminder set for 10 seconds from now

      const response = await createReminderEvent(
        auth,
        reminderSummary,
        reminderDescription,
        reminderDateTime,
      );

      return response;
    } catch (error) {
      console.error("Error in main function:", error.message);
      return null;
    }
  }

  const response = await main();

  return json({ data: response });
}
