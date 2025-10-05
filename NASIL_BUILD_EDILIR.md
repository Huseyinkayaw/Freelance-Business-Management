# 🔨 Adım Adım Build Rehberi

## 🎯 Kendi Bilgisayarınızda Desktop Uygulaması Oluşturma

Bu rehber sizi adım adım desktop uygulamanızı oluşturma sürecinde yönlendirecek.

---

## 📋 ADIM 1: Gereksinimleri Kurun

### Windows Kullanıcıları İçin

#### 1.1. Node.js ve Yarn Kurun
1. https://nodejs.org adresine gidin
2. "LTS" (Long Term Support) sürümünü indirin
3. İndirdiğiniz dosyayı çalıştırın ve kurulumu tamamlayın
4. Terminali açın (Windows PowerShell) ve test edin:
```powershell
node --version
# v18.x.x veya üzeri olmalı
```
5. Yarn'ı kurun:
```powershell
npm install -g yarn
yarn --version
```

#### 1.2. Rust Kurun
1. https://rustup.rs adresine gidin
2. "rustup-init.exe" dosyasını indirin ve çalıştırın
3. Terminalde "1" yazıp Enter basın (default installation)
4. Kurulum tamamlanınca terminali kapatıp yeni bir tane açın
5. Test edin:
```powershell
rustc --version
# rustc 1.x.x olmalı
```

#### 1.3. Visual Studio Build Tools Kurun
1. https://visualstudio.microsoft.com/downloads/ adresine gidin
2. "Build Tools for Visual Studio 2022" indirin
3. Çalıştırın ve "Desktop development with C++" seçeneğini işaretleyin
4. Kurulumu tamamlayın (birkaç GB indirecek)

---

### macOS Kullanıcıları İçin

#### 1.1. Homebrew Kurun (yoksa)
Terminal açın ve şunu çalıştırın:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 1.2. Node.js ve Yarn Kurun
```bash
brew install node yarn
node --version  # v18.x.x veya üzeri
yarn --version  # 1.22.x veya üzeri
```

#### 1.3. Rust Kurun
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustc --version  # rustc 1.x.x
```

#### 1.4. Xcode Command Line Tools Kurun
```bash
xcode-select --install
```
Açılan pencerede "Install" butonuna tıklayın.

---

## 📂 ADIM 2: Projeyi Hazırlayın

### 2.1. Proje Klasörüne Gidin
```bash
# Windows PowerShell veya macOS Terminal
cd /path/to/your/project/frontend
```

### 2.2. Dependencies'leri Yükleyin
```bash
yarn install
```

Bu işlem 1-2 dakika sürebilir. Şu mesajı görmelisiniz:
```
✨  Done in X.XXs
```

---

## 🚀 ADIM 3: Build Edin

### 3.1. İlk Test (Development Mode)

Build yapmadan önce uygulamanın çalıştığından emin olalım:

```bash
yarn tauri:dev
```

Bu komut:
- React uygulamasını başlatır (http://localhost:3000)
- Tauri desktop penceresini açar
- Hot reload aktiftir (kod değişirse otomatik yansır)

**İlk çalıştırmada Rust dependencies derlendiği için 5-10 dakika sürebilir!**

Uygulama açıldı mı? Tebrikler! Ctrl+C ile kapatın ve production build'e geçin.

### 3.2. Production Build

```bash
yarn tauri:build
```

**Önemli Notlar:**
- İlk build 5-10 dakika sürecek (Rust compilation)
- CPU %100'e çıkacak - normal!
- Sonraki build'ler çok daha hızlı (1-2 dakika)

### 3.3. Build İlerlemesi

Terminal çıktısında şunları göreceksiniz:

1. **Frontend Build** (~30 saniye):
```
Creating an optimized production build...
Compiled successfully.
```

2. **Rust Compilation** (5-10 dakika):
```
Compiling tauri v1.x.x
Compiling app v0.1.0
```

3. **Bundle Creation** (~1 dakika):
```
Creating Windows installer...
Finished [msi] at: src-tauri/target/release/bundle/msi/...
```

---

## 📦 ADIM 4: Build Çıktılarını Bulun

### Windows Build Çıktıları

Build tamamlandığında şu klasöre gidin:
```
/path/to/project/frontend/src-tauri/target/release/bundle/
```

Burada bulacaklarınız:

1. **MSI Installer** (Önerilen):
```
msi/Freelancer Finans Takip_1.0.0_x64_en-US.msi
```
- Kullanıcılar için profesyonel installer
- Başlat menüsüne ekler
- Kaldırma seçeneği sunar
- Boyut: ~12-15 MB

2. **Portable EXE**:
```
../release/Freelancer Finans Takip.exe
```
- Kurulum gerektirmez
- USB'den çalıştırılabilir
- Tek dosya
- Boyut: ~10-12 MB

### macOS Build Çıktıları

```
/path/to/project/frontend/src-tauri/target/release/bundle/
```

1. **DMG Disk Image** (Önerilen):
```
dmg/Freelancer Finans Takip_1.0.0_x64.dmg
```
- macOS standart dağıtım formatı
- Sürükle-bırak kurulum
- Boyut: ~8-10 MB (sıkıştırılmış)

2. **App Bundle**:
```
macos/Freelancer Finans Takip.app
```
- Doğrudan çalıştırılabilir
- Applications klasörüne kopyalanabilir
- Boyut: ~10-12 MB

---

## 🎉 ADIM 5: Uygulamayı Test Edin

### Windows'ta Test

1. MSI dosyasına sağ tıklayın → "Install"
2. Kurulum sihirbazını takip edin
3. Başlat menüsünden "Freelancer Finans Takip" açın
4. Uygulama açıldı mı? ✅ Başarılı!

### macOS'ta Test

1. DMG dosyasına çift tıklayın
2. Uygulamayı Applications klasörüne sürükleyin
3. Launchpad'den "Freelancer Finans Takip" açın
4. "Tanımlanamayan geliştirici" uyarısı gelirse:
   - Sistem Tercihleri → Güvenlik ve Gizlilik
   - "Yine de Aç" butonuna tıklayın

---

## 🔍 Sorun Giderme

### "Command 'tauri' not found"
```bash
# Dependencies'leri yeniden yükleyin
rm -rf node_modules
yarn install
```

### "Rust compiler not found"
```bash
# Windows
rustup update

