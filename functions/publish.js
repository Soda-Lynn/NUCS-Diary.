export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    if (!data.content) return new Response("No content", { status: 400 });

    // Generate random post ID
    const id = Math.random().toString(36).slice(2, 8);

    // Save HTML content in KV storage
    await env.POSTS.put(id, data.content);

    // Return JSON with post URL
    return new Response(JSON.stringify({ url: `/p/${id}` }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
