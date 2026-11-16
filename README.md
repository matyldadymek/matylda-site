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

## Still to do (plan for 17 Nov 2026)

**1. Text: titles and descriptions**
- [ ] Go through every film, section by section. The title shows on the thumbnail; the short description shows only in the pop-up.
  - [ ] Fiction (12 films)
  - [ ] Documentary (12 films)
  - [ ] Broadcast & streaming (10 films)
  - [ ] Short form (10 films)
  - [ ] Motion graphics (3 films)
- [ ] Make the style consistent: brand prefixes ("Eurosport –", "WBD Sports –"), capitals, and descriptions that just say "Instagram".
- [ ] The text on the contact page.

**2. Order of films in each section**
- [ ] Decide the order inside each section (top-left first). The **All** filter on the Work page follows the same order, section by section.
- [ ] Check the homepage nine still feel right afterwards.

**3. Mobile site**
- [ ] On your phone, check: homepage, Work filters (swipe sideways), a few pop-ups (Vimeo, YouTube, BEASTS, a website film), contact page.
- [ ] Screenshot anything that looks off.

**4. Films that still need something**
- [ ] *Rencontre(s) avec Michel Déon* and *Święta Lipka*: no video link – find one or remove them.
- [ ] *Stats and emotions* (Motion graphics) uses the same Vimeo link as *Eurosport – Olympic Confessions* – check.
- [ ] *Inside Out* is off the site until you have an open link (vimeo.com/42556875 is password-protected on someone else's account).
- [ ] *French cycling star*: the thumbnail looks like a press photo – check you may use it, or use a still from your edit.

**5. Finishing touches**
- [ ] A small icon for the browser tab.
- [ ] The preview picture and text that appear when someone shares your link (WhatsApp, LinkedIn, email).

**6. Go live**
- [ ] Point matyldadymek.co.uk to this site, check everything on the real address, then cancel Weebly (keep the domain).
