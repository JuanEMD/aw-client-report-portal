## AW Client Report Portal — PRD v1.0 

**Date** : 2026-04-09 | **Build Type** : New 

## One-Line Summary 

A portal where the team enters client financial data into a structured form and generates polished quarterly SACS (cashflow) and TCC (net worth) PDF reports in minutes instead of a full day. 

## Company Context 

_Researched from the customer's website._ 

EF is a financial planning firm based in the Atlanta. The firm serves high net worth and ultra-high-net-worth families with comprehensive financial planning, including cash flow management, investment oversight, retirement planning, and college planning. 

The team is small — three people: Andrew, Rebecca (financial planner with Schwab access and compliance responsibilities), and Maryann (executive assistant, recently hired through Sagan). They have approximately 6 regular clients on retainer with quarterly meetings, plus assets under management. Their clients are millionaires with high expectations for professionalism and accuracy. The firm uses Windbrook Solutions as their financial planning entity. Their current report preparation process takes a full day per client meeting and involves manually pulling data from multiple sources (Pinnacle Bank, Charles Schwab, RightCapital, Zillow) and assembling it in Canva and Word documents. 

## Developer Brief 

_Quick context for the engineer._ 

- **Client setup (one-time)** : The team currently stores client data across Excel spreadsheets, PreciseFP (onboarding questionnaires), and various document files in Dropbox. There's no central CRM. The portal provides a simple client record where they enter static info once: names, DOB, age, last four of SSN, account types (retirement, 

non-retirement, joint, trust), monthly salary, agreed expense budget, and which accounts each client has. This eliminates re-entering the same info every quarter. 

- **Data entry + automated math** : Currently, Maryann and Rebecca spend a full day pulling balances from Pinnacle Bank (via email request), Schwab (Rebecca logs in manually), Zillow (for house values), and sometimes RightCapital. They then manually calculate totals, excess transfers, and net worth — and often make errors. The portal presents a checklist of fields per client, pre-populated with static data, where they enter the current balances. All math is automatic: inflow minus outflow = excess to private reserve, sum retirement accounts by spouse, total non-retirement, add trust for grand total, separate liabilities. Rebecca: "all of that math is done manually, so even just automating that would be great" (25:36). 

- **PDF generation matching existing format** : Andrew created the SACS and TCC templates and is happy with how they look — no visual redesign. The SACS (screenshot at 13:08) shows a cashflow diagram with Inflow, Outflow, and Private Reserve bubbles connected by arrows. The TCC shows a circle chart with retirement accounts (top), non-retirement (bottom), trust (center), and liabilities. The portal generates PDFs matching these layouts with correct numbers placed in the right spots. Rebecca: "We're not looking to change the appearance" (11:15). A slight polish is welcome — Maryann: "I like that, a little [polish] would be nice" (52:42). 

- **Export options** : Download as PDF directly, or export to Canva for any last-minute adjustments. Both options from the same interface. Zaki proposed this at 52:56-53:07, Maryann confirmed. 

## Stack Suggestions 

_Recommended tools and services. The engineer may diverge if the project calls for it._ 

|**Layer**|**Tool**|**Rationale**|
|---|---|---|
|Hosting|Railway|Standard Sagan default.<br>Simple web app, no heavy<br>compute needed.|
|Frontend|HTML + CSS + JS|Clean, professional portal.<br>Clients (the team) are 3<br>people — needs to be simple<br>and beautiful. No framework<br>overhead.|
|Backend|Python|PDF generation (ReportLab<br>or WeasyPrint), form|



|**Layer**|**Tool**|**Rationale**|
|---|---|---|
|||handling, calculations.<br>Straightforward data<br>processing.|
|Database|SQLite on Railway volume|Client profiles, account<br>structures, report history. 6<br>clients — minimal volume.|
|PDF Generation|ReportLab or WeasyPrint|Generate pixel-perfect PDFs<br>matching existing SACS and<br>TCC templates. Templates<br>are fixed layout — no<br>dynamic resizing needed.|
|AI|None for V1|This is a structured data entry<br>+ calculation + PDF<br>generation tool. No AI<br>reasoning needed. All math is<br>deterministic.|



**Environment Variables** : CANVA_API_KEY (if Canva export is built), RAILWAY_DATABASE_PATH 

**Note** : No API integrations in V1. All financial data is entered manually by the team. This is intentional — RightCapital data is unreliable (Maryann: "don't trust RightCapital that much" — 49:06), Schwab access has compliance restrictions (Rebecca: "that login cannot be shared with any agent" — 48:14), and Pinnacle Bank data comes via secure email. V2 can add automated data pulling. 

