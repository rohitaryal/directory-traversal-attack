// These are directory under which papers are stored
// They change every in every exam, year so catch up with that
var subjectArr = [
  "CS-30001(DAA)-CS_END_NOV_2024",
  "HS-30101(EE)-CS_END_NOV_2024",
  "CS-30003(CN)-CS_END_NOV_2024",
  "CS-31001(SE)-CS_END_NOV_2024",
  "CS-30009(DOS)-CS_END_NOV_2024",
  "CM-30006(COMPILER)-CS_END_NOV_2024",
];

var headers = {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'accept-language': 'en-GB,en;q=0.8',
  'cache-control': 'no-cache',
  'dnt': '1',
  'pragma': 'no-cache',
  'priority': 'u=0, i',
  'sec-ch-ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'sec-gpc': '1',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'cookie': 'PUT_COOKIE_HERE', // COOKIE GOES HERE AND IS VALID FOR 3 DAYS SINCE RESULT PUBLICATION
}

var responseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

// MAIN PART OF THE CODE
var call = (roll, page, subject) => {
  return `https://evaluation.kiitresults.com/endnov2024stview/cs/GenerateImage.aspx?pgno=..\\..\\..\\${subject}\\EC2R\\${roll}\\${page}|DU|1`
};

// VERY GOOD, INLINE HTML. EXPERIENCED SENEOR DEBELOPAR
var html = () => {
  return `<!DOCTYPE html><html><head> <title>Shortcut</title> <style> * { box-sizing: border-box; outline: none; } input::-webkit-outer-spin-button:not(:nth-child(2)), input::-webkit-inner-spin-button:not(:nth-child(2)) { -webkit-appearance: none; margin: 0; } input[type=number]:not(:nth-child(2)) { -moz-appearance: textfield; } </style></head><body> <input type="number" id="roll-number" placeholder="Roll Number Here"> <br><br> <input type="number" id="page-number" placeholder="Page Number Here"> <br><br> <select name="subject" id="subject"> <option value="1">Design and Analysis of Algorithms</option> <option value="2">Engineering Economics</option> <option value="3">Computer Network</option> <option value="4">Software Engineering</option> <option value="5">Distributed OS</option> <option value="6">Compiler Design</option> </select> <button id="view">View</button> <button id="view-all">View All Pages</button> <br><br><br> <script> let collectedImages = []; let button = document.querySelector("#view"); let roll = document.querySelector("#roll-number"); let page = document.querySelector("#page-number"); let subject = document.querySelector("#subject"); let viewAll = document.querySelector("#view-all"); viewAll.addEventListener("click", () => { collectedImages.forEach(element => { element.remove(); }); collectedImages = []; for (let i = 1; i < 25; i++) { let fetchURI = \`https://empty-dawn-3dbf.erucix.workers.dev?roll=\${roll.value}&subject=\${subject.value}&page=\${i}\`; fetch(fetchURI) .then(data => data.blob()) .then(data => { let urlCreator = window.URL || window.webkitURL; var imgURL = urlCreator.createObjectURL(data); let image = document.createElement("img"); image.src = imgURL; document.body.appendChild(image); collectedImages.push(image); }); } }); button.addEventListener("click", () => { collectedImages.forEach(element => { element.remove(); }); collectedImages = []; let fetchURI = \`https://empty-dawn-3dbf.erucix.workers.dev?roll=\${roll.value}&subject=\${subject.value}&page=\${page.value}\`; fetch(fetchURI) .then(data => data.blob()) .then(data => { let urlCreator = window.URL || window.webkitURL; var imgURL = urlCreator.createObjectURL(data); let image = document.createElement("img"); image.src = imgURL; document.body.appendChild(image); collectedImages.push(image); }); }); </script></body></html>`;
}

export default {
  async fetch(request, env, ctx) {
    let url = new URL(request.url);
    let roll = url.searchParams.get("roll");
    let page = url.searchParams.get("page");
    let subject = url.searchParams.get("subject");

    if(roll == "" || roll == null) {
      return new Response(html(), {
        headers: {
          "Content-Type": "text/html"
        }
      })
    }

    if (roll == null || roll == "") {
      return new Response("What? At least provide a roll number.", {
        headers: responseHeaders,
      });
    }

    if (subject == null || subject == "") {
      return new Response("What? Provide a subject.", {
        headers: responseHeaders,
      });
    }

    if (page == null || page == "") {
      page = "1";
    }

    if (Number(page) < 1 || Number(page) > 999) {
      return new Response(`How come page number ${page} be possible?`, {
        headers: responseHeaders,
      });
    }

    if (Number(page) < 10) {
      page = "00" + page;
    } else if (Number(page) < 100) {
      page = "0" + page;
    }

    subject = subjectArr[Number(subject) - 1];

    let fetchURI = call(roll, page, subject);

    const response = await fetch(fetchURI, {
      headers,
      body: null,
      method: "GET"
    });

    if (response.status != 200) {
      console.log(await response.text());
      return new Response(fetchURI, {
        headers: responseHeaders,
      })
    }

    return new Response(await response.blob(), {
      headers: {
        "Content-Type": "image/jpeg",
        ...responseHeaders
      }
    });
  }
};
