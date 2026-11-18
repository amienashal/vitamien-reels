import numpy as np, wave
exec(open('scripts/sfx_ep1.py').read().split("add(0.0,notif2()")[0])  # reuse helpers
T=40.0; N=int(SR*T); out=np.zeros(N)
def add(t,sig,g=1.0):
    i=int(t*SR); j=min(N,i+len(sig)); out[i:j]+=sig[:j-i]*g
def thunder():
    n=int(2.0*SR); t=np.arange(n)/SR; x=rng.standard_normal(n)
    lp=np.convolve(x,np.ones(60)/60,'same'); crack=np.convolve(x,np.ones(4)/4,'same')*np.exp(-25*t)
    return (lp*3*np.exp(-2.2*t)+crack*0.8)*0.6
def glitch():
    n=int(0.25*SR); t=np.arange(n)/SR
    return np.sign(np.sin(2*np.pi*(80+rng.integers(0,600))*t))*0.25*(rng.random(n)>0.3)*np.exp(-6*t)
def heart():
    s=np.zeros(int(0.6*SR)); a=tone(55,0.18,14)*1.2; s[:len(a)]+=a; i=int(0.2*SR); s[i:i+len(a)]+=a*0.8; return s
def alarm(dur=1.5):
    t=np.arange(int(dur*SR))/SR; f=600+250*np.sign(np.sin(2*np.pi*3*t))
    return np.sin(2*np.pi*np.cumsum(f)/SR)*0.18
# dark drone 0-12.9 (villain)
t=np.arange(int(13.1*SR))/SR
drone=(np.sin(2*np.pi*41*t)+0.6*np.sin(2*np.pi*61.7*t)+0.3*np.sin(2*np.pi*82*t*(1+0.003*np.sin(t))))*0.12
drone*=np.minimum(1,t/0.8)*np.minimum(1,(13.1-t)/0.4)
add(0,drone,1.0)
for k in range(11): add(0.4+k*1.1,heart(),0.5)
add(0.8,glitch(),0.6); add(3.2,pop(),0.5); add(3.6,thunder(),0.9); add(4.5,glitch(),0.4)
add(6.3,whoosh(0.5),0.4); add(6.5,boom(),0.6)
add(8.8,err(),0.5); add(9.9,rise(1.1),0.35)
for k in range(6): add(10.0+k*0.15,pop(),0.25)
add(11.9,thunder(),0.8)
# hero
add(12.75,whoosh(0.6),0.6); add(13.3,boom(),0.8); add(13.4,chime(),0.4)
add(14.6,rise(1.0),0.3); add(16.8,pop(),0.5); add(18.3,err(),0.45); add(18.4,pop(),0.5); add(19.8,slide(),0.4)
add(20.95,whoosh(0.4),0.35); add(21.84,pop(),0.5); add(22.58,pop(),0.5); add(23.06,pop(),0.5)
add(23.5,rise(1.4),0.3); add(25.0,ding(1320),0.35); add(26.4,rise(1.0),0.25); add(27.6,err(),0.4)
add(29.45,whoosh(0.4),0.35); add(31.8,pop(),0.5); add(33.3,pop(),0.5); add(34.4,rise(0.8),0.35); add(35.2,ding(1320),0.35)
add(35.55,whoosh(0.45),0.4); add(35.75,boom(),0.6); add(35.85,chime(),0.5); add(36.0,slide(),0.5)
add(36.9,pop(),0.6)
def kick():
    t=np.arange(int(0.25*SR))/SR; f=110*np.exp(-20*t)+45
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-10*t)
def hat():
    n=int(0.05*SR); x=rng.standard_normal(n); return (x-np.convolve(x,np.ones(3)/3,'same'))*np.exp(-np.arange(n)/SR*90)*0.4
# hero music bed from 12.9
bpm=112; beat=60/bpm; mus=np.zeros(N); b=0; tt=12.9
def put(arr,i,s):
    if i>=N: return
    j=min(N,i+len(s)); arr[i:j]+=s[:j-i]
bass=[55,65.4,73.4,49]
while tt<T-0.5:
    i=int(tt*SR)
    if b%2==0: put(mus,i,kick()*0.8)
    put(mus,int((tt+beat/2)*SR),hat())
    fq=bass[(b//4)%4]; put(mus,i,tone(fq,beat*0.9,3)*0.5)
    if b%2==1: put(mus,i,tone(fq*4*(1.5 if (b//2)%2 else 1),0.3,10)*0.25)
    tt+=beat; b+=1
mus*=0.11
fo=int(1.2*SR); fade=np.ones(N); fade[-fo:]=np.linspace(1,0,fo)
mix=np.tanh((out*0.8+mus)*fade*1.2)*0.8
w=wave.open('public/ep4/sfx.wav','w'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close(); print('ok')
