def balls(R):
    B=[{0}]
    for r in range(R):
        b=B[-1]; B.append(b|{x+s for x in b for s in (7,-7,10,-10)})
    return B
B=balls(8)
for c,p,q in ((3,2,17),(5,2,45),(6,2,55),(7,1,34)):
    mask=sum(1<<(d-1) for d in B[c] if d>0)
    idx={0:0};st=[0];E=[];i=0
    while i<len(st):
        s=st[i];o=[]
        for w,t in [(0,s>>1)]+([(1,(s>>1)|mask)] if not s&1 else []):
            if t not in idx: idx[t]=len(st);st.append(t)
            o.append((idx[t],w))
        E.append(o);i+=1
    H=[0]*len(st)
    while True:
        N=[max([H[i]]+[H[t]+q*w-p for t,w in E[i]]) for i in range(len(st))]
        if N==H: break
        H=N
    print(c,p,q,'states',len(st),'H0',H[0],'maxH',max(H))
