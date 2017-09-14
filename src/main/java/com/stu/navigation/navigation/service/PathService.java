package com.stu.navigation.navigation.service;


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
        Map<String, Object> map = txTsp.solve(start, end, middle);
        return map;
    }
}
