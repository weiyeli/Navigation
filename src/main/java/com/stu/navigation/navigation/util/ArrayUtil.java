package com.stu.navigation.navigation.util;


/*
数据处理工具类
 */

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

public class ArrayUtil {

    static List<int[]> resList = new ArrayList();
    static List<String> test = new ArrayList<>();

    public static List<int[]> getAllSortArray(int[] array) {
        allSort(array, 0, array.length - 1);
        System.out.println(test);
        return resList;
    }

    public static void allSort(int[] array, int begin, int end) {

        for (int i = begin; i <= end; i++) {
            // 打印数组的内容
            if (begin == end) {
                int[] a = new int[array.length];
                for (int j = 0; j < array.length; j++) {
                    a[j] = array[j];
                }
                resList.add(a);
                return;
            }
            swap(array, begin, i);
            allSort(array, begin + 1, end);

            swap(array, begin, i);
        }
        return;
    }

    public static void swap(int[] array, int a, int b) {
        int tem = array[a];
        array[a] = array[b];
        array[b] = tem;
    }

    public static List<Integer> arrayToList(int[] path) {
        // 将最短路径数组转成List
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < path.length; i++) {
            if (path[i] == -1)
                break;
            list.add(path[i]);
        }


        return list;
    }

    public static void buttifyList(List<Integer> path) {
        // 去除相邻且重复的元素
        for (int i = 1; i < path.size(); i++) {
            if (path.get(i) == path.get(i-1))
                path.remove(i);
        }
    }

}
