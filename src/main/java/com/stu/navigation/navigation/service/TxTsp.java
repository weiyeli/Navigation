package com.stu.navigation.navigation.service;


import com.stu.navigation.navigation.mdoel.IndexMinHeap;
import com.stu.navigation.navigation.util.ArrayUtil;
import org.omg.CORBA.OBJ_ADAPTER;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;


public class TxTsp {

    private int nodeNum;   // 顶点数量
    private int[][] distance;   // 距离矩阵
    private int M = Integer.MAX_VALUE;

    public TxTsp(int size) {
        this.nodeNum = size;
    }


    private void init(String filename) throws IOException {

        distance = new int[nodeNum][nodeNum];

        // 初始化距离数组
        for (int i = 0; i < nodeNum; i++) {
            for (int j = 0; j < nodeNum; j++) {
                distance[i][j] = M;
            }
        }


        // 读取数据
        int x;
        int y;
        String strbuff = "";
        BufferedReader data = new BufferedReader(new InputStreamReader(new FileInputStream(filename)));

        while ((strbuff = data.readLine()) != null) {
            // 读取一行数据，数据格式1 2 10
            String[] strcol = strbuff.split("\t");
            x = Integer.valueOf(strcol[0]);
            y = Integer.valueOf(strcol[1]);
            int dis = Integer.valueOf(strcol[2]);
            distance[x][y] = dis;
        }


        data.close();
    }

