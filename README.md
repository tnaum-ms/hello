# hello

Draw pixel-art text on your GitHub contribution graph, just for fun 🫣

## How it works

Your GitHub profile shows a contribution graph — a grid of 53 columns (weeks) × 7 rows (days of the week, Sunday at top). Each cell's color intensity reflects how many contributions you made that day.

This tool generates backdated git commits that "light up" specific cells on the grid to spell out text. It includes two built-in pixel fonts (small 5×3 and large 7×5 bold), supports A–Z, 0–9, and common symbols, and lets you control the color intensity via commit count.

### Grid layout

```
         col 0          col 4  ← usable start              col 48 →  col 52
         ┌───┐          ┌───┐                               ┌───┐    ┌───┐
  Sun    │   │   ...    │   │  · · · █ █ · · · · · · · ·    │   │    │   │
  Mon    │   │          │   │  · · · · · · · · · · · · ·    │   │    │   │
  Tue    │ s │          │   │  · · · · · · · · · · · · ·    │   │    │   │
  Wed    │ k │          │   │        your text here         │   │    │ s │
  Thu    │ i │          │   │  · · · · · · · · · · · · ·    │   │    │ k │
  Fri    │ p │          │   │  · · · · · · · · · · · · ·    │   │    │ i │
  Sat    │   │          │   │  · · · · · · · · · · · · ·    │   │    │ p │
         └───┘          └───┘                               └───┘    └───┘
         ← 4 weeks →                                       ← 4 weeks →
           buffer                                             buffer
```

The first and last 4 weeks are skipped as buffer zones — this avoids polluting your recent activity feed and means you don't have to re-run the script as the graph scrolls.

## Requirements

- **Node.js** (v14+)
- **Git** configured with an email that matches your GitHub account

## Usage

```bash
# Clone this repo (or use it if you already have it)
git clone https://github.com/tnaum-ms/hello.git
cd hello

# Preview what "HELLO" would look like (no commits created)
node index.js "HELLO" --dry-run

# Generate commits for "HELLO"
node index.js "HELLO"

# Or any other text (A-Z, 0-9, space, and special characters)
node index.js "HI"
node index.js ">_ CODE"

# Use the large bold font
node index.js "HELLO" --large --dry-run

# Control how many commits per pixel (default: 30)
node index.js "HELLO" --commits=15 --dry-run

# Combine options
node index.js ">_ CODE" --large --commits=50 --dry-run

# After reviewing, push the commits
git push

# If you want to undo (before pushing)
git reset --hard HEAD~<number_of_commits>
```

### Parameters

#### `"TEXT"` (positional, optional)

The text to draw on the contribution graph. If omitted, defaults to `"HELLO"`. The text is automatically converted to uppercase.

**Supported characters:** A–Z, 0–9, space, and: `!` `>` `<` `:` `_` `-` `.` `/` `(` `)` `;`

```bash
node index.js "HELLO"        # simple text
node index.js ">_ CODE"     # terminal prompt style
node index.js ":)"           # text emoji
node index.js "2026"         # numbers work too
```

#### `--dry-run`

Show the ASCII preview and statistics without creating any commits. Always use this first to verify your text looks right before generating commits.

```bash
node index.js "HELLO" --dry-run
```

Output includes:
- ASCII grid preview of the contribution graph
- Number of lit pixels
- Total commits that would be created
- Date range the text will span

#### `--large`

Use the large bold font instead of the default small font.

| | Small (default) | Large (`--large`) |
|---|---|---|
| Height | 5 rows (Mon–Fri) | 7 rows (Sun–Sat) |
| Width | 3 columns per character | 5 columns per character |
| Strokes | Single pixel | Double-thick |
| Look | Compact, leaves Sun/Sat empty | Bold, fills entire grid height |

```bash
# Compare small vs large
node index.js "HI" --dry-run           # small: 20 pixels, 600 commits
node index.js "HI" --large --dry-run   # large: 44 pixels, 1320 commits
```

Note: large font characters are wider, so fewer characters fit. The usable zone is 45 columns — a 5-wide character + 1-col gap = 6 columns, so ~7 large characters fit vs ~11 small characters.

#### `--commits=N`

Set the number of commits generated per lit pixel. Default is `30`.

This controls the **color intensity** of your pixels on the contribution graph. GitHub calculates color based on quartiles relative to your personal maximum daily contribution count.

| Commits | Typical result |
|---|---|
| `--commits=5` | Very light green — subtle, barely visible |
| `--commits=15` | Light green — visible but understated |
| `--commits=30` | Medium green (default) — clearly visible |
| `--commits=50` | Dark green — stands out strongly |
| `--commits=80` | Darkest green — maximum intensity for most users |

```bash
# Light touch — won't overpower existing activity
node index.js "HELLO" --commits=10 --dry-run

# Go bold
node index.js "HELLO" --commits=60 --large --dry-run
```

**Tip:** Check your GitHub profile to see your current max daily contributions. If your max is ~60, then `--commits=30` gives you medium green. If your max is ~10, even `--commits=5` will show up clearly.

### What the script does

1. Calculates the grid start date (the Sunday at the top-left of your contribution graph)
2. Maps your text to grid coordinates using the pixel font
3. Centers the text horizontally and vertically in the usable zone
4. Shows an ASCII preview of the result
5. Asks for confirmation
6. Creates `commits × lit_pixels` commits, each with backdated `GIT_AUTHOR_DATE` / `GIT_COMMITTER_DATE`, appending lines to `data/contributions.txt`

### What you do after

- **Review** the commits: `git log --oneline | head -30`
- **Push**: `git push`
- **Wait** up to 24 hours for GitHub to update the graph
- **Undo** (if needed, before pushing): `git reset --hard HEAD~N`

## Example

```
$ node index.js "HI" --dry-run

  GitHub Contribution Graph Art Generator
  Text: "HI"

  Graph start (top-left): 2025-05-11 (Sunday)

  Contribution graph preview:

  Sun · · · · · · · · · · · · · · · · · · · · · █ █ █ · █ · █ · · · · · · · · · · · · · · · · · · · · · · · ·
  Mon · · · · · · · · · · · · · · · · · · · · · █ · · · █ · █ · · · · · · · · · · · · · · · · · · · · · · · ·
  Tue · · · · · · · · · · · · · · · · · · · · · █ · · · █ · █ · · · · · · · · · · · · · · · · · · · · · · · ·
  Wed · · · · · · · · · · · · · · · · · · · · · █ █ █ · · █ · · · · · · · · · · · · · · · · · · · · · · · · ·
  Thu · · · · · · · · · · · · · · · · · · · · · █ · · · · █ · · · · · · · · · · · · · · · · · · · · · · · · ·
  Fri · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·
  Sat · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·
```

## Notes

- The contribution graph color intensity is relative to your personal max. With ~30 commits per pixel, you should get a medium-green tile.
- Commits must be on the **default branch** to count.
- The commit email must match your GitHub account email.
- The graph may take up to 24 hours to update after pushing.
