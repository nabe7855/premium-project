import json

data = {
    '02_top_info_bar.png': {'left': 0.000, 'top': 1.103, 'width': 100.000, 'height': 11.034},
    '03_gold_divider.png': {'left': 5.071, 'top': 11.586, 'width': 89.811, 'height': 4.138},
    '05_silk_top_left.png': {'left': 0.000, 'top': 0.000, 'width': 16.598, 'height': 28.966},
    '06_silk_top_right.png': {'left': 83.402, 'top': 0.000, 'width': 16.598, 'height': 28.966},
    '07_silk_bottom_left.png': {'left': 0.000, 'top': 71.034, 'width': 16.598, 'height': 28.966},
    '08_silk_bottom_right.png': {'left': 83.402, 'top': 71.034, 'width': 16.598, 'height': 28.966},
    '09_today_card.png': {'left': 3.412, 'top': 20.690, 'width': 13.094, 'height': 49.379},
    '10_calendar_icon.png': {'left': 8.068, 'top': 28.966, 'width': 5.071, 'height': 12.414},
    '11_today_text.png': {'left': 7.284, 'top': 43.034, 'width': 6.777, 'height': 9.103},
    '12_honjitsu_text.png': {'left': 5.901, 'top': 52.690, 'width': 9.544, 'height': 11.034},
    '13_center_logo.png': {'left': 20.931, 'top': 15.448, 'width': 14.200, 'height': 53.517},
    '14_title_line1.png': {'left': 37.529, 'top': 25.931, 'width': 31.812, 'height': 19.862},
    '15_title_line2.png': {'left': 36.515, 'top': 44.966, 'width': 31.074, 'height': 22.897},
    '16_script_eng.png': {'left': 71.369, 'top': 26.483, 'width': 7.377, 'height': 15.448},
    '17_fukuoka_badge.png': {'left': 72.983, 'top': 48.552, 'width': 10.558, 'height': 15.172},
    '18_fukuoka_text.png': {'left': 71.000, 'top': 49.655, 'width': 8.944, 'height': 14.069},
    '19_menu_card.png': {'left': 86.307, 'top': 20.690, 'width': 10.881, 'height': 49.379},
    '20_menu_crown.png': {'left': 89.258, 'top': 23.724, 'width': 5.440, 'height': 10.207},
    '21_menu_text.png': {'left': 86.215, 'top': 37.793, 'width': 10.927, 'height': 9.103},
    '22_menu_hamburger.png': {'left': 88.889, 'top': 49.793, 'width': 6.270, 'height': 9.517},
    '23_bottom_bar.png': {'left': 3.412, 'top': 73.379, 'width': 94.145, 'height': 17.931},
    '24_left_segment.png': {'left': 3.596, 'top': 73.793, 'width': 43.061, 'height': 17.241},
    '25_pc_icon.png': {'left': 4.979, 'top': 76.414, 'width': 5.533, 'height': 14.345},
    '26_web_yoyaku_text.png': {'left': 10.788, 'top': 81.103, 'width': 10.051, 'height': 7.172},
    '27_24h_ok_text.png': {'left': 24.159, 'top': 81.793, 'width': 8.483, 'height': 5.655},
    '28_cta_button.png': {'left': 32.273, 'top': 78.345, 'width': 14.016, 'height': 10.483},
    '29_center_ornament.png': {'left': 49.285, 'top': 81.931, 'width': 1.614, 'height': 6.069},
    '30_right_segment.png': {'left': 49.424, 'top': 73.793, 'width': 48.133, 'height': 17.241},
    '31_phone_icon.png': {'left': 49.424, 'top': 76.138, 'width': 6.178, 'height': 14.897},
    '32_denwa_uketsuke.png': {'left': 56.155, 'top': 79.310, 'width': 9.497, 'height': 8.690},
    '33_time_range_text.png': {'left': 68.419, 'top': 81.793, 'width': 10.327, 'height': 5.655},
    '34_phone_number.png': {'left': 78.654, 'top': 81.379, 'width': 16.044, 'height': 6.759},
    '35_flower.png': {'left': 93.038, 'top': 44.138, 'width': 5.533, 'height': 27.586},
    '36_sparkles.png': {'left': 16.413, 'top': 25.103, 'width': 1.936, 'height': 41.379},
    '37_separator_dotted.png': {'left': 78.562, 'top': 86.621, 'width': 15.122, 'height': 3.862},
    '37b_ornament_line.png': {'left': 5.071, 'top': 11.310, 'width': 89.811, 'height': 4.690}
}

