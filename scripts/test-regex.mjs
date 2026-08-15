const r = /(^|[^"'])(https?:\/\/[^\s<>"]+)/g;
console.log('→https://google.com'.replace(r, '$1<a href="$2">$2</a>'));
console.log('<img src="https://google.com">'.replace(r, '$1<a href="$2">$2</a>'));
console.log(' 詳しくはこちら https://google.com '.replace(r, '$1<a href="$2">$2</a>'));
