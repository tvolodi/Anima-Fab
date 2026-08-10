# Tooling — options, costs, decisions

Working reference for the "BPM, honestly" series. Everything discussed so far, in one place.

**Status legend:** ✅ recommended · 🟡 viable alternative · ❌ discussed and rejected

> ⚠️ **Prices and licence terms below are from discussion, not from checking vendor sites
> on any particular date.** Verify current pricing and — especially — commercial-use terms
> for *your specific tier* before subscribing or publishing. See [Licensing](#licensing--the-one-thing-to-actually-check).

---

## 1. Animation / rendering — the core decision

This determines everything else, so it comes first.

| Tool | Status | What it is | Cost | Notes |
|---|---|---|---|---|
| **Remotion** | ✅ **primary recommendation** | React components → MP4. Write video as code. | Free for individuals/small teams; **company licence required above a size threshold** — check current terms | Best fit: you're a dev, the content is diagrams-as-data, and the same components can later drive an interactive web version. Renders headless in CI. |
| **Motion Canvas** | 🟡 strong alternative | TypeScript animation library, generator-based timing, has a visual editor | Free, MIT | More purpose-built for exactly this (technical/diagram explainers) than Remotion. Weaker ecosystem, no React reuse story. Genuinely close call. |
| **After Effects** | 🟡 industry default | Timeline motion graphics | ~$23/mo (single app) | Powerful, but every script change means re-doing layout by hand. For a *series*, that cost compounds badly. |
| **Blender (Grease Pencil)** | 🟡 free, capable | 2D animation inside a 3D app | Free | Excellent if you want hand-drawn character work later. Steep learning curve. Overkill for episode 1. |
| **Cartoon Animator 5** | 🟡 if characters arrive | 2D character animation, has auto lip sync + character library | ~$100–200 one-off, tiers vary | The pragmatic answer *if* the PM episodes need talking characters. Not needed for BPM. |
| **Adobe Character Animator** | 🟡 same use case | Webcam-driven puppets, real-time lip sync | Bundled w/ CC | Fast for talking heads. Limited otherwise. |
| **three.js** | ❌ rejected as platform | 3D in browser | Free | See [Platform](#5-platform). Fine as a *later* interactive companion, wrong as the delivery format. |
| **Meshy.ai → 3D pipeline** | ❌ rejected for now | AI 3D model generation | Subscription | See [The 3D trap](#the-3d-trap). |

### Why Remotion for this series specifically

The content is **diagrams defined as data**. Define a process once:

```ts
const marinaProcess = {
  nodes: [...],
  edges: [...],
}
```

and you get, for free:
- elements fading in on narration cues
- tokens animating along the *actual* flow paths
- the Act 2 overlay composing itself from the three inputs, rather than being drawn by hand
- reuse across episodes — same process, examined three different ways
- re-render on script change instead of re-animating

The token-with-eyes component is roughly 40 lines.

### The 3D trap

Meshy is cheap and fast, which makes 3D look like the easy path. The full pipeline is:

> model → retopo → rig → skin → animate → lip sync → light → render

Meshy does step one. Steps 2–7 are where months disappear, and AI-generated meshes are
often *harder* to rig than clean hand-made ones. For "boring business topics made fun,"
3D buys almost nothing — the product is writing and timing.

**If 3D ever happens:** Meshy + [Mixamo](https://mixamo.com) (free auto-rig + motion
library) is the combination that makes it survivable. Don't attempt it without Mixamo.

---

## 2. Voice

Voice is recorded **first**; animation is timed to it. This is not a stylistic preference,
it's the standard order and reversing it wastes work.

| Tool | Status | Cost | Notes |
|---|---|---|---|
| **Your own voice** | ✅ genuinely competitive | free + mic | For this genre, personality beats polish. The narrator is dry and flat — that's easy to perform and hard for TTS to nail. Strongly consider for episode 1. |
| **ElevenLabs** | ✅ best TTS | ~$5–22/mo typical tiers | Strongest narration quality. **Check commercial-use terms on your tier.** |
| **Azure Neural TTS** | 🟡 cheapest at volume | pay-per-character, very cheap | Less characterful, but fine for narration and dramatically cheaper if you produce a lot. |
| **Play.ht** | 🟡 | subscription | Alternative to ElevenLabs. |

**Episode 1 needs four distinct voices:** Narrator, Marina, Pavel, Director. If using TTS,
pick clearly different timbres — the episode depends on the audience tracking who is
speaking without being told. If recording yourself, three characters + narrator is a real
acting ask; consider TTS for the three characters and your own voice for the narrator, or
recruit two other people.

### Microphone, if recording yourself

Not discussed previously, but it's the gap in the list: a USB condenser or dynamic mic in
the $80–150 range (Samson Q2U, Audio-Technica ATR2100x, Rode NT-USB Mini) is the entire
requirement. Record in a room with soft furnishings. This matters more than any plugin.

---

## 3. Music

| Source | Status | Cost | Notes |
|---|---|---|---|
| **Epidemic Sound** | ✅ safest | ~$10–20/mo | Unambiguous licensing, YouTube-safe, no claim risk. Worth it purely for not thinking about it. |
| **Artlist** | ✅ | ~$10–20/mo | Same category as Epidemic. |
| **Suno / Udio** | 🟡 works, verify terms | subscription | Fine, and fast for getting exactly the mood you want. **Commercial rights depend on paid tier — verify before publishing.** |
| **Kevin MacLeod / YouTube Audio Library** | 🟡 free | free | Kevin MacLeod requires attribution (CC-BY) unless licensed. Overused but genuinely fine. |

**Episode 1 music plan:** none until Act 2. Enters low under the overlay, pulled at
"Nobody here is lying," returns at Act 4's cut to white. That's the only warm moment.

---

## 4. Sound effects

| Source | Status | Cost | Notes |
|---|---|---|---|
| **Freesound.org** | ✅ | free (CC — check per-file licence) | Licences vary per file, from CC0 to CC-BY. Check each one. |
| **Epidemic Sound** | ✅ | included in subscription | If already subscribed for music, SFX come with it. |

**Episode 1 needs very little:** a soft low-pitched click per box appearing, one tick per
token step. Nothing else. Resist whooshes.

---

## 5. Platform

| Option | Status | Notes |
|---|---|---|
| **YouTube** | ✅ | Distribution is the point. Hosting, bandwidth, mobile, browser compat all vanish. Search + audience already exist. |
| **three.js / self-hosted interactive** | ❌ for now | A URL nobody visits. Requires hosting, and iterating on infrastructure instead of content. |

**Later:** an interactive "run the process yourself" companion is a real differentiator —
build it once there are videos worth linking from. If the videos are built in Remotion, the
same React components can power both. That's the strongest single argument for Remotion.

---

## 6. Editing / post

| Tool | Status | Cost | Notes |
|---|---|---|---|
| **DaVinci Resolve** | ✅ | free | Edit + audio mixing (Fairlight) + colour in one app. The free version is not crippled. |

---

## 7. The pieces that are easy to forget

These aren't tools you buy — they're work that has to happen, and forgetting them is the
usual reason indie animation projects stall at 60%.

| Thing | Why it matters |
|---|---|
| **Script** — timed dialogue, not just "plot" | Plot is what happens. Script is what's said, when. Different artifact. |
| **Storyboard / animatic** | Shot-by-shot. **The #1 reason projects die is skipping this.** |
| **Voice recorded before animation** | Animation is timed to the voice track, not vice versa. |
| **Environments/sets** | Not relevant for BPM (abstract), becomes real work for PM episodes. |
| **Lip sync / facial animation** | Only if characters ever talk on screen. The hardest part of character work. Avoid as long as possible. |
| **Rigging + body animation** | A rigged animated character ≠ a 3D model. Separate discipline. |
| **Sound mix** | Resolve handles it. Budget real time for it — bad audio reads as amateur faster than bad visuals. |

---

## Licensing — the one thing to actually check

For **every** AI-generated asset (Suno, ElevenLabs, Meshy, and any AI image tool):

> Read the commercial-use terms for **your specific tier** before publishing.
> Free tiers commonly forbid commercial use, and **monetized YouTube counts as commercial**.

Also:
- **Remotion** is free for individuals but requires a paid company licence above a size
  threshold — check the current terms if this stops being a solo project.
- **Freesound** licences vary per file (CC0 vs CC-BY vs others).
- **Kevin MacLeod** is CC-BY — attribution required.
- **Don't use Minions or any existing character design.** Illumination's characters are
  protected, and BPMN training video is exactly the commercial use that draws a claim.
  Own designs only — and simpler is better anyway.

---

## Minimum viable stack for episode 1

Everything above is optional except this:

| Need | Choice | Cost |
|---|---|---|
| Animation | Remotion | free |
| Voice | own voice + phone or cheap mic | ~free |
| Music | Epidemic Sound or free library | $0–20/mo |
| SFX | Freesound | free |
| Edit | DaVinci Resolve | free |
| Platform | YouTube | free |

**Total: roughly €0–20/month.** Nothing here justifies a Meshy or 3D subscription yet.

### Recommended first move

Before committing to any of it: write the script (done — see
[ep01-nobody-has-seen-it.md](scripts/ep01-nobody-has-seen-it.md)), record narration on
your phone, and cut the crudest possible animatic — even static slides with movement.

Watch it back. That tells you in a day whether the writing works, which is the only
question that matters before spending money.

---

## Open decisions

- [ ] **Remotion vs Motion Canvas** — genuinely close. Remotion wins on ecosystem + the
      interactive-companion reuse story. Motion Canvas wins on being purpose-built for
      technical explainers. Pick by building the token-walking-a-path test in one of them.
- [ ] **Own voice vs TTS** for narrator (characters likely TTS either way)
- [ ] **Music subscription** — needed from episode 1, or use free library until the series
      proves itself?
