# HungerView USA

County food insecurity map (US / Michigan).

Demo: [alhaddia.github.io/hungerview](https://alhaddia.github.io/hungerview/)

## Features

- MI or US view
- Zoom for counties vs state averages
- Filter by minimum rate
- Export CSV
- Copy link to current view
- Link to a place: `?scope=MI&place=26163`
- Print-friendly layout

## Data

HDPulse / NIMHD county rates (2023), Feeding America Map the Meal Gap.  
`data/HDPulse_data_export.csv`

State averages = mean of county rates (not population-weighted).

## Run

```bash
npm install
npm run dev
```

```bash
npm run build
npm test
```

GitHub Pages deploys from `main`.

## Citation

HDPulse. National Institute on Minority Health and Health Disparities. https://hdpulse.nimhd.nih.gov/