## Screen Share Timestamps 

_Moments in the recording where the customer shared their screen._ 

|**Timestamp**|**Screenshots**|**Description**|**Relevance**|
|---|---|---|---|
|04:52|1_04m52s.jpg|Maryann showed<br>Dropbox folder<br>structure — client|Shows current file<br>organization — no<br>central CRM,|



||**Timestamp**<br>**Screenshots**<br>**Description**<br>**Relevance**<br>folders (PALS Fund,<br>Out One Drive,<br>Natability,<br>Miscellaneous, etc.),<br>Onboarding Materials<br>everything in<br>Dropbox folders<br>05:18<br>10_05m18s.jpg —<br>11_05m26s.jpg<br>SACS sample PDF in<br>Dropbox — "Simple<br>Automated Cash<br>Flow System<br>(SACS)" with<br>Inflow/Outflow/Private<br>Reserve diagram<br>**Critical reference.**<br>This is the SACS<br>template the portal<br>must replicate.<br>Shows the cashflow<br>bubble diagram with<br>green Inflow, red<br>Outflow, blue Private<br>Reserve.<br>13:08<br>50_13m08s.jpg<br>SACS example<br>opened in full —<br>shows the complete<br>SACS layout with<br>dollar amounts,<br>arrows, monthly<br>cashflow labels<br>**Critical reference.**<br>Full view of SACS<br>format: $15,000<br>Inflow → $11,000<br>Outflow (red arrow<br>with X) → excess<br>(blue arrow) →<br>Private Reserve.<br>Client name at top.<br>20:52<br>70_20m52s.jpg<br>TCC (Circle Chart)<br>showing retirement<br>accounts,<br>non-retirement, trust,<br>liabilities — all with<br>account bubbles<br>**Critical reference.**<br>Full view of TCC<br>format: Client 1 and<br>Client 2 retirement<br>sections (top),<br>non-retirement joint<br>accounts (bottom),<br>trust with house value<br>(center), liabilities<br>with interest rates.<br>Gray summary boxes<br>with totals.<br>26:26<br>80_26m26s.jpg<br>Monthly expense<br>worksheet — the<br>Shows the input data<br>source for the SACS|
|---|---|



|**Timestamp**|**Screenshots**|**Description**|**Relevance**|
|---|---|---|---|
|||Excel-based budget<br>template clients fill<br>during onboarding|outflow/expense<br>number|
|29:14|100_29m14s.jpg —<br>102_29m18s.jpg|Data Point List<br>document — detailed<br>specification of where<br>each data field<br>comes from for SACS<br>and TCC, with fields<br>listed: Inflow, Outflow,<br>Private Reserve,<br>Schwab accounts,<br>Target, Client Info,<br>Liabilities|**Critical reference.**<br>This document was<br>created by Rebecca<br>and Maryann<br>specifically for the<br>build. It maps every<br>field to its data<br>source. The engineer<br>should request this<br>document.|



## Key Definitions 

_Domain terms the engineer needs to understand._ 

|**Term**|**Meaning**|**Examples**|
|---|---|---|
|SACS|Simple Automated Cash Flow<br>— a one-page visual diagram<br>showing how money flows<br>from the client's paycheck<br>through their bank accounts<br>each month|Inflow ($15,000/mo) →<br>Outflow ($11,000/mo for<br>expenses) → Private<br>Reserve (excess savings)|
|TCC|Total Client Chart — a<br>one-page net worth overview<br>showing all client accounts<br>organized by type<br>(retirement, non-retirement,<br>trust, liabilities) with balances<br>and totals|Retirement: IRA $11K + Roth<br>IRA $15K = $26K total.<br>Non-retirement: brokerage<br>$50K. Trust: house $450K.<br>Liabilities: mortgage $200K|



||**Term**<br>**Meaning**<br>**Examples**<br>Inflow<br>The client's take-home pay<br>deposited into their primary<br>checking account<br>$15,000/month after taxes<br>Outflow<br>The agreed-upon monthly<br>expense budget transferred<br>from inflow to the spending<br>account<br>$11,000/month (rounded up<br>from actual ~$10,500 to<br>create buffer)<br>Private Reserve<br>High-yield savings account<br>where excess cash (inflow<br>minus outflow) accumulates<br>Target = 6 months of<br>expenses + all insurance<br>deductibles<br>Trust<br>Usually funded by the client's<br>primary residence. Value<br>updated quarterly from Zillow<br>Zestimate<br>"We go to Zillow, type in their<br>address, and it just pops up"<br>Pinnacle Bank<br>The bank where all clients<br>are encouraged to open their<br>personal banking accounts.<br>Balances requested via<br>secure email 2 days before<br>meetings<br>Personal bankers provide<br>balances on request<br>RightCapital<br>Financial planning aggregator<br>tool that connects to clients'<br>external accounts. Has an<br>API but data is often stale or<br>disconnected<br>"Don't trust RightCapital that<br>much... their own API is not<br>perfect"<br>PreciseFP<br>Client onboarding<br>questionnaire tool — closest<br>thing to a CRM. Stores client<br>profiles, family info, advisor<br>assignments<br>Has an API; used for<br>onboarding data collection<br>Floor<br>$1,000 minimum balance<br>maintained in each bank<br>account as a buffer<br>Never changes — always<br>$1,000|
|---|---|



