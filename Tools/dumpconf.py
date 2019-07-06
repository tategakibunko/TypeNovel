#!/usr/local/bin/python
import json
import sys

f = open("init.tnconfig.json")
lines = []
json = json.dumps(f.read())
lines.append("namespace TypeNovel.Lib\n")
lines.append("module InitialTnConfig = begin")
lines.append("  let value = " + json)
lines.append("end")
f.close()

print('\n'.join(lines))