    public Map<String, Object> solve(int start, int end, int[] middle) throws IOException {

        init("D:\\JavaProject\\navigation\\src\\main\\java\\com\\stu\\navigation\\navigation\\resources\\graph.csv");
        if (start < 0 || end > 49 || middle.length < 0) {
            System.out.println("参数错误");
            return null;
        }

        // 如果中间节点数目为0，则直接求起点到终点的最短距离
        if (middle.length == 0) {
            return dijkstra(start, end);
        }

        // 如果中间节点数目为1
        if (middle.length == 1) {

            int middlePoint = middle[0];
            ArrayList<Integer> list = new ArrayList<>();
            list.add(middlePoint);

            // 计算起点到中间节点和中间节点到终点的路径和距离
            Map<String, Object> startToMiddleMap = new HashMap<>();
            Map<String, Object> middleToEndMap = new HashMap<>();
            startToMiddleMap = dijkstra(start, middlePoint);
            middleToEndMap = dijkstra(middlePoint, end);

            // 总路径
            List<Integer> loopResPathList = new ArrayList<>();
            // 总距离
            int loopResDistance = -1;

            if (startToMiddleMap.containsKey("error") || middleToEndMap.containsKey("error")) {

                Map<String, Object> map = new HashMap<>();
                map.put("path", null);
                map.put("sd", -1);
                map.put("error", "-1");
                return map;
            }


            loopResPathList.addAll((ArrayList) startToMiddleMap.get("path"));
            loopResPathList.addAll(list);
            loopResPathList.addAll((ArrayList) middleToEndMap.get("path"));
            ArrayUtil.buttifyList(loopResPathList);

            loopResDistance = Integer.parseInt(startToMiddleMap.get("sd").toString()) +
                    Integer.parseInt(middleToEndMap.get("sd").toString());

            Map<String, Object> resMap = new HashMap<>();
            resMap.put("path", loopResPathList);
            resMap.put("sd", loopResDistance);
            return resMap;
        }

        // 路径记录数组path
        int[] path = new int[nodeNum];
        // 中间节点全排列List
        List<int[]> list = ArrayUtil.getAllSortArray(middle);
        // 全排列数目
        int allSortSize = list.size();
        // 保存某一种排列
        int[] sgMiddle = null;
        // 保存中间节点的最短路径
        int[] shortestMiddlePath;
        //保存计算结算：中间节点的最短路径和距离
        List<Map<String, Object>> middlePathList = new ArrayList<>();
        // 保存最终所有情况的结果
        List<Map<String, Object>> resList = new ArrayList<>();

        // 计算中间节点的最短路径
        for (int i = 0; i < allSortSize; i++) {
            sgMiddle = list.get(i);
            // 循环中接收信息的Map
            Map<String, Object> loopMap = new HashMap<>();

            // 保存路径总和
            int loopSum = 0;
            // 保存路径
            List<Integer> loopPathList = new ArrayList<>();
            for (int j = 0; j < sgMiddle.length - 1; j++) {
                // 判断两点是否连通
                if (isUnion(sgMiddle[j], sgMiddle[j + 1])) {
                    loopMap = dijkstra(sgMiddle[j], sgMiddle[j + 1]);
                    int temp = Integer.parseInt(loopMap.get("sd").toString());
                    loopSum += temp;
                    loopPathList.addAll((ArrayList) loopMap.get("path"));
                } else {
                    // 如果不连通
                    loopMap.put("path", null);
                    loopMap.put("sd", -1);
                    loopMap.put("error", "-1");
                    middlePathList.add(loopMap);
                    break;
                }
            }

            if (!loopMap.containsKey("error")) {
                loopMap.put("path", loopPathList);
                loopMap.put("sd", loopSum);
                middlePathList.add(loopMap);
            }


        }

        // 对每一种情况进行计算
        for (int i = 0; i < allSortSize; i++) {
            // 获取中间节点的Map
            Map<String, Object> loopMiddlePathMap = middlePathList.get(i);
            // 获取路径
            List<Integer> loopMiddlePathList = (ArrayList) loopMiddlePathMap.get("path");
            // 中间路径的头
            int middleHead = loopMiddlePathList.get(0);
            // 中间路径的尾
            int middleEnd = loopMiddlePathList.get(loopMiddlePathList.size() - 1);
            // 总路径
            List<Integer> loopResPathList = new ArrayList<>();
            // 总距离
            int loopResDistance = -1;

            // 如果不连通，则路径置空
            if (!isUnion(start, middleHead) || !isUnion(middleEnd, end) ||
                    loopMiddlePathMap.containsKey("error")) {
                loopMiddlePathMap.put("path", null);
                loopMiddlePathMap.put("sd", -1);
                resList.add(loopMiddlePathMap);
                continue;
            }

            // 计算起点到中间节点和中间节点到终点的路径和距离
            Map<String, Object> startToMiddleMap = new HashMap<>();
            Map<String, Object> middleToEndMap = new HashMap<>();
            startToMiddleMap = dijkstra(start, middleHead);
            middleToEndMap = dijkstra(middleEnd, end);

            if (startToMiddleMap.containsKey("error") || middleToEndMap.containsKey("error")) {
                loopMiddlePathMap.put("path", null);
                loopMiddlePathMap.put("sd", -1);
                loopMiddlePathMap.put("error", "-1");
                resList.add(loopMiddlePathMap);
                continue;
            }


            loopResPathList.addAll((ArrayList) startToMiddleMap.get("path"));
            loopResPathList.addAll(loopMiddlePathList);
            loopResPathList.addAll((ArrayList) middleToEndMap.get("path"));
            ArrayUtil.buttifyList(loopResPathList);

            loopResDistance = Integer.parseInt(startToMiddleMap.get("sd").toString()) +
                    Integer.parseInt(loopMiddlePathMap.get("sd").toString()) +
                    Integer.parseInt(middleToEndMap.get("sd").toString());

            Map<String, Object> resMap = new HashMap<>();
            resMap.put("path", loopResPathList);
            resMap.put("sd", loopResDistance);

            resList.add(resMap);
        }


        return getShortestPath(resList);

    }

