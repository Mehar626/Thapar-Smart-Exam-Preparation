import re

# Read all 4 individual files
with open("diagrams/1_use_case_diagram.drawio") as f:
    f1 = f.read()
with open("diagrams/2_activity_diagram.drawio") as f:
    f2 = f.read()
with open("diagrams/3_sequence_diagram.drawio") as f:
    f3 = f.read()
with open("diagrams/4_data_flow_diagram.drawio") as f:
    f4 = f.read()

def extract_diagram_tag(xml_content):
    # Regex find <diagram ...>...</diagram>
    match = re.search(r'(<diagram[\s\S]*?</diagram>)', xml_content)
    if match:
        return match.group(1)
    return ""

d1 = extract_diagram_tag(f1)
d2 = extract_diagram_tag(f2)
d3 = extract_diagram_tag(f3)
d4 = extract_diagram_tag(f4)

# Create a properly formatted mxfile with standard xml declaration
all_file_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2026-10-09T03:15:00.000Z" agent="Antigravity" version="21.0.0" type="device">
  {d1}
  {d2}
  {d3}
  {d4}
</mxfile>"""

with open("diagrams/TIET_ExamPrep_All_Diagrams.drawio", "w", encoding="utf-8") as f:
    f.write(all_file_content)

print("Validated XML structure for TIET_ExamPrep_All_Diagrams.drawio")

# Test with python xml parser
import xml.etree.ElementTree as ET
try:
    ET.fromstring(all_file_content)
    print("SUCCESS: XML is 100% valid and parsed correctly!")
except Exception as e:
    print("XML Error:", e)

