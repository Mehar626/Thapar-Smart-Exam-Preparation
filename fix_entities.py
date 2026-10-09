import re
import xml.etree.ElementTree as ET

files = [
    "diagrams/1_use_case_diagram.drawio",
    "diagrams/2_activity_diagram.drawio",
    "diagrams/3_sequence_diagram.drawio",
    "diagrams/4_data_flow_diagram.drawio"
]

def clean_xml(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace unescaped & with &amp; if not already &amp; or &lt; or &gt; or &quot; or &#...;
    cleaned = re.sub(r'&(?!(amp|lt|gt|quot|#\d+|#x[0-9a-fA-F]+);)', '&amp;', content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(cleaned)
    
    try:
        ET.fromstring(cleaned)
        print(f"✓ {path} is VALID XML")
    except Exception as e:
        print(f"✗ {path} error: {e}")

for file in files:
    clean_xml(file)

# Now recreate TIET_ExamPrep_All_Diagrams.drawio cleanly
diagram_tags = []
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        c = f.read()
    m = re.search(r'(<diagram[\s\S]*?</diagram>)', c)
    if m:
        diagram_tags.append(m.group(1))

all_xml = """<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2026-10-09T03:15:00.000Z" agent="Antigravity" version="21.0.0" type="device">
""" + "\n".join(diagram_tags) + "\n</mxfile>"

with open("diagrams/TIET_ExamPrep_All_Diagrams.drawio", 'w', encoding='utf-8') as f:
    f.write(all_xml)

try:
    ET.fromstring(all_xml)
    print("✓ diagrams/TIET_ExamPrep_All_Diagrams.drawio is 100% VALID XML!")
except Exception as e:
    print(f"✗ TIET_ExamPrep_All_Diagrams.drawio error: {e}")

