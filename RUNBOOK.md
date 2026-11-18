# RUNBOOK — Produksi & posting otomatis Salah Kaprah Vitamin

Dipakai oleh jadwal 3x sehari. Setiap run = 1 episode utuh, dari topik sampai terposting di @vitamien.io.

## 0. Pengaman (wajib)
- Akun tujuan HANYA Instagram Windsor id `17841477118826664` (vitamien.io). Jangan pernah posting ke `17841402205776856` (amienashal).
- Topik HANYA dari `TOPICS.md` di repo (salinan: Project claude.ai `claude/bank-topik-salah-kaprah.md`). Bila `antre` habis, jangan mengarang topik baru — laporkan & berhenti.
- Verifikasi setiap angka/klaim dengan web search ke sumber utama (NIH ODS, Cochrane, WHO, CDC, NCCIH, BPOM, Kemenkes). Bila klaim tidak didukung → tandai `perlu-tinjau`, ambil topik berikutnya.
- Tanpa jualan produk, tanpa klaim menyembuhkan, wajib baris "Edukasi, bukan pengganti konsultasi" di caption.
- Bila ada langkah gagal (render, URL, posting) → jangan posting setengah jadi; laporkan ke pemilik lewat pesan.

## 0b. Antrean & kunci
- `git pull` dulu. Baca `TOPICS.md` (sumber kebenaran antrean).
- Prioritas 1: baris `siap-posting` → langsung ke langkah 5 (posting) dengan video yang sudah ada.
- Prioritas 2: baris `antre` teratas → ubah jadi `sedang-diproduksi (slot, tanggal)`, commit & push SEGERA (kunci agar slot lain tidak mengambil topik yang sama). Bila push ditolak, pull --rebase lalu ulang pemilihan topik.
- Nomor episode = (nomor Ep tertinggi di TOPICS.md) + 1.

## 1. Siapkan
- Clone repo, `npm i`. Font sudah lokal di `public/fonts`.
- `pip install --break-system-packages faster-whisper` (timing subtitle).

## 2. Naskah (target 30–40 detik)
- Struktur: (a) villain di markas, mode `menace`, menyebar mitos (Hoaksin + anak buah sesuai topik, suara villain), (b) Vitaboy datang "STOP! SALAH KAPRAH!", (c) 3–4 beat fakta dengan visual data, (d) cara yang benar, (e) "Hoaks tumbang! Follow vitamien dot io!".
- Bahasa Indonesia santai, kalimat pendek, angka bulat yang tetap akurat.

## 3. Suara (ElevenLabs, flow `kXwWge9P2bMp3F35fLEG`, generations_count 1)
- Narator: voice `VUirSLTrc1D6kORqzdNo` (clone Amien), model eleven_v4, tag [energetic].
- Hoaksin: `WzVKtqQpTUUQ2JNx8YxI` [whispering, sinister]. Viro: `1aPDmPEYltTp3yDMQLiT` [growling, menacing].
- Unduh via creative_get_generations full_res_url → `public/epN/`. Percepat narator atempo 1.08–1.12, villain dipotong & dipercepat.
- Transkrip word-level dengan faster-whisper (bahasa id), perbaiki ejaan, gabung jadi `src/epN_words.json`.

## 4. Animasi
- Salin `src/Ep2.tsx` sebagai pola → `src/EpN.tsx`; ganti scene sesuai naskah; daftarkan di `src/Root.tsx`.
- Wajib: latar berganti tiap scene (circle reveal), karakter dari Mascot/Villain/Cast, partikel, kinetic text, safe zone (atas 220, bawah 380, kanan 140), subtitle di y≈1340.
- SFX: modifikasi `scripts/sfx.py` (drone & petir untuk scene villain, musik heroik setelah Vitaboy datang) → `public/epN/sfx.wav`.
- Cek still tiap scene (contact sheet) — tidak boleh ada teks tertimpa/terpotong.
- Render: `npx remotion render EpN out/vitamien_salahkaprah_epNN.mp4 --concurrency=2`.

## 5. Hosting & posting
- Commit MP4 ke `videos/` di repo publik, push; URL publik: `https://raw.githubusercontent.com/amienashal/vitamien-reels/main/videos/<file>.mp4` (cek curl 200 & ukuran sesuai).
- Windsor `execute_action` connector `instagram`, account `17841477118826664`, action `create_video_post`, params: video_url, caption, share_to_feed true, thumb_offset 1500.
- Caption: hook 1 baris + 3–5 poin fakta + "Sumber: …" + "⚠️ Edukasi, bukan pengganti konsultasi" + 5–8 hashtag (#salahkaprahvitamin #vitamien #faktavitamin #edukasikesehatan + topik).

## 6. Catat
- Ubah status topik di `TOPICS.md` → `tayang (EpNN, tanggal, media id)`, commit & push (sertakan MP4 di videos/ dan src/EpN.tsx). Bila Project claude.ai "Vitamien.io" bisa diakses, samakan juga `claude/bank-topik-salah-kaprah.md`.
- Laporkan ke pemilik: judul, link post, sumber, biaya kredit.
