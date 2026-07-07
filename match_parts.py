import cv2
import numpy as np
import glob
import os

main_img_path = r'C:\Users\nabe7\.gemini\antigravity\scratch\obsidian-antigravity-nexus\dev\premium-project\public\images\store\fukuoka\new-header\01_header_full.png'
parts_dir = r'C:\Users\nabe7\.gemini\antigravity\scratch\obsidian-antigravity-nexus\dev\premium-project\public\images\store\fukuoka\new-header'

main_img = cv2.imread(main_img_path)
H, W = main_img.shape[:2]

print(f'Main Image: {W}x{H}')

results = {}
for part_path in glob.glob(os.path.join(parts_dir, '*.png')):
    name = os.path.basename(part_path)
    if name.startswith('00') or name.startswith('01') or name.startswith('04'): 
        continue
    
    part = cv2.imread(part_path)
    if part is None: continue
    
    h, w = part.shape[:2]
    
    res = cv2.matchTemplate(main_img, part, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    
    x, y = max_loc
    
    left_pct = (x / W) * 100
    top_pct = (y / H) * 100
    width_pct = (w / W) * 100
    height_pct = (h / H) * 100
    
    results[name] = {
        'left': f'{left_pct:.3f}%',
        'top': f'{top_pct:.3f}%',
        'width': f'{width_pct:.3f}%',
        'height': f'{height_pct:.3f}%',
        'confidence': max_val
    }
    
for k in sorted(results.keys()):
    v = results[k]
    print(f"{k}: left={v['left']}, top={v['top']}, width={v['width']}, height={v['height']}, conf={v['confidence']:.2f}")
