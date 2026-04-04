import { createHmac, randomUUID } from "crypto";

function getCredentials() {
  const token = process.env.SWITCHBOT_TOKEN;
  const secret = process.env.SWITCHBOT_SECRET;
  if (!token || !secret) {
    throw new Error("SWITCHBOT_TOKEN and SWITCHBOT_SECRET must be set");
  }
  return { token, secret };
}

function buildHeaders() {
  const { token, secret } = getCredentials();
  const t = Date.now().toString();
  const nonce = randomUUID();
  const data = token + t + nonce;

  const sign = createHmac("sha256", secret)
    .update(data)
    .digest("base64");

  return {
    Authorization: token,
    sign,
    nonce,
    t,
    "Content-Type": "application/json",
  };
}

export async function sendSwitchBotCommand(
  deviceId: string,
  command: "turnOn" | "turnOff"
) {
  const url = `https://api.switch-bot.com/v1.1/devices/${deviceId}/commands`;

  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      command,
      parameter: "default",
      commandType: "command",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SwitchBot API error: ${res.status} ${body}`);
  }

  return res.json();
}
