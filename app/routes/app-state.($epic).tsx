import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { appStateActions, getAppState } from "~/remux_module/appState";

export const clientAction = async ({
  request,
  params,
}: ClientActionFunctionArgs) => {
  const { epic: epicKey } = params as { epic: string | undefined };
  const { action, payload } = await request.json();
  if (action && appStateActions[action]) {
    await appStateActions[action](payload);
    const value = await getAppState(epicKey);
    console.log(`${action}`, value);
    return value;
  }
  return { error: `Invalid action: ${action}` };
};

export const clientLoader = async ({
  request,
  params,
}: ClientLoaderFunctionArgs) => {
  const { epic: epicKey } = params as { epic: string | undefined };
  return await getAppState(epicKey);
};
