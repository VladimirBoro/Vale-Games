package springboot.spring.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateUtil {
    public String getDate() {
        LocalDate localDate = LocalDate.now();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MM-dd-YYYY");
        return localDate.format(dtf);
    }
}
