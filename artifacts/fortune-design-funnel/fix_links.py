import re

with open('src/pages/Services.tsx', 'r') as f:
    content = f.read()

# Remove the Link import
content = content.replace("import { Link } from \"wouter\";", "")

# Fix opening: <Link href="/path">\n  <a className="cls">
# -> <a href={`${BASE}/path`} className="cls">
def fix_open(m):
    path = m.group(1)
    cls = m.group(2)
    return f'<a href={{`${{BASE}}{path}`}} className="{cls}"'

content = re.sub(
    r'<Link href="(/[^"]*)">\s*\n\s*<a className="([^"]+)"',
    fix_open,
    content
)

# Fix template literal: <Link href={`/packages/${pkg.slug}`}>\n  <a className={`...`}>
def fix_open_tpl(m):
    path = m.group(1)
    var = m.group(2)
    cls = m.group(3)
    return f'<a href={{`${{BASE}}{path}${{{var}}}`}} className={{{cls}}}'

content = re.sub(
    r'<Link href=\{`(/[^$`]*)\$\{([^}]+)\}`\}>\s*\n\s*<a className=\{(`[^`]+`)\}',
    fix_open_tpl,
    content
)

# Fix closing: </a>\n  </Link> -> </a>
content = re.sub(r'</a>\n(\s*)</Link>', r'</a>', content)

with open('src/pages/Services.tsx', 'w') as f:
    f.write(content)

print('Done - links fixed')
