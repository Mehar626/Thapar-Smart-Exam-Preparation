import html

# 1. Use Case Diagram
usecase_puml = """@startuml
skinparam actorStyle awesome
left to right direction
skinparam packageStyle rectangle

actor "Student\\n(COE-3-3C72)" as Student
actor "Contributor / Senior" as Contributor
actor "CR (Batch Rep)" as CR
actor "Moderator" as Moderator
actor "Gemini LLM / System" as AI

rectangle "TIET Smart Exam-Prep Platform (UCS503)" {
  usecase "Login via @thapar.edu" as UC_Login
  usecase "View Batch Calendar\\n& Exam Countdown" as UC_Cal
  usecase "Explore Question Bank\\n(Filter by MST/EST/Topic)" as UC_QB
  usecase "Practice Mode (Self-Grade)" as UC_Practice
  usecase "Timed 30-Min Mock Quiz" as UC_Quiz
  usecase "Analyze Topic Weightage\\n& Historical Trends" as UC_Weightage
  usecase "Interact with AI Assistant\\n(TIET-GPT with Citations)" as UC_Assistant
  usecase "Participate in Public Forum\\n& Live Crunch Chat" as UC_Forum
  
  usecase "Upload Course Material\\n(Slides & Exam Papers)" as UC_Upload
  
  usecase "Review Ingestion Queue\\n(Approve/Reject Questions)" as UC_ModReview
  usecase "Verify Solutions\\n(Badge: Verified by Senior)" as UC_VerifySol
  usecase "Moderate Forum (Pin/Lock/Report)" as UC_ModForum
  
  usecase "Schedule Batch Event / Lab Eval" as UC_CREvent
  
  usecase "OCR / Parse & Chunk Docs" as UC_Parse
  usecase "Generate Embeddings (pgvector)" as UC_Embed
  usecase "Calculate Deterministic Stats" as UC_Stats
}

Student --> UC_Login
Student --> UC_Cal
Student --> UC_QB
Student --> UC_Practice
Student --> UC_Quiz
Student --> UC_Weightage
Student --> UC_Assistant
Student --> UC_Forum

Contributor --> UC_Upload

CR --> UC_CREvent

Moderator --> UC_ModReview
Moderator --> UC_VerifySol
Moderator --> UC_ModForum

UC_Upload ..> UC_Parse : <<triggers>>
UC_Parse ..> UC_ModReview : <<queues into>>
UC_ModReview ..> UC_Embed : <<upon approval>>
UC_ModReview ..> UC_Stats : <<recomputes>>
UC_Assistant ..> AI : <<RAG query>>
UC_Quiz ..> UC_QB : <<draws from>>
UC_Cal ..> UC_Assistant : <<deep links into>>
@enduml"""

# 2. Activity Diagram
activity_puml = """@startuml
start
:Contributor uploads PDF (PYQ / Slide);
:Server validates MIME type & size (<= 25MB);

if (Valid PDF?) then (yes)
  :Store file locally in storage;
  :Parser extracts raw text & section boundaries;
  :Split exam paper into individual questions & subparts;
  :LLM auto-tags (Course, Topic, Marks, EvalType, Year);
  :Stage questions in 'PENDING_REVIEW' state;
  
  |Moderator (/admin)|
  :Moderator inspects parsed questions in Review Queue;
  if (Tags & Marks Accurate?) then (needs edit)
    :Moderator modifies topic tags or marks;
  else (rejected)
    :Moderator rejects with reason;
    stop
  endif
  
  :Moderator clicks 'Approve';
  
  |Background System|
  :Generate pgvector Embeddings (text-embedding-004);
  :Save vectors to PostgreSQL Document/Question tables;
  :Recompute TopicWeightage & historical stats in SQL;
  :Update Pattern Analysis report;
  :Make questions live in Question Bank;
  
  |Student|
  :Questions searchable and available for Practice;
  stop
else (no)
  :Return Upload Error;
  stop
endif
@enduml"""