## Engineering Stories 

_These are suggestions. The assigned engineer will review the transcript independently and make their own implementation decisions._ 

User Story 1: Set up each client with their profile and accounts 

## 1a: Client Profile Management 

- **Description** : A simple client management screen where the team enters each client's static information once. This replaces scattered Excel files and Dropbox folders as the source of truth for client data. 

- **Acceptance Criteria** : 

   - Add a new client with: name(s), DOB, age (auto-calculated), last four of SSN, spouse info if applicable 

   - Define the client's account structure: which retirement accounts they have (IRA, Roth IRA, 401K, pension), which non-retirement accounts (brokerage, joint), trust details (property address for Zillow lookup), liabilities (mortgage, auto loan with interest rates) 

   - Enter static financial data: monthly salary (after tax), agreed monthly expense budget, private reserve target 

   - Support both single and married clients (Client 1 / Client 2 structure) 

   - Edit client details when things change (new job, raise, new account) 

   - Client list view showing all clients with last report date 

- **Data Sources** : Manual entry (from PreciseFP onboarding data, monthly expense worksheet) 

- **AI/Models** : None 

- **Notes** : ~6 clients currently, may grow to 12. Rebecca: "We're a very small operation, there's 3 of us" (31:54). The portal essentially serves as a lightweight CRM for report generation purposes. The Data Point List document (screenshot 100_29m14s.jpg) maps exactly which fields are needed — request this document from the team. 

## User Story 2: Enter quarterly balances and auto-calculate everything 

## 2a: Quarterly Report Data Entry 

- **Description** : Before a client meeting, the team clicks "Generate Report" for a client. The system shows a structured form with all fields needed, pre-populated with static data, and blanks for the dynamic balances that need to be entered. 

- **Acceptance Criteria** : 

One-click "Generate Report" from client profile 

   - Form shows all fields needed, organized by report section (SACS fields, then TCC fields) 

   - Static data (salary, expense budget, account types) is pre-filled from client profile 

   - Dynamic fields show clear labels: "Roth IRA Balance", "Schwab Brokerage Balance", "Private Reserve Balance", "Zillow Home Value" 

   - Each dynamic field shows the last known value (from previous quarter) as reference 

   - Fields that haven't been entered are highlighted as incomplete 

   - Option to "use last value" for fields that haven't changed 

   - Manual override on any field 

- **Data Sources** : Client profile (static), manual entry (dynamic balances) 

- **AI/Models** : None 

- **Notes** : Rebecca described the current pain: "we have to keep double checking, and things like that" (25:54). Maryann: "This takes us a day to prepare. If we could take this down to an hour" (33:34). The form should make it impossible to generate a report with missing data — all required fields must be filled. 

## 2b: Automated Calculations 

- **Description** : All math is automated once balances are entered. No manual addition, subtraction, or cross-referencing. 

- **Acceptance Criteria** : 

   - SACS: Excess = Inflow - Outflow (auto-calculated) 

   - SACS: Private Reserve Target = (6 × monthly expenses) + sum of all insurance deductibles 

   - TCC: Client 1 Retirement Total = sum of Client 1's retirement account balances 

   - TCC: Client 2 Retirement Total = sum of Client 2's retirement account balances 

   - TCC: Non-Retirement Total = sum of all non-retirement account balances (excluding trust) 

   - TCC: Grand Total Net Worth = Client 1 Retirement + Client 2 Retirement + Non-Retirement + Trust 

   - TCC: Liabilities Total = sum of all liability balances (displayed separately, NOT subtracted from net worth) 

   - All totals update in real-time as balances are entered 

- **Data Sources** : Entered balances from 2a 

- **AI/Models** : None — pure arithmetic 

