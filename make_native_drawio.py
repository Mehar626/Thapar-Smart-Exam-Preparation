# Generates native, editable drawio XML files containing real editable shapes, lines, actors, and processes.

# 1. USE CASE DIAGRAM (Native Drawio XML)
use_case_xml = """<mxfile host="app.diagrams.net" modified="2026-10-09T03:00:00.000Z" agent="Antigravity" version="21.0.0" type="device">
  <diagram id="usecase" name="Use Case Diagram">
    <mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1400" pageHeight="950" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- System Boundary -->
        <mxCell id="boundary" value="TIET Smart Exam-Prep Platform (UCS503 - COE-3-3C72)" style="shape=swimlane;whiteSpace=wrap;html=1;startSize=30;fillColor=#f8fafc;strokeColor=#64748b;fontStyle=1;fontSize=14;align=center;" vertex="1" parent="1">
          <mxGeometry x="250" y="40" width="840" height="850" as="geometry"/>
        </mxCell>

        <!-- Actors Left -->
        <mxCell id="act_student" value="Student&#xa;(COE-3-3C72)" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#dbeafe;strokeColor=#2563eb;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="80" y="240" width="50" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="act_contrib" value="Contributor /&#xa;Senior" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#fef3c7;strokeColor=#d97706;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="80" y="480" width="50" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="act_cr" value="CR (Batch Rep)" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#e0e7ff;strokeColor=#4f46e5;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="80" y="690" width="50" height="90" as="geometry"/>
        </mxCell>

        <!-- Actors Right -->
        <mxCell id="act_mod" value="Moderator" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#fee2e2;strokeColor=#dc2626;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1190" y="320" width="50" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="act_ai" value="Gemini LLM /&#xa;System Service" style="shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fillColor=#f3e8ff;strokeColor=#9333ea;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1190" y="580" width="50" height="90" as="geometry"/>
        </mxCell>

        <!-- Student Use Cases -->
        <mxCell id="uc_login" value="Login with @thapar.edu&#xa;(Role &amp; Batch Enriched)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;fontStyle=0;" vertex="1" parent="boundary">
          <mxGeometry x="50" y="50" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="uc_cal" value="View Batch Calendar &amp;&#xa;Readiness Countdown" style="ellipse;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;" vertex="1" parent="boundary">
          <mxGeometry x="50" y="130" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="uc_qb" value="Explore Question Bank&#xa;(MST/EST/Topic Filters)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;" vertex="1" parent="boundary">
          <mxGeometry x="50" y="210" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="uc_practice" value="Practice Mode&#xa;(Scratchpad &amp; Self-Grade)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;" vertex="1" parent="boundary">
          <mxGeometry x="50" y="290" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="uc_quiz" value="Attempt Timed 30-Min&#xa;Mock Exam Quiz" style="ellipse;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;" vertex="1" parent="boundary">
          <mxGeometry x="50" y="370" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="uc_weightage" value="View Topic Weightage&#xa;&amp; Historical Trend Charts" style="ellipse;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;" vertex="1" parent="boundary">
          <mxGeometry x="50" y="450" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="uc_assistant" value="Interact with TIET-GPT&#xa;(Grounded Citations &amp; Report)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;fontStyle=1;" vertex="1" parent="boundary">
          <mxGeometry x="50" y="530" width="190" height="65" as="geometry"/>
        </mxCell>
        <mxCell id="uc_forum" value="Participate in Public Forum&#xa;&amp; Live Crunch Chat" style="ellipse;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;" vertex="1" parent="boundary">
          <mxGeometry x="50" y="615" width="180" height="60" as="geometry"/>
        </mxCell>

        <!-- Contributor Use Cases -->
        <mxCell id="uc_upload" value="Upload Course Materials&#xa;(Slides &amp; PYQs)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#fffbeb;strokeColor=#f59e0b;" vertex="1" parent="boundary">
          <mxGeometry x="50" y="700" width="180" height="60" as="geometry"/>
        </mxCell>

        <!-- CR Use Cases -->
        <mxCell id="uc_crevent" value="Schedule Batch Event /&#xa;Lab Evaluation" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e0e7ff;strokeColor=#6366f1;" vertex="1" parent="boundary">
          <mxGeometry x="50" y="780" width="180" height="55" as="geometry"/>
        </mxCell>

        <!-- Ingestion / Processing Use Cases -->
        <mxCell id="uc_parse" value="Parse &amp; Segment Questions&#xa;&amp; Lecture Slides" style="ellipse;whiteSpace=wrap;html=1;fillColor=#faf5ff;strokeColor=#a855f7;" vertex="1" parent="boundary">
          <mxGeometry x="340" y="690" width="190" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="uc_embed" value="Generate Embeddings&#xa;&amp; Store in pgvector" style="ellipse;whiteSpace=wrap;html=1;fillColor=#faf5ff;strokeColor=#a855f7;" vertex="1" parent="boundary">
          <mxGeometry x="580" y="650" width="180" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="uc_stats" value="Compute Deterministic&#xa;Weightages &amp; Trends" style="ellipse;whiteSpace=wrap;html=1;fillColor=#faf5ff;strokeColor=#a855f7;" vertex="1" parent="boundary">
          <mxGeometry x="580" y="730" width="180" height="60" as="geometry"/>
        </mxCell>

        <!-- Moderator Use Cases -->
        <mxCell id="uc_mod_review" value="Review Staged Questions&#xa;in Moderator Queue (/admin)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#fef2f2;strokeColor=#ef4444;fontStyle=1;" vertex="1" parent="boundary">
          <mxGeometry x="570" y="270" width="200" height="65" as="geometry"/>
        </mxCell>
        <mxCell id="uc_verify_sol" value="Verify Solutions&#xa;(Badge: Verified by Senior)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#fef2f2;strokeColor=#ef4444;" vertex="1" parent="boundary">
          <mxGeometry x="570" y="355" width="200" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="uc_mod_forum" value="Moderate Discussion Forum&#xa;(Pin / Lock / Report)" style="ellipse;whiteSpace=wrap;html=1;fillColor=#fef2f2;strokeColor=#ef4444;" vertex="1" parent="boundary">
          <mxGeometry x="570" y="435" width="200" height="60" as="geometry"/>
        </mxCell>

        <!-- Edges: Student -->
        <mxCell id="e_st_login" edge="1" parent="1" source="act_student" target="uc_login" style="endArrow=none;html=1;strokeColor=#2563eb;"/>
        <mxCell id="e_st_cal" edge="1" parent="1" source="act_student" target="uc_cal" style="endArrow=none;html=1;strokeColor=#2563eb;"/>
        <mxCell id="e_st_qb" edge="1" parent="1" source="act_student" target="uc_qb" style="endArrow=none;html=1;strokeColor=#2563eb;"/>
        <mxCell id="e_st_prac" edge="1" parent="1" source="act_student" target="uc_practice" style="endArrow=none;html=1;strokeColor=#2563eb;"/>
        <mxCell id="e_st_quiz" edge="1" parent="1" source="act_student" target="uc_quiz" style="endArrow=none;html=1;strokeColor=#2563eb;"/>
        <mxCell id="e_st_weight" edge="1" parent="1" source="act_student" target="uc_weightage" style="endArrow=none;html=1;strokeColor=#2563eb;"/>
        <mxCell id="e_st_ast" edge="1" parent="1" source="act_student" target="uc_assistant" style="endArrow=none;html=1;strokeColor=#2563eb;strokeWidth=2;"/>
        <mxCell id="e_st_forum" edge="1" parent="1" source="act_student" target="uc_forum" style="endArrow=none;html=1;strokeColor=#2563eb;"/>

        <!-- Edges: Contributor -->
        <mxCell id="e_cb_up" edge="1" parent="1" source="act_contrib" target="uc_upload" style="endArrow=none;html=1;strokeColor=#d97706;"/>

        <!-- Edges: CR -->
        <mxCell id="e_cr_ev" edge="1" parent="1" source="act_cr" target="uc_crevent" style="endArrow=none;html=1;strokeColor=#4f46e5;"/>

        <!-- Edges: Mod -->
        <mxCell id="e_md_rev" edge="1" parent="1" source="act_mod" target="uc_mod_review" style="endArrow=none;html=1;strokeColor=#dc2626;strokeWidth=2;"/>
        <mxCell id="e_md_sol" edge="1" parent="1" source="act_mod" target="uc_verify_sol" style="endArrow=none;html=1;strokeColor=#dc2626;"/>
        <mxCell id="e_md_fm" edge="1" parent="1" source="act_mod" target="uc_mod_forum" style="endArrow=none;html=1;strokeColor=#dc2626;"/>

        <!-- Edges: AI & Pipeline relationships -->
        <mxCell id="e_ai_ast" edge="1" parent="1" source="act_ai" target="uc_assistant" style="endArrow=classic;dashed=1;html=1;strokeColor=#9333ea;strokeWidth=2;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e_up_parse" edge="1" parent="boundary" source="uc_upload" target="uc_parse" style="endArrow=open;dashed=1;html=1;strokeColor=#64748b;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e_parse_mod" edge="1" parent="boundary" source="uc_parse" target="uc_mod_review" style="endArrow=open;dashed=1;html=1;strokeColor=#64748b;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e_mod_emb" edge="1" parent="boundary" source="uc_mod_review" target="uc_embed" style="endArrow=open;dashed=1;html=1;strokeColor=#64748b;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e_mod_st" edge="1" parent="boundary" source="uc_mod_review" target="uc_stats" style="endArrow=open;dashed=1;html=1;strokeColor=#64748b;">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""

# 2. ACTIVITY DIAGRAM (Native Drawio XML)
activity_xml = """<mxfile host="app.diagrams.net" modified="2026-10-09T03:00:00.000Z" agent="Antigravity" version="21.0.0" type="device">
  <diagram id="activity" name="Activity Diagram - Ingestion & Moderation">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="1150" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- Swimlanes -->
        <mxCell id="lane_contrib" value="Contributor / Senior" style="shape=swimlane;whiteSpace=wrap;html=1;startSize=30;fillColor=#fef3c7;strokeColor=#d97706;fontStyle=1;align=center;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="280" height="1060" as="geometry"/>
        </mxCell>
        <mxCell id="lane_system" value="System Ingestion Pipeline" style="shape=swimlane;whiteSpace=wrap;html=1;startSize=30;fillColor=#eff6ff;strokeColor=#2563eb;fontStyle=1;align=center;" vertex="1" parent="1">
          <mxGeometry x="320" y="40" width="440" height="1060" as="geometry"/>
        </mxCell>
        <mxCell id="lane_mod" value="Moderator (/admin Queue)" style="shape=swimlane;whiteSpace=wrap;html=1;startSize=30;fillColor=#fef2f2;strokeColor=#dc2626;fontStyle=1;align=center;" vertex="1" parent="1">
          <mxGeometry x="760" y="40" width="300" height="1060" as="geometry"/>
        </mxCell>

        <!-- Initial node -->
        <mxCell id="init" value="" style="ellipse;fillColor=#000000;strokeColor=#000000;" vertex="1" parent="lane_contrib">
          <mxGeometry x="125" y="60" width="30" height="30" as="geometry"/>
        </mxCell>
        <mxCell id="a_upload" value="Upload PDF Document&#xa;(Lecture Slide / Exam Paper)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#d97706;" vertex="1" parent="lane_contrib">
          <mxGeometry x="50" y="120" width="180" height="50" as="geometry"/>
        </mxCell>

        <!-- System Pipeline Steps -->
        <mxCell id="a_validate" value="Validate File Format&#xa;&amp; Size (≤ 25MB)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#2563eb;" vertex="1" parent="lane_system">
          <mxGeometry x="130" y="120" width="180" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="d_valid" value="Valid?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#2563eb;" vertex="1" parent="lane_system">
          <mxGeometry x="175" y="200" width="90" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="a_parse" value="PDF Text Extraction&#xa;&amp; Structure Segmentation" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#2563eb;" vertex="1" parent="lane_system">
          <mxGeometry x="130" y="290" width="180" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="a_split" value="Split into Questions &amp; Subparts&#xa;or Slide Chunks" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#2563eb;" vertex="1" parent="lane_system">
          <mxGeometry x="130" y="370" width="180" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="a_autotag" value="LLM Auto-Tagging&#xa;(Topic, Marks, EvalType, Year)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#2563eb;" vertex="1" parent="lane_system">
          <mxGeometry x="130" y="450" width="180" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="a_stage" value="Stage in DB with Status:&#xa;'PENDING_REVIEW'" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#2563eb;" vertex="1" parent="lane_system">
          <mxGeometry x="130" y="530" width="180" height="50" as="geometry"/>
        </mxCell>

        <!-- Moderator Steps -->
        <mxCell id="a_queue" value="Review Submissions in&#xa;Queue (/admin)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#dc2626;" vertex="1" parent="lane_mod">
          <mxGeometry x="60" y="530" width="180" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="d_mod" value="Approve?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#dc2626;" vertex="1" parent="lane_mod">
          <mxGeometry x="105" y="615" width="90" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="a_edit" value="Edit Topic Tags, Marks,&#xa;or Question Type" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#dc2626;" vertex="1" parent="lane_mod">
          <mxGeometry x="60" y="700" width="180" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="a_reject" value="Reject with Reason&#xa;&amp; Archive Document" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#dc2626;" vertex="1" parent="lane_mod">
          <mxGeometry x="60" y="775" width="180" height="50" as="geometry"/>
        </mxCell>

        <!-- Final System Steps -->
        <mxCell id="a_embed" value="Generate Embeddings&#xa;(text-embedding-004) &amp; pgvector" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#2563eb;fontStyle=1;" vertex="1" parent="lane_system">
          <mxGeometry x="125" y="700" width="190" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="a_recompute" value="Deterministically Recompute&#xa;Topic Weightage &amp; Stats in SQL" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#2563eb;" vertex="1" parent="lane_system">
          <mxGeometry x="125" y="780" width="190" height="50" as="geometry"/>
        </mxCell>
        <mxCell id="a_publish" value="Publish to Live Question Bank&#xa;&amp; AI Assistant Corpus" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dcfce7;strokeColor=#16a34a;fontStyle=1;" vertex="1" parent="lane_system">
          <mxGeometry x="125" y="860" width="190" height="50" as="geometry"/>
        </mxCell>

        <!-- Termination node -->
        <mxCell id="fin" value="" style="ellipse;html=1;shape=endState;fillColor=#000000;strokeColor=#16a34a;" vertex="1" parent="lane_system">
          <mxGeometry x="205" y="945" width="30" height="30" as="geometry"/>
        </mxCell>
        <mxCell id="fin_reject" value="" style="ellipse;html=1;shape=endState;fillColor=#000000;strokeColor=#dc2626;" vertex="1" parent="lane_mod">
          <mxGeometry x="135" y="855" width="30" height="30" as="geometry"/>
        </mxCell>

        <!-- Connectors -->
        <mxCell id="c1" edge="1" parent="1" source="init" target="a_upload" style="endArrow=classic;html=1;"/>
        <mxCell id="c2" edge="1" parent="1" source="a_upload" target="a_validate" style="endArrow=classic;html=1;"/>
        <mxCell id="c3" edge="1" parent="1" source="a_validate" target="d_valid" style="endArrow=classic;html=1;"/>
        <mxCell id="c4" edge="1" parent="1" source="d_valid" target="a_parse" style="endArrow=classic;html=1;">
          <mxGeometry relative="1" as="geometry"><mxPoint as="offset" value="1"/></mxGeometry>
        </mxCell>
        <mxCell id="c5" edge="1" parent="1" source="a_parse" target="a_split" style="endArrow=classic;html=1;"/>
        <mxCell id="c6" edge="1" parent="1" source="a_split" target="a_autotag" style="endArrow=classic;html=1;"/>
        <mxCell id="c7" edge="1" parent="1" source="a_autotag" target="a_stage" style="endArrow=classic;html=1;"/>
        <mxCell id="c8" edge="1" parent="1" source="a_stage" target="a_queue" style="endArrow=classic;html=1;"/>
        <mxCell id="c9" edge="1" parent="1" source="a_queue" target="d_mod" style="endArrow=classic;html=1;"/>
        <mxCell id="c10" edge="1" parent="1" source="d_mod" target="a_embed" style="endArrow=classic;html=1;value=Approve;"/>
        <mxCell id="c11" edge="1" parent="1" source="d_mod" target="a_edit" style="endArrow=classic;html=1;value=Edit;"/>
        <mxCell id="c12" edge="1" parent="1" source="a_edit" target="a_embed" style="endArrow=classic;html=1;"/>
        <mxCell id="c13" edge="1" parent="1" source="d_mod" target="a_reject" style="endArrow=classic;html=1;value=Reject;"/>
        <mxCell id="c14" edge="1" parent="1" source="a_reject" target="fin_reject" style="endArrow=classic;html=1;"/>
        <mxCell id="c15" edge="1" parent="1" source="a_embed" target="a_recompute" style="endArrow=classic;html=1;"/>
        <mxCell id="c16" edge="1" parent="1" source="a_recompute" target="a_publish" style="endArrow=classic;html=1;"/>
        <mxCell id="c17" edge="1" parent="1" source="a_publish" target="fin" style="endArrow=classic;html=1;"/>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""

