import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id: userId } = await ctx.params;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing user id" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const started = Date.now();
    console.log(`[api/discord/user] fetching`, { userId });

    const res = await fetch(
      `https://cheiodedinheiro.discloud.app/discord/user/${userId}`,
    );

    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({
          error: "Discord API error",
          status: res.status,
          body: text,
        }),
        { status: res.status, headers: { "content-type": "application/json" } },
      );
    }

    const data = await res.json();
    console.log(`[api/discord/user] ok`, { userId, ms: Date.now() - started });
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: unknown) {
    console.error(`[api/discord/user] error`, err);
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: String(err) }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
}
