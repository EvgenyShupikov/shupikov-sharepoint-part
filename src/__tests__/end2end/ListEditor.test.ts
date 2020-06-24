import { launch, Browser, Page } from 'puppeteer';
import { ListEditorLocators, ItemEditorLocators } from '../../webparts/ListEditor/components/locators';
import * as faker from 'faker';


// TODO вынести константы в переменные окружения
const headless = false;
const testUrl = 'https://localhost:4321/temp/workbench.html';
const windowWidth = 1200;
const windowHeight = 800;

const workbenchLocators = {
    SearchWebPart: '.CanvasZone .CanvasToolboxHint:first-child',
    AddListEditor: '[data-automation-id="spPageCanvasLargeToolboxBody"] BUTTON[aria-label="ListEditor"]',
};

const wrapListLocation = (locator) => `[data-automationid='${locator}']`;

let browser: Browser;
let page: Page;

describe('Start browser', () => {

    test('should launch puppeteer', async (done) => {
        //https://github.com/GoogleChrome/puppeteer/issues/1183#issuecomment-364677167
        const chrome = { x: 0, y: 74 };   // comes from config in reality
        const args = [`--window-size=${windowWidth + chrome.x},${windowHeight + chrome.y}`];
        const browserParams = { headless, args };
        browser = await launch(browserParams);
        done();
    });

    test('should load page', async (done) => {
        const context = await browser.createIncognitoBrowserContext();
        page = await context.newPage();
        await page.setViewport({ width: windowWidth, height: windowHeight });
        await page.goto(testUrl, {
            waitUntil: ['domcontentloaded', 'networkidle0']
        });
        done();
    });
});


describe('Add webpart', () => {

    test('should search ListEditor', async (done) => {
        await page.waitForSelector(workbenchLocators.SearchWebPart, { visible: true });
        await page.click(workbenchLocators.SearchWebPart);
        done();
    });

    test('should add ListEditor', async (done) => {
        await page.waitForSelector(workbenchLocators.AddListEditor, { visible: true });
        await page.click(workbenchLocators.AddListEditor);
        done();
    });

    test('should found ListEditor', async (done) => {
        await page.waitForSelector(wrapListLocation(ListEditorLocators.RootElement), { visible: true });
        done();
    });
});


describe('Add item', () => {

    test('should click add button', async (done) => {
        const btnLocator = wrapListLocation(ListEditorLocators.ButtonAddItem);
        await page.waitForSelector(btnLocator, { visible: true });
        await page.click(btnLocator);
        done();
    });

    test('should open ListEditor', async (done) => {
        const dialogLocator = wrapListLocation(ItemEditorLocators.Dialog);
        await page.waitForSelector(dialogLocator, { visible: true });
        done();
    });

    // test('should show error', async (done) => {
    //     const buttonLocator = wrapListLocation(ItemEditorLocators.ButtonSave);
    //     await page.click(buttonLocator);
    //     const messageLocator = wrapListLocation(ItemEditorLocators.MessageWithError);
    //     await page.waitForSelector(messageLocator, { visible: true });
    //     done();
    // });

    test('should type title', async (done) => {
        const locator = wrapListLocation(ItemEditorLocators.InputTitle);
        const title = faker.name.findName();
        await page.type(locator, title);
        done();
    });

    // test('should show error', async (done) => {
    //     const buttonLocator = wrapListLocation(ItemEditorLocators.ButtonSave);
    //     await page.click(buttonLocator);
    //     const messageLocator = wrapListLocation(ItemEditorLocators.MessageWithError);
    //     await page.waitForSelector(messageLocator, { visible: true });
    //     done();
    // });

    test('should type code', async (done) => {
        const locator = wrapListLocation(ItemEditorLocators.InputCode);
        const code = faker.random.number({ min: 9999, max: 99999 }).toString();
        await page.type(locator, code);
        done();
    });

    // test('should show error', async (done) => {
    //     const buttonLocator = wrapListLocation(ItemEditorLocators.ButtonSave);
    //     await page.click(buttonLocator);
    //     const messageLocator = wrapListLocation(ItemEditorLocators.MessageWithError);
    //     await page.waitForSelector(messageLocator, { visible: true });
    //     done();
    // });

    test('should type description', async (done) => {
        const locator = wrapListLocation(ItemEditorLocators.InputDescription);
        const description = faker.lorem.words(5);
        await page.type(locator, description);
        done();
    });

    test('should save', async (done) => {
        const buttonLocator = wrapListLocation(ItemEditorLocators.ButtonSave);
        await page.click(buttonLocator);
        done();
    });

    test('should close ListEditor', async (done) => {
        const dialogLocator = wrapListLocation(ItemEditorLocators.Dialog);
        await page.waitForSelector(dialogLocator, { hidden: true });
        done();
    });
});


describe('Edit item', () => {

    test('should select last item', async (done) => {
        const lastRowLocator = `${wrapListLocation(ListEditorLocators.ListCell)}:last-child`;
        const clickableRow = `${lastRowLocator} ${wrapListLocation(ListEditorLocators.ListDetailsRow)}`;
        await page.click(clickableRow);
        done();
    });

    test('should click edit button', async (done) => {
        const btnLocator = wrapListLocation(ListEditorLocators.ButtonEditItem);
        await page.waitForSelector(btnLocator, { visible: true });
        await page.click(btnLocator);
        done();
    });

    test('should type title', async (done) => {
        const locator = wrapListLocation(ItemEditorLocators.InputTitle);
        const title = faker.name.findName();
        await page.type(locator, '');
        await page.type(locator, title, );
        done();
    });

    test('should type code', async (done) => {
        const locator = wrapListLocation(ItemEditorLocators.InputCode);
        const code = faker.random.number({ min: 9999, max: 99999 }).toString();
        await page.type(locator, code);
        done();
    });

    test('should type description', async (done) => {
        const locator = wrapListLocation(ItemEditorLocators.InputDescription);
        const description = faker.lorem.words(5);
        await page.type(locator, description);
        done();
    });

    test('should save', async (done) => {
        const buttonLocator = wrapListLocation(ItemEditorLocators.ButtonSave);
        await page.click(buttonLocator);
        done();
    });

    test('should close ListEditor', async (done) => {
        const dialogLocator = wrapListLocation(ItemEditorLocators.Dialog);
        await page.waitForSelector(dialogLocator, { hidden: true });
        done();
    });
});


describe('Remove item', () => {

    test('should select last item', async (done) => {
        const lastRowLocator = `${wrapListLocation(ListEditorLocators.ListCell)}:last-child`;
        const clickableRow = `${lastRowLocator} ${wrapListLocation(ListEditorLocators.ListDetailsRow)}`;
        await page.click(clickableRow);
        done();
    });

    test('should click remove button', async (done) => {
        const btnLocator = wrapListLocation(ListEditorLocators.ButtonRemoveItem);
        await page.waitForSelector(btnLocator, { visible: true });
        await page.click(btnLocator);
        done();
    });
});