package com.stu.navigation.navigation;

import com.stu.navigation.navigation.service.TxTsp;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class NavigationApplicationTests {

    @Test
    public void contextLoads() throws IOException {
        TxTsp txTsp = new TxTsp(50);
        int[] middle = {47,27,34};
        Map<String, Object> map = txTsp.solve(0, 22, middle);
    }

}
