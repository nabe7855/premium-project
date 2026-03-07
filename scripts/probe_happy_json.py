import requests
import json
import re

URL = 'https://happyhotel.jp/search/area/40/50019'
HEADERS = {'User-Agent': 'Mozilla/5.0'}

r = requests.get(URL, headers=HEADERS)
match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
if match:
    data = json.loads(match.group(1))
    props = data.get('props', {}).get('pageProps', {})
    # Recursively check for hotel information
    def find_hotels(obj, visited=None):
        if visited is None: visited = set()
        if id(obj) in visited: return
        visited.add(id(obj))

        if isinstance(obj, dict):
            if 'hotelName' in obj or 'hotel_name' in obj:
                print('FOUND HOTEL:', obj.get('hotelName', obj.get('hotel_name')))
                print(json.dumps(obj, indent=2))
                return True
            for k, v in obj.items():
                if find_hotels(v, visited): return True
        elif isinstance(obj, list):
            for i in obj:
                if find_hotels(i, visited): return True
        return False

    find_hotels(props)
else:
    print('Not Found')
