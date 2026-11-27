const fs=require('fs');
const [p,q,maxit]=process.argv.slice(2).map(Number);
const T=[1,2,4].map(c=>{const L=fs.readFileSync(`t${c}.txt`,'utf8').trim().split('\n');const n=+L[0];const bl=new Int32Array(n),pl=new Int32Array(n);for(let i=0;i<n;i++){const [a,b]=L[i+1].split(' ').map(Number);bl[i]=a;pl[i]=b;}return {n,bl,pl};});
const [A,Bc,C]=T; const n1=Bc.n,n2=C.n, N=A.n*n1*n2;
const ID=(a,b,c)=>(a*n1+b)*n2+c;
const R=new Uint8Array(N), Q=new Int32Array(N); let h=0,t=0,E=0; R[0]=1;Q[t++]=0;
const nx=new Int32Array(4);
function succ(s){const a=Math.floor(s/(n1*n2)),b=Math.floor(s/n2)%n1,c=s%n2;let m=0;
 nx[m++]=ID(A.bl[a],Bc.bl[b],C.bl[c]);
 if(A.pl[a]>=0)nx[m++]=ID(A.pl[a],Bc.bl[b],C.bl[c]);
 if(Bc.pl[b]>=0)nx[m++]=ID(A.bl[a],Bc.pl[b],C.bl[c]);
 if(C.pl[c]>=0)nx[m++]=ID(A.bl[a],Bc.bl[b],C.pl[c]);return m;}
while(h<t){const s=Q[h++];const m=succ(s);E+=m;for(let i=0;i<m;i++)if(!R[nx[i]]){R[nx[i]]=1;Q[t++]=nx[i];}}
console.log('reachable',t,'edges',E);
const H=new Int32Array(N);
for(let it=0;it<maxit;it++){let ch=0,mx=0;
 for(let i=t-1;i>=0;i--){const s=Q[i];const m=succ(s);let v=H[s];
  for(let k=0;k<m;k++){const x=H[nx[k]]+(k>0?q:0)-p;if(x>v)v=x;}
  if(v!==H[s]){H[s]=v;ch++;} if(v>mx)mx=v;}
 if(it%20==0||!ch)console.log('it',it,'changed',ch,'max',mx,'H0',H[0]);
 if(!ch){console.log('FIXPOINT H0=',H[0]);process.exit(0);}
 if(mx>5e6){console.log('DIVERGES at it',it);process.exit(1);}
}
console.log('no conclusion');
