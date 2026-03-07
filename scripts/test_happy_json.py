import requests
import json
import re

URL = 'https://happyhotel.jp/search/area/40/50019'
HEADERS = {'User-Agent': 'Mozilla/5.0'}

r = requests.get(URL, headers=HEADERS)
match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
if match:
    data = json.loads(match.group(1))
    # props.pageProps.initialState.hotelSearch.searchResult.hotelList
    # Let's see what's in pageProps
    print(json.dumps(list(data['props']['pageProps'].keys()), indent=2))
    if 'initialState' in data['props']['pageProps']:
        print(json.dumps(list(data['props']['pageProps']['initialState'].keys()), indent=2))
else:
    print('Not Found')
