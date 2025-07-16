package tests;

import base.BaseTest;
import org.testng.annotations.Test;

public class SampleTest extends BaseTest {

    @Test
    public void verifyGoogleTitle() {
        driver.get("https://www.google.com");
        test.info("Navigated to Google");
        String title = driver.getTitle();
        test.info("Title is: " + title);
    }
}
