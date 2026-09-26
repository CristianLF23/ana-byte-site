# Ana Byte V3 asset inventory

All files below are byte unchanged copies from `ana-byte-site/assets/images/`. The V3 catalogue in `data/catalog.js` is the single artwork data source. Dimensions are source pixel dimensions.

## Tattoos and artwork

| V3 path | Source | Dimensions | Use |
| --- | --- | ---: | --- |
| `assets/tattoos/02-heart-box.jpg` | `02-heart-box.jpg` | 336 x 474 | Núcleo sensível |
| `assets/tattoos/03-jinx.jpg` | `03-jinx.jpg` | 335 x 494 | Caos em neon |
| `assets/tattoos/04-cyber-warrior.jpg` | `04-cyber-warrior.jpg` | 331 x 495 | Um rosto. Outro mundo. |
| `assets/tattoos/05-embrace-void.jpg` | `05-embrace-void.jpg` | 388 x 748 | Embrace the void, arte digital |
| `assets/tattoos/06-fill-void.jpg` | `06-fill-void.jpg` | 418 x 818 | Fill the void, arte digital |
| `assets/tattoos/07-neon-panel.jpg` | `07-neon-panel.jpg` | 656 x 956 | Sinais de outro mundo, arte digital |
| `assets/tattoos/14-couple-illustration.jpg` | `14-couple-illustration.jpg` | 738 x 1122 | Entre nós, arte digital |
| `assets/tattoos/17-ladybug.jpg` | `17-ladybug.jpg` | 920 x 930 | Natureza reprogramada |
| `assets/tattoos/18-cyber-horse.jpg` | `18-cyber-horse.jpg` | 791 x 1150 | Anatomia do futuro |
| `assets/tattoos/19-neon-portrait.jpg` | `19-neon-portrait.jpg` | 1118 x 1280 | Entre pele e circuito |
| `assets/tattoos/20-dual-souls.jpg` | `20-dual-souls.jpg` | 1114 x 1280 | Dois mundos, um encontro |
| `assets/tattoos/21-cyber-instinct.jpg` | `21-cyber-instinct.jpg` | 1051 x 1280 | Instinto em neon |
| `assets/tattoos/22-neon-raven.jpg` | `22-neon-raven.jpg` | 1137 x 1280 | O voo da noite |

The artwork folder includes genuine tattoo photographs and genuine digital artwork photographs because this V3 asset pack has no separate digital source folder. No image was generated, recolored, cropped, or retouched.

## Process composites

These are the only source files that visibly contain a drawing or digital study paired with a tattoo result. They are kept as complete composites; no missing stages were inferred.

| V3 path | Source | Dimensions | Pair represented |
| --- | --- | ---: | --- |
| `assets/process/08-hunter-process.jpg` | `08-hunter-process.jpg` | 666 x 878 | Instinto sintético |
| `assets/process/09-heart-process.jpg` | `09-heart-process.jpg` | 632 x 874 | Coração exposto |
| `assets/process/10-symbiote-process.jpg` | `10-symbiote-process.jpg` | 657 x 847 | Outra forma de existir |
| `assets/process/11-dagger-process.jpg` | `11-dagger-process.jpg` | 630 x 834 | Corte de luz |
| `assets/process/12-cat-process.jpg` | `12-cat-process.jpg` | 662 x 829 | A noite tem olhos |
| `assets/process/13-vampire-process.jpg` | `13-vampire-process.jpg` | 659 x 827 | Depois da meia-noite |

## Artist and studio

| V3 path | Source | Dimensions | Use |
| --- | --- | ---: | --- |
| `assets/artist/15-ana-working.jpg` | `15-ana-working.jpg` | 863 x 1145 | Ana working, primary artist portrait |
| `assets/artist/16-studio.jpg` | `16-studio.jpg` | 921 x 1140 | Studio environment |
| `assets/artist/23-ana-studio.jpg` | `23-ana-studio.jpg` | 1284 x 1593 | Ana in studio |

## Logo and contact source notes

No official standalone logo asset was found in the project or supplied materials. The final V3 mark is `assets/ui/ana-byte-mark.png`, isolated from the lettering in the approved mockup (not rebuilt with a font). It is a reference-derived raster asset, not an official vector logo. The contact values retained in `data/catalog.js` are the existing V1 values: WhatsApp `+55 11 91900 7582`, Instagram `@ana.byte`, and São Paulo studio address `Rua Sen. Felício dos Santos, 373`.

## Final environment and identity sources

Original approved desktop crop: `C:/Users/crist.PC/AppData/Local/Temp/codex-clipboard-2858e2d4-094c-4b30-84ad-0052e35b2a41.png`.

Original approved mobile crop: `C:/Users/crist.PC/AppData/Local/Temp/codex-clipboard-7612f301-6faf-4e7c-8731-86a4f4ab05b3.png`.

Cat identity reference: `C:/Users/crist.PC/AppData/Local/Temp/codex-clipboard-51880158-8555-4bec-a0b7-45d2a1f94e05.png`.

Final edited PNGs retained outside the public website:

- Desktop: `C:/Users/crist.PC/.codex/generated_images/01a0c614-ebfb-7a53-a3f7-1e4594d7e148/exec-1f56f3db-41d3-4f6c-afe1-132ca15dba43.png` (2017 × 780).
- Mobile: `C:/Users/crist.PC/.codex/generated_images/01a0c614-ebfb-7a53-a3f7-1e4594d7e148/exec-12c2cdcb-d00f-46b2-bb30-2e66f2839ef9.png` (828 × 1900).

Edit directions: retain the approved scene's architecture, perspective, illustrated Ana, signs and relative positions; remove rasterized interactive UI so the interface is real HTML; edit the environmental cat to match the supplied green eyes and asymmetrical white forehead, muzzle, chest and paws. Avoid duplicate edges, ghosting, invented tattoos and replacement people. These directions summarize the edits, not a verbatim record of generation prompts.

Runtime WebPs: `city-desktop.webp`, `city-1280.webp`, `city-mobile.webp`, `city-mobile-600.webp`. The foreground occlusion layer reuses the same image with a CSS polygon. No real portfolio photograph went through image generation.

Logo source: approved mobile board `codex-clipboard-5b1cbad9-ce33-43e2-8b79-416ca3afcc58.png`, isolated by `qa/prepare-fidelity-assets.cjs`.

Active heading font: `Orbitron-Variable.ttf`, under `Orbitron-OFL.txt`. Inactive font experiments are not loaded. Runtime GSAP files preserve their upstream license headers.

## Featured candidates

The recommended four featured works for the V3 first pass are `Anatomia do futuro` (horse), `O voo da noite` (raven), `Entre pele e circuito` (portrait), and `Instinto em neon` (creature). Their catalogue order is 1 through 4 so the UI can consume this selection without duplicating paths.
