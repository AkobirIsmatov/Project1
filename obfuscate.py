import re, json


def minify_js(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(r"\s+", " ", content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')


def minify_css(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(r"/\*.*?\*/", "", content, flags=re.DOTALL)
    content = re.sub(r"\s+", " ", content)
    content = re.sub(r"\s*([{};:,])\s*", r"\1", content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')


def minify_html(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL)
    content = re.sub(r"\s+", " ", content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')


def minify_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, separators=(',', ':'), ensure_ascii=False)
        f.write('\n')


for path in ['index.html', 'style.css', 'script.js', 'blackhole.js', 'CV_info.json']:
    if path.endswith('.js'):
        minify_js(path)
    elif path.endswith('.css'):
        minify_css(path)
    elif path.endswith('.html'):
        minify_html(path)
    elif path.endswith('.json'):
        minify_json(path)
