"""Refresh the English homepage citation badge from its Google Scholar profile."""
import re
from datetime import datetime
from pathlib import Path
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

PROFILE = 'https://scholar.google.com/citations?user=pNBIQ8wAAAAJ&hl=en'
PAGE = Path(__file__).resolve().parents[1] / 'index.html'


def citation_count(html):
    table = re.search(r'<table\b[^>]*\bid=[\'\"]gsc_rsb_st[\'\"][^>]*>(.*?)</table>', html, re.S)
    if not table:
        raise ValueError('Scholar statistics table missing (possibly blocked or CAPTCHA)')
    cell = re.search(r'<td\b[^>]*class=[\'\"]gsc_rsb_std[\'\"][^>]*>\s*([\d,]+)\s*</td>', table[1])
    if not cell:
        raise ValueError('Total citation count missing')
    return int(cell[1].replace(',', ''))


def main():
    request = Request(PROFILE, headers={'User-Agent': 'Mozilla/5.0'})
    with urlopen(request, timeout=30) as response:
        count = citation_count(response.read().decode('utf-8'))
    source = PAGE.read_text()
    checked = datetime.now(ZoneInfo('Asia/Shanghai')).strftime('%Y-%m-%d')
    badge = re.compile(r'(<a class="scholar-badge"[^>]*>)(.*?)(</a>)', re.S)
    def update(match):
        link, image, end = match.groups()
        link = re.sub(r'title="[^"]*"', f'title="Google Scholar · checked {checked}"', link)
        image, n = re.subn(r'/badge/Citations-[\d,]+-4285F4', f'/badge/Citations-{count}-4285F4', image)
        if n != 1:
            raise ValueError('Expected exactly one citation badge image')
        image = re.sub(r'alt="Google Scholar citations: [\d,]+"', f'alt="Google Scholar citations: {count}"', image)
        return link + image + end
    result, n = badge.subn(update, source)
    if n != 1:
        raise ValueError('Expected exactly one Scholar badge')
    PAGE.write_text(result)
    print(f'Google Scholar citations: {count}; checked {checked}')


if __name__ == '__main__':
    main()
