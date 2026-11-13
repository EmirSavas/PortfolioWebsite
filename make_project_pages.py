# Creates projects/<id>/index.html for every project in content.js.
# Run:  python3 make_project_pages.py   (only needed after adding a new project)
import json, re, subprocess, os
js = subprocess.check_output(["node", "-e", "global.window={};require('./content.js');console.log(JSON.stringify(window.SITE.en.projects.items.map(p=>({id:p.id,title:p.title,short:p.short}))))"]).decode()
TEMPLATE = open("project-template.html").read()
for p in json.loads(js):
    d = os.path.join("projects", p["id"]); os.makedirs(d, exist_ok=True)
    html = TEMPLATE.replace("{{TITLE}}", p["title"]).replace("{{DESC}}", p["short"].replace('"', "&quot;"))
    open(os.path.join(d, "index.html"), "w").write(html)
    print("wrote", d)
