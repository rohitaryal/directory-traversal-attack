# 📁 Directory Traversal Attack 
Proof of concept for directory traversal attack in KIIT evaluation page.

I am using cloudflare workers here because 
- Ease of keeping up and running
- It doesn't seem to hit cloudflare bot protection captcha
- Image fetching speed is very fast since workers fetch them for me

# 🪶 Features
- Fetch evaluated answer sheet for any student
- No it doesn't show any marks

There are more room for improvements like accessing sensitive files, databases, etc but i know very little about how Windows IIS servers work.

# 🔥 Running
```bash
git clone https://github.com/rohitaryal/directory-traversal-attack/
cd directory-traversal-attack
npm install wrangler --save-dev
npm wrangler dev
```
