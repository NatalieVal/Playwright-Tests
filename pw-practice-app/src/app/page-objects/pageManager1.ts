import { Page, expect } from '@playwright/test';
import {NavigationPage} from '../page-objects/navigationPage';
import {FormLayoutsPage} from '../page-objects/formLayoutsPage';
import { DatePickerPage } from '../page-objects/datePickerPage';

export class PageManager1 {
    //creating fields for every page object
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayoutsPage: FormLayoutsPage
    private readonly datePickerPage: DatePickerPage

    constructor(page: Page)  {
        //calling all the pages inside of the constructor
        this.page = page
        //initializing all the page objects
        this.navigationPage = new NavigationPage(this.page)
        this.formLayoutsPage = new FormLayoutsPage(this.page)
        this.datePickerPage = new DatePickerPage(this.page)
        
    }
    // calling all the instances
    navigateTo() {
        return this.navigationPage
    }
    onFormLayoutsPage() {
        return this.formLayoutsPage
    }
    onDatePickerPage() {
        return this.datePickerPage
    }
}