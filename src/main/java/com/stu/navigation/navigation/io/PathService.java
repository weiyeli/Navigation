package com.stu.navigation.navigation.io;


import com.stu.navigation.navigation.service.TxTsp;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;


@Service
public class PathService {
    public static final int M = -1;
    public static final int SIZE = 50;

    public Map<String, Object> getPathMap(int start, int end, int[] middle) throws IOException {

        TxTsp txTsp = new TxTsp(SIZE);
//        int[] middle = {1, 2, 3};
        Map<String, Object> map = txTsp.solve(start, end, middle);
        System.out.println((ArrayList) map.get("path"));
        System.out.println(Integer.parseInt(map.get("sd").toString()));
        return map;
    }
}
