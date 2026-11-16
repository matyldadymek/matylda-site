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
  colour: rose                        # optional: green, lime, rose, mauve, sage, olive, clay, plum, forest, ink
  image: images/silence-radio.jpg     # optional: your own thumbnail
  fill: true                          # optional: crop black bars baked into an old 4:3 video
  mature: true                        # optional: adult film – shows a notice and a 'Watch on Vimeo' button
```

Rules: keep the indentation, put a title in quotes if it contains a colon, and start every film with `- title:`. GitHub keeps every earlier version, so any mistake can be undone.

Tip: when you replace a thumbnail, upload it under a **new file name** (e.g. `beasts-3.jpg`) and update the `image:` line. Browsers keep old images for up to 10 minutes, and a new name makes everyone see the new one straight away.

## Triangle colours

| name | colour | name | colour |
|---|---|---|---|
| green | #89C787 | sage | #768776 |
| lime | #B6C787 | olive | #6B725A |
| rose | #C79087 | clay | #725D5A |
| mauve | #C787AA | plum | #725A67 |
| forest | #2D472C | ink | #2C3317 |

Films without a colour get one automatically, arranged so neighbours never match.

## Design

Colours, font and spacing are in `style.css` (the palette is at the top). Behaviour is in `app.js`.

## Still to do (as of 16 Nov 2026)

- [ ] Go through every film's **title and short description** (shown in the pop-up), section by section.
- [ ] Films with no video link: *Stina Ekblad and the Music*, *Rencontre(s) avec Michel Déon*, *Święta Lipka* – find links, or remove them.
- [ ] *Stats and emotions* (Motion graphics) uses the same Vimeo link as *Eurosport – Olympic Confessions* – check.
- [ ] *Inside Out* removed for now (password-protected on someone else's Vimeo, vimeo.com/42556875). Add back when you have an open link.
- [ ] *French cycling star* thumbnail looks like a press photo – check you may use it, or swap for a still from your edit.
- [ ] Try the editing dashboard at app.pagescms.org.
- [ ] When happy: point matyldadymek.co.uk to this site, check it, then cancel Weebly (keep the domain).