    public Map<String, Object> dijkstra(int start, int end) throws IOException {

        Map<String, Object> map = new HashMap<>();
        Queue<Integer> queue = new PriorityQueue<>();

        int n = distance.length;
        // 记录最短距离
        int[] shortest = new int[n];
        // 记录最短路径
        int[][] path = new int[n][n];
        boolean[] visited = new boolean[n];

        // 初始化路径数组
        for (int i = 0; i < nodeNum; i++) {
            for (int j = 0; j < path.length; j++) {
                path[i][j] = -1;
            }
        }

        // 初始化最短距离数组
        for (int i = 0; i < n; i++) {
            shortest[i] = distance[start][i];
        }

        // 初始化，第一个结点求出
        shortest[start] = 0;
        visited[start] = true;
        for (int i = 0; i < n; i++) {
            path[i][0] = start;
        }

        // 判断起点和终点是否连通
        if (!isUnion(start, end)) {
            map.put("path", null);
            map.put("sd", -1);
            map.put("error", "起点和终点不连通");
            return map;
        }

        IndexMinHeap indexMinHeap = new IndexMinHeap(nodeNum + 5);
        // 把顶点和索引放进最小索引堆
        for (int i = 0; i < nodeNum; i++) {
            if (i != start && !visited[i])
                indexMinHeap.insert(i + 1, shortest[i]);
        }


        for (int count = 0; !indexMinHeap.isEmpty(); count++) {
            // 选出离初始顶点最近的顶点
            int k = M;
            int min = M;
//            for (int i = 0; i < n; i++) {
//                // 如果该顶点未被遍历且与start相连
//                if (!visited[i] && shortest[i] != M) {
//                    if (min == -1 || min > shortest[i]) {
//                        min = shortest[i];
//                        k = i;
//                    }
//                }
//            }
            // 从最小索引堆中找出最小值的索引
            k = indexMinHeap.minIndex() - 1;
            // 最小值
            min = indexMinHeap.minKey();
            // 去掉这个点
            indexMinHeap.delMin();

            if (k == M) {
                map.put("error", "-1");
                return map;
            }

            //更新操作
            shortest[k] = min;
            visited[k] = true;

            for (int i = 0; i < path[k].length; i++) {
                if (path[k][i] == -1) {
                    path[k][i] = k;
                    break;
                }
            }

            // 以k为中心点，更新起点到未访问点的距离
            Iterator<Integer> iterator = indexMinHeap.iterator();
            while (iterator.hasNext()) {
                int i = iterator.next() - 1;
                if (!visited[i] && distance[k][i] != M) {
                    int callen = min + distance[k][i];                    // 执行一次松弛操作
                    if (shortest[i] == M || shortest[i] > callen) {
                        shortest[i] = callen;
                        indexMinHeap.changeKey(i + 1, callen);
                        // 复制一份经过k点的路径
                        path[i] = Arrays.copyOf(path[k], path[k].length);
//                        // 将k加入到i的最短路径
//                        for (int j = 0; j < path[i].length; j++) {
//                            if (path[i][j] == -1) {
//                                path[i][j] = k;
//                                break;
//                            }
//
//                        }
                    }
                }
            }


        }

        map.put("path", ArrayUtil.arrayToList(path[end]));
        map.put("sd", shortest[end]);
        return map;
    }

    /*
    将数组转换成
     */

    /*
    返回起点v的第一个邻接顶点的索引，失败则返回-1
     */
    private int firstVertex(int v) {
        // 参数合法性 TODO

        for (int i = 0; i < distance.length; i++) {
            if (distance[v][i] != Integer.MAX_VALUE)
                return i;
        }

        return -1;
    }

    /*
    返回顶点v相对于w的下一个邻接顶点的索引，失败则返回-1
     */
    private int nextVertex(int v, int w) {
        // 参数合法性 TODO

        for (int i = w + 1; i < distance.length; i++) {
            if (distance[v][i] != Integer.MAX_VALUE)
                return i;
        }
        return -1;
    }

    /*
    判断图中两点的连通性
     */
    private boolean isUnion(int start, int end) {
        boolean[] visited = new boolean[nodeNum];

        for (int i = 0; i < visited.length; i++) {
            visited[i] = false;
        }

        DFS(start, visited);

        if (visited[end] == true)
            return true;
        return false;
    }

    /*
    深度搜索
     */
    private void DFS(int i, boolean[] visited) {

        visited[i] = true;

        for (int j = firstVertex(i); j >= 0; j = nextVertex(i, j)) {
            if (!visited[j])
                DFS(j, visited);
        }
    }

    /*
    求出最短路径
     */
    private Map<String, Object> getShortestPath(List<Map<String, Object>> list) {
        int min = -1;
        int index = -1;
        for (Map<String, Object> map : list) {
            if (map.containsKey("error"))
                continue;

            int sd = Integer.parseInt(map.get("sd").toString());
            if (min == -1 || min > sd) {
                min = sd;
                index = list.indexOf(map);
            }
        }

        if (min == -1 || index == -1) {
            System.out.println("fuck 没有路径");
            return null;
        }

        return list.get(index);
    }


}
