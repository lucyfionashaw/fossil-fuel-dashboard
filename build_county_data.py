import pandas as pd, json, os

COUNTY = r'C:/Users/lucyf/Downloads/2025-useer-county-data.xlsx'
STATE  = r'C:/Users/lucyf/Dropbox/Nenufar/EIA Analysis/USEER_2025_energy_jobs_by_state.xlsx'

ABBR = {'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA','Colorado':'CO',
'Connecticut':'CT','Delaware':'DE','District of Columbia':'DC','Florida':'FL','Georgia':'GA','Hawaii':'HI',
'Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY','Louisiana':'LA',
'Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS',
'Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ',
'New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD',
'Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA',
'West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY'}
NAME = {v:k for k,v in ABBR.items()}

CATS = ['total','epg_Solar','epg_Wind','epg_Hydroelectric','epg_Low-Impact Hydroelectric',
        'epg_Natural Gas','epg_Coal','epg_Oil & Other FF','epg_Other','tds',
        'fuels_Coal','fuels_Petroleum & Other FF','fuels_Natural Gas','fuels_Woody Biomass',
        'fuels_Corn Ethanol','fuels_Other','ee','mv']
LEAVES = CATS[1:]

EPG = {'epg_Solar':4,'epg_Wind':5,'epg_Hydroelectric':6,'epg_Low-Impact Hydroelectric':7,
       'epg_Natural Gas':8,'epg_Coal':9,'epg_Oil & Other FF':10,'epg_Other':11}
TDS_COLS = [13,14,15,16,17]
FUELS = {'fuels_Coal':19,'fuels_Petroleum & Other FF':20,'fuels_Natural Gas':21,
         'fuels_Woody Biomass':22,'fuels_Corn Ethanol':23,'fuels_Other':24}
EE_COLS = [26,27,28,29,30]
MV_COL = 32
SUPP = 5.0

def parse(x):
    if pd.isna(x): return 0.0, False
    s = str(x).strip()
    if s.startswith('<'): return SUPP, True
    try: return float(x), False
    except: return 0.0, False

# ---------------- county sheet ----------------
cdf = pd.read_excel(COUNTY, sheet_name='County', header=None).iloc[2:].reset_index(drop=True)
counties = {}
for _, row in cdf.iterrows():
    fips = row[1]
    if pd.isna(fips): continue
    fips = str(int(fips)).zfill(5)
    # skip USEER state-level "unallocated" rows (FIPS xxx999, no county name) — not real counties
    if fips[2:] == '999' or pd.isna(row[2]): continue
    rec = {'n': str(row[2]).strip(), 's': str(row[0]).strip(), 'val': {}, 'supp': {}}
    for k, c in EPG.items():
        v, sup = parse(row[c]); rec['val'][k]=v; rec['supp'][k]=sup
    for k, c in FUELS.items():
        v, sup = parse(row[c]); rec['val'][k]=v; rec['supp'][k]=sup
    v, sup = parse(row[MV_COL]); rec['val']['mv']=v; rec['supp']['mv']=sup
    tp=[parse(row[c]) for c in TDS_COLS]; rec['val']['tds']=sum(p[0] for p in tp)
    rec['supp']['tds']=all(p[1] or p[0]==0 for p in tp) and any(p[1] for p in tp)
    ep=[parse(row[c]) for c in EE_COLS]; rec['val']['ee']=sum(p[0] for p in ep)
    rec['supp']['ee']=all(p[1] or p[0]==0 for p in ep) and any(p[1] for p in ep)
    counties[fips]=rec

by_state = {}
for f, r in counties.items():
    by_state.setdefault(r['s'], []).append(f)

# ---------------- state targets ----------------
sub = pd.read_excel(STATE, sheet_name='Energy Jobs 2024')
sub = sub[sub['Sub-sector'].notna()]
subt = sub.groupby(['State','Sub-sector'])['Number of jobs'].sum()
val = pd.read_excel(STATE, sheet_name='Validation')
valt = val.set_index(['State','Sector'])['Stated sector total']

def ssub(state, name):
    try: return float(subt.loc[(state,name)])
    except KeyError: return 0.0
def ssec(state, sector):
    try: return float(valt.loc[(state,sector)])
    except KeyError: return 0.0

