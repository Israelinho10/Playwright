const {test, expect} = require('@playwright/test'); //To import the playwright package
const exp = require('constants');

//We have to add async before function in order to use await inside the test
//We can use aync function() or async ()=>

//NOTE: ALWAYS REMEMBER TO USE 'await'
test('Browser context playwright test',async ({browser})=>{ 
    const context = await browser.newContext(); //It will open a new browser instance
    const page = await context.newPage();//It will create a new page on the browser instance
    const userName = page.locator("#username");
    const password = page.locator("[type='password']");
    const signIn = page.locator("#signInBtn");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    //page.locator('#username').type("rahulshetty"); //type is deprecated, use fill instead
    await userName.fill("rahulshetty");
    await password.fill("learning");
    await signIn.click();
    console.log(await page.locator("[style*='block']").textContent()); //Get the text present in the locator
    await expect(page.locator("[style*='block']")).toContainText("Incorrect");
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    console.log(await page.locator(".card-body a").nth(0).textContent()); // We can use first() instead of nth(0)
}); 

test('Use incorrect username or password',async ({page})=>{ 
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await page.locator("#username").fill("rahulshetty");
    await page.locator("[type='password']").fill("learning");
    await page.locator("#signInBtn").click();
    console.log(await page.locator("[style*='block']").textContent()); //Get the text present in the locator
    await expect(page.locator("[style*='block']")).toContainText("Incorrect");
}); 

test('Page playwright test',async ({page})=>{ 
    await page.goto("https://www.google.com");
    await expect(page).toHaveTitle("Google");
}); 

test('UI Controls',async ({page})=>{ 
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator("#username");
    const password = page.locator("[type='password']");
    const signIn = page.locator("#signInBtn");
    const dropdown = page.locator("select.form-control");
    const documentLink = page.locator("[href*='documents-request']");

    await dropdown.selectOption("consult");
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    console.log(page.locator(".radiotextsty").last().isChecked()); //Gets the boolean value if the radio button is checked
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms").isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute("class", "blinkingText");
    //await page.pause(); //To pause the execution and the playwright inspector will be open
}); 

test.only('Child windows handle',async ({browser})=>{ 
    const context = await browser.newContext(); //It will open a new browser instance
    const page = await context.newPage();//It will create a new page on the browser instance
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    //We need a Promise in order to get the context of a new page. Because JS is asyncronous, so it will wait until all the steps
    //are fulfilled succesfully.
    const[newPage] = await Promise.all([
            context.waitForEvent('page'),//Listen for any new page (pending, rejected, fulfilled), but it has to be in a listener event
            documentLink.click()//new page is opened
        ]);

    const text = await newPage.locator(".red").textContent();
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);
    await page.locator("#username").fill(domain);
    console.log(page.locator("#username").textContent());
});