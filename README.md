# HungerView USA

Interactive map of food insecurity rates for state and local program planning.

## Data

County rates come from an NIMHD HDPulse export (`data/HDPulse_data_export.csv`), based on Feeding America Map the Meal Gap (2023).

Zoomed out, the map shows state averages (simple average of county rates). Zoom in for county detail. Michigan opens at the county level.

## Setup

```bash
npm install
npm run dev
```

## Deploy

Static Vite build (`npm run build` → `dist`). GitHub Pages is wired through `.github/workflows/deploy-pages.yml`.

## Citation

HDPulse: An Ecosystem of Health Disparities and Specific Populations Health Resources. National Institute on Minority Health and Health Disparities. https://hdpulse.nimhd.nih.gov/
