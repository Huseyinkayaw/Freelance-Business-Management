import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
// Modern icons matching the reference design
import { 
  HiOutlineChartBar, HiOutlineCreditCard, HiOutlineReceiptTax, 
  HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineDocumentReport,
  HiOutlineCalendar, HiOutlineUser, HiOutlineCog, HiOutlineMoon,
  HiOutlineSun, HiOutlineCloudDownload, HiOutlineCloudUpload,
  HiOutlineRefresh, HiOutlinePlus, HiOutlineTrash, HiOutlineLink,
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineEye, HiOutlinePencil
} from 'react-icons/hi';
// Lucide icons for better semantic clarity
import { 
  BarChart3, Wifi, Smartphone, Calculator, Home, Zap, 
  Droplet, Flame, Building, Palette, Code, TrendingUp as LucideTrendingUp,
  Film, Brain, Puzzle
} from 'lucide-react';

const App = () => {
  // State yönetimi
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [taxPayments, setTaxPayments] = useState([]);
  const [showForm, setShowForm] = useState(null);
  const [editItem, setEditItem] = useState(null); // Düzenleme için
  const [currentProfile, setCurrentProfile] = useState('DEMO');
  const [profiles, setProfiles] = useState(['DEMO']);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const [dashboardFilter, setDashboardFilter] = useState({
    type: 'month', // 'month' veya 'year'
    year: currentYear, // Güncel yıl
    month: currentMonth // Güncel ay
  });
  const [projectsFilter, setProjectsFilter] = useState({
    type: 'month',
    year: currentYear,
    month: currentMonth
  });
  const [incomesFilter, setIncomesFilter] = useState({
    type: 'month',
    year: currentYear,
    month: currentMonth
  });
  const [expensesFilter, setExpensesFilter] = useState({
    type: 'month',
    year: currentYear,
    month: currentMonth
  });
  const [taxesFilter, setTaxesFilter] = useState({
    type: 'month',
    year: currentYear,
    month: currentMonth
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Online durumu
  const [darkMode, setDarkMode] = useState(false); // Dark mode durumu
  const [agenda, setAgenda] = useState([]); // Ajanda notları
  const [appTitle, setAppTitle] = useState('Freelancer Finans Takip'); // Düzenlenebilir başlık
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Başlık düzenleme durumu
  const [regularExpenses, setRegularExpenses] = useState([]); // Düzenli giderler
  const [subscriptions, setSubscriptions] = useState([]); // Abonelikler
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // Profile dropdown durumu
  const [agendaModalItem, setAgendaModalItem] = useState(null); // Ajanda modal için seçili öğe

  // Dark mode toggle fonksiyonu
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // HTML element'ine dark class'ını ekle/çıkar
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // localStorage'dan veri yükleme ve online durumu izleme
  useEffect(() => {
    const loadData = () => {
      try {
        // Profil listesini yükle
        const savedProfiles = localStorage.getItem('profiles');
        if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
        
        // Aktif profili yükle
        const savedCurrentProfile = localStorage.getItem('currentProfile');
        if (savedCurrentProfile) setCurrentProfile(savedCurrentProfile);
        
        // Dark mode ayarını yükle ve HTML'e uygula
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
          const darkModeValue = JSON.parse(savedDarkMode);
          setDarkMode(darkModeValue);
          if (darkModeValue) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        
        // Başlık yükle
        const savedTitle = localStorage.getItem('appTitle');
        if (savedTitle) setAppTitle(savedTitle);
        
        // Aktif profile göre verileri yükle
        const profileKey = savedCurrentProfile || 'DEMO';
        const savedProjects = localStorage.getItem(`projects_${profileKey}`);
        const savedIncomes = localStorage.getItem(`incomes_${profileKey}`);
        const savedExpenses = localStorage.getItem(`expenses_${profileKey}`);
        const savedTaxPayments = localStorage.getItem(`taxPayments_${profileKey}`);
        const savedAgenda = localStorage.getItem(`agenda_${profileKey}`);
        const savedRegularExpenses = localStorage.getItem(`regularExpenses_${profileKey}`);
        const savedSubscriptions = localStorage.getItem(`subscriptions_${profileKey}`);

        if (savedProjects) setProjects(JSON.parse(savedProjects));
        if (savedIncomes) setIncomes(JSON.parse(savedIncomes));
        if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
        if (savedTaxPayments) setTaxPayments(JSON.parse(savedTaxPayments));
        if (savedAgenda) setAgenda(JSON.parse(savedAgenda));
        if (savedRegularExpenses) setRegularExpenses(JSON.parse(savedRegularExpenses));
        if (savedSubscriptions) setSubscriptions(JSON.parse(savedSubscriptions));
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      }
    };

    loadData();

    // Online/offline durumu izleme
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Profil değişikliğinde verileri yükle
  useEffect(() => {
    const loadProfileData = () => {
      try {
        const savedProjects = localStorage.getItem(`projects_${currentProfile}`);
        const savedIncomes = localStorage.getItem(`incomes_${currentProfile}`);
        const savedExpenses = localStorage.getItem(`expenses_${currentProfile}`);
        const savedTaxPayments = localStorage.getItem(`taxPayments_${currentProfile}`);
        const savedRegularExpenses = localStorage.getItem(`regularExpenses_${currentProfile}`);
        const savedSubscriptions = localStorage.getItem(`subscriptions_${currentProfile}`);
        const savedAgenda = localStorage.getItem(`agenda_${currentProfile}`);

        // DEMO profili için örnek veriler - Dinamik tarihlerle (sürekli güncel)
        const today = new Date();
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        const getRelativeDate = (daysOffset) => {
          const date = new Date(today);
          date.setDate(date.getDate() + daysOffset);
          return formatDate(date);
        };
        
        const getRelativePeriod = (monthsOffset = 0) => {
          const date = new Date(today);
          date.setMonth(date.getMonth() + monthsOffset);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        };

        const demoProjects = [
          {
            id: 'proj-1',
            name: 'Kurumsal Web Sitesi - Teknoloji A.Ş.',
            status: 'devam-ediyor',
            price: 55000,
            start_date: getRelativeDate(-20),
            end_date: getRelativeDate(35),
            description: 'React ve Node.js ile kurumsal web sitesi geliştirme'
          },
          {
            id: 'proj-2',
            name: 'E-Ticaret Platformu - Moda Butik',
            status: 'devam-ediyor',
            price: 75000,
            start_date: getRelativeDate(-15),
            end_date: getRelativeDate(45),
            description: 'Full-stack e-ticaret çözümü, ödeme entegrasyonu'
          },
          {
            id: 'proj-3',
            name: 'Mobil Uygulama - Fitness Koçu',
            status: 'teklif-iletildi',
            price: 85000,
            start_date: getRelativeDate(10),
            end_date: getRelativeDate(100),
            description: 'iOS ve Android için cross-platform fitness uygulaması'
          },
          {
            id: 'proj-4',
            name: 'CRM Sistemi - Danışmanlık Ltd.',
            status: 'tamamlandi',
            price: 42000,
            start_date: getRelativeDate(-80),
            end_date: getRelativeDate(-15),
            description: 'Müşteri ilişkileri yönetim sistemi geliştirme'
          },
          {
            id: 'proj-5',
            name: 'Landing Page - Startup XYZ',
            status: 'tamamlandi',
            price: 18000,
            start_date: getRelativeDate(-65),
            end_date: getRelativeDate(-30),
            description: 'Modern ve responsive landing page tasarımı'
          },
          {
            id: 'proj-6',
            name: 'Dashboard Panel - Fintech',
            status: 'revizyonda',
            price: 62000,
            start_date: getRelativeDate(-25),
            end_date: getRelativeDate(20),
            description: 'Admin dashboard ve analitik panel geliştirme'
          }
        ];

        const demoIncomes = [
          // Bu ay gelirleri
          {
            id: 'inc-1',
            brand: 'Teknoloji A.Ş.',
            description: 'Kurumsal Web Sitesi - İkinci Ödeme (%40)',
            amount: 22000,
            income_date: getRelativeDate(-5),
            vat_rate: 0.18
          },
          {
            id: 'inc-2',
            brand: 'Moda Butik',
            description: 'E-Ticaret Platformu - İlk Ödeme (%50)',
            amount: 37500,
            income_date: getRelativeDate(-12),
            vat_rate: 0.18
          },
          {
            id: 'inc-3',
            brand: 'Danışmanlık Ltd.',
            description: 'CRM Sistemi - Final Ödemesi (%30)',
            amount: 12600,
            income_date: getRelativeDate(-8),
            vat_rate: 0.18
          },
          // Geçen ay gelirleri
          {
            id: 'inc-4',
            brand: 'Startup XYZ',
            description: 'Landing Page - Tam Ödeme',
            amount: 18000,
            income_date: getRelativeDate(-35),
            vat_rate: 0.18
          },
          {
            id: 'inc-5',
            brand: 'Fintech',
            description: 'Dashboard Panel - İlk Ödeme (%50)',
            amount: 31000,
            income_date: getRelativeDate(-42),
            vat_rate: 0.18
          },
          {
            id: 'inc-6',
            brand: 'Teknoloji A.Ş.',
            description: 'Kurumsal Web Sitesi - İlk Ödeme (%40)',
            amount: 22000,
            income_date: getRelativeDate(-50),
            vat_rate: 0.18
          },
          // 2 ay önce gelirleri
          {
            id: 'inc-7',
            brand: 'Danışmanlık Ltd.',
            description: 'CRM Sistemi - İkinci Ödeme (%40)',
            amount: 16800,
            income_date: getRelativeDate(-68),
            vat_rate: 0.18
          },
          {
            id: 'inc-8',
            brand: 'Moda Butik',
            description: 'Web Tasarım Danışmanlığı',
            amount: 8500,
            income_date: getRelativeDate(-75),
            vat_rate: 0.18
          }
        ];

        const demoExpenses = [
          // Harici giderler - Bu ay
          {
            id: 'exp-1',
            category: 'ofis-ekipman',
            amount: 4500,
            expense_date: getRelativeDate(-3),
            description: 'MacBook Pro ekran tamir'
          },
          {
            id: 'exp-2',
            category: 'egitim',
            amount: 1200,
            expense_date: getRelativeDate(-7),
            description: 'Advanced React & Next.js kursu'
          },
          {
            id: 'exp-3',
            category: 'seyahat',
            amount: 2800,
            expense_date: getRelativeDate(-14),
            description: 'Müşteri toplantısı - İstanbul uçak ve konaklama'
          },
          // Harici giderler - Geçen ay
          {
            id: 'exp-4',
            category: 'ofis-ekipman',
            amount: 3200,
            expense_date: getRelativeDate(-38),
            description: 'Logitech MX klavye ve mouse seti'
          },
          {
            id: 'exp-5',
            category: 'pazarlama',
            amount: 1800,
            expense_date: getRelativeDate(-45),
            description: 'Google Ads kampanyası'
          },
          // Harici giderler - 2 ay önce
          {
            id: 'exp-6',
            category: 'ofis-ekipman',
            amount: 5500,
            expense_date: getRelativeDate(-70),
            description: 'LG UltraWide monitör'
          }
        ];

        const demoTaxPayments = [
          {
            id: 'tax-1',
            type: 'KDV',
            amount: 8640,
            payment_date: getRelativeDate(-10),
            description: 'Ağustos 2025 KDV beyannamesi'
          },
          {
            id: 'tax-2',
            type: 'Gelir Vergisi',
            amount: 7200,
            payment_date: getRelativeDate(-10),
            description: 'Ağustos 2025 Gelir Vergisi'
          },
          {
            id: 'tax-3',
            type: 'KDV',
            amount: 7920,
            payment_date: getRelativeDate(-42),
            description: 'Temmuz 2025 KDV beyannamesi'
          },
          {
            id: 'tax-4',
            type: 'Gelir Vergisi',
            amount: 6600,
            payment_date: getRelativeDate(-42),
            description: 'Temmuz 2025 Gelir Vergisi'
          }
        ];

        // Abonelikler - Son 3 ay için periyot bazlı
        const currentPeriod = getRelativePeriod(0);
        const lastPeriod = getRelativePeriod(-1);
        const twoMonthsAgo = getRelativePeriod(-2);
        
        const demoSubscriptions = [
          // Bu ay abonelikleri
          { id: 'sub-1', category: 'tasarim', subcategoryLabel: 'Figma Pro', amount: 144, period: currentPeriod },
          { id: 'sub-2', category: 'tasarim', subcategoryLabel: 'Adobe Creative Cloud', amount: 799, period: currentPeriod },
          { id: 'sub-3', category: 'yazilim', subcategoryLabel: 'GitHub Copilot', amount: 120, period: currentPeriod },
          { id: 'sub-4', category: 'yazilim', subcategoryLabel: 'JetBrains All Products', amount: 289, period: currentPeriod },
          { id: 'sub-5', category: 'pazarlama', subcategoryLabel: 'LinkedIn Premium', amount: 199, period: currentPeriod },
          { id: 'sub-6', category: 'eglence-icerik', subcategoryLabel: 'Netflix', amount: 149, period: currentPeriod },
          { id: 'sub-7', category: 'eglence-icerik', subcategoryLabel: 'Spotify Premium', amount: 54, period: currentPeriod },
          { id: 'sub-8', category: 'yapay-zeka', subcategoryLabel: 'ChatGPT Plus', amount: 240, period: currentPeriod },
          { id: 'sub-9', category: 'yapay-zeka', subcategoryLabel: 'Midjourney', amount: 360, period: currentPeriod },
          { id: 'sub-10', category: 'eklenti', subcategoryLabel: 'Grammarly Premium', amount: 144, period: currentPeriod },
          // Geçen ay abonelikleri
          { id: 'sub-11', category: 'tasarim', subcategoryLabel: 'Figma Pro', amount: 144, period: lastPeriod },
          { id: 'sub-12', category: 'tasarim', subcategoryLabel: 'Adobe Creative Cloud', amount: 799, period: lastPeriod },
          { id: 'sub-13', category: 'yazilim', subcategoryLabel: 'GitHub Copilot', amount: 120, period: lastPeriod },
          { id: 'sub-14', category: 'yazilim', subcategoryLabel: 'JetBrains All Products', amount: 289, period: lastPeriod },
          { id: 'sub-15', category: 'pazarlama', subcategoryLabel: 'LinkedIn Premium', amount: 199, period: lastPeriod },
          { id: 'sub-16', category: 'eglence-icerik', subcategoryLabel: 'Netflix', amount: 149, period: lastPeriod },
          { id: 'sub-17', category: 'eglence-icerik', subcategoryLabel: 'Spotify Premium', amount: 54, period: lastPeriod },
          { id: 'sub-18', category: 'yapay-zeka', subcategoryLabel: 'ChatGPT Plus', amount: 240, period: lastPeriod },
          { id: 'sub-19', category: 'eklenti', subcategoryLabel: 'Grammarly Premium', amount: 144, period: lastPeriod },
          // 2 ay önce abonelikleri
          { id: 'sub-20', category: 'tasarim', subcategoryLabel: 'Figma Pro', amount: 144, period: twoMonthsAgo },
          { id: 'sub-21', category: 'tasarim', subcategoryLabel: 'Adobe Creative Cloud', amount: 799, period: twoMonthsAgo },
          { id: 'sub-22', category: 'yazilim', subcategoryLabel: 'GitHub Copilot', amount: 120, period: twoMonthsAgo },
          { id: 'sub-23', category: 'yazilim', subcategoryLabel: 'JetBrains All Products', amount: 289, period: twoMonthsAgo },
          { id: 'sub-24', category: 'eglence-icerik', subcategoryLabel: 'Netflix', amount: 149, period: twoMonthsAgo },
          { id: 'sub-25', category: 'yapay-zeka', subcategoryLabel: 'ChatGPT Plus', amount: 240, period: twoMonthsAgo }
        ];

        const demoRegularExpenses = [
          // Bu ay sabit giderler
          { id: 'reg-1', category: 'internet', amount: 450, period: currentPeriod },
          { id: 'reg-2', category: 'telefon', amount: 320, period: currentPeriod },
          { id: 'reg-3', category: 'muhasebe', amount: 1200, period: currentPeriod },
          { id: 'reg-4', category: 'kira', amount: 12000, period: currentPeriod },
          { id: 'reg-5', category: 'elektrik', amount: 850, period: currentPeriod },
          { id: 'reg-6', category: 'su', amount: 180, period: currentPeriod },
          { id: 'reg-7', category: 'dogalgaz', amount: 420, period: currentPeriod },
          { id: 'reg-8', category: 'aidat', amount: 650, period: currentPeriod },
          // Geçen ay sabit giderler
          { id: 'reg-9', category: 'internet', amount: 450, period: lastPeriod },
          { id: 'reg-10', category: 'telefon', amount: 320, period: lastPeriod },
          { id: 'reg-11', category: 'muhasebe', amount: 1200, period: lastPeriod },
          { id: 'reg-12', category: 'kira', amount: 12000, period: lastPeriod },
          { id: 'reg-13', category: 'elektrik', amount: 920, period: lastPeriod },
          { id: 'reg-14', category: 'su', amount: 175, period: lastPeriod },
          { id: 'reg-15', category: 'dogalgaz', amount: 380, period: lastPeriod },
          { id: 'reg-16', category: 'aidat', amount: 650, period: lastPeriod },
          // 2 ay önce sabit giderler
          { id: 'reg-17', category: 'internet', amount: 450, period: twoMonthsAgo },
          { id: 'reg-18', category: 'telefon', amount: 320, period: twoMonthsAgo },
          { id: 'reg-19', category: 'muhasebe', amount: 1200, period: twoMonthsAgo },
          { id: 'reg-20', category: 'kira', amount: 12000, period: twoMonthsAgo },
          { id: 'reg-21', category: 'elektrik', amount: 780, period: twoMonthsAgo },
          { id: 'reg-22', category: 'su', amount: 165, period: twoMonthsAgo },
          { id: 'reg-23', category: 'aidat', amount: 650, period: twoMonthsAgo }
        ];

        const demoAgenda = [
          // Gelecek notlar - Yüksek öncelik
          {
            id: 'agenda-1',
            date: getRelativeDate(3),
            title: 'Teknoloji A.Ş. - Final Sunum',
            note: 'Kurumsal web sitesi projesinin final sunumu ve teslim. Yönetim kurulu katılacak.',
            priority: 'yuksek',
            created_at: new Date().toISOString()
          },
          {
            id: 'agenda-2',
            date: getRelativeDate(7),
            title: 'Moda Butik - İkinci Faz Görüşmesi',
            note: 'E-ticaret platformu ikinci faz özelliklerinin görüşülmesi. Ödeme entegrasyonu detayları.',
            priority: 'yuksek',
            created_at: new Date().toISOString()
          },
          {
            id: 'agenda-3',
            date: getRelativeDate(15),
            title: 'Vergi Beyannamesi - Eylül',
            note: 'Eylül ayı KDV ve gelir vergisi beyanname son günü. Muhasebeci ile koordinasyon.',
            priority: 'yuksek',
            created_at: new Date().toISOString()
          },
          // Gelecek notlar - Orta öncelik
          {
            id: 'agenda-4',
            date: getRelativeDate(10),
            title: 'Fitness Koçu Uygulaması - İlk Toplantı',
            note: 'Mobil uygulama projesi için müşteri ile kick-off toplantısı. Gereksinim analizi.',
            priority: 'orta',
            created_at: new Date().toISOString()
          },
          {
            id: 'agenda-5',
            date: getRelativeDate(20),
            title: 'Portfolio Sitesi Güncelleme',
            note: 'Kişisel portfolio sitesine yeni projelerin eklenmesi ve blog yazısı.',
            priority: 'orta',
            created_at: new Date().toISOString()
          },
          // Gelecek notlar - Düşük öncelik
          {
            id: 'agenda-6',
            date: getRelativeDate(25),
            title: 'Online Eğitim - React Native',
            note: 'Udemy üzerinden aldığım React Native kursunun tamamlanması.',
            priority: 'dusuk',
            created_at: new Date().toISOString()
          },
          // Geçmiş notlar
          {
            id: 'agenda-7',
            date: getRelativeDate(-2),
            title: 'Dashboard Panel - Revizyon Teslimi',
            note: 'Fintech projesi için dashboard revizyonlarının teslim edilmesi.',
            priority: 'yuksek',
            created_at: new Date().toISOString()
          },
          {
            id: 'agenda-8',
            date: getRelativeDate(-5),
            title: 'Danışmanlık Ltd. - Eğitim Seansı',
            note: 'CRM sistemi kullanıcı eğitimi ve dokümantasyon paylaşımı.',
            priority: 'orta',
            created_at: new Date().toISOString()
          }
        ];

        // DEMO profili için varsayılan verileri kullan, diğer profiller için kayıtlı verileri
        if (currentProfile === 'DEMO') {
          // DEMO profili için her zaman yeni verileri yükle (kullanıcı silip yeniden doldurma talebi)
          setProjects(demoProjects);
          localStorage.setItem(`projects_${currentProfile}`, JSON.stringify(demoProjects));
          
          setIncomes(demoIncomes);
          localStorage.setItem(`incomes_${currentProfile}`, JSON.stringify(demoIncomes));
          
          setExpenses(demoExpenses);
          localStorage.setItem(`expenses_${currentProfile}`, JSON.stringify(demoExpenses));
          
          setTaxPayments(demoTaxPayments);
          localStorage.setItem(`taxPayments_${currentProfile}`, JSON.stringify(demoTaxPayments));
          
          setRegularExpenses(demoRegularExpenses);
          localStorage.setItem(`regularExpenses_${currentProfile}`, JSON.stringify(demoRegularExpenses));
          
          setSubscriptions(demoSubscriptions);
          localStorage.setItem(`subscriptions_${currentProfile}`, JSON.stringify(demoSubscriptions));
          
          setAgenda(demoAgenda);
          localStorage.setItem(`agenda_${currentProfile}`, JSON.stringify(demoAgenda));
        } else {
          // Diğer profiller için kayıtlı verileri yükle veya boş başla
          setProjects(savedProjects ? JSON.parse(savedProjects) : []);
          setIncomes(savedIncomes ? JSON.parse(savedIncomes) : []);
          setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
          setTaxPayments(savedTaxPayments ? JSON.parse(savedTaxPayments) : []);
          setRegularExpenses(savedRegularExpenses ? JSON.parse(savedRegularExpenses) : []);
          setSubscriptions(savedSubscriptions ? JSON.parse(savedSubscriptions) : []);
          setAgenda(savedAgenda ? JSON.parse(savedAgenda) : []);
        }
      } catch (error) {
        console.error('Profil verileri yüklenirken hata:', error);
      }
    };

    loadProfileData();
  }, [currentProfile]);

  // Düzenli giderler için dönem değişikliği takibi
  useEffect(() => {
    const currentDate = new Date();
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Mevcut dönem için düzenli giderler var mı kontrol et
    const currentPeriodExpenses = regularExpenses.filter(expense => expense.period === currentPeriod);
    
    if (currentPeriodExpenses.length === 0 && regularExpenses.length > 0) {
      resetAndAddRegularExpensesForNewPeriod();
    }
  }, [dashboardFilter.year, dashboardFilter.month, regularExpenses]);

  // Verileri localStorage'a kaydetme (profile göre)
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(`${key}_${currentProfile}`, JSON.stringify(data));
    } catch (error) {
      console.error('Veri kaydedilirken hata:', error);
    }
  };

  // Test profili fonksiyonu kaldırıldı - varsayılan veriler kullanılıyor

  // Profil yönetimi
  const addProfile = (profileName) => {
    if (profileName && !profiles.includes(profileName)) {
      const updatedProfiles = [...profiles, profileName];
      setProfiles(updatedProfiles);
      localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
      setCurrentProfile(profileName);
      localStorage.setItem('currentProfile', profileName);
      setShowProfileForm(false);
    }
  };

  const deleteProfile = (profileName) => {
    if (profileName !== 'default' && profiles.length > 1) {
      const updatedProfiles = profiles.filter(p => p !== profileName);
      setProfiles(updatedProfiles);
      localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
      
      // Profil verilerini sil
      localStorage.removeItem(`projects_${profileName}`);
      localStorage.removeItem(`incomes_${profileName}`);
      localStorage.removeItem(`expenses_${profileName}`);
      localStorage.removeItem(`taxPayments_${profileName}`);
      localStorage.removeItem(`regularExpenses_${profileName}`);
      
      // Default profile geç
      if (currentProfile === profileName) {
        setCurrentProfile('DEMO');
        localStorage.setItem('currentProfile', 'DEMO');
      }
    }
  };

  const clearCurrentProfile = () => {
    if (window.confirm(`"${currentProfile}" profilindeki tüm verileri silmek istediğinizden emin misiniz?`)) {
      setProjects([]);
      setIncomes([]);
      setExpenses([]);
      setTaxPayments([]);
      setAgenda([]);
      setRegularExpenses([]);
      saveToStorage('projects', []);
      saveToStorage('incomes', []);
      saveToStorage('expenses', []);
      saveToStorage('taxPayments', []);
      saveToStorage('agenda', []);
      saveToStorage('regularExpenses', []);
    }
  };

  // Genel filtreleme fonksiyonu
  const filterDataByPeriod = (data, dateField, filterState) => {
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      
      if (filterState.type === 'month') {
        return itemDate.getMonth() === filterState.month && 
               itemDate.getFullYear() === filterState.year;
      } else if (filterState.type === 'year') {
        return itemDate.getFullYear() === filterState.year;
      } else if (filterState.type === 'all') {
        return true; // Tüm zamanlar - hepsini göster
      }
      
      return true;
    });
  };

  const dashboardSummary = useMemo(() => {
    // Filtrelenmiş verileri al
    const filteredIncomes = filterDataByPeriod(incomes, 'income_date', dashboardFilter);
    const filteredExpenses = filterDataByPeriod(expenses, 'expense_date', dashboardFilter);
    const filteredTaxPayments = filterDataByPeriod(taxPayments, 'payment_date', dashboardFilter);
    
    // Mevcut döneme ait düzenli giderleri ve abonelikleri filtrele
    const currentPeriod = `${dashboardFilter.year}-${String(dashboardFilter.month + 1).padStart(2, '0')}`;
    const filteredRegularExpenses = regularExpenses.filter(expense => expense.period === currentPeriod);
    const filteredSubscriptions = subscriptions.filter(subscription => subscription.period === currentPeriod);
    
    const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
    const baseExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const regularExpensesTotal = filteredRegularExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const subscriptionsTotal = filteredSubscriptions.reduce((sum, subscription) => sum + subscription.amount, 0);
    const totalTaxPaid = filteredTaxPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Gelirlerden çıkan KDV'yi hesapla (vergi ödemelerine otomatik olarak ekleniyor)
    const totalVATFromIncomes = filteredIncomes.reduce((sum, income) => sum + (income.tax_amount || 0), 0);
    
    // Toplam giderler: Normal giderler + Düzenli giderler + Abonelikler + Vergi ödemeleri (KDV dahil)
    const totalExpenses = baseExpenses + regularExpensesTotal + subscriptionsTotal + totalTaxPaid;
    
    // Projeler için özel filtreleme - sadece aktif projeleri say (tamamlanan hariç)
    const filteredProjects = filterDataByPeriod(projects, 'start_date', dashboardFilter);
    const activeProjects = filteredProjects.filter(p => 
      p.status !== 'tamamlandi' && 
      (p.status === 'devam-ediyor' || p.status === 'teklif-iletildi')
    ).length;
    
    return {
      totalIncome,
      totalExpenses,
      baseExpenses, // Normal giderler
      regularExpensesTotal, // Düzenli giderler
      subscriptionsTotal, // Abonelikler
      totalVATFromIncomes, // Gelirlerden gelen KDV (artık vergi ödemelerinde)
      netProfit: totalIncome - totalExpenses, // Net kar
      totalTaxPaid,
      activeProjects,
      filteredIncomes,
      filteredExpenses,
      filteredTaxPayments,
      filteredRegularExpenses,
      filteredSubscriptions,
      filteredProjects,
      period: dashboardFilter
    };
  }, [incomes, expenses, taxPayments, regularExpenses, subscriptions, projects, dashboardFilter]);

  // Yeni proje ekleme
  const addProject = (projectData) => {
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      created_at: new Date().toISOString()
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveToStorage('projects', updatedProjects);
    setShowForm(null);
  };

  // Proje güncelleme
  const updateProject = (updatedProject) => {
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    saveToStorage('projects', updatedProjects);
    setEditItem(null);
  };

  // Proje silme
  const deleteProject = (projectId) => {
    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      saveToStorage('projects', updatedProjects);
    }
  };

  // Yeni gelir ekleme
  const addIncome = (incomeData) => {
    const newIncome = {
      id: Date.now().toString(),
      ...incomeData,
      created_at: new Date().toISOString()
    };
    
    // Eğer vat_rate varsa tax_amount'u hesapla
    if (incomeData.vat_rate && !incomeData.tax_amount) {
      newIncome.tax_amount = incomeData.amount * incomeData.vat_rate;
    }
    
    const updatedIncomes = [...incomes, newIncome];
    setIncomes(updatedIncomes);
    saveToStorage('incomes', updatedIncomes);
    
    // Eğer KDV varsa, otomatik olarak vergi ödemelerine ekle
    const taxAmount = newIncome.tax_amount || (incomeData.vat_rate ? incomeData.amount * incomeData.vat_rate : 0);
    if (taxAmount && taxAmount > 0) {
      const vatPayment = {
        id: `vat_${Date.now()}`,
        amount: taxAmount,
        type: 'KDV',
        payment_date: incomeData.income_date,
        description: `${incomeData.brand || incomeData.description} - Otomatik KDV`
      };
      
      const updatedTaxPayments = [...taxPayments, vatPayment];
      setTaxPayments(updatedTaxPayments);
      saveToStorage('taxPayments', updatedTaxPayments);
    }
    
    setShowForm(null);
  };

  // Gelir güncelleme
  const updateIncome = (updatedIncome) => {
    const originalIncome = incomes.find(i => i.id === updatedIncome.id);
    
    const updatedIncomes = incomes.map(i => 
      i.id === updatedIncome.id ? updatedIncome : i
    );
    setIncomes(updatedIncomes);
    saveToStorage('incomes', updatedIncomes);
    
    // İlgili otomatik KDV ödeme kaydını güncelle
    if (originalIncome) {
      // Eski otomatik KDV kaydını bul ve güncelle/sil
      const updatedTaxPayments = taxPayments.map(payment => {
        // Otomatik KDV kayıtlarını tanımla (description'da "Otomatik KDV" geçen ve income description'ı ile eşleşen)
        const isAutoVatPayment = payment.description && 
                                payment.description.includes('Otomatik KDV') &&
                                payment.description.includes(originalIncome.description) &&
                                payment.type === 'KDV';
        
        if (isAutoVatPayment) {
          // Yeni income'da KDV varsa güncelle
          if (updatedIncome.tax_amount && updatedIncome.tax_amount > 0) {
            return {
              ...payment,
              amount: updatedIncome.tax_amount,
              payment_date: updatedIncome.income_date,
              description: `${updatedIncome.description} - Otomatik KDV`
            };
          } else {
            // Yeni income'da KDV yoksa bu kaydı silmek için null döndür
            return null;
          }
        }
        return payment;
      }).filter(payment => payment !== null); // null kayıtları filtrele
      
      // Eğer yeni income'da KDV var ama önceden otomatik KDV kaydı yoksa, yeni kayıt oluştur
      const hasAutoVatPayment = taxPayments.some(payment => 
        payment.description && 
        payment.description.includes('Otomatik KDV') &&
        payment.description.includes(originalIncome.description) &&
        payment.type === 'KDV'
      );
      
      if (updatedIncome.tax_amount && updatedIncome.tax_amount > 0 && !hasAutoVatPayment) {
        const newVatPayment = {
          id: `vat_${Date.now()}`,
          amount: updatedIncome.tax_amount,
          type: 'KDV',
          payment_date: updatedIncome.income_date,
          description: `${updatedIncome.description} - Otomatik KDV`
        };
        updatedTaxPayments.push(newVatPayment);
      }
      
      setTaxPayments(updatedTaxPayments);
      saveToStorage('taxPayments', updatedTaxPayments);
    }
    
    setEditItem(null);
    setShowForm(null);
  };

  // Gelir silme
  const deleteIncome = (incomeId) => {
    if (window.confirm('Bu geliri silmek istediğinizden emin misiniz?')) {
      const incomeToDelete = incomes.find(i => i.id === incomeId);
      
      const updatedIncomes = incomes.filter(i => i.id !== incomeId);
      setIncomes(updatedIncomes);
      saveToStorage('incomes', updatedIncomes);
      
      // İlgili otomatik KDV ödeme kaydını sil
      if (incomeToDelete) {
        const updatedTaxPayments = taxPayments.filter(payment => {
          // Otomatik KDV kayıtlarını tanımla ve sil
          const isAutoVatPayment = payment.description && 
                                  payment.description.includes('Otomatik KDV') &&
                                  payment.description.includes(incomeToDelete.description) &&
                                  payment.type === 'KDV';
          return !isAutoVatPayment; // Otomatik KDV kayıtlarını hariç tut
        });
        
        setTaxPayments(updatedTaxPayments);
        saveToStorage('taxPayments', updatedTaxPayments);
      }
      
      // Form'u kapatmak için
      setEditItem(null);
      setShowForm(null);
    }
  };

  // Yeni gider ekleme
  const addExpense = (expenseData) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      created_at: new Date().toISOString()
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveToStorage('expenses', updatedExpenses);
    setShowForm(null);
  };

  // Gider güncelleme
  const updateExpense = (updatedExpense) => {
    const updatedExpenses = expenses.map(e => 
      e.id === updatedExpense.id ? updatedExpense : e
    );
    setExpenses(updatedExpenses);
    saveToStorage('expenses', updatedExpenses);
    setEditItem(null);
  };

  // Gider silme
  const deleteExpense = (expenseId) => {
    if (window.confirm('Bu gideri silmek istediğinizden emin misiniz?')) {
      const updatedExpenses = expenses.filter(e => e.id !== expenseId);
      setExpenses(updatedExpenses);
      saveToStorage('expenses', updatedExpenses);
    }
  };

  // Yeni vergi ödemesi ekleme
  const addTaxPayment = (taxData) => {
    const newTaxPayment = {
      id: Date.now().toString(),
      ...taxData,
      created_at: new Date().toISOString()
    };
    const updatedTaxPayments = [...taxPayments, newTaxPayment];
    setTaxPayments(updatedTaxPayments);
    saveToStorage('taxPayments', updatedTaxPayments);
    setShowForm(null);
  };

  // Vergi ödemesi güncelleme
  const updateTaxPayment = (updatedTaxPayment) => {
    const updatedTaxPayments = taxPayments.map(t => 
      t.id === updatedTaxPayment.id ? updatedTaxPayment : t
    );
    setTaxPayments(updatedTaxPayments);
    saveToStorage('taxPayments', updatedTaxPayments);
    setEditItem(null);
  };

  // Vergi ödemesi silme
  const deleteTaxPayment = (taxId) => {
    if (window.confirm('Bu vergi ödemesini silmek istediğinizden emin misiniz?')) {
      const updatedTaxPayments = taxPayments.filter(t => t.id !== taxId);
      setTaxPayments(updatedTaxPayments);
      saveToStorage('taxPayments', updatedTaxPayments);
    }
  };

  // Profil Export/Import fonksiyonları - Tüm profil verileri
  const exportProfileToJSON = () => {
    const allProfilesData = {};
    
    // Tüm profillerin verilerini topla
    profiles.forEach(profileName => {
      const profileProjects = localStorage.getItem(`projects_${profileName}`);
      const profileIncomes = localStorage.getItem(`incomes_${profileName}`);
      const profileExpenses = localStorage.getItem(`expenses_${profileName}`);
      const profileTaxPayments = localStorage.getItem(`taxPayments_${profileName}`);
      
      allProfilesData[profileName] = {
        projects: profileProjects ? JSON.parse(profileProjects) : [],
        incomes: profileIncomes ? JSON.parse(profileIncomes) : [],
        expenses: profileExpenses ? JSON.parse(profileExpenses) : [],
        tax_payments: profileTaxPayments ? JSON.parse(profileTaxPayments) : []
      };
    });
    
    const data = {
      exported_at: new Date().toISOString(),
      version: "1.0",
      profiles: profiles,
      current_profile: currentProfile,
      all_data: allProfilesData
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tum-profiller-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importProfileFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Veri yapısını kontrol et
        if (importedData.all_data && importedData.profiles) {
          // Tüm profilleri ve verilerini içe aktar
          const { profiles: importedProfiles, all_data, current_profile } = importedData;
          
          // Profilleri güncelle
          const mergedProfiles = [...new Set([...profiles, ...importedProfiles])];
          setProfiles(mergedProfiles);
          localStorage.setItem('profiles', JSON.stringify(mergedProfiles));
          
          // Her profil için verileri kaydet
          Object.entries(all_data).forEach(([profileName, profileData]) => {
            if (profileData.projects) {
              localStorage.setItem(`projects_${profileName}`, JSON.stringify(profileData.projects));
            }
            if (profileData.incomes) {
              localStorage.setItem(`incomes_${profileName}`, JSON.stringify(profileData.incomes));
            }
            if (profileData.expenses) {
              localStorage.setItem(`expenses_${profileName}`, JSON.stringify(profileData.expenses));
            }
            if (profileData.tax_payments) {
              localStorage.setItem(`taxPayments_${profileName}`, JSON.stringify(profileData.tax_payments));
            }
          });
          
          // Aktif profili değiştir
          if (current_profile && mergedProfiles.includes(current_profile)) {
            setCurrentProfile(current_profile);
            localStorage.setItem('currentProfile', current_profile);
          }
          
          alert(`Tüm profiller başarıyla içe aktarıldı!\nProfiller: ${importedProfiles.join(', ')}`);
        } else {
          alert('Geçersiz dosya formatı! Profil export dosyası seçin.');
        }
      } catch (error) {
        console.error('İçe aktarma hatası:', error);
        alert('Dosya okuma hatası!');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Input'u temizle
  };

  // Ajanda yönetimi - YENİDEN YAZILDI
  const addAgendaItem = (agendaData) => {
    const newItem = {
      id: `agenda-${Date.now()}`,
      ...agendaData,
      created_at: new Date().toISOString()
    };
    const updated = [...agenda, newItem];
    setAgenda(updated);
    saveToStorage('agenda', updated);
  };

  const updateAgendaItem = (id, updatedData) => {
    const updated = agenda.map(item =>
      item.id === id ? { ...item, ...updatedData, updated_at: new Date().toISOString() } : item
    );
    setAgenda(updated);
    saveToStorage('agenda', updated);
  };

  const deleteAgendaItem = (id) => {
    if (window.confirm('Bu ajanda notunu silmek istediğinizden emin misiniz?')) {
      const updated = agenda.filter(item => item.id !== id);
      setAgenda(updated);
      saveToStorage('agenda', updated);
    }
  };

  // Düzenli giderler yönetimi
  const addRegularExpense = (expenseData) => {
    const currentDate = new Date();
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      period: currentPeriod // Mevcut döneme göre otomatik atama
    };
    
    // Sadece düzenli giderler listesine ekle
    const updatedRegular = [...regularExpenses, newExpense];
    setRegularExpenses(updatedRegular);
    saveToStorage('regularExpenses', updatedRegular);
  };

  const updateRegularExpense = (id, updatedData) => {
    const updated = regularExpenses.map(expense =>
      expense.id === id ? { ...expense, ...updatedData } : expense
    );
    setRegularExpenses(updated);
    saveToStorage('regularExpenses', updated);
  };

  const deleteRegularExpense = (id) => {
    // Sadece düzenli giderler listesinden sil
    const updatedRegular = regularExpenses.filter(expense => expense.id !== id);
    setRegularExpenses(updatedRegular);
    saveToStorage('regularExpenses', updatedRegular);
  };

  // Abonelik yönetimi
  const addSubscription = (subscriptionData) => {
    const currentDate = new Date();
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const newSubscription = {
      id: Date.now().toString(),
      ...subscriptionData,
      period: currentPeriod
    };
    
    const updatedSubscriptions = [...subscriptions, newSubscription];
    setSubscriptions(updatedSubscriptions);
    saveToStorage('subscriptions', updatedSubscriptions);
  };

  const deleteSubscription = (id) => {
    const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updatedSubscriptions);
    saveToStorage('subscriptions', updatedSubscriptions);
  };

  // Düzenli giderleri yeni dönem için otomatik sıfırlama ve ekleme
  const resetAndAddRegularExpensesForNewPeriod = () => {
    const currentDate = new Date();
    const currentPeriod = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Mevcut döneme ait düzenli giderler var mı kontrol et
    const currentPeriodExpenses = regularExpenses.filter(expense => expense.period === currentPeriod);
    
    if (currentPeriodExpenses.length === 0) {
      // Önceki dönemlerin düzenli giderlerini al ve yeni döneme kopyala
      const previousPeriodExpenses = regularExpenses.filter(expense => expense.period !== currentPeriod);
      
      if (previousPeriodExpenses.length > 0) {
        // En son dönemin düzenli giderlerini al
        const latestPeriod = previousPeriodExpenses.reduce((latest, expense) => 
          expense.period > latest ? expense.period : latest, ''
        );
        const latestExpenses = previousPeriodExpenses.filter(expense => expense.period === latestPeriod);
        
        // Yeni dönem için otomatik olarak ekle
        latestExpenses.forEach(expense => {
          const newExpense = {
            ...expense,
            id: Date.now().toString() + Math.random(),
            period: currentPeriod
          };
          
          // Düzenli giderler listesine ekle
          const updatedRegular = [...regularExpenses, newExpense];
          setRegularExpenses(updatedRegular);
          saveToStorage('regularExpenses', updatedRegular);
          
          // Ana giderler listesine de ekle
          const mainExpense = {
            id: `main_${newExpense.id}`,
            amount: expense.amount,
            category: expense.category,
            description: `${expense.amount} TL ${expense.category}`,
            expense_date: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`,
            created_at: new Date().toISOString()
          };
          
          const updatedExpenses = [...expenses, mainExpense];
          setExpenses(updatedExpenses);
          saveToStorage('expenses', updatedExpenses);
        });
      }
    }
  };

  // Başlık düzenleme
  const updateTitle = (newTitle) => {
    setAppTitle(newTitle);
    localStorage.setItem('appTitle', newTitle);
    setIsEditingTitle(false);
  };

  // Dönem Filtresi Bileşeni
  const PeriodFilter = ({ filter, setFilter, label, colorVariant = "default" }) => {
    const goToToday = () => {
      const today = new Date();
      setFilter({
        type: 'month',
        year: today.getFullYear(),
        month: today.getMonth()
      });
    };
    
    // Color variants for different sections
    const getColorClasses = () => {
      switch(colorVariant) {
        case 'purple':
          return darkMode 
            ? 'bg-purple-700 border-purple-600 text-white hover:bg-purple-600' 
            : 'bg-purple-600 border-purple-500 text-white hover:bg-purple-700';
        case 'indigo':
          return darkMode 
            ? 'bg-indigo-700 border-indigo-600 text-white hover:bg-indigo-600' 
            : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700';
        case 'success':
          return darkMode 
            ? 'bg-green-700 border-green-600 text-white hover:bg-green-600' 
            : 'bg-green-600 border-green-500 text-white hover:bg-green-700';
        case 'danger':
          return darkMode 
            ? 'bg-red-700 border-red-600 text-white hover:bg-red-600' 
            : 'bg-red-600 border-red-500 text-white hover:bg-red-700';
        case 'warning':
          return darkMode 
            ? 'bg-orange-700 border-orange-600 text-white hover:bg-orange-600' 
            : 'bg-orange-600 border-orange-500 text-white hover:bg-orange-700';
        default:
          return darkMode 
            ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
            : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50';
      }
    };
    
    return (
      <div className="flex items-center gap-2">
        <label className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>{label}:</label>
        
        {/* Tür Seçimi */}
        <select
          value={filter.type}
          onChange={(e) => setFilter({...filter, type: e.target.value})}
          className={`px-2 py-2 h-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="month">Aylık</option>
          <option value="year">Yıllık</option>
          <option value="all">Tüm Zamanlar</option>
        </select>
        
        {/* Yıl - Sadece aylık veya yıllık seçildiğinde */}
        {(filter.type === 'month' || filter.type === 'year') && (
          <select
            value={filter.year}
            onChange={(e) => setFilter({...filter, year: parseInt(e.target.value)})}
            className={`px-2 py-2 h-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {Array.from({length: 10}, (_, i) => currentYear + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        )}
        
        {/* Ay - Sadece aylık seçildiğinde */}
        {filter.type === 'month' && (
          <select
            value={filter.month}
            onChange={(e) => setFilter({...filter, month: parseInt(e.target.value)})}
            className={`px-2 py-2 h-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
              'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        )}
        
        {/* Bugüne Git Butonu */}
        <button
          onClick={goToToday}
          className={`px-3 py-2 h-10 rounded-md border transition-colors duration-200 hover:scale-110 ${getColorClasses()}`}
          title="Bugüne git"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };

  // Form bileşenleri
  const ProjectForm = ({ project = null }) => {
    const [formData, setFormData] = useState({
      status: project?.status || 'teklif-iletildi',
      name: project?.name || '',
      description: project?.description || '',
      start_date: project?.start_date || new Date().toISOString().split('T')[0],
      end_date: project?.end_date || '',
      price: project?.price || ''
    });

    // Form her açıldığında tarihi güncelle
    useEffect(() => {
      if (!project) {
        // Yeni proje ekleme - her zaman güncel tarihi al
        setFormData(prev => ({
          ...prev,
          start_date: new Date().toISOString().split('T')[0]
        }));
      }
    }, [project]);

    const statuses = {
      'teklif-iletildi': 'Teklif İletildi',
      'devam-ediyor': 'Devam Ediyor',
      'revizyonda': 'Revizyonda',
      'tamamlandi': 'Tamamlandı',
      'iptal-edildi': 'İptal Edildi'
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const projectData = {
        ...formData,
        price: parseFloat(formData.price) || 0
      };
      
      if (project) {
        updateProject({ ...project, ...projectData });
      } else {
        addProject(projectData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          {project ? 'Proje Düzenle' : 'Proje Ekle'}
        </h3>
        
        {/* Tarih - En üstte */}
        <DateInput
          value={formData.start_date}
          onChange={(e) => setFormData({...formData, start_date: e.target.value})}
          required={true}
          label="Proje Başlangıç Tarihi"
        />
        
        {/* Bitiş Tarihi */}
        <DateInput
          value={formData.end_date}
          onChange={(e) => setFormData({...formData, end_date: e.target.value})}
          required={false}
          label="Proje Bitiş Tarihi"
        />
        
        {/* Durum */}
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {Object.entries(statuses).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Proje Adı"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        <textarea
          placeholder="Proje Açıklaması"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <input
          type="number"
          placeholder="Fiyat (₺)"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <div className="flex gap-4">
          <StandardButton type="submit" variant="primary">
            {project ? 'Güncelle' : 'Kaydet'}
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => {
              setShowForm(null);
              setEditItem(null);
            }}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  const IncomeForm = ({ income = null }) => {
    const [formData, setFormData] = useState({
      brand: income?.brand || '',
      project_id: income?.project_id || '',
      description: income?.description || '',
      amount: income?.amount || '',
      vat_rate: income?.vat_rate || 0.20, // KDV oranı
      income_date: income?.income_date || new Date().toISOString().split('T')[0]
    });

    // Form her açıldığında tarihi güncelle
    useEffect(() => {
      if (!income) {
        setFormData(prev => ({
          ...prev,
          income_date: new Date().toISOString().split('T')[0]
        }));
      }
    }, [income]);

    const calculateAmounts = (amount, vatRate) => {
      const baseAmount = parseFloat(amount) || 0;
      const vatAmount = baseAmount * vatRate;
      const netAmount = baseAmount - vatAmount;
      return { baseAmount, vatAmount, netAmount };
    };

    const { baseAmount, vatAmount, netAmount } = calculateAmounts(formData.amount, formData.vat_rate);

    const handleSubmit = (e) => {
      e.preventDefault();
      const amount = parseFloat(formData.amount) || 0;
      const vatRate = parseFloat(formData.vat_rate) || 0;
      const vatAmount = amount * vatRate;
      const netAmount = amount - vatAmount;
      
      const incomeData = {
        ...formData,
        amount,
        vat_rate: vatRate,
        tax_amount: vatAmount,
        net_amount: netAmount
      };
      
      if (income) {
        updateIncome({ ...income, ...incomeData });
      } else {
        addIncome(incomeData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          {income ? 'Gelir Düzenle' : 'Gelir Ekle'}
        </h3>
        
        {/* Tarih - En üstte */}
        <DateInput
          value={formData.income_date}
          onChange={(e) => setFormData({...formData, income_date: e.target.value})}
          required={true}
          label="Gelir Tarihi"
        />
        
        {/* Marka */}
        <input
          type="text"
          placeholder="Marka"
          value={formData.brand}
          onChange={(e) => setFormData({...formData, brand: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        
        {/* Proje Seçimi - Opsiyonel */}
        <select
          value={formData.project_id}
          onChange={(e) => setFormData({...formData, project_id: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="">-- Proje seçilmemiş --</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Gelir Açıklaması"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <input
          type="number"
          placeholder="Tutar (₺)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        
        {/* KDV Oranı Seçimi */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium transition-colors duration-200 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>KDV Oranı</label>
          <select
            value={formData.vat_rate}
            onChange={(e) => setFormData({...formData, vat_rate: parseFloat(e.target.value)})}
            className={`w-full p-3 border rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value={0}>%0 (KDV Yok)</option>
            <option value={0.01}>%1</option>
            <option value={0.08}>%8</option>
            <option value={0.18}>%18</option>
            <option value={0.20}>%20</option>
          </select>
        </div>
        
        {/* KDV Hesaplama Gösterimi */}
        {formData.amount && (
          <div className={`p-4 rounded-md space-y-2 transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-gray-50'
          }`}>
            <div className={`flex justify-between text-sm transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <span>Ana Tutar:</span>
              <span className="font-semibold">₺{baseAmount.toLocaleString('tr-TR')}</span>
            </div>
            <div className={`flex justify-between text-sm transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <span>KDV ({(formData.vat_rate * 100).toFixed(0)}%):</span>
              <span className="font-semibold text-red-500">₺{vatAmount.toLocaleString('tr-TR')}</span>
            </div>
            <div className={`flex justify-between text-sm border-t pt-2 transition-colors duration-200 ${
              darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-700'
            }`}>
              <span className="font-semibold">Net Tutar:</span>
              <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>₺{netAmount.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        )}
        <div className="flex gap-4">
          <StandardButton type="submit" variant="success">
            {income ? 'Güncelle' : 'Kaydet'}
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => {
              setShowForm(null);
              setEditItem(null);
            }}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  const ExpenseForm = ({ expense = null }) => {
    const [formData, setFormData] = useState({
      category: expense?.category || '',
      description: expense?.description || '',
      expense_date: expense?.expense_date || new Date().toISOString().split('T')[0],
      amount: expense?.amount || ''
    });

    // Form her açıldığında tarihi güncelle
    useEffect(() => {
      if (!expense) {
        setFormData(prev => ({
          ...prev,
          expense_date: new Date().toISOString().split('T')[0]
        }));
      }
    }, [expense]);

    const categories = {
      'ofis-giderleri': 'Ofis Giderleri',
      'donanim': 'Donanım',
      'pazarlama': 'Pazarlama',
      'ulasim': 'Ulaşım',
      'egitim': 'Eğitim',
      'proje-bazli': 'Proje Bazlı Harcamalar',
      'yemek': 'Yemek',
      'diger': 'Diğer'
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      if (expense) {
        updateExpense({ ...expense, ...expenseData });
      } else {
        addExpense(expenseData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          {expense ? 'Gider Düzenle' : 'Gider Ekle'}
        </h3>
        
        {/* Tarih - En üstte */}
        <DateInput
          value={formData.expense_date}
          onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
          required={true}
          label="Gider Tarihi"
        />
        
        {/* Kategori - Dropdown + Manual */}
        <div className="flex gap-2">
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className={`p-3 border rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Seçin...</option>
            {Object.entries(categories)
              .filter(([key]) => key !== 'diger')
              .sort(([, a], [, b]) => a.localeCompare(b, 'tr'))
              .map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))
            }
            <option key="diger" value="diger">Diğer</option>
          </select>
          <input
            type="text"
            placeholder="Kategori girin..."
            value={formData.category && categories[formData.category] ? categories[formData.category] : (formData.category || '')}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className={`flex-1 p-3 border rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            required
          />
        </div>
        
        <input
          type="text"
          placeholder="Açıklama"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        
        {/* Tutar - En altta */}
        <input
          type="number"
          placeholder="Tutar (₺)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        
        <div className="flex gap-4">
          <StandardButton type="submit" variant="danger">
            {expense ? 'Güncelle' : 'Kaydet'}
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => {
              setShowForm(null);
              setEditItem(null);
            }}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  const TaxPaymentForm = ({ taxPayment = null }) => {
    const [formData, setFormData] = useState({
      amount: taxPayment?.amount || '',
      type: taxPayment?.type || 'KDV',
      payment_date: taxPayment?.payment_date || new Date().toISOString().split('T')[0],
      description: taxPayment?.description || ''
    });

    // Form her açıldığında tarihi güncelle
    useEffect(() => {
      if (!taxPayment) {
        setFormData(prev => ({
          ...prev,
          payment_date: new Date().toISOString().split('T')[0]
        }));
      }
    }, [taxPayment]);

    const taxTypes = {
      'KDV': 'KDV',
      'Damga Vergisi': 'Damga Vergisi',
      'Stopaj': 'Stopaj',
      'BAĞ-KUR': 'BAĞ-KUR',
      'Geçici Vergi': 'Geçici Vergi'
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const taxData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      if (taxPayment) {
        updateTaxPayment({ ...taxPayment, ...taxData });
      } else {
        addTaxPayment(taxData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">
          {taxPayment ? 'Vergi Ödemesi Düzenle' : 'Vergi Ödemesi Ekle'}
        </h3>
        
        {/* Tarih Seçimi - İlk sıra */}
        <DateInput
          value={formData.payment_date}
          onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
          required={true}
          label="Ödeme Tarihi"
        />
        
        {/* Vergi Türü (KDV, Damga Vergisi gibi) - İkinci sıra */}
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        >
          {Object.entries(taxTypes).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        
        {/* Açıklama - Üçüncü sıra */}
        <textarea
          placeholder="Açıklama"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        
        {/* Vergi Tutarı - Son sıra */}
        <input
          type="number"
          placeholder="Ödenen Vergi Tutarı (₺)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        <div className="flex gap-4">
          <StandardButton type="submit" variant="primary">
            {taxPayment ? 'Güncelle' : 'Kaydet'}
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => {
              setShowForm(null);
              setEditItem(null);
            }}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  const AgendaForm = ({ agendaItem = null }) => {
    const [formData, setFormData] = useState({
      title: agendaItem?.title || '',
      note: agendaItem?.note || '',
      date: agendaItem?.date || new Date().toISOString().split('T')[0],
      priority: agendaItem?.priority || 'orta'
    });

    // Form her açıldığında veya agendaItem değiştiğinde tarihi güncelle
    useEffect(() => {
      setFormData({
        title: agendaItem?.title || '',
        note: agendaItem?.note || '',
        date: agendaItem?.date || new Date().toISOString().split('T')[0],
        priority: agendaItem?.priority || 'orta'
      });
    }, [agendaItem]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (agendaItem) {
        updateAgendaItem(agendaItem.id, formData);
        setEditItem(null);
      } else {
        addAgendaItem(formData);
        setShowForm(null);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {agendaItem ? 'Notu Düzenle' : 'Yeni Not'}
        </h3>
        
        <DateInput
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          required={true}
          label="Tarih"
        />
        
        <select
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: e.target.value})}
          className={`w-full p-3 border rounded-md ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="dusuk">Düşük</option>
          <option value="orta">Orta</option>
          <option value="yuksek">Yüksek</option>
        </select>
        
        <input
          type="text"
          placeholder="Başlık"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className={`w-full p-3 border rounded-md ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        
        <textarea
          placeholder="Not"
          value={formData.note}
          onChange={(e) => setFormData({...formData, note: e.target.value})}
          className={`w-full p-3 border rounded-md ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          rows="3"
        />
        
        <div className="flex gap-4">
          <StandardButton type="submit" variant="primary">
            {agendaItem ? 'Güncelle' : 'Kaydet'}
          </StandardButton>
          <StandardButton
            type="button"
            variant="secondary"
            onClick={() => {
              setShowForm(null);
              setEditItem(null);
            }}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  // Ajanda Modal Komponenti
  const AgendaModal = ({ item, onClose }) => {
    if (!item) return null;
    
    const isToday = item.date === new Date().toISOString().split('T')[0];
    const isPast = new Date(item.date) < new Date().setHours(0,0,0,0);
    
    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className={`max-w-2xl w-full rounded-xl shadow-2xl transform transition-all ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700' 
              : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Ajanda Detayı
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <HiOutlineXCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Tarih ve Etiketler */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm px-3 py-1.5 rounded-lg font-medium ${
                darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200/70 text-gray-700'
              }`}>
                <HiOutlineCalendar className="w-4 h-4 inline mr-1" />
                {new Date(item.date).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              {isToday && (
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                }`}>
                  Bugün
                </span>
              )}
              {isPast && (
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                }`}>
                  Geçmiş
                </span>
              )}
              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                item.priority === 'yuksek' ? (darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-700') :
                item.priority === 'orta' ? (darkMode ? 'bg-yellow-900/50 text-yellow-200' : 'bg-yellow-100 text-yellow-700') :
                (darkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-700')
              }`}>
                {item.priority === 'yuksek' ? 'Yüksek Öncelik' : item.priority === 'orta' ? 'Orta Öncelik' : 'Düşük Öncelik'}
              </span>
            </div>

            {/* Başlık */}
            <div>
              <h3 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {item.title}
              </h3>
            </div>

            {/* Not */}
            {item.note && (
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700/30' : 'bg-gray-100/70'
              }`}>
                <p className={`text-base leading-relaxed whitespace-pre-wrap ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {item.note}
                </p>
              </div>
            )}

            {/* Oluşturma/Güncelleme Zamanı */}
            {(item.created_at || item.updated_at) && (
              <div className={`text-xs pt-2 border-t ${
                darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'
              }`}>
                {item.created_at && (
                  <p>Oluşturulma: {new Date(item.created_at).toLocaleString('tr-TR')}</p>
                )}
                {item.updated_at && (
                  <p>Güncelleme: {new Date(item.updated_at).toLocaleString('tr-TR')}</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`p-6 border-t flex justify-end ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <StandardButton
              onClick={onClose}
              variant="primary"
            >
              Kapat
            </StandardButton>
          </div>
        </div>
      </div>
    );
  };

  // Düzenli Gider Formu
  const RegularExpenseForm = ({ category, categoryLabel, onClose }) => {
    const [formData, setFormData] = useState({
      amount: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const expenseData = {
        category,
        categoryLabel,
        amount: parseFloat(formData.amount) || 0,
        description: '' // Açıklama alanını boş bırak
      };
      
      addRegularExpense(expenseData);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          placeholder="Tutar (₺)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className={`w-full p-2 border rounded text-sm transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-600 border-gray-500 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        <div className="flex gap-2">
          <StandardButton 
            type="submit" 
            variant="success"
            size="sm"
            className="flex-1"
          >
            Kaydet
          </StandardButton>
          <StandardButton
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  // Abonelik Formu
  const SubscriptionForm = ({ category, categoryLabel, subcategory, subcategoryLabel, onClose }) => {
    const [formData, setFormData] = useState({
      amount: '',
      selectedItem: subcategory || '',
      customItem: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const subscriptionData = {
        category,
        categoryLabel,
        subcategory: formData.selectedItem || formData.customItem,
        subcategoryLabel: formData.selectedItem ? subcategoryLabel : formData.customItem,
        amount: parseFloat(formData.amount) || 0,
        description: formData.selectedItem || formData.customItem
      };
      
      addSubscription(subscriptionData);
      onClose();
    };

    // Kategori alt seçenekleri
    const subcategoryOptions = {
      'tasarim': [
        'Adobe Creative Cloud',
        'Autodesk (3ds Max, Maya)',
        'Canva Pro',
        'Capcut',
        'Cinema 4D',
        'Figma'
      ],
      'yazilim': [
        'Google Workspace',
        'JetBrains',
        'Visual Studio'
      ],
      'pazarlama': [
        'Ahrefs',
        'Buffer / Hootsuite',
        'HubSpot',
        'Mailchimp',
        'Semrush'
      ],
      'eglence-icerik': [
        'Amazon Prime',
        'Apple Music',
        'BluTV',
        'Disney+',
        'Exxen',
        'Gain',
        'HBO Max',
        'MUBI',
        'Netflix',
        'Spotify',
        'YouTube'
      ],
      'yapay-zeka': [
        'ChatGPT',
        'Claude',
        'Copy.ai',
        'Cursor',
        'Descript',
        'Elevenlabs',
        'GitHub Copilot',
        'Jasper AI',
        'MidJourney',
        'Perplexity',
        'Pixelcut',
        'Runway',
        'Stable Diffusion',
        'Uppbeat'
      ],
      'eklenti': [
        'Autocut',
        'Cutback',
        'Firecut',
        'LottieFiles',
        'ProtoPie'
      ]
    };

    const currentOptions = subcategoryOptions[category] || [];

    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Ürün/Hizmet Seçimi */}
        <div className="space-y-2">
          <label className={`block text-xs font-medium transition-colors duration-200 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Ürün/Hizmet
          </label>
          <select
            value={formData.selectedItem}
            onChange={(e) => setFormData({...formData, selectedItem: e.target.value, customItem: ''})}
            className={`w-full p-2 border rounded text-sm transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-600 border-gray-500 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">-- Seçin veya özel girin --</option>
            {currentOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          
          {/* Özel Giriş */}
          {!formData.selectedItem && (
            <input
              type="text"
              placeholder="Özel ürün/hizmet adı girin..."
              value={formData.customItem}
              onChange={(e) => setFormData({...formData, customItem: e.target.value})}
              className={`w-full p-2 border rounded text-sm transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-600 border-gray-500 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required={!formData.selectedItem}
            />
          )}
        </div>

        {/* Tutar */}
        <input
          type="number"
          placeholder="Aylık Tutar (₺)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className={`w-full p-2 border rounded text-sm transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-600 border-gray-500 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        
        <div className="flex gap-2">
          <StandardButton 
            type="submit" 
            variant="success"
            size="sm"
            className="flex-1"
          >
            Kaydet
          </StandardButton>
          <StandardButton
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  // Profil formu
  const ProfileForm = () => {
    const [newProfileName, setNewProfileName] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (newProfileName.trim()) {
        addProfile(newProfileName.trim());
        setNewProfileName('');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Yeni Profil Ekle</h3>
        <input
          type="text"
          placeholder="Profil Adı"
          value={newProfileName}
          onChange={(e) => setNewProfileName(e.target.value)}
          className={`w-full p-3 border rounded-md transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
        <div className="flex gap-4">
          <StandardButton type="submit" variant="primary">
            Profil Ekle
          </StandardButton>
          <StandardButton
            variant="secondary"
            onClick={() => setShowProfileForm(false)}
          >
            İptal
          </StandardButton>
        </div>
      </form>
    );
  };

  // Standart buton bileşeni - tutarlı boyutlar için
  const StandardButton = ({ 
    type = "button", 
    onClick, 
    className = "", 
    variant = "primary", 
    children, 
    disabled = false,
    size = "md"
  }) => {
    const baseClasses = "font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center whitespace-nowrap";
    
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };
    
    const variantClasses = {
      primary: darkMode 
        ? "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500" 
        : "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      secondary: darkMode
        ? "bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-500"
        : "bg-gray-400 hover:bg-gray-500 text-white focus:ring-gray-500",
      success: darkMode
        ? "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
        : "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      danger: darkMode
        ? "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
        : "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      warning: darkMode
        ? "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
        : "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      info: darkMode
        ? "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
        : "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      purple: darkMode
        ? "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
        : "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      indigo: darkMode
        ? "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
        : "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500"
    };
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {children}
      </button>
    );
  };

  // Modern Edit/Delete Button Component - System Compatible
  const EditDeleteButtons = ({ 
    onEdit, 
    onDelete, 
    editTitle = "Düzenle", 
    deleteTitle = "Sil",
    size = "sm",
    className = ""
  }) => {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {/* Edit Button */}
        <button
          type="button"
          onClick={onEdit}
          className={`
            inline-flex items-center justify-center rounded-lg transition-all duration-200 
            hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1
            ${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'}
            ${darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white focus:ring-gray-600' 
              : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm hover:shadow-md focus:ring-gray-300'
            }
          `}
          title={editTitle}
        >
          <svg className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        {/* Delete Button */}
        <button
          type="button"
          onClick={onDelete}
          className={`
            inline-flex items-center justify-center rounded-lg transition-all duration-200 
            hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1
            ${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'}
            ${darkMode 
              ? 'bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-700/50 text-gray-300 hover:text-red-300 focus:ring-red-600' 
              : 'bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 shadow-sm hover:shadow-md focus:ring-red-300'
            }
          `}
          title={deleteTitle}
        >
          <svg className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    );
  };

  // Tarih seçici bileşeni - bugün butonuyla - Consistent gray system colors
  const DateInput = ({ value, onChange, className = "", required = false, label = "" }) => {
    const setToday = () => {
      const today = new Date().toISOString().split('T')[0];
      onChange({ target: { value: today } });
    };

    return (
      <div className="relative">
        {label && (
          <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={value}
            onChange={onChange}
            className={`flex-1 p-3 border rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } ${className}`}
            required={required}
          />
          <button
            type="button"
            onClick={setToday}
            className={`px-3 py-3 rounded-md border transition-colors duration-200 hover:scale-105 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300' 
                : 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700'
            }`}
            title="Bugüne git"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Basit SVG pasta grafiği bileşeni
  const PieChart = ({ data, title, size = 200, colorType = 'default' }) => {
    // Eğer hiç veri yoksa boş pasta göster
    if (!data || data.length === 0) {
      return (
        <div className="text-center p-4">
          <h4 className="font-semibold mb-2">{title}</h4>
          <div className="flex items-center justify-center" style={{ height: size }}>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full border-8 border-gray-200 mb-4"></div>
              <p className="text-gray-500">Henüz veri yok</p>
            </div>
          </div>
        </div>
      );
    }
    
    // Eğer tüm değerler 0 ise boş pasta göster
    if (data.every(d => d.value === 0)) {
      return (
        <div className="text-center p-4">
          <h4 className="font-semibold mb-2">{title}</h4>
          <div className="flex items-center justify-center" style={{ height: size }}>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full border-8 border-gray-200 mb-4"></div>
              <p className="text-gray-500">Henüz veri yok</p>
            </div>
          </div>
        </div>
      );
    }

    // Sadece 0 olmayan değerleri filtrele
    const validData = data.filter(d => d.value > 0);

    const total = validData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;

    // Veriyi değere göre sırala (büyükten küçüğe) ve ona göre renk ata
    const sortedData = [...validData].sort((a, b) => b.value - a.value);
    
    const colorPalettes = {
      income: ['#86efac', '#fde047', '#c4b5fd', '#7dd3fc', '#fdba74', '#bef264', '#93c5fd'], // Gelir: Pastel yeşil tonları
      expense: ['#fca5a5', '#c4b5fd', '#fde047', '#7dd3fc', '#fdba74', '#bef264', '#93c5fd'], // Gider: Pastel kırmızı tonları
      tax: ['#fdba74', '#c4b5fd', '#fde047', '#7dd3fc', '#86efac', '#bef264', '#93c5fd'], // Vergi: Pastel turuncu tonları
      default: ['#86efac', '#fde047', '#fca5a5', '#c4b5fd', '#7dd3fc', '#fdba74', '#bef264']
    };

    const basePalette = colorPalettes[colorType] || colorPalettes.default;
    
    // Her veri öğesi için rengi belirle (sıralı dataya göre)
    const colors = validData.map(item => {
      const sortedIndex = sortedData.findIndex(sortedItem => sortedItem.label === item.label);
      return basePalette[sortedIndex % basePalette.length];
    });

    // Tek değer için tam daire çiz
    if (validData.length === 1) {
      const singleItem = validData[0];
      const mainColor = basePalette[0]; // Ana renk
      
      return (
        <div className="text-center">
          <h4 className="font-semibold mb-2">{title}</h4>
          <svg width={size} height={size} className="mx-auto">
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill={mainColor}
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: mainColor }}
                ></div>
                <span>{singleItem.label}</span>
              </div>
              <span>100% (₺{singleItem.value.toLocaleString('tr-TR')})</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h4 className="font-semibold mb-2">{title}</h4>
        <svg width={size} height={size} className="mx-auto">
          {validData.map((item, index) => {
            
            const percentage = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle = endAngle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index]}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="mt-2 space-y-1 text-sm">
          {validData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors[index] }}
                  ></div>
                  <span>{item.label}</span>
                </div>
                <span>{percentage}% (₺{item.value.toLocaleString('tr-TR')})</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Dashboard Bileşeni
  const Dashboard = () => {
    // Gelir dağılımı için veri hazırlama
    const incomeChartData = dashboardSummary.filteredIncomes.reduce((acc, income) => {
      const brand = income.brand || 'Belirsiz Marka';
      const existing = acc.find(item => item.label === brand);
      if (existing) {
        existing.value += income.amount;
      } else {
        acc.push({ label: brand, value: income.amount });
      }
      return acc;
    }, []).sort((a, b) => b.value - a.value); // Değere göre azalan sırada sırala

    // Gider dağılımı için veri hazırlama - 3 ana grup: Harici Giderler, Abonelikler, Sabit Giderler
    const expenseChartData = (() => {
      const groups = {
        'Harici Giderler': 0,
        'Abonelikler': 0,
        'Sabit Giderler': 0
      };
      
      // Normal giderler (Harici Giderler)
      dashboardSummary.filteredExpenses.forEach(expense => {
        groups['Harici Giderler'] += expense.amount;
      });
      
      // Abonelikler
      dashboardSummary.filteredSubscriptions.forEach(subscription => {
        groups['Abonelikler'] += subscription.amount;
      });
      
      // Düzenli giderler (Sabit Giderler)
      dashboardSummary.filteredRegularExpenses.forEach(expense => {
        groups['Sabit Giderler'] += expense.amount;
      });
      
      // Sadece 0'dan büyük değerleri döndür ve değere göre azalan sırada sırala
      return Object.entries(groups)
        .filter(([label, value]) => value > 0)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
    })();

    // Vergi dağılımı için veri hazırlama
    const taxChartData = dashboardSummary.filteredTaxPayments.reduce((acc, payment) => {
      const type = payment.type || 'Belirsiz';
      const existing = acc.find(item => item.label === type);
      if (existing) {
        existing.value += payment.amount;
      } else {
        acc.push({ label: type, value: payment.amount });
      }
      return acc;
    }, []).sort((a, b) => b.value - a.value); // Değere göre azalan sırada sırala

    return (
      <div className={`rounded-2xl border shadow-md ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
      }`}>
        {/* Financial Summary Card Content */}
        <div className="p-8">
          {/* Header with Period Filter - Sadece Dönem */}
          <div className="flex justify-end items-center mb-6">
            <PeriodFilter 
              filter={dashboardFilter} 
              setFilter={setDashboardFilter} 
              label="Dönem" 
              colorVariant="default"
            />
          </div>
          
          {/* Finansal Özet Kartı - Tek kart içinde 4 bilgi */}
          <div className={`p-6 rounded-xl border ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
          }`}>
            <div className="mb-6">
              <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                darkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>Finansal Özet</h2>
            </div>
            
            {/* Ana kartlar - Modern Design inspired by reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Gelir Card */}
              <div className={`p-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 hover:from-gray-600 hover:to-gray-700' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
              }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                darkMode 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-green-100 text-green-600'
              }`}>
                <HiOutlineTrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-bold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ₺{dashboardSummary.totalIncome.toLocaleString('tr-TR')}
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Toplam gelir tutarı</p>
            </div>
          </div>

          {/* Gider Card */}
          <div className={`p-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 hover:from-gray-600 hover:to-gray-700' 
              : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                darkMode 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-red-100 text-red-600'
              }`}>
                <HiOutlineTrendingDown className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-bold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ₺{dashboardSummary.totalExpenses.toLocaleString('tr-TR')}
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Toplam gider tutarı</p>
            </div>
          </div>

          {/* Vergi Card */}
          <div className={`p-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 hover:from-gray-600 hover:to-gray-700' 
              : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                darkMode 
                  ? 'bg-orange-500/20 text-orange-400' 
                  : 'bg-orange-100 text-orange-600'
              }`}>
                <HiOutlineReceiptTax className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-bold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ₺{dashboardSummary.totalTaxPaid.toLocaleString('tr-TR')}
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Toplam vergi tutarı</p>
              {/* KDV text removed as requested by user */}
              {/* {dashboardSummary.totalVATFromIncomes > 0 && (
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-orange-400' : 'text-orange-600'
                }`}>
                  KDV: ₺{dashboardSummary.totalVATFromIncomes.toLocaleString('tr-TR')}
                </p>
              )} */}
            </div>
          </div>

          {/* Net Kar Card */}
          <div className={`p-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 hover:from-gray-600 hover:to-gray-700' 
              : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                darkMode 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                <HiOutlineChartBar className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-bold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ₺{dashboardSummary.netProfit.toLocaleString('tr-TR')}
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Toplam net kazanç</p>
            </div>
          </div>
        </div>
        </div>

        {/* Projeler Özet - Modern Card Design */}
        {(() => {
          const totalProjectCount = dashboardSummary.filteredProjects.length;
          // İptal edilen projeleri toplam değerden hariç tut
          const activeProjectsForValue = dashboardSummary.filteredProjects.filter(p => p.status !== 'iptal-edildi');
          const totalProjectValue = activeProjectsForValue.reduce((sum, p) => sum + (p.price || 0), 0);
          const completedProjects = dashboardSummary.filteredProjects.filter(p => p.status === 'tamamlandi').length;
          const activeProjects = dashboardSummary.filteredProjects.filter(p => p.status === 'devam-ediyor').length;
          const proposalSent = dashboardSummary.filteredProjects.filter(p => p.status === 'teklif-iletildi').length;
          const onHold = dashboardSummary.filteredProjects.filter(p => p.status === 'beklemede').length;
          const cancelled = dashboardSummary.filteredProjects.filter(p => p.status === 'iptal-edildi').length;
          
          if (totalProjectCount === 0) return null;
          
          return (
            <div className="mt-8">
              <div className={`p-6 rounded-xl border transition-all duration-300 shadow-md hover:shadow-lg ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Proje Özeti</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {/* Toplam - İlk sırada */}
                  <div className={`p-4 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
                  }`}>
                    <h4 className={`text-xs font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Toplam</h4>
                    <p className={`text-2xl font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{totalProjectCount}</p>
                  </div>
                  
                  {/* Teklif İletildi */}
                  <div className={`p-4 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
                  }`}>
                    <h4 className={`text-xs font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Teklif İletildi</h4>
                    <p className={`text-2xl font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{proposalSent}</p>
                  </div>
                  
                  {/* Devam Ediyor */}
                  <div className={`p-4 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
                  }`}>
                    <h4 className={`text-xs font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Devam Ediyor</h4>
                    <p className={`text-2xl font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{activeProjects}</p>
                  </div>
                  
                  {/* Revizyonda */}
                  <div className={`p-4 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
                  }`}>
                    <h4 className={`text-xs font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Revizyonda</h4>
                    <p className={`text-2xl font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{dashboardSummary.filteredProjects.filter(p => p.status === 'revizyonda').length}</p>
                  </div>
                  
                  {/* Tamamlandı */}
                  <div className={`p-4 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
                  }`}>
                    <h4 className={`text-xs font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Tamamlandı</h4>
                    <p className={`text-2xl font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{completedProjects}</p>
                  </div>
                  
                  {/* İptal Edildi */}
                  <div className={`p-4 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
                  }`}>
                    <h4 className={`text-xs font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>İptal Edildi</h4>
                    <p className={`text-2xl font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{cancelled}</p>
                  </div>
                  
                  {/* Toplam Değer - En sağda */}
                  <div className={`p-4 rounded-xl text-center transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
                  }`}>
                    <h4 className={`text-xs font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Toplam Değer</h4>
                    <p className={`text-lg font-bold transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>₺{totalProjectValue.toLocaleString('tr-TR')}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Ajanda Özeti - Modern Card Design */}
        {(() => {
          const today = new Date().setHours(0,0,0,0);
          
          // Tarihi gelmemiş notları önceliğe göre sırala
          const upcomingItems = agenda
            .filter(item => new Date(item.date) >= today)
            .sort((a, b) => {
              // Öncelik sıralaması: yuksek > orta > dusuk
              const priorityOrder = { 'yuksek': 1, 'orta': 2, 'dusuk': 3 };
              const priorityDiff = (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
              
              // Önce önceliğe göre, sonra tarihe göre
              if (priorityDiff !== 0) return priorityDiff;
              return new Date(a.date) - new Date(b.date);
            })
            .slice(0, 3);
          
          if (upcomingItems.length === 0) return null;
          
          return (
            <div className="mt-8">
              <div className={`p-6 rounded-xl border transition-all duration-300 shadow-md hover:shadow-lg ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className={`text-xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>Ajanda Özeti</h3>
                </div>
                
                <div className="space-y-3">
                  {upcomingItems.map(item => (
                    <div key={item.id} className={`p-4 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-[1.01] ${
                      darkMode 
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Tarih İkonu - Yukarıda */}
                          <div className={`p-2 rounded-lg ${
                            darkMode ? 'bg-gray-700/50' : 'bg-gray-200/70'
                          }`}>
                            <HiOutlineCalendar className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            {/* Tarih İkonu, Tarih, Önem Seviyesi - Yan Yana */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                                darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200/70 text-gray-700'
                              }`}>
                                {new Date(item.date).toLocaleDateString('tr-TR', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </div>
                              {item.priority && (
                                <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  item.priority === 'yuksek' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                  item.priority === 'orta' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                  {item.priority === 'yuksek' ? 'Yüksek' : item.priority === 'orta' ? 'Orta' : 'Düşük'}
                                </div>
                              )}
                            </div>
                            <p className={`font-semibold transition-colors duration-200 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.title}
                            </p>
                            {item.description && (
                              <p className={`text-sm mt-1 transition-colors duration-200 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setAgendaModalItem(item)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            darkMode 
                              ? 'bg-gray-600 text-gray-200 hover:bg-gray-500 border border-gray-500' 
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300'
                          }`}
                          title="Detayları görüntüle"
                        >
                          <HiOutlineEye className="w-4 h-4 inline mr-1" />
                          Görüntüle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Analiz Grafikleri - Ayrı Kartlar */}
        <div className="mt-8">
          <div className="mb-6">
            <h3 className={`text-xl font-bold transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Analiz Grafikleri</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gelir Grafiği - Ayrı Kart */}
            <div className={`p-6 rounded-xl border shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:from-gray-700 hover:to-gray-800' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200'
            }`}>
              {/* Icon on left with text on right, centered layout */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  <HiOutlineTrendingUp className="w-5 h-5" />
                </div>
                <h4 className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Gelir Dağılımı</h4>
              </div>
              <PieChart 
                data={incomeChartData} 
                title=""
                size={250}
                colorType="income"
              />
            </div>
            
            {/* Gider Grafiği - Ayrı Kart */}
            <div className={`p-6 rounded-xl border shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:from-gray-700 hover:to-gray-800' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200'
            }`}>
              {/* Icon on left with text on right, centered layout */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <HiOutlineTrendingDown className="w-5 h-5" />
                </div>
                <h4 className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Gider Dağılımı</h4>
              </div>
              <PieChart 
                data={expenseChartData} 
                title=""
                size={250}
                colorType="expense"
              />
            </div>
            
            {/* Vergi Grafiği - Ayrı Kart */}
            <div className={`p-6 rounded-xl border shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:from-gray-700 hover:to-gray-800' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200'
            }`}>
              {/* Icon on left with text on right, centered layout */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  <HiOutlineReceiptTax className="w-5 h-5" />
                </div>
                <h4 className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Vergi Dağılımı</h4>
              </div>
              <PieChart 
                data={taxChartData} 
                title=""
                size={250}
                colorType="tax"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Header */}
      <header className={`shadow-md border-b transition-colors duration-200 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-850 border-gray-700' : 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300'}`}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Düzenlenebilir Başlık - Sol taraf */}
            <div className="flex items-center">
              {isEditingTitle ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={appTitle}
                    onChange={(e) => setAppTitle(e.target.value)}
                    className={`text-2xl font-bold border-b-2 border-blue-500 bg-transparent focus:outline-none transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateTitle(appTitle);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => updateTitle(appTitle)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${ 
                      darkMode 
                        ? 'bg-green-600 hover:bg-green-500 text-white' 
                        : 'bg-green-100 hover:bg-green-200 text-green-800'
                    }`}
                    title="Kaydet"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => {
                      setAppTitle(localStorage.getItem('appTitle') || 'Freelancer Finans Takip');
                      setIsEditingTitle(false);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      darkMode 
                        ? 'bg-red-600 hover:bg-red-500 text-white' 
                        : 'bg-red-100 hover:bg-red-200 text-red-800'
                    }`}
                    title="İptal"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <h1 
                  onClick={() => setIsEditingTitle(true)}
                  className={`text-2xl font-bold cursor-pointer hover:opacity-70 transition-opacity duration-200 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  title="Başlığı düzenlemek için tıklayın"
                >
                  {appTitle}
                </h1>
              )}
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center gap-3">
              
              {/* Online/Offline Status - Modern */}
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  isOnline 
                    ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                    : 'bg-red-500 shadow-lg shadow-red-500/50'
                }`}
                title={isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
              />

              {/* Modern Profile Button with Dropdown */}
              <div className="relative profile-dropdown-container">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {currentProfile}
                  </span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${
                    showProfileDropdown ? 'rotate-180' : ''
                  } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Profile Dropdown Menu */}
                {showProfileDropdown && (
                  <div className={`fixed right-4 top-16 w-56 rounded-lg border shadow-xl z-[99999] ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    {/* Profile Management - Top Section */}
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setShowProfileForm(true);
                            setShowProfileDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            darkMode 
                              ? 'hover:bg-gray-700 text-gray-300' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Yeni Profil Ekle
                        </button>
                        {currentProfile !== 'DEMO' && (
                          <button
                            onClick={() => {
                              deleteProfile(currentProfile);
                              setShowProfileDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-red-400' 
                                : 'hover:bg-gray-100 text-red-600'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Profili Sil
                          </button>
                        )}
                        <button
                          onClick={() => {
                            clearCurrentProfile();
                            setShowProfileDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            darkMode 
                              ? 'hover:bg-gray-700 text-gray-300' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          Profili Sıfırla
                        </button>
                      </div>
                    </div>

                    {/* Profile Selection */}
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <label className={`block text-xs font-medium mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Profil Seçin</label>
                      <select
                        value={currentProfile}
                        onChange={(e) => {
                          setCurrentProfile(e.target.value);
                          localStorage.setItem('currentProfile', e.target.value);
                        }}
                        className={`w-full px-3 py-2 rounded-md border text-sm ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-gray-200' 
                            : 'bg-gray-50 border-gray-300 text-gray-700'
                        }`}
                      >
                        {profiles.map(profile => (
                          <option key={profile} value={profile}>{profile}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Import/Export Section - Bottom */}
                    <div className="p-3">
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            exportProfileToJSON();
                            setShowProfileDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            darkMode 
                              ? 'hover:bg-gray-700 text-gray-300' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Dışa Aktar
                        </button>
                        <label className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                          darkMode 
                            ? 'hover:bg-gray-700 text-gray-300' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 11-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          İçe Aktar
                          <input
                            type="file"
                            accept=".json"
                            onChange={(e) => {
                              importProfileFromJSON(e);
                              setShowProfileDropdown(false);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Website Link - Modern Business Icon */}
              <a 
                href="https://www.huseyinkaya.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
                title="www.huseyinkaya.co"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6zm2 2v4h2V8H6zm4 0v4h2V8h-2z"/>
                </svg>
              </a>
              
              {/* Dark Mode Toggle - Improved Background Alignment */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={darkMode ? 'Açık tema' : 'Koyu tema'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {darkMode ? (
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  ) : (
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offline Warning */}
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-yellow-800">
              <span className="text-lg">⚠️</span>
              <p className="text-sm">
                <strong>Çevrimdışı Modda:</strong> Verileriniz güvenli bir şekilde yerel olarak saklanıyor. 
                İnternet bağlantınız geldiğinde otomatik olarak senkronize edilecek.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - Card Style */}
      <nav className={`transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 'dashboard', label: 'Özet', icon: BarChart3, color: 'blue' },
              { id: 'projects', label: 'Projeler', icon: HiOutlineDocumentReport, color: 'purple' },
              { id: 'income', label: 'Gelirler', icon: HiOutlineTrendingUp, color: 'green' },
              { id: 'expenses', label: 'Giderler', icon: HiOutlineCreditCard, color: 'red' },
              { id: 'taxes', label: 'Vergiler', icon: HiOutlineReceiptTax, color: 'orange' },
              { id: 'agenda', label: 'Ajanda', icon: HiOutlineCalendar, color: 'indigo' }
            ].map((tab) => {
              const getIconBgColor = (color, isActive) => {
                if (!isActive) {
                  return darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200/70 text-gray-600';
                }
                
                const colorMap = {
                  'blue': darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600',
                  'purple': darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600',
                  'green': darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600',
                  'red': darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600',
                  'orange': darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600',
                  'indigo': darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                };
                
                return colorMap[color] || (darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200/70 text-gray-600');
              };
              
              return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  activeTab === tab.id
                    ? darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-xl' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200 shadow-xl'
                    : darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:from-gray-700 hover:to-gray-800'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:shadow-md'
                }`}
              >
                {/* Icon at top with colored background */}
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-xl ${getIconBgColor(tab.color, activeTab === tab.id)}`}>
                    {tab.id === 'dashboard' ? (
                      <tab.icon size={24} strokeWidth={2} />
                    ) : (
                      <tab.icon className="w-6 h-6" />
                    )}
                  </div>
                  
                  {/* Label at bottom */}
                  <p className={`text-sm font-medium ${
                    activeTab === tab.id
                      ? darkMode ? 'text-white' : 'text-gray-900'
                      : darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {tab.label}
                  </p>
                  
                  {/* Active indicator - Color matched to tab */}
                  {activeTab === tab.id && (
                    <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full ${
                      tab.color === 'blue' ? (darkMode ? 'bg-blue-400' : 'bg-blue-600') :
                      tab.color === 'purple' ? (darkMode ? 'bg-purple-400' : 'bg-purple-600') :
                      tab.color === 'green' ? (darkMode ? 'bg-green-400' : 'bg-green-600') :
                      tab.color === 'red' ? (darkMode ? 'bg-red-400' : 'bg-red-600') :
                      tab.color === 'orange' ? (darkMode ? 'bg-orange-400' : 'bg-orange-600') :
                      tab.color === 'indigo' ? (darkMode ? 'bg-indigo-400' : 'bg-indigo-600') :
                      (darkMode ? 'bg-gray-400' : 'bg-gray-600')
                    }`} />
                  )}
                </div>
              </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Original Navigation (kept for revert option) - COMMENTED OUT */}
      {/* <nav className={`border-b transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Özet', icon: HiOutlineChartBar },
              { id: 'projects', label: 'Projeler', icon: HiOutlineDocumentReport },
              { id: 'income', label: 'Gelirler', icon: HiOutlineTrendingUp },
              { id: 'expenses', label: 'Giderler', icon: HiOutlineCreditCard },
              { id: 'taxes', label: 'Vergiler', icon: HiOutlineReceiptTax },
              { id: 'agenda', label: 'Ajanda', icon: HiOutlineCalendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 py-4 px-4 border-b-2 font-medium text-sm transition-all duration-300 rounded-t-lg ${
                  activeTab === tab.id
                    ? darkMode 
                      ? 'border-blue-400 text-blue-400 bg-blue-500/10' 
                      : 'border-blue-500 text-blue-600 bg-blue-50'
                    : darkMode 
                      ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500 hover:bg-gray-700/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav> */}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-3">
        {/* Profil Formu */}
        {showProfileForm && (
          <div className={`mb-6 p-6 rounded-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <ProfileForm />
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard />}
        
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Projeler</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Dönem Filtresi */}
                <PeriodFilter 
                  filter={projectsFilter} 
                  setFilter={setProjectsFilter} 
                  label="Dönem" 
                  colorVariant="default"
                />
                <StandardButton
                  onClick={() => setShowForm('project')}
                  variant="primary"
                  className="h-10"
                >
                  Proje Ekle
                </StandardButton>
              </div>
            </div>
            
            {(showForm === 'project' || (editItem && editItem.type === 'project')) && (
              <div className={`p-6 rounded-xl border transition-all duration-300 shadow-lg ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <ProjectForm project={editItem?.data} />
              </div>
            )}
            
            {/* Projeler Gruplandırılmış Gösterim */}
            {(() => {
              const filteredProjects = filterDataByPeriod(projects, 'start_date', projectsFilter);
              const groupedProjects = filteredProjects.reduce((acc, project) => {
                if (!acc[project.status]) {
                  acc[project.status] = [];
                }
                acc[project.status].push(project);
                return acc;
              }, {});

              const statusLabels = {
                'teklif-iletildi': 'Teklif İletildi',
                'devam-ediyor': 'Devam Ediyor',
                'revizyonda': 'Revizyonda',
                'tamamlandi': 'Tamamlandı',
                'iptal-edildi': 'İptal Edildi'
              };

              const statusColors = {
                'teklif-iletildi': darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gray-50 border-gray-200',
                'devam-ediyor': darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gray-50 border-gray-200',
                'revizyonda': darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gray-50 border-gray-200',
                'tamamlandi': darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gray-50 border-gray-200',
                'iptal-edildi': darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
              };

              return Object.entries(groupedProjects).map(([status, statusProjects]) => (
                <div key={status} className={`p-6 rounded-xl border transition-all duration-300 shadow-md hover:shadow-lg ${statusColors[status] || (darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200')}`}>
                  <h3 className="text-lg font-semibold mb-4">
                    {statusLabels[status] || status} ({statusProjects.length})
                  </h3>
                  <div className="grid gap-4">
                    {statusProjects
                      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                      .map(project => (
                      <div key={project.id} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                        darkMode 
                          ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/60 border-gray-700/50 shadow-gray-900/20' 
                          : 'bg-gradient-to-br from-white/95 to-gray-50/60 border-gray-200/50 shadow-gray-100/50 hover:shadow-lg'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            {/* Date - Compact format */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded-md font-medium transition-colors duration-200 ${
                                darkMode 
                                  ? 'bg-gray-700/50 text-gray-300' 
                                  : 'bg-gray-200/70 text-gray-700'
                              }`}>
                                Başlangıç: {new Date(project.start_date).toLocaleDateString('tr-TR', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </span>
                              {project.end_date && (
                                <span className={`text-xs px-2 py-1 rounded-md font-medium transition-colors duration-200 ${
                                  darkMode 
                                    ? 'bg-gray-700/50 text-gray-300' 
                                    : 'bg-gray-200/70 text-gray-700'
                                }`}>
                                  Bitiş: {new Date(project.end_date).toLocaleDateString('tr-TR', { 
                                    day: '2-digit', 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </span>
                              )}
                            </div>
                            <h4 className="text-lg font-semibold mb-1">{project.name}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
                          </div>
                          
                          {/* Price and Actions - Better Structure */}
                          <div className="flex flex-col items-end gap-3">
                            {/* Price Section - Professional formatting */}
                            <div className="text-right">
                              <p className={`text-2xl font-bold mb-1 transition-colors duration-200 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                ₺{project.price?.toLocaleString('tr-TR') || '0'}
                              </p>
                              <p className="text-xs text-gray-500 font-medium">Proje Değeri</p>
                            </div>
                            
                            {/* Action Buttons - Modern System Compatible */}
                            <EditDeleteButtons 
                              onEdit={() => setEditItem({ type: 'project', data: project })}
                              onDelete={() => deleteProject(project.id)}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
        
        {activeTab === 'income' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Gelirler</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Dönem Filtresi */}
                <PeriodFilter 
                  filter={incomesFilter} 
                  setFilter={setIncomesFilter} 
                  label="Dönem" 
                  colorVariant="default"
                />
                <StandardButton
                  onClick={() => setShowForm('income')}
                  variant="primary"
                  className="h-10"
                >
                  Gelir Ekle
                </StandardButton>
              </div>
            </div>
            
            {(showForm === 'income' || (editItem && editItem.type === 'income')) && (
              <div className={`p-6 rounded-xl border transition-all duration-300 shadow-lg ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <IncomeForm income={editItem?.data} />
              </div>
            )}
            
            <div className="grid gap-4">
              {filterDataByPeriod(incomes, 'income_date', incomesFilter)
                .sort((a, b) => new Date(b.income_date) - new Date(a.income_date))
                .map(income => {
                const relatedProject = projects.find(p => p.id === income.project_id);
                return (
                  <div key={income.id} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/60 border-gray-700/50 shadow-gray-900/20' 
                      : 'bg-gradient-to-br from-white/95 to-gray-50/60 border-gray-200/50 shadow-gray-100/50 hover:shadow-lg'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        {/* Date - Compact format */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-md font-medium transition-colors duration-200 ${
                            darkMode 
                              ? 'bg-gray-700/50 text-gray-300' 
                              : 'bg-gray-200/70 text-gray-700'
                          }`}>
                            {new Date(income.income_date).toLocaleDateString('tr-TR', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <h3 className={`text-lg font-semibold mb-1 transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {income.brand || 'Belirsiz Marka'}
                        </h3>
                        
                        {relatedProject && (
                          <p className={`text-sm font-medium mb-1 transition-colors duration-200 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Proje: {relatedProject.name}
                          </p>
                        )}
                        
                        <p className={`text-sm leading-relaxed mb-2 transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {income.description}
                        </p>
                        
                        {/* Tax Info - Compact */}
                        <div className={`text-xs flex gap-4 transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <span>Vergi: ₺{income.tax_amount?.toLocaleString('tr-TR') || '0'}</span>
                          <span>Net: ₺{income.net_amount?.toLocaleString('tr-TR') || income.amount?.toLocaleString('tr-TR')}</span>
                        </div>
                      </div>
                      
                      {/* Price and Actions - Better Structure */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Price Section - Professional formatting */}
                        <div className="text-right">
                          <p className={`text-2xl font-bold mb-1 transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            ₺{income.amount.toLocaleString('tr-TR')}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">Brüt Gelir</p>
                        </div>
                        
                        {/* Action Buttons - Modern System Compatible */}
                        <EditDeleteButtons 
                          onEdit={() => setEditItem({ type: 'income', data: income })}
                          onDelete={() => deleteIncome(income.id)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            {/* Giderler Ana Başlık */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Giderler</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Dönem Filtresi */}
                  <PeriodFilter 
                    filter={expensesFilter} 
                    setFilter={setExpensesFilter} 
                    label="Dönem" 
                    colorVariant="default"
                  />
                  <StandardButton
                    onClick={() => setShowForm('expense')}
                    variant="primary"
                    className="h-10"
                  >
                    Gider Ekle
                  </StandardButton>
                </div>
              </div>
              
              {/* Normal Giderler Bölümü - İlk sıra */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Harici Giderler
                    </h3>
                  </div>
                </div>
                
                {(showForm === 'expense' || (editItem && editItem.type === 'expense')) && (
                  <div className={`p-6 rounded-xl border transition-all duration-300 shadow-lg ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                  }`}>
                    <ExpenseForm expense={editItem?.data} />
                  </div>
                )}
                
                <div className="grid gap-4">
                {filterDataByPeriod(expenses, 'expense_date', expensesFilter)
                  .sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date))
                  .map(expense => {
                  const categories = {
                    'ofis-giderleri': 'Ofis Giderleri',
                    'donanim': 'Donanım',
                    'pazarlama': 'Pazarlama',
                    'ulasim': 'Ulaşım',
                    'egitim': 'Eğitim',
                    'proje-bazli': 'Proje Bazlı Harcamalar',
                    'yemek': 'Yemek',
                    'diger': 'Diğer'
                  };
                  
                  return (
                    <div key={expense.id} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                      darkMode 
                        ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/60 border-gray-700/50 shadow-gray-900/20' 
                        : 'bg-gradient-to-br from-white/95 to-gray-50/60 border-gray-200/50 shadow-gray-100/50 hover:shadow-lg'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                          {/* Date - Compact format */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-md font-medium transition-colors duration-200 ${
                              darkMode 
                                ? 'bg-gray-700/50 text-gray-300' 
                                : 'bg-gray-200/70 text-gray-700'
                            }`}>
                              {new Date(expense.expense_date).toLocaleDateString('tr-TR', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>
                          
                          <h3 className={`text-lg font-semibold mb-1 transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {categories[expense.category] || expense.category}
                          </h3>
                          
                          <p className={`text-sm leading-relaxed transition-colors duration-200 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {expense.description || 'Açıklama yok'}
                          </p>
                        </div>
                        
                        {/* Price and Actions - Better Structure */}
                        <div className="flex flex-col items-end gap-3">
                          {/* Price Section - Professional formatting */}
                          <div className="text-right">
                            <p className={`text-2xl font-bold mb-1 transition-colors duration-200 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              ₺{expense.amount.toLocaleString('tr-TR')}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">Gider Tutarı</p>
                          </div>
                          
                          {/* Action Buttons - Modern System Compatible */}
                          <EditDeleteButtons 
                            onEdit={() => setEditItem({ type: 'expense', data: expense })}
                            onDelete={() => deleteExpense(expense.id)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            
              {/* Abonelikler Bölümü - İkinci sıra */}
              <div className="space-y-6 mt-8 pt-8 border-t border-dashed">
                <div>
                  <h3 className={`text-lg font-semibold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Abonelikler
                  </h3>
                </div>
                
                {/* Abonelik Kategori Butonları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'tasarim', label: 'Tasarım', icon: Palette },
                    { key: 'yazilim', label: 'Yazılım', icon: Code },
                    { key: 'pazarlama', label: 'Pazarlama', icon: LucideTrendingUp },
                    { key: 'eglence-icerik', label: 'Eğlence & İçerik', icon: Film },
                    { key: 'yapay-zeka', label: 'Yapay Zeka', icon: Brain },
                    { key: 'eklenti', label: 'Eklenti', icon: Puzzle }
                  ].map(category => {
                    // Mevcut döneme ait abonelikleri filtrele
                    const currentPeriod = `${dashboardFilter.year}-${String(dashboardFilter.month + 1).padStart(2, '0')}`;
                    const categorySubscriptions = subscriptions.filter(subscription => 
                      subscription.category === category.key && subscription.period === currentPeriod
                    );
                    
                    return (
                      <div key={category.key} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                        darkMode 
                          ? 'bg-gradient-to-br from-gray-800/90 to-slate-800/60 border-gray-700/50 shadow-gray-900/20' 
                          : 'bg-gradient-to-br from-white/95 to-slate-50/80 border-slate-200/50 shadow-slate-100/50 hover:shadow-md'
                      }`}>
                        <div className="text-center mb-3">
                          <div className={`p-2 rounded-lg mx-auto w-fit mb-1 ${
                            darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200/70 text-gray-600'
                          }`}>
                            <category.icon size={20} strokeWidth={2} />
                          </div>
                          <h4 className={`text-sm font-medium transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>{category.label}</h4>
                        </div>
                        
                        {/* Mevcut Abonelikler */}
                        <div className="space-y-2 mb-3">
                          {categorySubscriptions.map((subscription, index) => (
                            <div key={subscription.id} className={`p-2 rounded text-xs transition-colors duration-200 ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-50 text-gray-700'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{subscription.subcategoryLabel || subscription.description}</div>
                                  <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>₺{subscription.amount.toLocaleString('tr-TR')}</div>
                                </div>
                                <button
                                  onClick={() => deleteSubscription(subscription.id)}
                                  className={`
                                    inline-flex items-center justify-center w-6 h-6 rounded-md transition-all duration-200 
                                    hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1
                                    ${darkMode 
                                      ? 'bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-700/50 text-gray-300 hover:text-red-300 focus:ring-red-600' 
                                      : 'bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 shadow-sm hover:shadow-md focus:ring-red-300'
                                    }
                                  `}
                                  title="Sil"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Yeni Abonelik Ekleme */}
                        <button
                          onClick={() => setShowForm(`subscription-${category.key}`)}
                          className={`w-full py-2 px-3 text-xs rounded border-2 border-dashed transition-colors duration-200 ${
                            darkMode 
                              ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                              : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                          }`}
                        >
                          + Abonelik Ekle
                        </button>
                        
                        {/* Form */}
                        {showForm === `subscription-${category.key}` && (
                          <div className="mt-3 pt-3 border-t">
                            <SubscriptionForm 
                              category={category.key}
                              categoryLabel={category.label}
                              onClose={() => setShowForm(null)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Sabit Giderler Bölümü - Üçüncü sıra */}
              <div className="space-y-6 mt-8 pt-8 border-t border-dashed">
                <div>
                  <h3 className={`text-lg font-semibold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Sabit Giderler
                  </h3>
                </div>
                
                {/* Sabit Gider Kategori Butonları - 4'erli 2 satır - İstenen sıralama */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { key: 'internet', label: 'İnternet', icon: Wifi },
                    { key: 'telefon', label: 'Telefon', icon: Smartphone },
                    { key: 'muhasebe', label: 'Muhasebe', icon: Calculator },
                    { key: 'kira', label: 'Kira', icon: Home },
                    { key: 'elektrik', label: 'Elektrik', icon: Zap },
                    { key: 'su', label: 'Su', icon: Droplet },
                    { key: 'dogalgaz', label: 'Doğalgaz', icon: Flame },
                    { key: 'aidat', label: 'Aidat', icon: Building }
                  ].map(category => {
                  // Mevcut döneme ait düzenli giderleri filtrele
                  const currentPeriod = `${dashboardFilter.year}-${String(dashboardFilter.month + 1).padStart(2, '0')}`;
                  const categoryExpenses = regularExpenses.filter(expense => 
                    expense.category === category.key && expense.period === currentPeriod
                  );
                  
                  return (
                    <div key={category.key} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                      darkMode 
                        ? 'bg-gradient-to-br from-gray-800/90 to-slate-800/60 border-gray-700/50 shadow-gray-900/20' 
                        : 'bg-gradient-to-br from-white/95 to-slate-50/80 border-slate-200/50 shadow-slate-100/50 hover:shadow-md'
                    }`}>
                      <div className="text-center mb-3">
                        <div className={`p-2 rounded-lg mx-auto w-fit mb-1 ${
                          darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200/70 text-gray-600'
                        }`}>
                          <category.icon size={20} strokeWidth={2} />
                        </div>
                        <h4 className={`text-sm font-medium transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{category.label}</h4>
                      </div>
                      
                      {/* Mevcut Giderler */}
                      <div className="space-y-2 mb-3">
                        {categoryExpenses.map((expense, index) => (
                          <div key={expense.id} className={`flex items-center justify-between p-2 rounded text-xs transition-colors duration-200 ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-50 text-gray-700'
                          }`}>
                            <div className="flex items-center justify-between w-full">
                              <div className="font-medium">₺{expense.amount.toLocaleString('tr-TR')}</div>
                              <button
                                onClick={() => deleteRegularExpense(expense.id)}
                                className={`
                                  inline-flex items-center justify-center w-6 h-6 rounded-md transition-all duration-200 
                                  hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1
                                  ${darkMode 
                                    ? 'bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-700/50 text-gray-300 hover:text-red-300 focus:ring-red-600' 
                                    : 'bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 shadow-sm hover:shadow-md focus:ring-red-300'
                                  }
                                `}
                                title="Sil"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Yeni Gider Ekleme */}
                      <button
                        onClick={() => setShowForm(`regular-${category.key}`)}
                        className={`w-full py-2 px-3 text-xs rounded border-2 border-dashed transition-colors duration-200 ${
                          darkMode 
                            ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300' 
                            : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                        }`}
                      >
                        + Ekle
                      </button>
                      
                      {/* Form */}
                      {showForm === `regular-${category.key}` && (
                        <div className="mt-3 pt-3 border-t">
                          <RegularExpenseForm 
                            category={category.key}
                            categoryLabel={category.label}
                            onClose={() => setShowForm(null)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'taxes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className={`text-2xl font-bold transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Vergi Yönetimi</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Dönem Filtresi */}
                <PeriodFilter 
                  filter={taxesFilter} 
                  setFilter={setTaxesFilter} 
                  label="Dönem" 
                  colorVariant="default"
                />
                <StandardButton
                  onClick={() => setShowForm('tax')}
                  variant="primary"
                  className="h-10"
                >
                  Ödeme Ekle
                </StandardButton>
              </div>
            </div>
            
            {(showForm === 'tax' || (editItem && editItem.type === 'tax')) && (
              <div className={`p-6 rounded-xl border transition-all duration-300 shadow-lg ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <TaxPaymentForm taxPayment={editItem?.data} />
              </div>
            )}
            
            {/* Vergi Ödemeleri - Üstte */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Vergi Ödemeleri</h3>
              <div className="grid gap-4">
                {filterDataByPeriod(taxPayments, 'payment_date', taxesFilter)
                  .filter(payment => !payment.description || !payment.description.includes('Otomatik KDV'))
                  .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))
                  .map(payment => (
                  <div key={payment.id} className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/60 border-gray-700/50 shadow-gray-900/20' 
                      : 'bg-gradient-to-br from-white/95 to-gray-50/60 border-gray-200/50 shadow-gray-100/50 hover:shadow-lg'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        {/* Date - Compact format */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-md font-medium transition-colors duration-200 ${
                            darkMode 
                              ? 'bg-gray-700/50 text-gray-300' 
                              : 'bg-gray-200/70 text-gray-700'
                          }`}>
                            {new Date(payment.payment_date).toLocaleDateString('tr-TR', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <h3 className={`text-lg font-semibold mb-1 transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {payment.type || 'Vergi Ödemesi'}
                        </h3>
                        
                        {payment.description && (
                          <p className={`text-sm leading-relaxed mb-2 transition-colors duration-200 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {payment.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Price and Actions - Better Structure */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Price Section - Professional formatting */}
                        <div className="text-right">
                          <p className={`text-2xl font-bold mb-1 transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            ₺{payment.amount.toLocaleString('tr-TR')}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">Vergi Ödemesi</p>
                        </div>
                        
                        {/* Action Buttons - Modern System Compatible */}
                        <EditDeleteButtons 
                          onEdit={() => setEditItem({ type: 'tax', data: payment })}
                          onDelete={() => deleteTaxPayment(payment.id)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* KDV Bilgileri - Gelirlerden - Altta */}
            {(() => {
              const filteredIncomes = filterDataByPeriod(incomes, 'income_date', taxesFilter);
              const vatIncomes = filteredIncomes.filter(income => income.tax_amount && income.tax_amount > 0);
              
              if (vatIncomes.length > 0) {
                return (
                  <div 
                    key={`vat-section-${vatIncomes.length}-${vatIncomes.map(i => i.id).join('-')}`}
                    className={`p-4 rounded-lg border transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-800/50 border-gray-700' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                    <h3 className={`text-base font-semibold mb-3 transition-colors duration-200 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>KDV (Gelir)</h3>
                    <div className="space-y-2">
                      {vatIncomes.map(income => (
                        <div key={income.id} className={`p-3 rounded border transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-700/30 border-gray-600' 
                            : 'bg-white border-gray-200'
                        }`}>
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full transition-colors duration-200 ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-200' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  📅 {income.income_date}
                                </span>
                              </div>
                              <p className={`text-sm font-semibold transition-colors duration-200 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {income.brand || 'Belirsiz Marka'}
                              </p>
                              <p className={`text-xs transition-colors duration-200 ${
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {income.description}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className={`text-base font-bold transition-colors duration-200 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                ₺{income.tax_amount.toLocaleString('tr-TR')}
                              </p>
                              <p className={`text-xs transition-colors duration-200 ${
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                %{((income.vat_rate || 0.18) * 100).toFixed(0)} KDV
                              </p>
                              <p className={`text-xs transition-colors duration-200 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                (₺{income.amount.toLocaleString('tr-TR')})
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className={`flex justify-between items-center p-2 rounded transition-colors duration-200 ${
                          darkMode 
                            ? 'bg-gray-700/30 text-gray-200' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <span className="text-sm font-semibold">Toplam KDV:</span>
                          <span className="text-lg font-bold">
                            ₺{vatIncomes.reduce((sum, income) => sum + (income.tax_amount || 0), 0).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
        
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Ajanda
              </h2>
              <StandardButton
                onClick={() => setShowForm('agenda')}
                variant="primary"
                className="h-10"
              >
                Not Ekle
              </StandardButton>
            </div>
            
            {(showForm === 'agenda' || (editItem && editItem.type === 'agenda')) && (
              <div className={`p-6 rounded-xl border shadow-lg ${
                darkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <AgendaForm agendaItem={editItem?.data} />
              </div>
            )}
            
            <div className="grid gap-4">
              {agenda.length === 0 ? (
                <div className={`text-center py-12 rounded-lg border-2 border-dashed ${
                  darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
                }`}>
                  <p className="text-xl font-medium mb-2">Henüz ajanda notu yok</p>
                  <p>İlk notunuzu eklemek için "Not Ekle" butonuna tıklayın</p>
                </div>
              ) : (
                agenda
                  .sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    const today = new Date().setHours(0,0,0,0);
                    
                    const isPastA = dateA < today;
                    const isPastB = dateB < today;
                    
                    // Önce gelecek/bugün notları, sonra geçmiş notları
                    if (isPastA && !isPastB) return 1;
                    if (!isPastA && isPastB) return -1;
                    
                    // Aynı kategorideyse tarihe göre sırala
                    return dateA - dateB;
                  })
                  .map(item => {
                    const isToday = item.date === new Date().toISOString().split('T')[0];
                    const isPast = new Date(item.date) < new Date().setHours(0,0,0,0);
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                          darkMode 
                            ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/60 border-gray-700/50 shadow-gray-900/20' 
                            : 'bg-gradient-to-br from-white/95 to-gray-50/60 border-gray-200/50 shadow-gray-100/50 hover:shadow-lg'
                        } ${isToday ? (darkMode ? 'ring-2 ring-gray-600' : 'ring-2 ring-gray-400') : ''} ${isPast ? 'opacity-60' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                                darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-200/70 text-gray-700'
                              }`}>
                                {new Date(item.date).toLocaleDateString('tr-TR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                              {isToday && (
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                                }`}>
                                  Bugün
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                item.priority === 'yuksek' ? (darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-700') :
                                item.priority === 'orta' ? (darkMode ? 'bg-yellow-900/50 text-yellow-200' : 'bg-yellow-100 text-yellow-700') :
                                (darkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-100 text-green-700')
                              }`}>
                                {item.priority === 'yuksek' ? 'Yüksek' : item.priority === 'orta' ? 'Orta' : 'Düşük'}
                              </span>
                            </div>
                            
                            <h3 className={`text-lg font-semibold mb-1 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.title}
                            </h3>
                            
                            {item.note && (
                              <p className={`text-sm leading-relaxed ${
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {item.note}
                              </p>
                            )}
                          </div>
                          
                          <EditDeleteButtons 
                            onEdit={() => setEditItem({ type: 'agenda', data: item })}
                            onDelete={() => deleteAgendaItem(item.id)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Ajanda Modal */}
      {agendaModalItem && (
        <AgendaModal 
          item={agendaModalItem} 
          onClose={() => setAgendaModalItem(null)} 
        />
      )}
    </div>
  );
};

export default App;