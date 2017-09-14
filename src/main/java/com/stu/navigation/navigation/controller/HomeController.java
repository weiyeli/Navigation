package com.stu.navigation.navigation.controller;


import com.stu.navigation.navigation.form.Form;
import com.stu.navigation.navigation.service.PathService;
import com.stu.navigation.navigation.util.NavigationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Map;

@Controller
public class HomeController {

    @Autowired
    PathService pathService;

    @RequestMapping(path = {"/","/index"}, method = RequestMethod.GET)
    public String index() {
        return "index";
    }

    @RequestMapping(path = "/getPath", method = RequestMethod.POST)
    @ResponseBody
    public String getPath(@RequestBody @Valid Form form) {
        Map<String, Object> map = null;
            try{
                map = pathService.getPathMap(form.getStart(), form.getEnd() , form.getMiddle());
            }catch (IOException e) {
                e.printStackTrace();
            }
            return NavigationUtil.getJSONString(1, map);
    }
}
