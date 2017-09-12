package com.stu.navigation.navigation.io;

import java.util.PriorityQueue;
import java.util.Queue;

public class Queue_test {
    public static Queue<Integer> queue = new PriorityQueue<>();

    public static void main(String[] args) {
        queue.offer(1000);
        queue.offer(6);
        queue.offer(999);
        System.out.println(queue.peek());
        System.out.println(queue.size());
    }
}
