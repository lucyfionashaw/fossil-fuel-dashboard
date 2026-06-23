import re, json

txt = open('county-data.js', encoding='utf-8').read()
def grab(n): return json.loads(re.search(n + r' = (.*?);\n', txt, re.S).group(1))
ORDER = grab('const COUNTY_CAT_ORDER'); COUNTY = grab('const COUNTY_JOBS'); STATE = grab('const STATE_JOBS')
EMP = json.loads(re.search(r'const COUNTY_EMP = (.*?);\n',
                           open('county-emp.js', encoding='utf-8').read(), re.S).group(1))
NC = len(COUNTY)
SNAME = {a: STATE[a]['n'] for a in STATE}

def metrics(key):
    vi = ORDER.index(key); fi = vi - 1
    rep = []          # disclosed counties (name, state, jobs, emp)
    for f, d in COUNTY.items():
        if d['f'][fi] == '1':
            continue
        v = d['v'][vi]
        if v > 0:
            rep.append((f, d['n'], d['s'], v, EMP.get(f, 0)))
    rep.sort(key=lambda x: -x[3])
    nat = sum(s['v'][vi] for s in STATE.values())          # authoritative national
    rep_tot = sum(x[3] for x in rep)
    base = rep_tot if rep_tot else 1
    def topc(n): return sum(x[3] for x in rep[:n]) / base * 100
    def n_for(p):
        c = 0
        for i, x in enumerate(rep, 1):
            c += x[3]
            if c / base * 100 >= p: return i
        return len(rep)
    hhi = sum((x[3] / base * 100) ** 2 for x in rep)
    # states
    st = sorted(((a, STATE[a]['v'][vi]) for a in STATE if STATE[a]['v'][vi] > 0), key=lambda x: -x[1])
    st_tot = sum(v for _, v in st) or 1
    # dependence (share of ALL jobs, CBP). Restrict the headline county to a real
    # employment base (>=2,000 jobs) so micro-counties with one facility don't dominate;
    # >100% cases (energy jobs > county private payroll) are counted but flagged.
    dep = [(nm, s, v, e, v / e * 100) for _, nm, s, v, e in rep if e > 0]
    dep.sort(key=lambda x: -x[4])
    sizeable = [d for d in dep if d[3] >= 2000]
    top_dep = sizeable[0] if sizeable else (dep[0] if dep else ('-', '-', 0, 0, 0))
    n_over100 = sum(1 for *_, pc in dep if pc > 100)
    return dict(
        nat=round(nat), ncty=len(rep), cty_pc=len(rep) / NC * 100,
        top1=topc(1), top1_nm=f'{rep[0][1]}, {rep[0][2]}' if rep else '-', top1_jobs=round(rep[0][3]) if rep else 0,
        top10=topc(10), n50=n_for(50), n80=n_for(80), hhi=round(hhi),
        top_state=SNAME[st[0][0]] if st else '-', top_state_pc=(st[0][1] / st_tot * 100) if st else 0,
        top3_pc=sum(v for _, v in st[:3]) / st_tot * 100,
        dep_nm=f'{top_dep[0]}, {top_dep[1]}', dep_pc=top_dep[4], dep_jobs=round(top_dep[2]), dep_emp=round(top_dep[3]),
        n_dep25=sum(1 for *_, pc in dep if pc >= 25), n_dep10=sum(1 for *_, pc in dep if pc >= 10),
        n_over100=n_over100,
    )

CATS = [
    ('Coal — mining',      'fuels_Coal'),
    ('Coal — power',       'epg_Coal'),
    ('Oil/petroleum — fuels', 'fuels_Petroleum & Other FF'),
    ('Oil — power',        'epg_Oil & Other FF'),
    ('Gas — fuels',        'fuels_Natural Gas'),
    ('Gas — power',        'epg_Natural Gas'),
    ('Solar — power',      'epg_Solar'),
    ('Wind — power',       'epg_Wind'),
    ('Hydro — power',      'epg_Hydroelectric'),
    ('Woody biomass',      'fuels_Woody Biomass'),
    ('Corn ethanol',       'fuels_Corn Ethanol'),
    ('Transmission/Distribution/Storage', 'tds'),
    ('Energy efficiency',  'ee'),
    ('Motor vehicles',     'mv'),
]

rows = [(lbl, metrics(k)) for lbl, k in CATS]

print(f'{"category":36}{"jobs":>10}{"#cty":>6}{"cty%":>6}{"top1%":>7}{"top10%":>8}{"#=50%":>7}{"#=80%":>7}{"HHI":>6}{"topState":>16}{"st%":>6}{"top3%":>7}')
for lbl, m in rows:
    print(f'{lbl:36}{m["nat"]:>10,}{m["ncty"]:>6}{m["cty_pc"]:>6.1f}{m["top1"]:>7.1f}{m["top10"]:>8.1f}{m["n50"]:>7}{m["n80"]:>7}{m["hhi"]:>6,}{m["top_state"]:>16}{m["top_state_pc"]:>6.1f}{m["top3_pc"]:>7.1f}')

print('\n--- LOCAL DEPENDENCE (share of ALL county jobs, CBP 2022) ---')
print('  headline county restricted to >=2,000 total jobs; #>=X% counts all disclosed counties')
print(f'{"category":36}{"most-dependent sizeable county":34}{"%all":>6}{"#>=25%":>8}{"#>=10%":>8}{"#>100%":>8}')
for lbl, m in rows:
    print(f'{lbl:36}{m["dep_nm"]:34}{m["dep_pc"]:>6.1f}{m["n_dep25"]:>8}{m["n_dep10"]:>8}{m["n_over100"]:>8}')
