import csv, json, re

# total private employment per county FIPS from Census CBP 2022 (naics = '------')
emp = {}
with open('cbp22co/cbp22co.txt', newline='', encoding='latin-1') as fh:
    r = csv.DictReader(fh)
    for row in r:
        if row['naics'].strip('"') == '------':
            fips = row['fipstate'].zfill(2) + row['fipscty'].zfill(3)
            try:
                emp[fips] = int(row['emp'])
            except ValueError:
                emp[fips] = 0

# coverage check against the USEER counties
txt = open('county-data.js', encoding='utf-8').read()
COUNTY = json.loads(re.search(r'const COUNTY_JOBS = (.*?);\n', txt, re.S).group(1))
matched = sum(1 for f in COUNTY if emp.get(f, 0) > 0)
missing = [f for f in COUNTY if emp.get(f, 0) <= 0]
print(f'CBP county rows           : {len(emp):,}')
print(f'USEER counties            : {len(COUNTY):,}')
print(f'USEER counties matched    : {matched:,}')
print(f'USEER counties unmatched  : {len(missing):,}')
print('sample unmatched:', [(f, COUNTY[f]["n"], COUNTY[f]["s"]) for f in missing[:8]])

out = {f: emp[f] for f in COUNTY if emp.get(f, 0) > 0}
js = 'const COUNTY_EMP = ' + json.dumps(out, separators=(',', ':')) + ';\n'
open('county-emp.js', 'w', encoding='utf-8').write(js)
print('wrote county-emp.js', round(len(js) / 1024), 'KB')
