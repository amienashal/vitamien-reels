import numpy as np, wave
SR=44100; T=35.6; N=int(SR*T)
out=np.zeros(N)
rng=np.random.default_rng(1)
def mixl(*sigs):
    n=max(len(s) for s in sigs); r=np.zeros(n)
    for s in sigs: r[:len(s)]+=s
    return r
def add(t,sig,g=1.0):
    i=int(t*SR); j=min(N,i+len(sig)); out[i:j]+=sig[:j-i]*g
def tone(f,dur,decay=8,typ='sine'):
    t=np.arange(int(dur*SR))/SR
    w=np.sin(2*np.pi*f*t) if typ=='sine' else np.sign(np.sin(2*np.pi*f*t))*0.5
    a=np.minimum(1,t/0.004)
    return w*np.exp(-decay*t)*a
def pop():
    t=np.arange(int(0.12*SR))/SR; f=600*np.exp(-25*t)+200
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-30*t)
def whoosh(dur=0.6):
    n=int(dur*SR); nz=rng.standard_normal(n); t=np.linspace(0,1,n)
    return np.convolve(nz,np.ones(6)/6,'same')*np.sin(np.pi*t)**2*0.6
def boom():
    t=np.arange(int(0.7*SR))/SR; f=120*np.exp(-6*t)+40
    s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-5*t)
    return s+np.convolve(rng.standard_normal(len(t)),np.ones(30)/30,'same')*np.exp(-12*t)*1.5
def ding(f=1320): return mixl(tone(f,0.8,5),0.4*tone(f*2,0.5,8))
def chime():
    s=np.zeros(int(1.4*SR))
    for k,fq in enumerate([784,988,1175,1568]):
        tt=tone(fq,0.9,4); i=int(k*0.09*SR); s[i:i+len(tt)]+=tt[:len(s)-i]
    return s*0.6
def notif2():
    s=np.zeros(int(0.4*SR)); a=tone(988,0.15,15); b=tone(1318,0.25,12)
    s[:len(a)]+=a; i=int(0.12*SR); s[i:i+len(b)]+=b; return s
def tick(): return tone(2200,0.04,80)
def err():
    s=np.zeros(int(0.5*SR)); a=tone(220,0.18,6,'sq'); s[:len(a)]+=a; i=int(0.22*SR); s[i:i+len(a)]+=a; return s*0.6
def rise(dur=1.6):
    t=np.arange(int(dur*SR))/SR; f=300+700*(t/dur)**2
    return np.sin(2*np.pi*np.cumsum(f)/SR)*0.25*np.minimum(1,t*4)*np.minimum(1,(dur-t)*6)
def slide():
    t=np.arange(int(0.8*SR))/SR; f=900*np.exp(-3*t)+150
    return np.sin(2*np.pi*np.cumsum(f)/SR)*0.35*np.exp(-2*t)
add(0.0,notif2(),0.5); add(0.35,notif2(),0.4)
add(0.6,pop(),0.7)
for k in range(4): add(4.5+k*0.18,pop(),0.5)
add(5.75,whoosh(0.6),0.6); add(6.3,boom(),0.7); add(6.45,pop(),0.6)
for k in range(5): add(7.62+k*0.16,tick(),0.5)
add(8.4,ding(1568),0.35)
for ts in [9.36,16.52,20.27,24.98]: add(ts-0.15,whoosh(0.45),0.35)
add(11.3,rise(1.2),0.5); add(15.0,err(),0.45)
add(16.7,rise(1.2),0.4); add(18.39,ding(1320),0.35); add(19.49,ding(1568),0.35)
add(21.6,rise(1.8),0.45); add(23.5,chime(),0.45)
for k in range(12): add(25.2+k*0.17,tick(),0.35)
add(27.2,pop(),0.6); add(28.7,err(),0.35)
add(30.3,whoosh(0.45),0.4); add(30.48,boom(),0.6); add(30.6,chime(),0.5); add(30.9,slide(),0.5)
add(31.4,pop(),0.6); add(32.0,ding(1760),0.3)
bpm=104; beat=60/bpm
def kick():
    t=np.arange(int(0.25*SR))/SR; f=110*np.exp(-20*t)+45
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-10*t)
def hat():
    n=int(0.05*SR); x=rng.standard_normal(n); return (x-np.convolve(x,np.ones(3)/3,'same'))*np.exp(-np.arange(n)/SR*90)*0.4
bass=[55,55,65.4,49]; mus=np.zeros(N); b=0; t=0.0
def put(arr,i,s):
    if i>=N: return
    j=min(N,i+len(s)); arr[i:j]+=s[:j-i]
while t<T-0.5:
    i=int(t*SR)
    if b%2==0: put(mus,i,kick()*0.8)
    put(mus,int((t+beat/2)*SR),hat())
    fq=bass[(b//4)%4]; put(mus,i,tone(fq,beat*0.9,3)*0.5)
    if b%2==1: put(mus,i,tone(fq*4*(1.5 if (b//2)%2 else 1),0.3,10)*0.25)
    t+=beat; b+=1
mus*=0.12
fo=int(1.2*SR); fade=np.ones(N); fade[-fo:]=np.linspace(1,0,fo)
mix=np.tanh((out*0.8+mus)*fade*1.2)*0.8
w=wave.open('public/ep1/sfx.wav','w'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close(); print('ok')
