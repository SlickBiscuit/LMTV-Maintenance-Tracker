# LMTV-Maintenance-Tracker
A LMTV maintenance management system that allows users to track LMTVs, maintenance history, vehicle status, and assigned mechanics through a React frontend, Express REST API, and PostgreSQL database (Docker).

![LMTV ERD](./LMTV%20ERD.png)

1. Units → LMTVs: 1:N
2. LMTVs → Maintenance Records: 1:N
3. LMTVs → LMTV Mechanics: 1:N
4. Mechanics → LMTV Mechanics: 1:N
5. LMTVs ↔ Mechanics: M:N, implemented through lmtv_mechanics