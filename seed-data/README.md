# Seed Data Directory

Drop course files into this folder for automated processing via the ingestion pipeline:

```
seed-data/
└── <COURSE_CODE>/           # e.g., UCS503
    ├── pyqs/
    │   ├── MST_2022.pdf
    │   ├── MST_2023.pdf
    │   ├── EST_2023.pdf
    │   └── EST_2024.pdf
    └── slides/
        ├── Unit1_Software_Processes.pdf
        ├── Unit2_Agile_Methods.pdf
        ├── Unit3_Requirements.pdf
        └── Unit4_Testing.pdf
```

## Running Ingestion
Once files are in place, run:
```bash
docker compose exec app npm run ingest -- UCS503
# or locally:
npm run ingest -- UCS503
```
This runs the end-to-end pipeline:
1. Native PDF / Vision parsing
2. Question segmentation & sub-part extraction
3. Automated curriculum & topic tagging
4. Pushing items to the **Moderator Review Queue** (`/admin`)
5. Upon moderator approval: pgvector embedding & topic weightage recalculation