- **Notes** : Rebecca was very specific about the calculation rules: "we do not subtract liabilities from their net worth, they're just a separate box" (26:15). "We do not add the trust in [to non-retirement total]... the non-retirement total is only the accounts, not the trust" (24:28). These rules must be exact. 

## User Story 3: Generate polished PDF reports 

## 3a: SACS PDF Generation 

- **Description** : Generate a SACS (Simple Automated Cash Flow) PDF matching the existing visual template — cashflow bubble diagram with Inflow, Outflow, and Private Reserve sections. 

- **Acceptance Criteria** : 

   - PDF matches existing SACS layout: green Inflow circle, red Outflow circle, blue Private Reserve section, connecting arrows 

   - Client name and date in header 

   - Page 1: Cashflow diagram with monthly amounts (Inflow → Outflow → Private Reserve) 

   - Page 2: Private Reserve balance, investment account balance (Schwab), target savings number 

   - All numbers correctly placed in their visual positions 

   - Format is fixed — nothing shifts or misaligns regardless of number size 

   - Company branding colors (blue) applied 

- **Data Sources** : Calculated values from 2b 

- 

## **AI/Models** : None 

- **Notes** : Rebecca: "We want the form set so nothing can move" (13:57). The current Canva template causes alignment issues — "if we move something, especially with the circle chart, this one gets moved" (12:47). The PDF must be pixel-perfect and stable. Request sample PDFs from the team for exact layout matching. 

## 3b: TCC (Circle Chart) PDF Generation 

- **Description** : Generate a TCC (Total Client Chart) PDF matching the existing net worth overview template — account bubbles organized by type with totals. 

- **Acceptance Criteria** : 

   - PDF matches existing TCC layout: retirement accounts (top), non-retirement (bottom), trust (center), liabilities (separate section) 

   - Client name and date in header 

   - Green client info bubbles with names, ages, DOB, last four SSN 

   - Account bubbles show: account type, last four account number, balance, cash balance (for investment accounts) 

   - Gray summary boxes: Client 1 Retirement Total, Client 2 Retirement Total, Non-Retirement Total, Grand Total 

   - Liabilities section with type, interest rate, and balance 

   - Dynamic number of account bubbles per client (some have 2, some have 5) 

   - Trust section shows property address and Zillow value 

- **Data Sources** : Calculated values from 2b 

- **AI/Models** : None 

- **Notes** : The TCC has variable layout — number of account bubbles varies by client. Rebecca: "we personalize this for every client. We make however many bubbles we need" (22:00). The template must handle 1-6 retirement accounts per spouse and 1-6 non-retirement accounts. Liabilities are 0-3 items typically. 

## User Story 4: Export options 

## 4a: PDF Download and Canva Export 

- **Description** : After generating reports, the team can download as PDF or export to Canva for final adjustments. 

- **Acceptance Criteria** : 

   - "Download as PDF" button generates and downloads both SACS and TCC as separate PDFs 

   - "Export to Canva" button creates the report in the team's Canva workspace for visual editing 

   - Downloaded PDFs are print-ready and client-presentation quality 

   - Report generation history: team can re-download previous quarterly reports 

- **Data Sources** : Generated report data 

- **AI/Models** : None 

- **Notes** : Zaki proposed both options at 52:56-53:07. Maryann confirmed: "Sound? Perfect." The Canva export is a nice-to-have — if Canva API integration is complex, PDF download alone covers the core need. Rebecca: "We don't want to do it in either [Canva or Word], ideally" (13:48) — the portal itself is the preferred tool. 

## Data Sources 

_All external systems the build connects to._ 

|**Source**|**Type**|**Direction**|**Integration**<br>**Method**|**Notes**|
|---|---|---|---|---|
|Manual Entry<br>(Team)|Form Input|In|Portal web form|Primary data<br>source for V1.<br>Team enters<br>balances from<br>Pinnacle Bank,<br>Schwab, Zillow,|



|**Source**|**Type**|**Direction**|**Integration**<br>**Method**|**Notes**|
|---|---|---|---|---|
|||||etc. into the<br>portal form.|
|PreciseFP|Onboarding<br>Data|In (one-time)|Manual transfer<br>to portal|Client profile<br>data (name,<br>DOB, SSN last<br>4, family).<br>Entered into<br>portal once<br>during client<br>setup. Has API<br>but not needed<br>for V1 with only<br>6 clients.|
|Canva|Design Tool|Out|Canva API<br>(optional)|Export<br>generated<br>reports to Canva<br>for visual editing.<br>Nice-to-have for<br>V1 — PDF<br>download is the<br>primary output.|



## **V2 Data Sources (not in V1 scope):** 

- RightCapital API — auto-pull account balances (unreliable, needs investigation) 

