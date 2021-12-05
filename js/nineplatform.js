// 請代入自己的網址路徑
const api_path = "trista";
const token = "Esj5E5pslmcwSXHpsErAkexOloI2";

const table = document.querySelector(".orderPage-table");




// 取得訂單列表和圓餅圖
function getListandC3() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            data = response.data.orders;
            //   console.log(data);
            renderOrderList(data);
            delClick();
        })
}

//組合訂單列表
function renderOrderList(data) {
    let str = "<thead><tr><th>訂單編號</th><th>聯絡人</th><th>聯絡地址</th><th>電子郵件</th><th>訂單品項</th><th>訂單日期</th><th>訂單狀態</th><th>操作</th></tr></thead>";
    
    // let length=data.length;
    data.forEach((item) => {
        let prods="";
        console.log(item.createdAt);
        // 日期轉換
        let date = (new Date(item.createdAt * 1000)).toLocaleDateString();
        
        let length=item.products.length;
        
        for(let i=0;i<length;i++){
            prods+=`<ol><li>品項${(i+1)+":</br>"+item.products[i].title}</li></ol>`;
            
        }

       

        // console.log(item);

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
            <a href="#">${item.paid === true ? "已處理" : "未處理"}</a>
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
function c3render(data){
    //處理圓餅圖
    let totalObj = {};
    data.forEach((item) => {
        let length=item.products.length;
        for(let i=0;i<length;i++){
            
            if (totalObj[item.products[i].title] == undefined) {
                totalObj[item.products[i].title] = 1;
            } else {
                totalObj[item.products[i].title] += 1;
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

    // console.log(totalObj);


    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData
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
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {

        })
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {

        })
}

//刪除按鈕事件
function delClick() {
    table.addEventListener('click', function (e) {
        if (e.target.value !== "刪除") return;
        let id = e.target.getAttribute("data-id");
        deleteOrderItem(id);
        init();
    })

    let delAll = document.querySelector(".discardAllBtn");

    delAll.addEventListener('click', function (e) {
        deleteAllOrder
        init();
    })

}







function init() {

    getListandC3();

}


init();


