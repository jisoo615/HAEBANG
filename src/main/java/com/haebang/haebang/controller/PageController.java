package com.haebang.haebang.controller;

import com.haebang.haebang.entity.Apt;
import com.haebang.haebang.entity.Item;
import com.haebang.haebang.repository.ItemRepository;
import com.haebang.haebang.service.AptService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.net.http.HttpRequest;
import java.util.HashMap;
import java.util.List;
import java.util.SortedMap;

@RequiredArgsConstructor
@Controller
public class PageController {
    final AptService aptService;
    final ItemRepository itemRepository;

    @GetMapping("mypage")
    public String mypage(){
        return "mypage";
    }
    @GetMapping("mypage/items")
    public String myItems(){return "mypage/items";}
    @GetMapping("mypage/bookmarked")
    public String bookmarked(){return "mypage/bookmarked";}

    @GetMapping("/memberLogin")
    public String memberLogin(){
        return "memberLogin";
    }

    @RequestMapping("/apt")
    public String showApt(Model model){

        List<Apt> list = aptService.findAllApt();
        model.addAttribute("Apt",list);

        return "showApt";
    }
    @RequestMapping("/item/detail/{road_address}")
    public String dp_detail(Model model,@PathVariable("road_address") String road_address){
        System.out.println(road_address);
        Apt apt = aptService.findAptByRoadAddress(road_address);
        model.addAttribute("apt", apt);
        return "item/detail";
    }

    @GetMapping("item/write")
    public String write(Model model){
        model.addAttribute("item_id", 0);
        return "item/write";
    }
    @GetMapping("item/edit/{item_id}")
    public ModelAndView edit(Model model, @PathVariable("item_id") Long id, HttpServletRequest request){
        Item item = itemRepository.findById(id).orElseThrow();
        if(request.getCookies() != null){
            for(Cookie cookie : request.getCookies()){
                if( cookie.getName().equals("username") ){
                    if(cookie.getValue().equals(item.getUsername())){
                        System.out.println("매물 작성 페이지 로딩 : "+id);
                        ModelAndView mv = new ModelAndView("item/write");
                        mv.addObject("item_id", id);
                        return mv;
                    }
                }
            }
        }

        ModelAndView mv = new ModelAndView("alert");
        mv.addObject("msg", "타인 글 수정 불가\n");
        mv.addObject("url", "/item/detail/"+item.getApt().getRoadAddress());
        return mv;
    }

    @PostMapping("/error")
    public String error(){
        return "error";
    }
}
