package com.haebang.haebang.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDTO {


    private String roomId; // 방번호
    private String writer; // 메시지 보낸사람
    private String message; // 메시지
}