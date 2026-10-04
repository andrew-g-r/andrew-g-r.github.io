"""Check the static publication directory, links, and contact-detail exclusions."""

from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1] / "docs"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.references = []
        self.headings = 0

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if "id" in values:
            self.ids.append(values["id"])
        if tag == "h1":
            self.headings += 1
        for attribute in ("src", "href"):
            if attribute in values:
                self.references.append(values[attribute])
        if tag == "img":
            assert values.get("alt"), "Images need useful alternative text"


page = Page()
page.feed((ROOT / "index.html").read_text())
assert page.headings == 1
assert len(page.ids) == len(set(page.ids)), "Duplicate IDs"
for reference in page.references:
    assert not reference.startswith(("mailto:", "tel:")), "Contact link in public site"
    parts = urlsplit(reference)
    if parts.scheme:
        assert parts.scheme in ("https", "data"), f"Unexpected link scheme: {parts.scheme}"
        continue
    if parts.path:
        assert (ROOT / unquote(parts.path.lstrip("/"))).is_file(), reference
    if parts.fragment:
        assert parts.fragment in page.ids, reference

css = ROOT / "assets/site.css"
for reference in re.findall(r"url\(([^)]+)\)", css.read_text()):
    path = css.parent / reference.strip("\"'")
    assert path.is_file(), path

email = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
phone = re.compile(r"(?<![\w.])(?:\+1[ -]?)?\(?\d{3}\)?[ .-]\d{3}[ .-]\d{4}(?![\w.])")
for path in ROOT.rglob("*"):
    if path.suffix not in (".html", ".js", ".css"):
        continue
    content = path.read_text()
    assert not email.search(content), f"Email address in {path.relative_to(ROOT)}"
    assert not phone.search(content), f"Phone number in {path.relative_to(ROOT)}"
    assert not re.search(r"google-analytics|googletagmanager|facebook\.net", content), "Unexpected tracking"

assert (ROOT / ".nojekyll").is_file()
print("Site checks passed: assets, anchors, metadata structure, and contact-detail exclusions.")
