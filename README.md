# Basic WebApp

🚀 A simple Node.js and Express-based web app that shows the visitor's IP address, browser details, and includes a little surprise... 😉

## 🔧 Features

- Displays visitor's:
  - IP address
  - User-Agent (browser and OS info)
- Styled with modern fonts and dark mode
- Includes a fun **Rick Roll Easter Egg**
- Supports Cloudflare Tunnel to expose the app over the internet
- Deployable with Jenkins CI/CD pipeline

## 📦 Installation

```bash
git clone https://github.com/omkardamame/basic-webapp.git
cd basic-webapp
npm install
node app.js
```

The app will run at: http://localhost:3000

## 🌐 Expose to Internet

Use Cloudflare Tunnel to make your local server publicly available.

```bash
cloudflared tunnel --url http://localhost:3000
```

Then configure your DNS to use the public URL.

---

🤖 Jenkins CI/CD (Optional)
This project can be deployed using Jenkins. Basic CI/CD flow:

- Push to GitHub triggers Jenkins
- Jenkins pulls latest code
- Builds and restarts the app

---

🙃 Rick Roll Disclaimer
Yes, you’ll be rickrolled. Enjoy 🎶

---

🧾 License

This project is licensed under the [MIT License](LICENSE).
