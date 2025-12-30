export async function onRequestGet({ params, env }) {
  const postDataRaw = await env.POSTS.get(params.id);
  if (!postDataRaw) return new Response("Post not found", { status: 404 });

  const postData = JSON.parse(postDataRaw);
  const content = postData.content;
  const title = postData.title;
  let ogImage = postData.ogImage;

  // Auto pick first image if OG not set
  if (!ogImage) {
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
    if (imgMatch) ogImage = imgMatch[1];
  }

  const description = content.replace(/<[^>]*>/g, "").slice(0, 100);

  return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
${ogImage ? `<meta property="og:image" content="${ogImage}">` : ""}
<meta property="og:type" content="article">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  body {
    font-family: sans-serif;
    padding: 20px;
    line-height: 1.5;
    margin: 0;
    background: inherit; /* adapt to Telegram IV theme */
    color: inherit;
  }
  article {
    max-width: 700px;
    margin: auto;
  }

  /* Text formatting */
  h1,h2,h3 { margin: 15px 0 10px; }
  p { margin: 10px 0; }
  strong { font-weight: bold; }
  em { font-style: italic; }
  u { text-decoration: underline; }
  s { text-decoration: line-through; }
  a { color: #0645AD; text-decoration: underline; }
  
  /* Lists */
  ul, ol { margin: 10px 0 10px 20px; }
  li { margin: 5px 0; }

  /* Images & videos */
  img, video { max-width: 100%; height: auto; margin: 10px 0; }

  /* Text alignments */
  .ql-align-center { text-align: center; }
  .ql-align-right { text-align: right; }
  .ql-align-justify { text-align: justify; }

  /* Font sizes */
  .ql-size-small { font-size: 0.75em; }
  .ql-size-large { font-size: 1.25em; }
  .ql-size-huge { font-size: 1.5em; }

  /* Colors applied by Quill */
  .ql-color-red { color: red; }
  .ql-color-blue { color: blue; }
  .ql-color-green { color: green; }
  .ql-bg-yellow { background-color: yellow; }
  .ql-bg-pink { background-color: pink; }
  /* Add more colors if needed */
</style>
</head>
<body>
<article>
  <h1>${title}</h1>
  <div class="content">
    ${content}
  </div>
</article>
</body>
</html>
  `, { headers: { "Content-Type": "text/html" } });
}