# 3. SEQUENCE DIAGRAM (Native Drawio XML)
sequence_xml = """<mxfile host="app.diagrams.net" modified="2026-10-09T03:00:00.000Z" agent="Antigravity" version="21.0.0" type="device">
  <diagram id="sequence" name="Sequence Diagram - Grounded RAG Query">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- Lifelines (Headers) -->
        <mxCell id="p_student" value="Student&#xa;(COE-3-3C72)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#dbeafe;strokeColor=#2563eb;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="120" height="680" as="geometry"/>
        </mxCell>
        <mxCell id="p_fe" value="Web Frontend&#xa;(Next.js Client)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#f1f5f9;strokeColor=#64748b;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="220" y="40" width="120" height="680" as="geometry"/>
        </mxCell>
        <mxCell id="p_api" value="Chat API Route&#xa;(/api/assistant/chat)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#e0e7ff;strokeColor=#4f46e5;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="400" y="40" width="140" height="680" as="geometry"/>
        </mxCell>
        <mxCell id="p_det" value="Deterministic Engine&#xa;(SQL Pattern Aggregator)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#fef3c7;strokeColor=#d97706;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="600" y="40" width="150" height="680" as="geometry"/>
        </mxCell>
        <mxCell id="p_db" value="Vector Database&#xa;(PostgreSQL + pgvector)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#dcfce7;strokeColor=#16a34a;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="810" y="40" width="140" height="680" as="geometry"/>
        </mxCell>
        <mxCell id="p_llm" value="LLM Provider&#xa;(Gemini / Mock)" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fillColor=#f3e8ff;strokeColor=#9333ea;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1000" y="40" width="120" height="680" as="geometry"/>
        </mxCell>

        <!-- Messages -->
        <mxCell id="m1" value="1. Enters doubt: 'Compare Agile vs Waterfall in MST'" style="html=1;verticalAlign=bottom;endArrow=block;strokeColor=#2563eb;" edge="1" parent="1">
          <mxGeometry width="80" relative="1" as="geometry">
            <mxPoint x="100" y="110" as="sourcePoint"/>
            <mxPoint x="280" y="110" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="m2" value="2. POST /api/assistant/chat { courseId, query, examType }" style="html=1;verticalAlign=bottom;endArrow=block;strokeColor=#4f46e5;" edge="1" parent="1">
          <mxGeometry width="80" relative="1" as="geometry">
            <mxPoint x="280" y="145" as="sourcePoint"/>
            <mxPoint x="470" y="145" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="m3" value="3. Semantic Cosine Search (pgvector query <=> chunks)" style="html=1;verticalAlign=bottom;endArrow=block;strokeColor=#16a34a;" edge="1" parent="1">
          <mxGeometry width="80" relative="1" as="geometry">
            <mxPoint x="470" y="180" as="sourcePoint"/>
            <mxPoint x="880" y="180" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="m4" value="4. Returns Top-K relevant Slide Chunks &amp; past PYQs" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;strokeColor=#16a34a;" edge="1" parent="1">
          <mxGeometry width="80" relative="1" as="geometry">
            <mxPoint x="880" y="220" as="sourcePoint"/>
            <mxPoint x="470" y="220" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="m5" value="5. Fetch deterministic stats (marks share, frequency)" style="html=1;verticalAlign=bottom;endArrow=block;strokeColor=#d97706;" edge="1" parent="1">
          <mxGeometry width="80" relative="1" as="geometry">
            <mxPoint x="470" y="260" as="sourcePoint"/>
            <mxPoint x="675" y="260" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="m6" value="6. Returns actual numbers (Agile 60%, 12 marks)" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;strokeColor=#d97706;" edge="1" parent="1">
          <mxGeometry width="80" relative="1" as="geometry">
            <mxPoint x="675" y="300" as="sourcePoint"/>
            <mxPoint x="470" y="300" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

        <!-- Frame / Constraint box -->
        <mxCell id="m_box" value="Grounding Assembly: Combine Slide Chunks + PYQs + Stats&#xa;Enforce Rule: 'Cite exact sources, never invent'" style="shape=note;whiteSpace=wrap;html=1;size=14;verticalAlign=top;align=left;spacingLeft=5;fillColor=#fffbeb;strokeColor=#f59e0b;" vertex="1" parent="1">
          <mxGeometry x="410" y="335" width="280" height="55" as="geometry"/>
        </mxCell>

        <mxCell id="m7" value="7. generateContent(GroundedPrompt)" style="html=1;verticalAlign=bottom;endArrow=block;strokeColor=#9333ea;strokeWidth=2;" edge="1" parent="1">
          <mxGeometry width="80" relative="1" as="geometry">
            <mxPoint x="470" y="430" as="sourcePoint"/>
            <mxPoint x="1060" y="430" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="m8" value="8. Streamed cited response ('[Slide 12: Unit 1]', '[MST 2023, Q1a]')" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;strokeColor=#9333ea;strokeWidth=2;" edge="1" parent="1">
          <mxGeometry width="80" relative="1" as="geometry">
            <mxPoint x="1060" y="480" as="sourcePoint"/>
            <mxPoint x="470" y="480" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="m9" value="9. Return JSON { responseText, citations: [...] }" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;strokeColor=#4f46e5;" edge="1" parent="1">
          <mxGeometry width="80" relative="1" as="geometry">
            <mxPoint x="470" y="530" as="sourcePoint"/>
            <mxPoint x="280" y="530" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="m10" value="10. Render Markdown, KaTeX formulas &amp; clickable citation badges" style="html=1;verticalAlign=bottom;endArrow=open;strokeColor=#2563eb;" edge="1" parent="1">
          <mxGeometry width="80" relative="1" as="geometry">
            <mxPoint x="280" y="575" as="sourcePoint"/>
            <mxPoint x="100" y="575" as="targetPoint"/>
          </mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""

# 4. DATA FLOW DIAGRAM LEVEL 1 (Native Drawio XML)
dfd_xml = """<mxfile host="app.diagrams.net" modified="2026-10-09T03:00:00.000Z" agent="Antigravity" version="21.0.0" type="device">
  <diagram id="dfd" name="Data Flow Diagram (Level 1)">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1200" pageHeight="850" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- External Entities (Rectangles) -->
        <mxCell id="e_student" value="Student&#xa;(COE-3-3C72)" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#dbeafe;strokeColor=#2563eb;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="240" width="130" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="e_contrib" value="Contributor / Senior" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#fef3c7;strokeColor=#d97706;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="520" width="130" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="e_mod" value="Moderator / CR" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#fee2e2;strokeColor=#dc2626;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1000" y="380" width="130" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="e_llm" value="Gemini LLM API" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#f3e8ff;strokeColor=#9333ea;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="1000" y="160" width="130" height="60" as="geometry"/>
        </mxCell>

        <!-- Processes (Circles / Rounded) -->
        <mxCell id="p1" value="1.0&#xa;Auth &amp; Batch Context&#xa;Filtering" style="rounded=1;arcSize=40;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="270" y="100" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="p2" value="2.0&#xa;Ingestion, OCR &amp;&#xa;Auto-Tagging" style="rounded=1;arcSize=40;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="270" y="520" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="p3" value="3.0&#xa;Moderator Review &amp;&#xa;Queue Verification" style="rounded=1;arcSize=40;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="540" y="520" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="p4" value="4.0&#xa;Embedding &amp; Deterministic&#xa;Analytics Engine" style="rounded=1;arcSize=40;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="780" y="520" width="170" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="p5" value="5.0&#xa;Question Bank &amp;&#xa;Practice Runner" style="rounded=1;arcSize=40;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="270" y="240" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="p6" value="6.0&#xa;Hybrid Retrieval &amp;&#xa;Grounded Assistant" style="rounded=1;arcSize=40;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="540" y="240" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="p7" value="7.0&#xa;Academic Calendar&#xa;&amp; Forum Engine" style="rounded=1;arcSize=40;whiteSpace=wrap;html=1;fillColor=#eff6ff;strokeColor=#3b82f6;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="270" y="380" width="160" height="60" as="geometry"/>
        </mxCell>

        <!-- Data Stores (Open-ended rects / cylinders) -->
        <mxCell id="d1" value="D1: Users, Batches &amp; Enrollments" style="shape=partialRectangle;top=0;bottom=0;fillColor=#f8fafc;strokeColor=#475569;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="50" y="40" width="220" height="35" as="geometry"/>
        </mxCell>
        <mxCell id="d2" value="D2: Raw Uploads / PDF Storage" style="shape=partialRectangle;top=0;bottom=0;fillColor=#f8fafc;strokeColor=#475569;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="240" y="670" width="220" height="35" as="geometry"/>
        </mxCell>
        <mxCell id="d3" value="D3: Questions &amp; Embeddings (pgvector)" style="shape=partialRectangle;top=0;bottom=0;fillColor=#f8fafc;strokeColor=#475569;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="750" y="340" width="230" height="35" as="geometry"/>
        </mxCell>
        <mxCell id="d4" value="D4: Topic Weightages &amp; Pattern Reports" style="shape=partialRectangle;top=0;bottom=0;fillColor=#f8fafc;strokeColor=#475569;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="750" y="430" width="230" height="35" as="geometry"/>
        </mxCell>
        <mxCell id="d5" value="D5: Calendar Events &amp; Forum Threads" style="shape=partialRectangle;top=0;bottom=0;fillColor=#f8fafc;strokeColor=#475569;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="510" y="390" width="220" height="35" as="geometry"/>
        </mxCell>

        <!-- Data Flows -->
        <mxCell id="df1" edge="1" parent="1" source="e_student" target="p1" style="endArrow=classic;html=1;value=Credentials;"/>
        <mxCell id="df2" edge="1" parent="1" source="p1" target="d1" style="endArrow=classic;html=1;value=Batch Info;"/>
        
        <mxCell id="df3" edge="1" parent="1" source="e_contrib" target="p2" style="endArrow=classic;html=1;value=PDF Papers;"/>
        <mxCell id="df4" edge="1" parent="1" source="p2" target="d2" style="endArrow=classic;html=1;value=Raw Files;"/>
        <mxCell id="df5" edge="1" parent="1" source="p2" target="p3" style="endArrow=classic;html=1;value=Parsed Questions;"/>
        
        <mxCell id="df6" edge="1" parent="1" source="e_mod" target="p3" style="endArrow=classic;html=1;value=Approval / Tag Edits;"/>
        <mxCell id="df7" edge="1" parent="1" source="p3" target="p4" style="endArrow=classic;html=1;value=Verified Items;"/>
        <mxCell id="df8" edge="1" parent="1" source="p4" target="d3" style="endArrow=classic;html=1;value=Vectors &amp; Chunks;"/>
        <mxCell id="df9" edge="1" parent="1" source="p4" target="d4" style="endArrow=classic;html=1;value=SQL Aggregates;"/>

        <mxCell id="df10" edge="1" parent="1" source="e_student" target="p5" style="endArrow=classic;html=1;value=Filters &amp; Practice;"/>
        <mxCell id="df11" edge="1" parent="1" source="d3" target="p5" style="endArrow=classic;html=1;value=Real PYQs;"/>
        
        <mxCell id="df12" edge="1" parent="1" source="e_student" target="p6" style="endArrow=classic;html=1;value=Doubt / Q&amp;A;"/>
        <mxCell id="df13" edge="1" parent="1" source="d3" target="p6" style="endArrow=classic;html=1;value=Vector Match;"/>
        <mxCell id="df14" edge="1" parent="1" source="d4" target="p6" style="endArrow=classic;html=1;value=Precomputed Stats;"/>
        <mxCell id="df15" edge="1" parent="1" source="p6" target="e_llm" style="endArrow=classic;html=1;value=Grounded Prompt;"/>
        <mxCell id="df16" edge="1" parent="1" source="e_llm" target="p6" style="endArrow=classic;html=1;value=Cited Content;"/>
        <mxCell id="df17" edge="1" parent="1" source="p6" target="e_student" style="endArrow=classic;html=1;value=Grounded Response;"/>

        <mxCell id="df18" edge="1" parent="1" source="e_mod" target="p7" style="endArrow=classic;html=1;value=Add Lab/Exam;"/>
        <mxCell id="df19" edge="1" parent="1" source="p7" target="d5" style="endArrow=classic;html=1;value=Events &amp; Posts;"/>
        <mxCell id="df20" edge="1" parent="1" source="d5" target="e_student" style="endArrow=classic;html=1;value=Filtered Calendar;"/>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""

