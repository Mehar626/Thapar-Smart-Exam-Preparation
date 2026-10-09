import urllib.request
import zlib
import base64
import os

def plantuml_encode(plantuml_text):
    # Standard PlantUML encoding format (deflate + custom base64-like map)
    zlibbed = zlib.compress(plantuml_text.encode('utf-8'))[2:-4]
    mapping = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"
    res = ""
    for i in range(0, len(zlibbed), 3):
        b1 = zlibbed[i]
        b2 = zlibbed[i+1] if i+1 < len(zlibbed) else 0
        b3 = zlibbed[i+2] if i+2 < len(zlibbed) else 0
        c1 = b1 >> 2
        c2 = ((b1 & 0x3) << 4) | (b2 >> 4)
        c3 = ((b2 & 0xF) << 2) | (b3 >> 6)
        c4 = b3 & 0x3F
        res += mapping[c1] + mapping[c2]
        if i + 1 < len(zlibbed):
            res += mapping[c3]
        if i + 2 < len(zlibbed):
            res += mapping[c4]
    return res

diagrams = [
    ("diagrams/use_case_diagram.puml", "diagrams/use_case_diagram.svg", "diagrams/use_case_diagram.png"),
    ("diagrams/activity_diagram.puml", "diagrams/activity_diagram.svg", "diagrams/activity_diagram.png"),
    ("diagrams/sequence_diagram.puml", "diagrams/sequence_diagram.svg", "diagrams/sequence_diagram.png"),
]

for src, out_svg, out_png in diagrams:
    with open(src, 'r') as f:
        content = f.read()
    code = plantuml_encode(content)
    
    # Download SVG
    svg_url = f"http://www.plantuml.com/plantuml/svg/~1{code}"
    try:
        req = urllib.request.Request(svg_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            svg_data = response.read()
            with open(out_svg, 'wb') as out_f:
                out_f.write(svg_data)
        print(f"Successfully generated {out_svg}")
    except Exception as e:
        print(f"Failed to fetch {out_svg}: {e}")

    # Download PNG
    png_url = f"http://www.plantuml.com/plantuml/png/~1{code}"
    try:
        req = urllib.request.Request(png_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            png_data = response.read()
            with open(out_png, 'wb') as out_f:
                out_f.write(png_data)
        print(f"Successfully generated {out_png}")
    except Exception as e:
        print(f"Failed to fetch {out_png}: {e}")

