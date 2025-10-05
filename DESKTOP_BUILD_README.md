# 🖥️ Freelancer Finans Takip - Desktop Uygulaması

Bu uygulama artık Windows ve macOS için offline çalışan bir desktop uygulaması olarak kullanılabilir!

## 📋 Özellikler

- ✅ **Tamamen Offline**: İnternet bağlantısı gerekmez
- 💾 **Yerel Veri Saklama**: Tüm verileriniz bilgisayarınızda güvenle saklanır
- 🚀 **Hafif ve Hızlı**: ~10-15MB boyutunda, hızlı başlatma
- 🖼️ **Orijinal Görünüm**: Web versiyonuyla aynı arayüz ve grafikler
- 🔒 **Güvenli**: Tauri ile geliştirildi (Rust tabanlı)
- 📊 **Tüm Özellikler Çalışır**: Projeler, gelir-gider takibi, grafikler, ajanda

## 🛠️ Geliştirme Ortamı Gereksinimleri

### Windows için:
1. **Node.js 18+** ve **Yarn**
2. **Rust** (rustup): https://rustup.rs/
3. **Visual Studio Build Tools** (C++ geliştirme araçları)
   - Visual Studio Installer'dan "Desktop development with C++" seçeneğini kurun

### macOS için:
1. **Node.js 18+** ve **Yarn**
2. **Rust** (rustup): https://rustup.rs/
3. **Xcode Command Line Tools**: `xcode-select --install`

## 🚀 Build İşlemleri

### 1. Dependencies'leri Yükleyin

```bash
cd /app/frontend
yarn install
```

### 2. Geliştirme Modunda Çalıştırma

```bash
cd /app/frontend
yarn tauri:dev
```

Bu komut uygulamayı geliştirme modunda açar. Kod değişiklikleri otomatik yansır.

### 3. Production Build (Windows)

```bash
cd /app/frontend
yarn tauri:build
```

Build tamamlandığında:
- **Installer**: `/app/frontend/src-tauri/target/release/bundle/msi/Freelancer Finans Takip_1.0.0_x64_en-US.msi`
- **Portable exe**: `/app/frontend/src-tauri/target/release/Freelancer Finans Takip.exe`

### 4. Production Build (macOS)

```bash
cd /app/frontend
yarn tauri:build
```

Build tamamlandığında:
- **DMG**: `/app/frontend/src-tauri/target/release/bundle/dmg/Freelancer Finans Takip_1.0.0_x64.dmg`
- **App Bundle**: `/app/frontend/src-tauri/target/release/bundle/macos/Freelancer Finans Takip.app`

## 📦 Build Çıktıları

### Windows
- `Freelancer Finans Takip_1.0.0_x64.msi` - Windows Installer (önerilen)
- `Freelancer Finans Takip.exe` - Portable çalıştırılabilir dosya

### macOS
- `Freelancer Finans Takip_1.0.0_x64.dmg` - macOS Disk Image (önerilen)
- `Freelancer Finans Takip.app` - Application Bundle

## 💾 Veri Saklama

Uygulama tüm verileri tarayıcı localStorage API'sini kullanarak saklar:

- **Windows**: `%APPDATA%\Roaming\com.freelancer.finans\Local Storage`
- **macOS**: `~/Library/Application Support/com.freelancer.finans/Local Storage`

## 🔄 Web Sürümünden Geçiş

Desktop uygulaması, web versiyonuyla aynı localStorage yapısını kullanır. Web sürümünden verilerinizi export/import özelliği ile taşıyabilirsiniz:

1. Web versiyonunda: Profil → Dışa Aktar → JSON dosyasını kaydet
2. Desktop uygulamasında: Profil → İçe Aktar → JSON dosyasını seç

## 📝 Notlar

- İlk build işlemi biraz uzun sürebilir (Rust dependencies'leri derlenir)
- Sonraki build'ler çok daha hızlıdır
- Build boyutu: ~10-15MB (sıkıştırılmış)
- Çalışma zamanı bellek kullanımı: ~50-100MB

## 🐛 Sorun Giderme

### Build hatası alıyorsanız:
1. Rust yüklü mü kontrol edin: `rustc --version`
2. Dependencies'leri temizleyin: `cd /app/frontend/src-tauri && cargo clean`
3. Node modules'ü temizleyin: `cd /app/frontend && rm -rf node_modules && yarn install`

### Uygulama açılmıyorsa:
- Windows'ta: Antivirüs yazılımı bloklayabilir, güvenli listeye ekleyin
- macOS'ta: "Tanımlanamayan geliştiriciden" uyarısı için: Sistem Tercihleri → Güvenlik ve Gizlilik → "Yine de Aç"

## 📞 Destek

Herhangi bir sorun yaşarsanız, build loglarını kontrol edin:
- Geliştirme: Terminalde gösterilir
- Production: `/app/frontend/src-tauri/target/release/` altında log dosyaları

## ✨ Değişiklik Geçmişi

### v1.0.0 (İlk Sürüm)
- ✅ Tauri ile desktop uygulaması
- ✅ Windows ve macOS desteği
- ✅ Tam offline çalışma
- ✅ Yerel veri saklama
- ✅ Tüm web özelliklerinin uyumluluğu
- ✅ Grafiklerin tam desteği (Recharts)
