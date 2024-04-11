const {test, expect} = require('@playwright/test'); //To import the playwright package
const exp = require('constants');

//To run just one file use the next command: npx playwright test tests/ClientApp.spec.js

test('Client App login',async ({page})=>{ 
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("anshika@gmail.com");
    await page.locator("[type='password']").fill("Iamking@000");
    await page.locator("[value='Login']").click();
    //await page.waitForLoadState('networkidle'); //Waits until all the calls are made, but is randomly not working
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    expect(titles.length).toBeGreaterThan(4);
    console.log(titles);
    const count = await products.count();
    for(let i=0; i<count; i++){
        console.log(await products.nth(i).locator("b").textContent());
        //The locator scope will be inside of products elements using: products.nth(i).locator()
        if(await products.nth(i).locator("b").textContent()===productName){
            //Add to cart code
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    await page.pause();
}); 