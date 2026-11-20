"""Voice over gratis via Microsoft Edge TTS (pengganti ElevenLabs).

Pakai:
  python3 scripts/tts_edge.py <peran> "<teks>" <out.wav> <words.json> [--offset DETIK]
peran: n (narator/Vitaboy), hx (Hoaksin), viro (Viro & villain lain)

Output: WAV 24 kHz mono + JSON kata [{w, s, e, who}] (timing dari WordBoundary Edge,
tidak perlu faster-whisper). --offset menggeser timing bila klip ditaruh tidak di detik 0.
Efek villain memakai pitch-shift tanpa mengubah durasi, jadi timing kata tetap akurat.
"""
import asyncio, json, os, ssl, subprocess, sys, tempfile

import edge_tts
import edge_tts.communicate as _c

CA = "/root/.ccr/ca-bundle.crt"
if os.path.exists(CA):  # proxy sandbox cloud
    _c._SSL_CTX = ssl.create_default_context(cafile=CA)

ROLES = {
    # voice, rate, pitch, filter ffmpeg (pitch-shift durasi tetap: asetrate*k lalu atempo 1/k)
    "n":    ("id-ID-ArdiNeural", "+12%", "+5Hz", "loudnorm=I=-16:TP=-1.5"),
    "hx":   ("id-ID-ArdiNeural", "+0%", "-20Hz",
             "asetrate=24000*0.85,aresample=24000,atempo=1.17647,aecho=0.8:0.55:70|140:0.35|0.2,bass=g=6,loudnorm=I=-17:TP=-1.5"),
    "viro": ("id-ID-ArdiNeural", "+0%", "-30Hz",
             "asetrate=24000*0.78,aresample=24000,atempo=1.28205,aecho=0.8:0.5:40:0.4,bass=g=8,acrusher=bits=10:mix=0.25,loudnorm=I=-17:TP=-1.5"),
}


async def synth(text, voice, rate, pitch, mp3):
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, proxy=proxy, boundary="WordBoundary")
    words = []
    with open(mp3, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                s = ch["offset"] / 1e7
                words.append((ch["text"], s, s + ch["duration"] / 1e7))
    return words


def attach_punct(text, words):
    """Kembalikan tanda baca dari teks asli ke tiap kata (subtitle lebih natural)."""
    toks, out, i = text.split(), [], 0
    for w, s, e in words:
        while i < len(toks) and w.lower() not in toks[i].lower():
            i += 1
        out.append((toks[i] if i < len(toks) else w, s, e))
        i += 1
    return out


def main():
    a = sys.argv[1:]
    off = 0.0
    if "--offset" in a:
        k = a.index("--offset"); off = float(a[k + 1]); del a[k:k + 2]
    role, text, out_wav, out_json = a
    voice, rate, pitch, af = ROLES[role]
    with tempfile.TemporaryDirectory() as d:
        mp3 = os.path.join(d, "raw.mp3")
        words = asyncio.run(synth(text, voice, rate, pitch, mp3))
        if not words or os.path.getsize(mp3) == 0:
            sys.exit("TTS gagal: audio kosong")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3, "-af", af,
                        "-ar", "24000", "-ac", "1", out_wav], check=True)
    words = attach_punct(text, words)
    data = [{"w": w, "s": round(s + off, 2), "e": round(e + off, 2), "who": role} for w, s, e in words]
    json.dump(data, open(out_json, "w"), ensure_ascii=False)
    print(f"{out_wav}: {len(data)} kata, selesai di {data[-1]['e']:.2f}s")


if __name__ == "__main__":
    main()
