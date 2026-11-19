import numpy as np, wave
exec(open('scripts/sfx_ep1.py').read().split("add(0.0,notif2()")[0])  # reuse helpers
T=46.6; N=int(SR*T); out=np.zeros(N)
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
# dark drone 0-8.6 (villain)
t=np.arange(int(8.6*SR))/SR
drone=(np.sin(2*np.pi*41*t)+0.6*np.sin(2*np.pi*61.7*t)+0.3*np.sin(2*np.pi*82*t*(1+0.003*np.sin(t))))*0.12
drone*=np.minimum(1,t/0.8)*np.minimum(1,(8.6-t)/0.4)
add(0,drone,1.0)
for k in range(7): add(0.4+k*1.1,heart(),0.5)
add(0.5,glitch(),0.6); add(0.5,rise(1.3),0.35); add(1.95,thunder(),0.9); add(2.0,glitch(),0.4); add(1.9,slide(),0.3)
add(4.2,whoosh(0.5),0.4); add(4.45,boom(),0.6)
add(4.5,rise(1.0),0.3); add(5.4,thunder(),0.8); add(5.5,err(),0.4)
add(6.45,whoosh(0.4),0.3); add(6.8,pop(),0.3); add(7.0,pop(),0.3); add(7.2,pop(),0.3); add(7.6,err(),0.35)
# hero
add(8.35,whoosh(0.6),0.6); add(8.8,boom(),0.8); add(8.9,chime(),0.4)
add(10.1,whoosh(0.4),0.35); add(11.4,ding(1320),0.4)
add(12.55,whoosh(0.4),0.35); add(14.64,pop(),0.5); add(15.38,pop(),0.5); add(16.04,ding(1320),0.3); add(17.58,pop(),0.5); add(18.18,err(),0.35); add(18.6,glitch(),0.25)
add(19.65,whoosh(0.4),0.35); add(20.7,slide(),0.3); add(21.4,pop(),0.4); add(22.3,pop(),0.4)
add(22.95,whoosh(0.4),0.35); add(25.06,pop(),0.45); add(26.9,err(),0.4); add(28.14,pop(),0.45); add(29.6,rise(0.8),0.3); add(30.4,ding(1320),0.35); add(31.1,pop(),0.4)
add(32.95,whoosh(0.45),0.35); add(33.7,slide(),0.35); add(34.72,pop(),0.5); add(35.3,pop(),0.5); add(36.28,ding(1320),0.35)
add(37.15,whoosh(0.45),0.35); add(38.28,pop(),0.5); add(39.28,pop(),0.5); add(40.62,chime(),0.35)
add(42.9,whoosh(0.45),0.4); add(43.1,boom(),0.6); add(43.2,chime(),0.5); add(43.35,slide(),0.5)
add(44.2,pop(),0.6)
def kick():
    t=np.arange(int(0.25*SR))/SR; f=110*np.exp(-20*t)+45
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-10*t)
def hat():
    n=int(0.05*SR); x=rng.standard_normal(n); return (x-np.convolve(x,np.ones(3)/3,'same'))*np.exp(-np.arange(n)/SR*90)*0.4
bpm=112; beat=60/bpm; mus=np.zeros(N); b=0; tt=8.5
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
w=wave.open('public/ep7/sfx.wav','w'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close(); print('ok')
