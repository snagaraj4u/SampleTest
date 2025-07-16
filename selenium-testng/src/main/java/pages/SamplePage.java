package pages;

import org.openqa.selenium.WebDriver;

public class SamplePage {
    WebDriver driver;

    public SamplePage(WebDriver driver) {
        this.driver = driver;
    }

    public void openGoogle() {
    	driver.get("https://www.google.com");


    }

    public String getTitle() {
        return driver.getTitle();
    }
}