# macOS
source $HOME/.cargo/env
rustup update
```

### "Build failed: linking failed"
**Windows**: Visual Studio Build Tools kurulumu kontrol edin
**macOS**: Xcode Command Line Tools: `xcode-select --install`

### Build çok yavaş
- İlk build 5-10 dakika normal
- Antivirüs Rust klasörünü hariç tutun
- SSD kullanıyorsanız daha hızlıdır

### Uygulama açılmıyor
**Windows**: Antivirüs yazılımınız bloke ediyordur
- Windows Defender → İzin ver listesi
- .exe dosyasını ekleyin

**macOS**: Gatekeeper bloke ediyor
- Sistem Tercihleri → Güvenlik → "Yine de Aç"

---

## 📊 Build İstatistikleri

### Zaman
- İlk build: 5-10 dakika
- İkinci build: 1-2 dakika
- Frontend değişikliği: 30 saniye
- Rust değişikliği: 1-2 dakika

### Boyut
- Source code: ~5 MB
- node_modules: ~400 MB
- Build cache: ~2 GB (ilk build sonrası)
- Final app: ~10-15 MB

### Sistem Kullanımı (Build sırasında)
- CPU: %80-100 (normal!)
- RAM: 2-4 GB
- Disk I/O: Yoğun

---

## 🎯 İleri Seviye

### Release vs Debug Build

**Development (debug):**
```bash
yarn tauri:dev
# veya
yarn tauri build --debug
```
- Hızlı build
- Büyük dosya boyutu (~50 MB)
- Debug sembolleri dahil

**Production (release):**
```bash
yarn tauri:build
```
- Optimize edilmiş
- Küçük dosya boyutu (~10-15 MB)
- Hızlı çalışma

### Belirli Platform İçin Build

```bash
# Sadece Windows
yarn tauri:build:windows

# Sadece macOS
yarn tauri:build:macos
```

### Build Cache Temizleme

Sorun yaşıyorsanız cache'i temizleyin:

```bash
# Frontend cache
rm -rf node_modules
rm -rf build
yarn install

# Rust cache
cd src-tauri
cargo clean
cd ..

# Yeniden build
yarn tauri:build
```

---

## ✅ Başarı Kontrol Listesi

Build başarılı olduysa:

- [ ] Terminal'de "Finished" mesajı gördüm
- [ ] `src-tauri/target/release/bundle/` klasöründe dosyalar var
- [ ] .msi veya .dmg dosyası oluştu
- [ ] Dosya boyutu 10-15 MB civarında
- [ ] Uygulamayı başarıyla kurdum
- [ ] Uygulama açıldı ve çalışıyor
- [ ] Grafikler görünüyor
- [ ] Veri kaydedilip yükleniyor

Hepsi ✅ ise **tebrikler!** Desktop uygulamanız hazır! 🎉

---

## 📞 Yardım

Sorun mu yaşıyorsunuz?

1. Terminal çıktısını dikkatli okuyun
2. Hata mesajını Google'da aratın
3. `DESKTOP_BUILD_README.md` dosyasını okuyun
4. Tauri docs: https://tauri.app/v1/guides/building/

**Başarılar! 🚀**
