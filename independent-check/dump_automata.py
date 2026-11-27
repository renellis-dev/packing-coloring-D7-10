def balls(R):
    B=[{0}]
    for r in range(R):
        b=B[-1]; B.append(b|{x+s for x in b for s in (7,-7,10,-10)})
    return B
B=balls(4)
for c in (1,2,4):
    mask=0
    for d in B[c]:
        if d>0: mask|=1<<(d-1)
    idx={0:0}; st=[0]; rows=[]; i=0
    while i<len(st):
        s=st[i]; r=[]
        for t in ([s>>1, (s>>1)|mask] if not s&1 else [s>>1,None]):
            if t is None: r.append(-1); continue
            if t not in idx: idx[t]=len(st); st.append(t)
            r.append(idx[t])
        rows.append(r); i+=1
    with open(f"t{c}.txt","w") as f:
        f.write(f"{len(rows)}\n"+"".join(f"{a} {b}\n" for a,b in rows))
    print(c,len(rows))
