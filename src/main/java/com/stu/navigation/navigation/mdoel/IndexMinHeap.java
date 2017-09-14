package com.stu.navigation.navigation.mdoel;


import java.util.Iterator;
import java.util.NoSuchElementException;

/*
最小索引堆
 */
public class IndexMinHeap implements Iterable<Integer> {
    private int maxN;       //索引堆中元素的最大个数
    private int N;          //当前索引堆中的元素个数
    private int[] pq;       //使用一级索引的二叉堆
    private int[] qp;       //反向索引，qp[pq[i]] = pq[qp[i]] = i,用于映射key索引对应pq二叉堆中的位置
    private int[] keys;     //真正存的东西

    /*
    初始化索引区间为(0到maxN-1)的空索引堆
     */
    public IndexMinHeap(int capacity) {
        if (capacity <= 0)
            throw new IllegalArgumentException();
        maxN = capacity;
        N = 0;
        pq = new int[capacity + 1];
        qp = new int[capacity + 1];
        keys = new int[capacity + 1];
        //初始每个索引都没用过
        for (int i = 0; i <= maxN; i++) {
            qp[i] = -1;
        }
    }

    public boolean isEmpty() {
        return N == 0;
    }

    public int size() {
        return N;
    }

    /*
    判断索引堆是否已经存在索引i
     */
    public boolean contains(int i) {
        return qp[i] != -1;
    }

    /*
    返回最小值的索引号
     */
    public int minIndex() {
        if (isEmpty())
            throw new NoSuchElementException("IndexMinHeap underflow");
        return pq[1];
    }

    /*
    返回优先队列最小值，即二叉堆根节点
     */
    public int minKey() {
        if (isEmpty())
            throw new NoSuchElementException("IndexMinHeap underflow");
        return keys[pq[1]];
    }

    /*
    将索引i与键值关联
     */
    public void insert(int i, int key) {
        if (i < 0 || i > maxN)
            throw new IllegalArgumentException("index i out of boundary");
        if (contains(i))
            throw new IllegalArgumentException("index i has allocted");
        N++;
        pq[N] = i;
        qp[i] = N;
        pq[N] = i; //pq,qp互为映射
        keys[i] = key;
        adjustUp(N);
    }

    /*
    删除最小键值并返回其对应的索引
     */
    public int delMin() {
        if (isEmpty())
            throw new NoSuchElementException("IndexMinHeap underflow");
        int min = minIndex();
        delete(min);
        return min;
    }

    /*
    删除索引i以及对应的键值
    @param 删除索引为i的元素
     */
    public void delete(int i) {
        if (!contains(i))
            throw new NoSuchElementException("IndexMinHeap underflow");
        int pqi = qp[i];
        swap(pqi, N--);
        adjustUp(pqi);
        adjustDown(pqi);
        qp[i] = -1;
        keys[i] = -1;
        pq[N + 1] = -1;
    }

    /*
    改变与索引i关联的键值
    @param i 待改变键值的索引
    @param key 改变后的键值
     */
    public void changeKey(int i, int key) {
        if (!contains(i))
            throw new NoSuchElementException("IndexMinHeap underflow");
        if (keys[i] == key)
            throw new IllegalArgumentException("argument key equal to the origin key");
        if (keys[i] > key)
            decreaseKey(i, key);
        else
            increaseKey(i, key);
    }

    /*
    减小与索引I关联的键值到给定的新键值
    @param i 与待减少的键值关联的索引
    @param key 新键值
     */
    public void decreaseKey(int i, int key) {
        if (!contains(i))
            throw new NoSuchElementException("IndexMinHeap underflow");
        if (keys[i] < key)
            throw new IllegalArgumentException("argument key more than the origin key");
        keys[i] = key;
        int pqi = qp[i];
        adjustUp(pqi);
        adjustDown(pqi);
    }

    /*
    增加与索引I关联的键值到给定的新键值
    @param i 与待增加的键值关联的索引
    @param key 新键值
     */
    public void increaseKey(int i, int key) {
        if (!contains(i))
            throw new NoSuchElementException("IndexMinHeap underflow");
        if (keys[i] > key)
            throw new IllegalArgumentException("argument key less than the origin key");
        keys[i] = key;
        int pqi = qp[i];
        adjustUp(pqi);
        adjustDown(pqi);
    }


    /*
    交换一级索引值，以及其对称映射中的值
     */
    private void swap(int i, int j) {
        int temp = pq[i];
        pq[i] = pq[j];
        pq[j] = temp;

        // 真他妈难懂，关键在于搞清楚pq数组的索引就是实际二叉树的索引，qp数组的索引和实际元素的索引是对应的，qp的值是pq数组的索引
        int qpi = pq[i];    //原来j的元素的索引值
        int qpj = pq[j];    //原来i的元素的索引值
        qp[qpi] = i;
        qp[qpj] = j;
    }

    /*
    判断键值的大小关系
     */
    private boolean less(int i, int j) {
        int ki = pq[i];
        int kj = pq[j];
        return keys[ki] < keys[kj];
    }

    /*
    Heap helper functions
     */


    /*
    SiftDown
    @param i 一级索引的二叉堆的索引i，pq数组的数组位置
     */
    private void adjustDown(int i) {
        // 保证有左儿子
        while (2 * i <= N) {
            int l = 2 * i;    //左儿子的位置
            while (l < N && less(l + 1, l))  //保证有右儿子，并且比较左儿子和右儿子的大小
                l++;
            if (less(l, i)) {
                swap(l, i);
                i = l;
            } else break;

        }
    }

    /*
    SiftUp
    @param i 一级索引的二叉堆的索引i，pq数组的数组位置
     */
    private void adjustUp(int i) {
        // 保证有爸爸
        while (i > 1) {
            int p = i / 2;
            if (less(p, i))
                break;
            swap(p, i);
            i = p;
        }
    }

    @Override
    public Iterator<Integer> iterator() {
        return new HeapIterator();
    }

    private class HeapIterator implements Iterator<Integer> {
        //create a new pq
        IndexMinHeap copy;

        //add all elements to copy of heap
        //takes linear time since already in heap order so no keys move
        public HeapIterator() {
            copy = new IndexMinHeap(maxN);
            for (int i = 1; i <= N; i++) {
                int ki = pq[i];
                int key = keys[ki];
                copy.insert(ki, key);
            }
        }

        @Override
        public boolean hasNext() {
            return !copy.isEmpty();
        }

        @Override
        public Integer next() {
            if (!hasNext())
                throw new NoSuchElementException("IndexMinHeap underflow");
            return copy.delMin();
        }
    }


    public static void main(String[] args) {
        IndexMinHeap indexMinHeap = new IndexMinHeap(10);
        indexMinHeap.insert(1, 10);
        indexMinHeap.insert(2, 8);
        indexMinHeap.insert(3, 99);
        indexMinHeap.changeKey(2, 5);
        indexMinHeap.changeKey(2, 1000);
        System.out.println(indexMinHeap.minIndex());
    }

}
