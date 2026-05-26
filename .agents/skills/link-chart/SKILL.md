---
name: link-chart
description: >
  Generates a monthly bar chart of links created in the past 12 months from the
  project's Neon/PostgreSQL database. Use this skill whenever the user asks to
  visualise link activity, see a chart of short links, plot link creation
  statistics, show how many links were created per month, or export a links
  graph/chart. Trigger even if the user's phrasing is informal ("show me the
  link stats", "how many links did we make last year?", "give me a bar chart of
  links").
---

# link-chart

Generate a PNG bar chart that shows how many short links were created each
month over the past 12 months.

## What this skill does

1. Reads `DATABASE_URL` from the `.env` file at the project root.
2. Connects to the PostgreSQL database and queries the `short_links` table.
3. Groups results by calendar month for the last 12 months (inclusive of the
   current partial month).
4. Runs a bundled Python script (`scripts/plot_links.py`) that draws the bar
   chart and writes a PNG file to the location the user specifies (default:
   `link-chart.png` in the current working directory).

## Usage

Run the script from the project root:

```bash
python .agents/skills/link-chart/scripts/plot_links.py [--output PATH] [--env PATH]
```

| Flag       | Default          | Purpose                                           |
| ---------- | ---------------- | ------------------------------------------------- |
| `--output` | `link-chart.png` | Where to save the PNG                             |
| `--env`    | `.env`           | Path to the `.env` file containing `DATABASE_URL` |

## When to invoke

Read the bundled script, then execute it. Do not rewrite the chart logic
inline — the script in `scripts/plot_links.py` handles everything. Your job is
to:

1. Confirm the `.env` file path with the user if it's non-standard.
2. Decide on the output filename/path (ask if not specified).
3. Run the script with the correct flags.
4. Surface the resulting PNG to the user (print the path, or use
   `present_files` if available).

## Dependencies

The script uses only the Python standard library plus three common packages:

- `psycopg2-binary` — PostgreSQL adapter
- `matplotlib` — chart rendering
- `python-dotenv` — `.env` loading

If any are missing, install them first:

```bash
pip install psycopg2-binary matplotlib python-dotenv
```
