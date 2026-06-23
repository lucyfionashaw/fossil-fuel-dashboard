import re, json

txt = open('county-data.js', encoding='utf-8').read()
def grab(n): return json.loads(re.search(n + r' = (.*?);\n', txt, re.S).group(1))
ORDER = grab('const COUNTY_CAT_ORDER'); COUNTY = grab('const COUNTY_JOBS')
EMP = json.loads(re.search(r'const COUNTY_EMP = (.*?);\n',
                           open('county-emp.js', encoding='utf-8').read(), re.S).group(1))

def dep(label, vi):
    fi = vi - 1
    rows = []
    for f, d in COUNTY.items():
        if d['f'][fi] == '1':       # skip suppressed/imputed
            continue
        v = d['v'][vi]
        tot = EMP.get(f, 0)
        if v > 0 and tot > 0:
            rows.append((d['n'], d['s'], v, tot, v / tot * 100))
    rows.sort(key=lambda x: -x[4])
    print('=' * 66)
    print(label, '— coal as % of ALL county jobs (Census CBP private emp)')
    print('=' * 66)
    for nm, s, v, tot, pc in rows[:12]:
        print(f'  {pc:5.1f}%   {nm}, {s}   ({v:,} coal of {tot:,} total jobs)')
    for thr in (10, 25, 40):
        print(f'  counties where coal >= {thr}% of all jobs: {sum(1 for *_ , pc in rows if pc >= thr)}')
    print()

dep('COAL MINING (Fuels)', ORDER.index('fuels_Coal'))
dep('COAL POWER  (EPG)',   ORDER.index('epg_Coal'))
