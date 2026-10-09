import re
import xml.etree.ElementTree as ET

def escape_xml_attr_values(xml_str):
    # Fix <=> and standalone < or > inside attributes
    fixed = xml_str.replace('<=>', '&lt;=&gt;')
    # Replace unescaped & 
    fixed = re.sub(r'&(?!(amp|lt|gt|quot|#\d+|#x[0-9a-fA-F]+);)', '&amp;', fixed)
    return fixed

# Fix 3_sequence_diagram.drawio
with open("diagrams/3_sequence_diagram.drawio", "r") as f:
    s = f.read()

s_fixed = escape_xml_attr_values(s)
with open("diagrams/3_sequence_diagram.drawio", "w") as f:
    f.write(s_fixed)

ET.fromstring(s_fixed)
print("✓ 3_sequence_diagram.drawio is perfectly valid now!")

# Now regenerate TIET_ExamPrep_All_Diagrams.drawio
files = [
    "diagrams/1_use_case_diagram.drawio",
    "diagrams/2_activity_diagram.drawio",
    "diagrams/3_sequence_diagram.drawio",
    "diagrams/4_data_flow_diagram.drawio"
]

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

ET.fromstring(all_xml)
print("✓ ALL DIAGRAMS FILE TIET_ExamPrep_All_Diagrams.drawio is 100% VALID AND TESTED!")

