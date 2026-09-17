# راهنمای Deploy به GitHub Pages

## ✅ تنظیمات انجام شده

### 1. فایل `vite.config.js`
- `base: '/zaban/'` اضافه شده است
- این تنظیم مسیرهای assets را برای GitHub Pages اصلاح می‌کند

### 2. فایل `.github/workflows/deploy.yml`
- GitHub Actions workflow برای deploy خودکار ایجاد شده است
- با هر push به branch `main`، سایت به صورت خودکار deploy می‌شود

## 🚀 مراحل Deploy

### روش 1: Deploy خودکار (توصیه شده)

1. **فعال کردن GitHub Pages در Repository:**
   - به Settings → Pages بروید
   - در بخش "Source"، گزینه "GitHub Actions" را انتخاب کنید

2. **Push کردن تغییرات:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

3. **بررسی Status:**
   - به تب "Actions" در GitHub بروید
   - workflow "Deploy to GitHub Pages" را مشاهده کنید
   - پس از موفقیت، سایت در آدرس زیر در دسترس خواهد بود:
   ```
   https://aryouhub.github.io/zaban/
   ```

### روش 2: Deploy دستی

1. **Build پروژه:**
   ```bash
   npm run build
   ```

2. **Deploy با gh-pages:**
   ```bash
   npm install -D gh-pages
   npx gh-pages -d dist
   ```

## 🔧 تنظیمات Repository

### 1. Repository Settings
- به Settings → General بروید
- در بخش "Features"، گزینه "Pages" را فعال کنید

### 2. Branch Protection (اختیاری)
- به Settings → Branches بروید
- Branch protection rules را برای `main` تنظیم کنید

## 📝 نکات مهم

1. **نام Repository:**
   - URL سایت بر اساس نام repository ساخته می‌شود
   - `https://aryouhub.github.io/zaban/`

2. **Base Path:**
   - در `vite.config.js` باید `base: '/zaban/'` باشد
   - این تنظیم مسیرهای assets را اصلاح می‌کند

3. **Custom Domain (اختیاری):**
   - می‌توانید دامنه شخصی را به GitHub Pages متصل کنید
   - فایل `CNAME` را در پوشه `public` ایجاد کنید

4. **HTTPS:**
   - GitHub Pages به صورت خودکار HTTPS را فعال می‌کند
   - Enforce HTTPS را در Settings → Pages فعال کنید

## 🐛 عیب‌یابی

### مشکل: صفحه سفید یا 404
- **علت:** Base path اشتباه است
- **راه حل:** بررسی کنید `base: '/zaban/'` در `vite.config.js` تنظیم شده باشد

### مشکل: Assets لود نمی‌شوند
- **علت:** مسیرهای نسبی اشتباه هستند
- **راه حل:** Build را مجدد اجرا کنید: `npm run build`

### مشکل: Workflow اجرا نمی‌شود
- **علت:** GitHub Actions غیرفعال است
- **راه حل:** در Settings → Actions → General، گزینه "Allow all actions" را فعال کنید

## 📊 بررسی Status

1. **GitHub Actions:**
   - تب Actions → آخرین workflow run
   - بررسی کنید همه steps موفق بوده‌اند

2. **GitHub Pages:**
   - Settings → Pages
   - بررسی کنید سایت deploy شده است

3. **URL سایت:**
   ```
   https://aryouhub.github.io/zaban/
   ```

## 🎉 موفقیت!

پس از deploy موفق، سایت شما در آدرس زیر در دسترس خواهد بود:
```
https://aryouhub.github.io/zaban/
```

## 📚 منابع بیشتر

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Static Deploy](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions](https://docs.github.com/en/actions)
