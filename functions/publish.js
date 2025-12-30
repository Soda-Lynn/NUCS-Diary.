export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    if (!data.content) return new Response("No content", { status: 400 });

    const id = Math.random().toString(36).slice(2, 8);
    const postData = JSON.stringify({
      content: data.content,
      title: data.title || "NUCS Diary Post",
      ogImage: data.ogImage || ""
    });

    await env.POSTS.put(id, postData);

    return new Response(JSON.stringify({ url: /p/${id} }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
