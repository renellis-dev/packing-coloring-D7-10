from fractions import Fraction as F
import sys
def balls(R):
    B=[{0}]
    for r in range(R):
        b=B[-1]; B.append(b|{x+s for x in b for s in (7,-7,10,-10)})
    return B
B=balls(8)
def maxmean(c):
    mask=0
    for d in B[c]:
        if d>0: mask|=1<<(d-1)
    idx={0:0}; st=[0]; edges=[]
    i=0
    while i<len(st):
        s=st[i]; outs=[]
        for w,t in ((0,s>>1),)+(((1,(s>>1)|mask),) if not s&1 else ()):
            if t not in idx: idx[t]=len(st); st.append(t)
            outs.append((idx[t],w))
        edges.append(outs); i+=1
    n=len(st)
    # Karp max mean cycle from source 0 (all states reachable)
    NEG=-10**9
    D=[[NEG]*n for _ in range(n+1)]; D[0][0]=0
    for k in range(n):
        Dk=D[k]; Dn=D[k+1]
        for u in range(n):
            if Dk[u]>NEG:
                for v,w in edges[u]:
                    if Dk[u]+w>Dn[v]: Dn[v]=Dk[u]+w
    best=None
    for v in range(n):
        if D[n][v]==NEG: continue
        m=min(F(D[n][v]-D[k][v],n-k) for k in range(n) if D[k][v]>NEG)
        if best is None or m>best: best=m
    return n,best
for c in map(int,sys.argv[1:]):
    print(c,*maxmean(c),flush=True)
