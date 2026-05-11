# hello

Draw pixel-art text on your GitHub contribution graph, just for fun 🫣

## How it works

Your GitHub profile shows a contribution graph — a grid of 53 columns (weeks) × 7 rows (days of the week, Sunday at top). Each cell's color intensity reflects how many contributions you made that day.

This tool generates backdated git commits that "light up" specific cells on the grid to spell out text. It uses a built-in 5×3 pixel font (A–Z, 0–9, space, `!`) and creates **30 commits per lit pixel** — enough for a visible medium-green color without overpowering your real activity.

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

# Or any other text (A-Z, 0-9, space, !)
node index.js "HI"
node index.js "42"

# After reviewing, push the commits
git push

# If you want to undo (before pushing)
git reset --hard HEAD~<number_of_commits>
```

### Options

| Argument | Description |
|---|---|
| `"TEXT"` | The text to draw (default: `HELLO`). Supports A–Z, 0–9, space, `!`. |
| `--dry-run` | Show the ASCII preview and stats without creating any commits. |

### What the script does

1. Calculates the grid start date (the Sunday at the top-left of your contribution graph)
2. Maps your text to grid coordinates using the pixel font
3. Centers the text horizontally and vertically in the usable zone
4. Shows an ASCII preview of the result
5. Asks for confirmation
6. Creates `30 × lit_pixels` commits, each with backdated `GIT_AUTHOR_DATE` / `GIT_COMMITTER_DATE`, appending lines to `data/contributions.txt`

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
