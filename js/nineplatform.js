// 請代入自己的網址路徑
const api_path = "trista";
const token = "Esj5E5pslmcwSXHpsErAkexOloI2";
const config = {
    headers: {
      Authorization: "Esj5E5pslmcwSXHpsErAkexOloI2"
    }
  };

const table   = document.querySelector(".orderPage-table");
const picture = document.querySelector("section.wrap");
let firstTime=0;


//GET 取得訂單列表和圓餅圖
function getListandC3() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,config)
        .then(function (response) {
            data = response.data.orders;
            // console.log(data);
            renderOrderList(data);
            if(firstTime===0){
                changeStatu();
                delClick();
                firstTime++;
            }
            
            

        }).catch(function (error) {
            console.log(error);

        })
}

//組合訂單列表
function renderOrderList(data) {
    let str = "<thead><tr><th>訂單編號</th><th>聯絡人</th><th>聯絡地址</th><th>電子郵件</th><th>訂單品項</th><th>訂單日期</th><th>訂單狀態</th><th>操作</th></tr></thead>";

    // let length=data.length;
    data.forEach((item) => {
        let prods = "";
        // console.log(item.createdAt);
        // 日期轉換
        let date = (new Date(item.createdAt * 1000)).toLocaleDateString();

        let length = item.products.length;

        for (let i = 0; i < length; i++) {
            prods += `<ol><li>品項${(i + 1) + ":</br>" + item.products[i].title}</li></ol>`;

        }


        str += `<tr>
        <td>${item.id}</td>
        <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
            ${prods}
        </td>
        <td>${date}</td>
        <td class="orderStatus">
            <a data-id=${item.id} class="process" href="#">${item.paid === true ? "已處理" : "未處理"}</a>
        </td>
        <td>
            <input data-id="${item.id}" type="button" class="delSingleOrder-Btn" value="刪除">
        </td>
    </tr>`;
    })

    table.innerHTML = str;

    c3render(data);
}

//組合圓餅圖
function c3render(data) {
    //處理圓餅圖
    let totalObj = {};
    data.forEach((item) => {
        let length = item.products.length;
        for (let i = 0; i < length; i++) {

            //LV1圖
            // if (totalObj[item.products[i].category] == undefined) {
            //     totalObj[item.products[i].category] = item.products[i].price;
            // } else {
            //     totalObj[item.products[i].category] += item.products[i].price;
            // } 
            //LV2圖
            if (totalObj[item.products[i].title] == undefined) {
                totalObj[item.products[i].title] = item.products[i].price;
            } else {
                totalObj[item.products[i].title] += item.products[i].price;
            }
        }

    });

    let newData = [];
    let area = Object.keys(totalObj);
    area.forEach(function (item) {
        let ary = [];
        ary.push(item);
        ary.push(totalObj[item]);
        newData.push(ary);
    });

    // console.log("老師教得內容:");
    // console.log(newData);

    //陣列排序大到小
    newData.sort(function (a, b) {
        return b[1] - a[1];
    });

    // console.log("排序後:");
    // console.log(newData);

    let newDataLen = newData.length;

    //整理價錢條件
    let condition = [];

    for (let i = 0; i < newDataLen; i++) {
        condition.push(newData[i][1]);
    }

    //去除價錢重複 
    let result = condition.filter(function (element, index, arr) {
        // console.log(element, index, arr);
        // console.log(arr.indexOf(element));
        // console.log(index);
        return arr.indexOf(element) === index;
    });
    // console.log("去除價錢重複排序後:");
    // console.log(result);

    //防呆:前三名價錢條件陣列長度若小於3，
    let reslen = result.length < 3 ? result.length : 3;

 
    // console.log(reslen);

    //找出前三名營收品項，重新組合資料
    let top3arry = [];
    let dataother = ["其它", 0];

    //如果整理好資料小於4筆不用塞選 
    if (newDataLen < 3) {
        top3arry = newData;
    } else {

        for (let i = 0; i < newDataLen; i++) {

            //比對前三名資料
            for (let j = 0; j < reslen; j++) {
                if (newData[i][1] === result[j])
                {
                    top3arry.push(newData[i]);
                } 
             
            }

            //比對第3名後的資料放入其它
            for(let k=3;k<result.length;k++){
                if (newData[i][1] === result[k])
                {
                    dataother[1] += newData[i][1];
                }
            }
        }

        top3arry.push(dataother);

    }

    //最後確認圓餅圖陣列是否有資料
    let top3arrylength=top3arry.length;
    if(top3arrylength===0) picture.setAttribute("style","display:none");
    else picture.setAttribute("style","");



    console.log("最後整理好的陣列:");
    console.log(top3arry);




    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: top3arry
            // colors: {
            //     "Louvre 雙人床架": "#DACBFF",
            //     "Antony 雙人床架": "#9D7FEA",
            //     "Anty 雙人床架": "#5434A7",
            //     "其他": "#301E5F",
            // }
        },
    });

}

// 刪除全部訂單
function deleteAllOrder() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,config)
        .then(function (response) {
            init();

        }).catch(function (error) {
            console.log(error);

        })
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,config)
        .then(function (response) {

        }).catch(function (error) {
            console.log(error);

        })
}

//刪除按鈕事件
function delClick() {
    table.addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.value !== "刪除") return;
        let id = e.target.getAttribute("data-id");
        deleteOrderItem(id);
        init();
    })

    let delAll = document.querySelector(".discardAllBtn");

    delAll.addEventListener('click', function (e) {
        e.preventDefault();
        deleteAllOrder();
        ;
    })

}

//訂單處理狀態
function changeStatu() {

    table.addEventListener('click', function (e) {

        if (e.target.getAttribute('class') !== "process") return;
        change(e.target.getAttribute('data-id'),e.target.textContent);
        

    })
}

//PUT 修改訂單
function change(id,textContent) {
    let statue=true;
    if(textContent==="已處理"){
        statue=false;
    }
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
        {

            "data": {
                "id": id,
                "paid": statue
            }
        }, 
        config


    )
        .then(function (response) {
            data = response.data.orders;
            renderOrderList(data);
            
        })
        .catch(function (error) {
            console.log(error);

        })

        
}


function init() {

    getListandC3();
    
    

}

//登入按鈕
const submit =document.querySelector('#submit');

//登出按鈕
const logout =document.querySelector('#logout');


//管理員身份登入驗證
submit.addEventListener('click', function(e){
    
    const account=document.querySelector("#account").value;
    const password=document.querySelector("#password").value;
    const login=document.querySelector("#login");
    const webcontent=document.querySelector("#webcontent");
    const chart=document.querySelector("#chart");
    // console.log(account);
    if(account==="trista"&&password==="trista"){
        login.setAttribute("style","display: none");
        webcontent.setAttribute("style","");
        
        init();   
    }
})

//登出
logout.addEventListener('click',(e)=>{
    e.preventDefault();
    login.setAttribute("style","");
    webcontent.setAttribute("style","display: none");
    chart.textContent="";
})









