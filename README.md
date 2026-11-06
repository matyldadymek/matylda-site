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
```

Rules: keep the indentation, put a title in quotes if it contains a colon, and start every film with `- title:`. GitHub keeps every earlier version, so any mistake can be undone.

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

## Still to do (as of 6 Nov 2026)

- [ ] Upload a thumbnail for each film (`images/` folder + `image:` line), 16:9, about 1280×720.
- [ ] Screenshots of the websites for *Everything I Ever Wanted…* and *My Friend the Polish Girl* (shown in their pop-ups).
- [ ] BEASTS: test the Vimeo mature-content check in the pop-up (private window, logged out). If it gets stuck, switch it to a "Watch on Vimeo" button.
- [ ] Films with no video link yet: *Stina Ekblad and the Music*, *Rencontre(s) avec Michel Déon*, *Święta Lipka*, *ON/HE*.
- [ ] Move Dropbox / Wix films to Vimeo: *Fin d'Été*, *Födelsedag*, *BBC – An overall look*, *Święta w Warszawie*, *Expresso*.
- [ ] *Przyjdź do mnie*: replace the private Vimeo dashboard link with the public one.
- [ ] *Stats and emotions*: same Vimeo link as *Olympic Confessions* – check.
- [ ] Try the editing dashboard at app.pagescms.org.
- [ ] When happy: point matyldadymek.co.uk to this site, check it, then cancel Weebly (keep the domain).