groups = {
    'logo_center': {
        'type': 'link', 'href': '/store/{slug}', 'bg': None, 'box': None,
        'parts': ['13_center_logo.png', '14_title_line1.png', '15_title_line2.png', '16_script_eng.png', '17_fukuoka_badge.png', '18_fukuoka_text.png']
    },
    'today_card': {
        'type': 'link', 'href': '/store/{slug}/cast', 'bg': '09_today_card.png',
        'parts': ['10_calendar_icon.png', '11_today_text.png', '12_honjitsu_text.png']
    },
    'menu_card': {
        'type': 'button', 'onClick': 'toggleMenu', 'bg': '19_menu_card.png',
        'parts': ['20_menu_crown.png', '21_menu_text.png', '22_menu_hamburger.png']
    },
    'cta_left': {
        'type': 'link', 'href': '/store/{slug}/first-time', 'bg': '24_left_segment.png',
        'parts': ['25_pc_icon.png', '26_web_yoyaku_text.png', '27_24h_ok_text.png', '28_cta_button.png']
    },
    'phone_right': {
        'type': 'tel', 'href': 'tel...', 'bg': '30_right_segment.png',
        'parts': ['31_phone_icon.png', '32_denwa_uketsuke.png', '33_time_range_text.png', '34_phone_number.png']
    }
}

def calc_rel(child, parent):
    rl = (child['left'] - parent['left']) / parent['width'] * 100
    rt = (child['top'] - parent['top']) / parent['height'] * 100
    rw = child['width'] / parent['width'] * 100
    rh = child['height'] / parent['height'] * 100
    return rl, rt, rw, rh

min_l = min([data[p]['left'] for p in groups['logo_center']['parts']])
min_t = min([data[p]['top'] for p in groups['logo_center']['parts']])
max_r = max([data[p]['left'] + data[p]['width'] for p in groups['logo_center']['parts']])
max_b = max([data[p]['top'] + data[p]['height'] for p in groups['logo_center']['parts']])
groups['logo_center']['box'] = {'left': min_l, 'top': min_t, 'width': max_r - min_l, 'height': max_b - min_t}

def generate_img(part_name, rel_box, is_bg=False):
    classes = 'absolute pointer-events-none'
    style = f" style={{{{ left: '{rel_box[0]:.3f}%', top: '{rel_box[1]:.3f}%', width: '{rel_box[2]:.3f}%', height: '{rel_box[3]:.3f}%' }}}}"
    return f'<img src="/images/store/fukuoka/new-header/{part_name}" className="{classes}"{style} alt="" />'

print('--- REACT CODE ---')
for gname, g in groups.items():
    parent_box = data[g['bg']] if g['bg'] else g['box']
    print(f"\n{gname}: absolute left: {parent_box['left']:.3f}%, top: {parent_box['top']:.3f}%, w: {parent_box['width']:.3f}%, h: {parent_box['height']:.3f}%")
    
    if g['bg']:
        print('  ' + generate_img(g['bg'], (0,0,100,100), True))
        
    for p in g['parts']:
        rel = calc_rel(data[p], parent_box)
        print('  ' + generate_img(p, rel, False))

print('\n--- NON-GROUP PARTS ---')
grouped_parts = set()
for g in groups.values():
    if g['bg']: grouped_parts.add(g['bg'])
    for p in g['parts']: grouped_parts.add(p)

for p, box in data.items():
    if p not in grouped_parts:
        print(generate_img(p, (box['left'], box['top'], box['width'], box['height']), False))
