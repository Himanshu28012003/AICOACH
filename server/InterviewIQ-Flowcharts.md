# InterviewIQ - Complete Flowchart Diagrams

This file contains all flowchart diagrams for the InterviewIQ project. You can copy each diagram and paste it into any Mermaid-compatible editor (GitHub, Notion, Draw.io, etc.).

---

## 1. Interview Lifecycle Flowchart

Copy the code below and paste into a Mermaid editor:

```mermaid
flowchart TD
    A["🎯 Start Interview"] --> B["📄 Upload Resume"]
    B --> C["🔄 POST /api/interview/resume"]
    C --> D["🤖 AI Analyzes Profile"]
    D --> E["Configure Interview<br/>- Role<br/>- Experience<br/>- Mode HR/Technical"]
    E --> F["POST /api/interview/generate-questions"]
    F --> G{Check Credits}
    
    G -->|❌ Insufficient| H["⚠️ Show Upgrade Prompt"]
    H --> I["Go to Payment Flow"]
    
    G -->|✅ Sufficient| J["💳 Deduct 50 Credits"]
    J --> K["📋 Create Interview Record"]
    K --> L["🎬 Generate 5 Questions"]
    L --> M["🚀 Interview Session Begins"]
    
    M --> N["🎤 Question 1 Presented"]
    N --> O["⏱️ Timer: 60-120 seconds"]
    O --> P["🎙️ User Records Answer"]
    P --> Q["POST /api/interview/submit-answer"]
    Q --> R["🤖 AI Evaluates Answer"]
    R --> S["📊 Score: Confidence,<br/>Communication,<br/>Correctness"]
    S --> T{More Questions?}
    
    T -->|Questions 2-5| N
    T -->|Complete| U["POST /api/interview/finish"]
    
    U --> V["📈 Calculate Final Score"]
    V --> W["📊 Generate Averages"]
    W --> X["Mark as Completed"]
    X --> Y["✅ Report Generated"]
    Y --> Z["📰 Show Detailed Report"]
    
    Z --> AA["📜 Interview History"]
    AA --> AB["View Past Reports"]
```

---

## 2. Payment & Credit Top-Up Flowchart

```mermaid
flowchart TD
    A["💰 Need More Credits"] --> B["📋 Select Pricing Plan"]
    B --> C["Choose Plan Amount"]
    C --> D["POST /api/payment/order"]
    D --> E["🛒 Create Razorpay Order"]
    E --> F["💾 Save Payment<br/>Status: CREATED"]
    F --> G["Return Order Details"]
    G --> H["💳 Client Opens Checkout"]
    
    H --> I["👤 User Enters Payment Details"]
    I --> J["💸 Razorpay Processes Payment"]
    J --> K{Payment Success?}
    
    K -->|❌ Failed| L["❌ Payment Failed"]
    L --> M["Show Error Message"]
    M --> N["Retry or Cancel"]
    
    K -->|✅ Success| O["✅ Payment Approved"]
    O --> P["Generate Payment Signature"]
    P --> Q["POST /api/payment/verify"]
    Q --> R["🔐 Verify HMAC-SHA256<br/>Signature"]
    R --> S{Signature Valid?}
    
    S -->|❌ Invalid| T["❌ Verification Failed"]
    T --> M
    
    S -->|✅ Valid| U["Update Status: PAID"]
    U --> V["➕ Increment User Credits"]
    V --> W["💾 Update User Document"]
    W --> X["Return Updated User"]
    X --> Y["📱 Client Updates Redux"]
    Y --> Z["✅ Credits Added!"]
    Z --> AA["🎯 Return to Interview Setup"]
```

---

## 3. Complete End-to-End User Journey

```mermaid
flowchart TD
    A["🌐 User Opens App<br/>localhost:5173"] --> B{Authenticated?}
    
    B -->|No| C["🔐 JWT Login Page"]
    C --> D["Enter email and password"]
    D --> E["POST /api/auth/login or /api/auth/register"]
    E --> F{Credentials valid?}
    F -->|Yes| G["Generate JWT Cookie"]
    F -->|No| H["Show auth error"]
    G --> I["Store User in Redux"]
    
    B -->|Yes| J["✅ User Authenticated"]
    I --> J
    
    J --> K["📖 Home Page"]
    K --> L["Click: Start Interview"]
    L --> M["Step 1: Setup<br/>Upload Resume"]
    M --> N["POST /api/interview/resume<br/>Extract PDF Text"]
    N --> O["AI Analyzes: Role,<br/>Skills, Experience"]
    O --> P["Step 1 Form"]
    P --> Q["Select Role, Experience,<br/>Interview Mode"]
    Q --> R["POST /api/interview/generate-questions"]
    R --> S{Credits ≥ 50?}
    
    S -->|No| T["💳 Pricing Page"]
    T --> U["Select Plan"]
    U --> V["→ PAYMENT FLOW ←"]
    V -->|Success| W["Credits Added"]
    W --> R
    
    S -->|Yes| X["✅ Deduct 50 Credits"]
    X --> Y["Create Interview + Questions"]
    Y --> Z["Step 2: Interview<br/>AI Interview Session"]
    AC --> AD["AI Introduces + Video"]
    AD --> AE["Question 1 of 5"]
    AE --> AF["🎤 User Records Answer"]
    AF --> AG["POST /api/interview/submit-answer"]
    AG --> AH["AI Scores Answer"]
    AH --> AI{More Questions?}
    AI -->|Yes| AE
    AI -->|No| AJ["POST /api/interview/finish"]
    
    AJ --> AK["Calculate Final Score"]
    AK --> AL["Step 3: Report<br/>Performance Dashboard"]
    AL --> AM["📊 View Scores & Feedback"]
    AM --> AN["Download PDF Report"]
    AN --> AO["📜 Interview History"]
    AO --> AP["View All Past Interviews"]
    AP --> AQ["Click: Open Report"]
    AQ --> AR["GET /api/interview/report/:id"]
    AR --> AS["View Detailed Analysis"]
    AS --> AT["✅ Complete"]
```

---

## How to Use These Diagrams

### Option 1: View in GitHub
- Upload this file to your GitHub repo
- GitHub will automatically render the Mermaid diagrams

### Option 2: Use in Notion
- Copy the entire Mermaid code block
- Paste in Notion using `/mermaid` command

### Option 3: Use in Draw.io
- Visit [https://mermaid.live](https://mermaid.live)
- Paste the Mermaid code
- Export as PNG/SVG/PDF

### Option 4: Use in Documentation
- Copy individual diagram code
- Paste into your README.md or documentation site

---

## Diagram Summary

| Diagram | Purpose | Key Flows |
|---------|---------|-----------|
| **Interview Lifecycle** | Shows complete interview execution | Resume upload → AI analysis → Q&A → Scoring → Report |
| **Payment Flow** | Credit purchasing process | Plan selection → Razorpay → Verification → Credit update |
| **End-to-End Journey** | Complete user workflow | Login → Setup → Payment → Interview → History |

---

**Generated:** May 3, 2026  
**Project:** InterviewIQ  
**Format:** Mermaid Flowchart (JSON-compatible, open-source)
