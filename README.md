# matyldadymek.co.uk

Portfolio site of Matylda Dymek, film and video editor.

## Editing the site

The easy way: sign in at **https://app.pagescms.org** with this GitHub account, open `matylda-site`, and edit films, the homepage selection and the contact page in simple forms. Saving updates the live site within a minute or two.

By hand: everything you'd ever change is in the `content/` folder.

| File | What it holds |
|---|---|
| `content/site.yml` | Your name and the contact page |
| `content/categories.yml` | The sections on the Work page, in order |
| `content/videos/*.yml` | The films in each section |

Each film looks like this:

```yaml
- title: Silence Radio
  tagline: Difficult choices          # shown in the pop-up
  link: https://vimeo.com/192494313   # Vimeo/YouTube play on the site; other links open in a new tab
  featured: 3                         # optional: position on the homepage
  corner: bottom-right                # optional: top-left, top-right, bottom-left, bottom-right
  image: images/silence-radio.jpg     # optional: your own thumbnail
```

Rules: keep the indentation, put a title in quotes if it contains a colon, and start every film with `- title:`. GitHub keeps every earlier version, so any mistake can be undone.

## Design

Colours, font and spacing are in `style.css` (the palette is at the top). Behaviour is in `app.js`.
