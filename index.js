const puppeteer = require("puppeteer");
const { LOGIN_URL, EMAIL_ADDRESS, PASSWORD } = require("./login.config");
// const iPhone = puppeteer.devices['iPhone 6'];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });
  const page = await browser.newPage();
  //   await page.emulate(iPhone);
  await page.goto(LOGIN_URL);
  await page.waitForSelector("form");

  // - - - - - -
  // - - - - - -

  const emailInput = await page.$('input[id="login-username"]');
  await emailInput.type(EMAIL_ADDRESS);

  const passwordInput = await page.$('input[id="login-password"]');
  await passwordInput.type(PASSWORD);

  const submitButton = await page.$('button[id="login-submit-button"]');
  await submitButton.click();

  // - - - - - -
  // - - - - - -

  //   await browser.close();
})();