# TGT[abbr][leaf] = authoritative state target (sector totals preserved exactly)
TGT = {}
for abbr, fipss in by_state.items():
    st = NAME.get(abbr)
    t = {}
    # EPG: scale sub-sectors to the Validation EPG sector total so they sum exactly
    epg_sec = ssec(st,'Electric Power Generation')
    raw = {
        'epg_Solar': ssub(st,'Solar EPG'),
        'epg_Wind': ssub(st,'Wind EPG'),
        'hydro': ssub(st,'Traditional Hydro EPG'),
        'epg_Natural Gas': ssub(st,'Natural Gas EPG'),
        'epg_Coal': ssub(st,'Coal EPG'),
        'epg_Oil & Other FF': ssub(st,'Oil & Other Fossil Fuel EPG'),
        'epg_Other': ssub(st,'Other EPG') + ssub(st,'Nuclear EPG'),
    }
    s_raw = sum(raw.values())
    sc = (epg_sec/s_raw) if s_raw>0 else 0.0
    # split Traditional Hydro into Hydroelectric / Low-Impact by county proportion
    csh = sum(counties[f]['val']['epg_Hydroelectric'] for f in fipss)
    csl = sum(counties[f]['val']['epg_Low-Impact Hydroelectric'] for f in fipss)
    frac_low = (csl/(csh+csl)) if (csh+csl)>0 else 0.0
    hydro = raw['hydro']*sc
    t['epg_Solar']=raw['epg_Solar']*sc; t['epg_Wind']=raw['epg_Wind']*sc
    t['epg_Hydroelectric']=hydro*(1-frac_low); t['epg_Low-Impact Hydroelectric']=hydro*frac_low
    t['epg_Natural Gas']=raw['epg_Natural Gas']*sc; t['epg_Coal']=raw['epg_Coal']*sc
    t['epg_Oil & Other FF']=raw['epg_Oil & Other FF']*sc; t['epg_Other']=raw['epg_Other']*sc
    # Fuels: scale sub-sectors to Validation Fuels sector total
    fuel_sec = ssec(st,'Fuels')
    fraw = {
        'fuels_Coal': ssub(st,'Coal Fuels'),
        'fuels_Petroleum & Other FF': ssub(st,'Oil & Other Petroleum Fuels'),
        'fuels_Natural Gas': ssub(st,'Natural Gas Fuels'),
        'fuels_Woody Biomass': ssub(st,'Woody Biomass and Cellulosic Biofuels'),
        'fuels_Corn Ethanol': ssub(st,'Corn Ethanol Fuels'),
        'fuels_Other': ssub(st,'Other Fuels') + ssub(st,'Other Ethanol / Non-woody Biomass Fuels'),
    }
    fs = sum(fraw.values()); fsc = (fuel_sec/fs) if fs>0 else 0.0
    for k,v in fraw.items(): t[k]=v*fsc
    # buckets straight from Validation sector totals
    t['tds']=ssec(st,'Transmission, Distribution & Storage')
    t['ee'] =ssec(st,'Energy Efficiency')
    t['mv'] =ssec(st,'Motor Vehicles & Component Parts')
    TGT[abbr]=t

# ---------------- county reconciliation (impute suppressed) ----------------
for abbr, fipss in by_state.items():
    for leaf in LEAVES:
        T = TGT[abbr].get(leaf, 0.0)
        supp_f=[f for f in fipss if counties[f]['supp'][leaf]]
        rep_f =[f for f in fipss if not counties[f]['supp'][leaf]]
        R = sum(counties[f]['val'][leaf] for f in rep_f)
        k=len(supp_f)
        if k>0 and (T-R)>0:
            share=(T-R)/k
            for f in supp_f: counties[f]['val'][leaf]=share

# ---------------- assemble county JSON ----------------
def r1(x): return round(x,1) if x<100 else round(x)
cout={}
for f,r in counties.items():
    leafvals=[r['val'][lf] for lf in LEAVES]
    flags=''.join('1' if r['supp'][lf] else '0' for lf in LEAVES)
    cout[f]={'n':r['n'],'s':r['s'],'v':[round(sum(leafvals))]+[r1(x) for x in leafvals],'f':flags}

# ---------------- assemble state JSON ----------------
sout={}
for abbr in by_state:
    leafvals=[TGT[abbr].get(lf,0.0) for lf in LEAVES]
    sout[abbr]={'n':NAME.get(abbr),'v':[round(sum(leafvals))]+[r1(x) for x in leafvals]}

js  = 'const COUNTY_CAT_ORDER = '+json.dumps(CATS)+';\n'
js += 'const COUNTY_JOBS = '+json.dumps(cout,separators=(',',':'))+';\n'
js += 'const STATE_JOBS = '+json.dumps(sout,separators=(',',':'))+';\n'
open('county-data.js','w',encoding='utf-8').write(js)

nat_s=sum(d['v'][0] for d in sout.values())
nat_c=sum(d['v'][0] for d in cout.values())
print('states',len(sout),'counties',len(cout))
print('STATE national total :', f'{nat_s:,}', '(target 8,466,698)')
print('COUNTY national total:', f'{nat_c:,}')
print(f'\n{"leaf":34}{"county":>12}{"state":>12}')
for i,lf in enumerate(LEAVES,1):
    print(f'{lf:34}{round(sum(d["v"][i] for d in cout.values())):>12,}{round(sum(d["v"][i] for d in sout.values())):>12,}')
print('wrote county-data.js', round(os.path.getsize("county-data.js")/1024),'KB')
