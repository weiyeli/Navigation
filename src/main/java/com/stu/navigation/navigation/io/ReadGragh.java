package com.stu.navigation.navigation.io;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class ReadGragh {

    public static void main(String[] args) {
        File csv = new File("D:\\JavaProject\\STU_Navigation\\src\\resources\\graph.csv");
        BufferedReader br = null;
        try{
            br = new BufferedReader(new FileReader(csv));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        String line = "";
        String[][] target = null;
        int index = 0;
        try{
            List<String> graphString = new ArrayList<>();
            while ((line = br.readLine())!=null) {
                System.out.println(line);
                target[index++] = line.split("\t");
                graphString.add(line);
            }
        }catch (IOException e){
            e.printStackTrace();
        }

    }
}
