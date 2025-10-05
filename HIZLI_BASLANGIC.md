# ⚡ Hızlı Başlangıç - Freelancer Finans Takip Desktop

## 🎯 Geliştiriciler İçin 3 Adımda Başlangıç

### 1️⃣ Gereksinimleri Kurun

**Windows:**
```powershell
# Node.js 18+ ve Yarn yükleyin
# Rust yükleyin: https://rustup.rs/
# Visual Studio Build Tools (C++ ile birlikte)
```

**macOS:**
```bash
# Node.js 18+ ve Yarn yükleyin
brew install node yarn
# Rust yükleyin
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Xcode Command Line Tools
xcode-select --install
```

**Linux (geliştirme için):**
```bash
# Node.js ve Yarn
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g yarn

# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Tauri dependencies
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.0-dev \
    build-essential curl wget file libssl-dev \
    libgtk-3-dev libayatana-appindicator3-dev \
    librsvg2-dev
```

### 2️⃣ Projeyi Hazırlayın

```bash
cd /app/frontend
yarn install
```

### 3️⃣ Çalıştırın veya Build Edin

**Geliştirme Modu (hot reload):**
```bash
yarn tauri:dev
```

**Production Build:**
```bash
yarn tauri:build
```

---

## 📦 Kullanıcılar İçin

### Windows Kullanıcıları

1. **İndirin**: `Freelancer Finans Takip_1.0.0_x64.msi`
2. **Kurun**: Çift tıklayın ve kurulum sihirbazını takip edin
3. **Çalıştırın**: Başlat menüsünden "Freelancer Finans Takip"
4. **Kullanın**: İnternet gerekmez! ✅

### macOS Kullanıcıları

1. **İndirin**: `Freelancer Finans Takip_1.0.0_x64.dmg`
2. **Açın**: DMG dosyasına çift tıklayın
3. **Kurun**: Uygulamayı Applications klasörüne sürükleyin
4. **Çalıştırın**: Launchpad'den açın
5. **Kullanın**: İnternet gerekmez! ✅

---

## 🆘 Hızlı Sorun Giderme

### "Rust is not installed" hatası
```bash
# Windows (PowerShell yönetici olarak)
winget install rustup

# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### "yarn: command not found"
```bash
npm install -g yarn
```

### Build çok uzun sürüyor
- İlk build 5-10 dakika sürebilir (Rust dependencies)
- Sonraki build'ler çok daha hızlı (~1-2 dakika)

### Uygulama açılmıyor
- **Windows**: Antivirüs engelliyor olabilir
- **macOS**: Sistem Tercihleri → Güvenlik → "Yine de Aç"

---

## 📂 Build Çıktıları Nerede?

```
/app/frontend/src-tauri/target/release/bundle/
├── msi/              # Windows Installer
├── nsis/             # Windows Portable
├── dmg/              # macOS Disk Image  
├── macos/            # macOS App Bundle
└── appimage/         # Linux (opsiyonel)
```

---

## 🚀 Özet Komutlar

```bash
# Geliştirme
yarn tauri:dev

# Production build (mevcut platform için)
yarn tauri:build

# Sadece frontend build (test için)
yarn build

# Temizlik
cd src-tauri && cargo clean
```

---

## 💡 Pro İpuçları

1. **İlk build'i gece bırakın** - 5-10 dakika sürer
2. **cargo clean sadece gerektiğinde** - Build cache'i korur
3. **Dev mode için HMR var** - Kod değişiklikleri anında yansır
4. **localStorage verisi korunur** - Dev ve prod aynı yeri kullanır
5. **Cross-compile zor** - Windows için Windows'ta, Mac için Mac'te build yapın

---

## 📞 Daha Fazla Bilgi

- **Detaylı rehber**: `DESKTOP_BUILD_README.md`
- **Kullanıcı rehberi**: `KULLANICI_REHBERI.md`
- **Tauri docs**: https://tauri.app/

---

**Başarılar! 🎉**
