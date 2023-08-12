
function edit_item(item_id){
    confirm("이 글을 수정하시겠습니까?");
    location.href = "/item/edit/"+item_id;
}

function delete_item(item_id){
    console.log(item_id);
    confirm("이 글을 삭제하시겠습니까?");
    $.ajax({
        type: "DELETE",
        url: "/api/apt/item/"+item_id,
        headers: {"content-type": "application/json", 'Authorization':'Bearer '+getCookie("ATK").substring(4)},
        dataType: "text",
    })
        .done(function (response) {
            hideLoadImage();
            confirm("삭제 완료")
            window.location.href = '/mypage/items';
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            hideLoadImage();
            alert("실패 : "+jqXHR.responseText);
        })
        .ajaxStart(
            showLoadingImage()
        )
}

function makeCardElement(response, del_edit_btn, bookmark_icon){// response[ item[photo[],photo[]..  ],item[photo[]..], item[..]]
    var containerDiv = document.createElement("div");
    containerDiv.className = "container";
    var user_id = parseInt( getCookie("user_id").substring(8) );

    response.forEach((obj) => {
        console.log(obj);
        var cardDiv = document.createElement("div");
        cardDiv.classList.add('card');

        cardDiv.appendChild(makeCarouselElement(obj.id, obj.s3_files));

        var cardHaeder = document.createElement("div");
        cardHaeder.className = "card-header";
        cardHaeder.innerText = obj.title;
        var cardBody = document.createElement("div");
        cardBody.setAttribute("item_id", obj.id);
        cardBody.className = "card-body";
        cardBody.innerHTML = `<h4>주소 : ${obj.apt.road_address}</h4>`+
            `    <h4>아파트명 : ${obj.apt.dp}</h4>`+
            `    <h6 class="card-subtitle mb-2 text-body-secondary">${obj.created_date}</h6>\n` +
            `    <p>${obj.username}님 작성</p>\n`+
            `    <h5 class="card-title">매매|전/월세 : ${obj.dp_amount}</h5>\n`+
            `    <p>계약날짜 : ${obj.contract_date}</p>\n`+
            `    <p>${obj.phone_number}</p>\n`+
            `    <p>${obj.dp_area}</p>`+
            `    <p>${obj.dong}(동)</p>`+
            `    <p>${obj.floor}층</p>`+
            `    <p>${obj.build_year}년도 건설</p>`+
            `    <p class="card-text">상세설명 : ${obj.text}</p>`;

        if(bookmark_icon==true){
            const bookmarkSet = new Set();
            obj.bookmarks.forEach((bookmark) => {
                bookmarkSet.add(bookmark.member.userId);
            })
            console.log(bookmarkSet);

            var bookmark = document.createElement("i");
            bookmark.id = "bookmark"+obj.id;
            bookmark.classList.add('bi', 'bi-bookmark-plus');
            bookmark.style.fontSize = "2rem";
            bookmark.onclick = function (){
                post_bookmark(obj.id);
            }
            var bookmarked = document.createElement("i");
            bookmarked.id = "bookmarked"+obj.id;
            bookmarked.classList.add('bi', 'bi-bookmark-check-fill');
            bookmarked.style.fontSize = "2rem";
            bookmarked.onclick = function (){
                delete_bookmark(obj.id);
            }

            if(bookmarkSet.has(user_id)){
                bookmarked.style.visibility = "visible";
                bookmark.style.visibility ="hidden";
            }else{
                bookmarked.style.visibility = "hidden";
                bookmark.style.visibility ="visible";
            }

            cardBody.appendChild(bookmark);
            cardBody.appendChild(bookmarked);
        }

        if(del_edit_btn==true){
            var delbtn = document.createElement("button");
            delbtn.className = "btn btn-secondary";
            delbtn.type = "button";
            delbtn.innerText = "삭제";
            delbtn.onclick = function (){
                delete_item(obj.id);
            }
            var editbtn = document.createElement("button");
            editbtn.className = "btn btn-secondary";
            editbtn.type = "button";
            editbtn.innerText = "수정";
            editbtn.onclick = function (){
                edit_item(obj.id);
            }
            // 버튼 간격 조절용
            var buttonSpacing = document.createElement("span");
            buttonSpacing.className = "button-spacing";
            buttonSpacing.style.marginRight = "10px";

            cardBody.appendChild(editbtn);
            cardBody.appendChild(buttonSpacing);
            cardBody.appendChild(delbtn);
        }

        cardDiv.appendChild(cardHaeder);
        cardDiv.appendChild(cardBody);
        containerDiv.appendChild(cardDiv);
    });

    return containerDiv;
}
function makeCarouselElement(idx, images){// carousel이 여러개일 경우 carousel마다 id를 다르게 줘야함
    // Create main carousel element
    const carouselDiv = document.createElement('div');
    carouselDiv.classList.add('carousel', 'slide');
    carouselDiv.id = 'carouselExampleIndicators'+idx;

    // Create carousel indicators
    const indicatorsDiv = document.createElement('div');
    indicatorsDiv.classList.add('carousel-indicators');

    for (let i = 0; i < images.length; i++) {
        const indicatorButton = document.createElement('button');
        indicatorButton.type = 'button';
        indicatorButton.dataset.bsTarget = '#carouselExampleIndicators'+idx;
        indicatorButton.dataset.bsSlideTo = i;
        indicatorButton.setAttribute('aria-label', `Slide ${i + 1}`);

        if (i === 0) {
            indicatorButton.classList.add('active');
            indicatorButton.setAttribute('aria-current', 'true');
        }

        indicatorsDiv.appendChild(indicatorButton);
    }

    // Create carousel inner container
    const innerDiv = document.createElement('div');
    innerDiv.classList.add('carousel-inner');

    for (let i = 0; i < images.length; i++) {
        const carouselItemDiv = document.createElement('div');
        carouselItemDiv.classList.add('carousel-item');

        if (i === 0) {
            carouselItemDiv.classList.add('active');
        }

        const img = document.createElement('img');
        img.src = images[i].s3_url;
        img.classList.add('d-block', 'w-100');
        img.alt = `Image ${i + 1}`;

        carouselItemDiv.appendChild(img);
        innerDiv.appendChild(carouselItemDiv);
    }

    // create prev,next button
    var prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "carousel-control-prev";
    prevBtn.dataset.bsTarget = "#carouselExampleIndicators"+idx;
    prevBtn.dataset.bsSlide = "prev";
    prevBtn.innerHTML = '<span className="carousel-control-prev-icon" aria-hidden="true"></span>'+
        '<span className="visually-hidden"><</span>';
    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "carousel-control-next";
    nextBtn.dataset.bsTarget = "#carouselExampleIndicators"+idx;
    nextBtn.dataset.bsSlide = "next";
    nextBtn.innerHTML = '<span className="carousel-control-next-icon" aria-hidden="true"></span>'+
        '<span className="visually-hidden">></span>';

    // Append elements to the main container
    carouselDiv.appendChild(indicatorsDiv);
    carouselDiv.appendChild(innerDiv);
    carouselDiv.appendChild(prevBtn);
    carouselDiv.appendChild(nextBtn);

    // Append the main container to the document
    //     document.body.appendChild(carouselDiv);
    return carouselDiv;
}
function post_bookmark(item_id){
    $.ajax({
        type: "POST",
        url: "/api/bookmark/"+item_id,
        headers: {"content-type": "application/json", 'Authorization':'Bearer '+getCookie("ATK").substring(4)},
        dataType: "text",
    })
        .done(function (response) {
            var empty_mark = document.getElementById("bookmark"+item_id);
            empty_mark.style.visibility = "hidden";
            var full_mark = document.getElementById("bookmarked"+item_id);
            full_mark.style.visibility = "visible";

            alert(response);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            alert("실패 : "+jqXHR.responseText);
        })
}
function delete_bookmark(item_id){
    $.ajax({
        type: "DELETE",
        url: "/api/bookmark/"+item_id,
        headers: {"content-type": "application/json", 'Authorization':'Bearer '+getCookie("ATK").substring(4)},
        dataType: "text",
    })
        .done(function (response) {
            var empty_mark = document.getElementById("bookmark"+item_id);
            empty_mark.style.visibility = "visible";
            var full_mark = document.getElementById("bookmarked"+item_id);
            full_mark.style.visibility = "hidden";

            alert(response);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            alert("실패 : "+jqXHR.responseText);
        })
}