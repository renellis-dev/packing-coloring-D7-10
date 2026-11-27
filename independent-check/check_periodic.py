import sys
# independent: graph distance of difference via BFS on integers (bounded box), not ball-mod-period
from collections import deque
LIM=2000
dist={0:0};dq=deque([0])
while dq:
    x=dq.popleft()
    for s in (7,-7,10,-10):
        y=x+s
        if abs(y)<=LIM and y not in dist: dist[y]=dist[x]+1; dq.append(y)
def check(path,allow0):
    w=list(map(int,open(path).read().split())); P=len(w)
    K=max(w); maxd=max(d for d,v in dist.items() if v<=K)
    # unroll enough copies so every pair within maxd appears, starting anywhere in a period
    seq=w*( (maxd//P)+3)
    pos={}
    for i,c in enumerate(seq):
        if c: pos.setdefault(c,[]).append(i)
    bad=0
    for c,L in pos.items():
        for a in range(len(L)):
            if L[a]>=P: break
            for b in range(a+1,len(L)):
                d=L[b]-L[a]
                if d>10*c: break
                if dist.get(d,99)<=c: bad+=1; print('conflict',c,L[a],d); 
    zeros=w.count(0)
    print(path.split('/')[-1],'period',P,'max',K,'zeros',zeros,'nonzero',P-zeros,'conflicts',bad, 'colors used',sorted(set(w)))
check(sys.argv[1],False); check(sys.argv[2],True)
