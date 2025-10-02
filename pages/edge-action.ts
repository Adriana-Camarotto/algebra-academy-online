import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const clientData = await req.json();

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/secure-action`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData),
    }
  );

  const result = await response.json();

  return NextResponse.json(result);
}
