import { NextRequest } from "next/server";
import { presenceHub } from "@/server/presenceHub";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      console.log(`[api/presence/stream] subscribe`, { ids });
      let closed = false;

      const cleanup = () => {
        closed = true;
        if (off) off();
      };

      try {
        presenceHub.requestPresencesFor?.(ids);
      } catch { }

      const snapshot = presenceHub.getSnapshot(ids);
      const enc = new TextEncoder();

      if (!closed) {
        controller.enqueue(enc.encode(`event: snapshot\n`));
        controller.enqueue(enc.encode(`data: ${JSON.stringify(snapshot)}\n\n`));
      }

      const off = presenceHub.onPresence((p) => {
        if (closed) return;
        if (ids.length && !ids.includes(p.discord_user.id)) return;

        controller.enqueue(enc.encode(`event: update\n`));
        controller.enqueue(enc.encode(`data: ${JSON.stringify(p)}\n\n`));
      });

      req.signal?.addEventListener('abort', cleanup);

      return cleanup;
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      connection: "keep-alive",
    },
  });
}


