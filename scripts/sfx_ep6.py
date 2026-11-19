import numpy as np, wave
exec(open('scripts/sfx_ep1.py').read().split("add(0.0,notif2()")[0])  # reuse helpers
T=44.0; N=int(SR*T); out=np.zeros(N)
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
# dark drone 0-11.9 (villain)
t=np.arange(int(11.9*SR))/SR
drone=(np.sin(2*np.pi*41*t)+0.6*np.sin(2*np.pi*61.7*t)+0.3*np.sin(2*np.pi*82*t*(1+0.003*np.sin(t))))*0.12
drone*=np.minimum(1,t/0.8)*np.minimum(1,(11.9-t)/0.4)
add(0,drone,1.0)
for k in range(10): add(0.4+k*1.1,heart(),0.5)
add(0.8,glitch(),0.6); add(1.8,rise(1.4),0.35); add(4.75,thunder(),0.9); add(4.9,rise(1.2),0.3); add(5.0,glitch(),0.4)
add(7.0,whoosh(0.5),0.4); add(7.25,boom(),0.6)
add(7.33,pop(),0.4); add(7.7,err(),0.5); add(8.47,pop(),0.4); add(8.9,err(),0.5)
for k in range(9): add(9.69+k*0.12,pop(),0.25)
add(10.8,thunder(),0.8)
# hero
add(11.6,whoosh(0.6),0.6); add(12.15,boom(),0.8); add(12.25,chime(),0.4)
add(13.3,whoosh(0.4),0.35); add(14.6,err(),0.45); add(15.5,err(),0.4); add(15.55,boom(),0.3)
add(16.95,whoosh(0.4),0.35); add(17.75,pop(),0.5); add(18.45,pop(),0.5); add(18.95,pop(),0.5)
add(19.0,rise(1.6),0.3); add(20.7,ding(1320),0.35)
add(20.95,whoosh(0.4),0.35); add(21.6,slide(),0.3); add(23.2,ding(1320),0.3); add(24.31,pop(),0.5); add(24.5,glitch(),0.25); add(25.4,pop(),0.45)
add(26.35,whoosh(0.4),0.35); add(27.7,pop(),0.45); add(30.2,err(),0.45); add(31.83,pop(),0.45); add(33.2,rise(0.8),0.3); add(34.0,ding(1320),0.35)
add(34.15,whoosh(0.45),0.35); add(35.33,pop(),0.5); add(36.77,pop(),0.5); add(37.9,chime(),0.35)
add(39.95,whoosh(0.45),0.4); add(40.15,boom(),0.6); add(40.25,chime(),0.5); add(40.4,slide(),0.5)
add(41.5,pop(),0.6)
def kick():
    t=np.arange(int(0.25*SR))/SR; f=110*np.exp(-20*t)+45
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-10*t)
def hat():
    n=int(0.05*SR); x=rng.standard_normal(n); return (x-np.convolve(x,np.ones(3)/3,'same'))*np.exp(-np.arange(n)/SR*90)*0.4
# hero music bed from 11.9
bpm=112; beat=60/bpm; mus=np.zeros(N); b=0; tt=11.75
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
w=wave.open('public/ep6/sfx.wav','w'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close(); print('ok')
