export async function onRequestGet({ params, env }) {
  const content = await env.POSTS.get(params.id);
  if (!content) return new Response("Post not found", { status: 404 });

  return new Response(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AnonPost</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<article>
${content}
</article>
</body>
</html>
  `, { headers: { "Content-Type": "text/html" } });
}
