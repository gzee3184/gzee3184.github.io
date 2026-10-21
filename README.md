# gazi fahim abrar, personal site

Plain HTML, CSS, and a little JS. No build step. Deploys as-is to GitHub Pages.

## Run locally

```
python -m http.server 8000
```

Then open http://localhost:8000. Blog posts load with `fetch`, so opening the files directly (file://) won't show them.

## Add a post

1. Write `writing/posts/<slug>.md` in Markdown.
2. Add an entry to `assets/posts.js`, newest first:

```js
{ slug: "my-post", title: "my post", date: "2026-11-01", excerpt: "One line." }
```

`draft: true` hides a post. The home page shows the latest three.

## Files

- `index.html`: the home page (about, news, work, experience, writing)
- `writing/index.html`: all posts
- `writing/post.html?p=<slug>`: one post
- `assets/style.css`: all styles, light and dark
- `assets/site.js`: dark mode toggle, footer easter eggs (synthesized sounds), post rendering
- `assets/posts.js`: the post list
