# nabuguides

Free visual guides and build logs about AI, crypto, Web3, cybersecurity and emerging technology—in English and Farsi.

Built in public by Nabu — External Partnerships, Community & KOLs @ Ledger.

> Agents propose. Humans supervise. Hardware guarantees.

## Guide library

- **Build the Eye (Farsi):** a 16-chapter guide to a voice-controlled trading agent with physical Ledger approval.
- **Your first cloud agent task (English and Farsi):** a safe first experiment organizing a messy Desktop.
- **Your first offline agent task (Farsi):** run the same task locally with Ollama, Llama, and OpenCode.

## Publishing and canonical URLs

The public home is [www.nabulines.com/nabuguides/](https://www.nabulines.com/nabuguides/). This repository remains the source of truth. GitHub Pages builds `main`; the existing Nabulines Vercel project serves that static origin under `/nabuguides/` using project routing rules.

After adding or updating a guide, run `python3 scripts/update-seo.py` before committing. It refreshes canonical URLs, social metadata, article structured data, bilingual alternate links, and the sitemaps. Do not point new canonical URLs back at GitHub Pages.

The Vercel project also serves the generated `site-sitemap.xml` at `/sitemap.xml`, and this repository’s `robots.txt` at the domain root. The guides sitemap is available at `/nabuguides/sitemap.xml`.

The routing rules belong to the existing Vercel project `kol` in `nabus-projects-b8bca9ec`. Keep the exact home route before the catch-all: `/nabuguides/` rewrites to the origin `index.html`; regex `^/nabuguides/(.+)$` rewrites to `https://alisharafiiii.github.io/nabu-guides/$1`. Both `/nabuguides` and `/nabuguides/index.html` permanently redirect to the canonical home. All external rewrites strip the incoming `cookie` and `authorization` headers. Changes to project routes must be staged, previewed, and published; a GitHub content push does not modify them.

Keep the Google site-verification meta tag in `index.html` so the URL-prefix Search Console property retains verification. Submit `/nabuguides/sitemap.xml` for that property; the root sitemap also includes the main Nabulines home.

GitHub Pages does not provide configurable server-side redirects. `assets/site-move.js` forwards legacy HTML links in the browser, preserving the query and fragment. It only runs on the old GitHub hostname. Without JavaScript, the full guide still works and its canonical points to Nabulines. Readers with an existing Arc watchlist stay on the old origin so they can download their saved list before following the new link.

## Local preview

```bash
python3 -m http.server 4174
```

Then open `http://localhost:4174`.

## Author

- [Telegram](https://t.me/web3nabu)
- [Instagram](https://www.instagram.com/nabu.base.eth/)
- [X](https://x.com/nabu_lines)
- [LinkedIn](https://www.linkedin.com/in/ali-sharafi-nabu)

All guides are educational. Financial examples are not financial advice.
