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
  type: Short film                    # shown in the pop-up bar, after the title
  length: 12 min                      # full length of the project, shown in brackets
  clip: excerpt                       # optional: excerpt, trailer or teaser
  tagline: Difficult choices          # old description, only shown while type is empty
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

## Still to do (plan for 18 Nov 2026)

Done on 17 Nov: titles and descriptions (Fiction, Documentary, Broadcast & streaming, Short form), order of Documentary and Broadcast, "All" removed, pop-up text bar, 18+ notice for BEASTS, hello animation on the contact page, domain pointed to this site.

**1. Padlock (HTTPS) and Weebly**
- [ ] When GitHub has the certificate: Settings → Pages → tick **Enforce HTTPS**.
- [ ] Check https://www.matyldadymek.co.uk opens with the padlock, then cancel the Weebly website plan (keep the domain and email at GoDaddy).

**2. Phone check**
- [ ] Homepage, each Work section (swipe the section names sideways), a few pop-ups (Vimeo, YouTube, BEASTS, Whisky stories on Instagram), contact page with the hello animation.
- [ ] Screenshot anything that looks off.

**3. Order and homepage**
- [ ] Fiction: decide the order (top-left first).
- [ ] Check the homepage nine still feel right.

**4. Films that still need something**
- [ ] *Rencontre(s) avec Michel Déon* and *Święta Lipka*: no video link – find one or remove them.
- [ ] *Stats and emotions* (Motion graphics) uses the same Vimeo link as *Olympic Confessions* – check.
- [ ] *Inside Out* is off the site until you have an open link.
- [x] *French cycling star*: new thumbnail from your own edit (18 Nov).
- [ ] Motion graphics: the three films still have the old-style descriptions – update them like the other sections, or keep.

**5. Finishing touches**
- [x] A small icon for the browser tab (white M on green, 18 Nov).
- [x] The preview picture that appears when someone shares your link (`share.png`, 18 Nov).
- [ ] Optional: the blue letter outline in the hello animation in dark green.