# Save individual drawio files
with open("diagrams/1_use_case_diagram.drawio", "w") as f:
    f.write(use_case_xml)

with open("diagrams/2_activity_diagram.drawio", "w") as f:
    f.write(activity_xml)

with open("diagrams/3_sequence_diagram.drawio", "w") as f:
    f.write(sequence_xml)

with open("diagrams/4_data_flow_diagram.drawio", "w") as f:
    f.write(dfd_xml)

# Save one unified multi-tab file with all 4 diagrams
all_in_one_xml = f"""<mxfile host="app.diagrams.net" modified="2026-10-09T03:00:00.000Z" agent="Antigravity" version="21.0.0" type="device">
  {use_case_xml[use_case_xml.find('<diagram'):use_case_xml.rfind('</diagram>') + 10]}
  {activity_xml[activity_xml.find('<diagram'):activity_xml.rfind('</diagram>') + 10]}
  {sequence_xml[sequence_xml.find('<diagram'):sequence_xml.rfind('</diagram>') + 10]}
  {dfd_xml[dfd_xml.find('<diagram'):dfd_xml.rfind('</diagram>') + 10]}
</mxfile>"""

with open("diagrams/TIET_ExamPrep_All_Diagrams.drawio", "w") as f:
    f.write(all_in_one_xml)

print("Generated all 4 native draw.io diagrams successfully!")