- Schwab — auto-pull investment balances (compliance restrictions on credentials) 

- Pinnacle Bank — auto-request balances (currently via secure email) 

- Zillow API — auto-pull Zestimate for trust property values 

## Discussed But Not Confirmed 

_These items came up in the transcript but were not explicitly committed to. Verify with the customer before including in the build._ 

- **Canva export** : Zaki proposed exporting to Canva (52:56) and Maryann confirmed, but Rebecca also said "we don't want to do it in either [Canva or Word], ideally" (13:48). The portal PDF may be sufficient without Canva export. Clarify priority. 

- **Dropbox auto-save** : Maryann asked about automatically saving generated reports to the client's Dropbox folder (41:23). Zaki acknowledged but didn't explicitly commit. Lightweight to add if confirmed. 

- **Monthly email distribution** : Zaki suggested auto-emailing reports to clients monthly (16:15). Rebecca said they only do quarterly. Not committed — future enhancement if they want to increase touchpoints. 

## Out of Scope (Future Phases) 

_These were discussed but deferred. Preserved here so nothing is lost._ 

- **Auto-pull from RightCapital API** : Maryann explicitly deferred this: "don't trust RightCapital that much... make that second version" (49:06-49:24). V2 feature. 

- **Auto-pull from Schwab** : Rebecca said the login "cannot be shared with any agent" due to compliance (48:14). Needs to be explored carefully. V2 feature. 

- **Client-facing monthly expense worksheet on portal** : Rebecca's idea — clients could update their expense worksheet directly in the portal instead of via Excel (42:14). Separate LEGO brick. 

- **Onboarding automation agent** : Zaki proposed automating client onboarding with reminders and form completion tracking (43:36-43:56). Separate LEGO brick. 

- **Plaid integration** : Zaki mentioned potentially connecting to bank accounts via Plaid instead of relying on RightCapital (49:28-49:46). V2+ feature. 

- **Podcast production** : Andrew asked about podcast production help in the first call — this is a hiring request, not an agent build. 

## Confidence Score 

_How well-scoped is this build? Scored across three dimensions, each out of 5. Overall = the lowest score._ 

|**Dimension**|**Score**|**Notes**|
|---|---|---|
|Scope Definition|5/5|Exceptionally clear. Two calls<br>define the exact input fields<br>and output formats. Rebecca|



|**Dimension**|**Score**|**Notes**|
|---|---|---|
|||and Maryann created a "Data<br>Point List" document<br>mapping every field to its<br>source (screenshot 100).<br>Sample PDFs were shared.<br>The team knows exactly what<br>they want.|
|Technical Feasibility|5/5|This is a straightforward web<br>app: form input →<br>calculations → PDF<br>generation. No API<br>integrations in V1. No AI<br>needed. Fixed-layout PDF<br>templates. Well-understood<br>technology. The only<br>complexity is matching the<br>visual layout exactly (circle<br>chart with variable bubbles).|
|Customer Impact|4/5|Reduces meeting prep from a<br>full day to under an hour per<br>client (Maryann: 33:34).<br>Eliminates manual math<br>errors. But with only 6 clients<br>meeting quarterly, the time<br>savings are ~24<br>person-days/year. The bigger<br>impact is error elimination<br>and enabling scale — the firm<br>can take on more clients<br>without more staff.|
|**Overall**|**4/5**|**= Customer Impact is the**<br>**constraint**|



Excellent build. Extremely well-defined scope with sample documents provided. Zero technical risk. The main value is error elimination, consistency, and enabling the firm to scale beyond 6 clients without adding staff. Rebecca and Maryann are engaged, detail-oriented, and will be excellent collaborators during the build. 

## Audit Notes 

All engineering stories traced to specific transcript moments across both calls. Client setup (US1) confirmed by Zaki's portal proposal (35:44-36:05) and discussion of PreciseFP data (50:00-50:44). Data entry and calculations (US2) confirmed by Rebecca's detailed walkthrough of both reports (05:55-26:34) and Maryann's statement "all of that math is done manually, so even just automating that would be great" (25:36). PDF generation (US3) confirmed by extensive discussion of SACS and TCC formats, Rebecca's insistence on fixed layout (13:57), and agreement to match existing visual design (11:15). Export options (US4) confirmed by Zaki's proposal (52:56) and Maryann's confirmation. 

Three items moved to Discussed But Not Confirmed: Canva export (ambiguous — portal may be sufficient), Dropbox auto-save (mentioned but not committed), and monthly email distribution (team only does quarterly). No red flags found — all features trace directly to the transcript. 