# 3. Sequence Diagram
sequence_puml = """@startuml
autonumber
actor "Student (3C72)" as Student
participant "Web Frontend\\n(Next.js App)" as UI
participant "API Route\\n(/api/assistant/chat)" as API
participant "Deterministic Engine\\n(SQL/Code)" as DetEngine
participant "Vector DB\\n(PostgreSQL pgvector)" as DB
participant "LLM Provider\\n(Gemini / Mock)" as LLM

Student -> UI : Asks question ("Compare Agile & Waterfall in MST 2023")
UI -> API : POST /api/assistant/chat { courseId, query, examType="MST" }

API -> DB : Semantic similarity search (query embedding <=> pgvector)
DB --> API : Top-K relevant slide chunks + past PYQs

API -> DetEngine : Fetch historical marks & topic frequency
DetEngine --> API : Deterministic stats (60% Agile share, 10 marks)

API -> API : Construct Grounded Prompt:\\n1. System constraints\\n2. Retrieved slides & PYQ context\\n3. Deterministic stats\\n4. Strict rule: 'Cite exact slides, do not invent'

API -> LLM : generateContent(GroundedPrompt)
LLM --> API : Streamed response with citations\\n('[Slide 12: Unit 1]', '[MST 2023, Q1a]')

API --> UI : JSON payload { responseText, citations: [...] }
UI -> Student : Render KaTeX math, Markdown & clickable citation chips
@enduml"""

# 4. Data Flow Diagram (Mermaid)
dfd_mermaid = """graph TD
    E1["Student (Batch: COE-3-3C72)"]
    E2["Contributor / Senior"]
    E3["Moderator / CR"]
    E4["Gemini LLM API"]

    P1["1.0 Auth & Batch Context Filtering"]
    P2["2.0 Ingestion, OCR & Auto-Tagging"]
    P3["3.0 Moderator Review & Quality Control"]
    P4["4.0 Embedding & Deterministic Analytics Engine"]
    P5["5.0 Question Bank & Practice Session Runner"]
    P6["6.0 Hybrid Retrieval & Grounded AI Assistant"]
    P7["7.0 Academic Calendar & Forum Engine"]

    D1[("D1: Users & Batches")]
    D2[("D2: Raw Uploads / PDF Storage")]
    D3[("D3: Questions & Solutions (pgvector)")]
    D4[("D4: Topic Weightage & Pattern Reports")]
    D5[("D5: Calendar Events & Forum Threads")]

    E1 -->|Credentials| P1
    P1 -->|Fetch Batch Info| D1
    
    E2 -->|Upload PDF / PYQs| P2
    P2 -->|Save File| D2
    P2 -->|Staged Questions| P3
    P2 -.->|Tagging Request| E4
    
    E3 -->|Approve / Modify Tags| P3
    P3 -->|Approved Entities| P4
    P4 -.->|Generate Vectors| E4
    P4 -->|Store Vectors & Chunks| D3
    P4 -->|Update SQL Aggregates| D4
    
    E1 -->|Practice Filter / Attempt| P5
    P5 -->|Read PYQs & Solutions| D3
    P5 -->|Log Scorecard & Weak Topics| D1
    
    E1 -->|Query / Doubt Prompt| P6
    P6 -->|Vector Similarity Query| D3
    P6 -->|Fetch Precomputed Stats| D4
    P6 -.->|Grounded Prompt with Citations| E4
    P6 -->|Verified Cited Answer| E1
    
    E3 -->|Add Batch Lab Eval / MST| P7
    P7 -->|Write Schedule| D5
    D5 -->|Filtered Calendar & Discussions| E1"""

def make_drawio_plantuml(title, puml_code):
    escaped = html.escape(puml_code)
    return f"""<mxfile host="app.diagrams.net" modified="2026-10-09T03:00:00.000Z" agent="Antigravity" version="21.0.0" type="device">
  <diagram id="{title.lower().replace(' ', '_')}" name="{title}">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="{escaped}" style="shape=mxgraph.plantuml.plantuml;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="1000" height="750" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""

with open("diagrams/use_case_diagram.puml", "w") as f:
    f.write(usecase_puml)

with open("diagrams/activity_diagram.puml", "w") as f:
    f.write(activity_puml)

with open("diagrams/sequence_diagram.puml", "w") as f:
    f.write(sequence_puml)

with open("diagrams/data_flow_diagram.mmd", "w") as f:
    f.write(dfd_mermaid)

print("Saved diagram source files into diagrams/ folder.")
