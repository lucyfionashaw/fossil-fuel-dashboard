import re, json

txt = open('county-data.js', encoding='utf-8').read()
def grab(name):
    m = re.search(name + r' = (.*?);\n', txt, re.S)
    return json.loads(m.group(1))

ORDER = grab('const COUNTY_CAT_ORDER')
COUNTY = grab('const COUNTY_JOBS')
STATE  = grab('const STATE_JOBS')

iEPG  = ORDER.index('epg_Coal')      # power plants
iFUEL = ORDER.index('fuels_Coal')    # mining / processing
NCOUNTIES = len(COUNTY)              # county units in USEER file

def analyze(label, vi):
    fi = vi - 1                      # flag index (f string excludes 'total')
    rep, sup = [], []                # reported counties, suppressed counties
    for f, d in COUNTY.items():
        v = d['v'][vi]
        if d['f'][fi] == '1':
            sup.append((f, v, d))
        elif v > 0:
            rep.append((f, v, d))
    rep.sort(key=lambda x: -x[1])
    rep_total = sum(v for _, v, _ in rep)
    sup_total = sum(v for _, v, _ in sup)
    nat = rep_total + sup_total
    # state authoritative total
    state_total = sum(s['v'][vi] for s in STATE.values())

    def topshare(n):
        return sum(v for _, v, _ in rep[:n]) / nat * 100

    # counties to reach X% of national (reported, descending)
    def n_for(pct):
        c = 0.0
        for i, (_, v, _) in enumerate(rep, 1):
            c += v
            if c / nat * 100 >= pct:
                return i
        return len(rep)

    # HHI across reported counties (0-10000)
    hhi = sum((v / nat * 100) ** 2 for _, v, _ in rep)

    # state-level concentration (authoritative state totals)
    st = sorted(((a, s['v'][vi]) for a, s in STATE.items() if s['v'][vi] > 0),
                key=lambda x: -x[1])
    st_tot = sum(v for _, v in st)
    def st_share(n): return sum(v for _, v in st[:n]) / st_tot * 100

    # local dependence: coal as share of that county's energy jobs (reported counties)
    dep = []
    for f, v, d in rep:
        tot = d['v'][0]
        if tot > 0:
            dep.append((d['n'], d['s'], v, tot, v / tot * 100))
    dep.sort(key=lambda x: -x[4])

    print('=' * 70)
    print(label)
    print('=' * 70)
    print(f'National total (authoritative state sum): {state_total:,}')
    print(f'County build-up total                   : {round(nat):,}  (reported {round(rep_total):,} + suppressed {round(sup_total):,})')
    print(f'Reported counties capture {rep_total/nat*100:.1f}% of county-build coal jobs')
    print()
    print('--- FOOTPRINT (how widespread) ---')
    print(f'Counties with reported coal jobs : {len(rep):>5}  ({len(rep)/NCOUNTIES*100:.1f}% of {NCOUNTIES} county units)')
    print(f'Counties suppressed (1-9 jobs)   : {len(sup):>5}')
    print(f'Counties with ANY coal presence  : {len(rep)+len(sup):>5}  ({(len(rep)+len(sup))/NCOUNTIES*100:.1f}%)')
    print(f'Counties with ZERO coal jobs     : {NCOUNTIES-len(rep)-len(sup):>5}  ({(NCOUNTIES-len(rep)-len(sup))/NCOUNTIES*100:.1f}%)')
    print()
    print('--- CLUSTERING (how few hold most jobs) ---')
    print(f'Top  1 county : {topshare(1):.1f}%   ({rep[0][2]["n"]}, {rep[0][2]["s"]} = {round(rep[0][1]):,} jobs)')
    print(f'Top  5 counties: {topshare(5):.1f}%')
    print(f'Top 10 counties: {topshare(10):.1f}%')
    print(f'Top 25 counties: {topshare(25):.1f}%')
    print(f'Top 50 counties: {topshare(50):.1f}%')
    print(f'# counties = 50% of jobs : {n_for(50)}')
    print(f'# counties = 80% of jobs : {n_for(80)}')
    print(f'# counties = 90% of jobs : {n_for(90)}')
    print(f'HHI (across counties)    : {round(hhi):,}   (>2500 = highly concentrated)')
    print()
    print('--- STATE-LEVEL ---')
    print(f'States with coal jobs : {len(st)}')
    print(f'Top state  : {st_share(1):.1f}%   ({STATE[st[0][0]]["n"]} = {round(st[0][1]):,})')
    print(f'Top 3 states: {st_share(3):.1f}%   ({", ".join(STATE[a]["n"] for a,_ in st[:3])})')
    print(f'Top 5 states: {st_share(5):.1f}%')
    print()
    print('--- LOCAL DEPENDENCE (coal as % of county ENERGY jobs) ---')
    for nm, s, v, tot, pc in dep[:10]:
        print(f'  {pc:5.1f}%   {nm}, {s}   ({round(v):,} of {round(tot):,} energy jobs)')
    n_dep = sum(1 for *_, pc in dep if pc >= 25)
    print(f'Counties where coal >= 25% of local energy jobs: {n_dep}')
    print()

analyze('COAL MINING  (Fuels -> Coal: extraction & processing)', iFUEL)
analyze('COAL POWER   (Electric Power Generation -> Coal)', iEPG)
