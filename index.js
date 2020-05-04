const fs = require("fs");
const path = require("path");
const util = require("util");
const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse");
const {
  LOGIN_URL,
  TEST_URL,
  EMAIL_ADDRESS,
  PASSWORD,
} = require("./login.config");
const writeFileAsync = util.promisify(fs.writeFile);

const PORT = 8041;
const DIST_PATH = path.resolve(__dirname, "report.html");

const BROWSER_CONFIG = {
  args: [`--remote-debugging-port=${PORT}`],
  headless: false,
  slowMo: 5,
};

const PAGE_CONFIG = {
  width: 1024,
  height: 768,
  isMobile: false,
};

const LIGHTHOUSE_CONFIG = {
  port: PORT,
  disableStorageReset: true,
  emulatedFormFactor: "desktop",
  output: "html",
};

(async () => {
  const browser = await puppeteer.launch(BROWSER_CONFIG);
  const page = await browser.newPage();

  await page.viewport(PAGE_CONFIG);
  await page.goto(LOGIN_URL);
  await page.waitForSelector("form");

  // - - - - - -

  const email = await page.$("#login-username");
  await email.type(EMAIL_ADDRESS);

  const password = await page.$("#login-password");
  await password.type(PASSWORD);

  const submit = await page.$("#login-submit-button");
  await submit.click();

  await page.waitForNavigation();

  // - - - - - -

  const result = await lighthouse(TEST_URL, LIGHTHOUSE_CONFIG);
  await writeFileAsync(DIST_PATH, result.report);

  // - - - - - -

  await browser.close();
})();
