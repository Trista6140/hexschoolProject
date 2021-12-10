const urlpath = "trista";
let ddlcont = "全部"; //下拉選單初始值 

const prodList = document.querySelector('.productWrap');
const shoppingCart = document.querySelector('.shoppingCart-table');

const form = document.querySelector(".orderInfo-form");
const inputs = document.querySelectorAll(
    "input[type=text],input[type=tel],input[type=text],input[type=email]"
);
let txt = document.querySelectorAll(".orderInfo-message");

let ifCheckOk = false;
let data;



//取得產品列表
function getProduct() {
    axios
        .get(
            `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlpath}/products`
        )
        .then(function (response) {
            data = response.data.products;
            // console.log(data);
            renderProduct(data);
        }).catch(function (error) {
            // console.log(error.response.data);
        });
}

//顯示產品列表
function renderProduct(data) {
    let str = "";

    data.forEach((item) => {
        if (ddlcont === "全部") {
            str += `<li class="productCard">
            <h4 class="productType">新品</h4>
            <img src="${item.images}" alt="">
            <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>`;

        }
        else if (ddlcont === item.category) {
            str += `<li class="productCard">
            <h4 class="productType">新品</h4>
            <img src="${item.images}" alt="">
            <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>`;

        }

    });

    prodList.innerHTML = str;

    //註冊按鈕事件
    btnClick();
}

//按鈕給予click事件
function btnClick() {


    prodList.addEventListener("click", (e) => {
        let target = e.target;
        if (target.getAttribute("class") !== "addCardBtn") {
            return;
        }
        e.preventDefault();
        // console.log(target.getAttribute("class"));

        addCart(target.getAttribute("data-id"));
    });
}


//加入購物車
function addCart(id) {
    axios
        .post(
            `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlpath}/carts`,
            {
                data: {
                    productId: id,
                    quantity: 1
                }
            }
        )
        .then(function (response) {
            //重新取得購物車內容
            console.log(response);

            getcartList();
        }).catch(function (error) {
            // console.log(error.response.data);
        });
}

//取得購物車資訊
function getcartList() {
    axios
        .get(
            `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlpath}/carts`
        )
        .then(function (response) {
            // data=response.data
            data = response.data.carts;
            console.log(data);
            rendercartList(data);
        }).catch(function (error) {
            // console.log(error.response.data);
        });
}

//顯示購物車資訊
function rendercartList(data) {
    let str = "<tr><th width='40%'>品項</th><th width='15%'>單價</th><th width='15%'>數量</th><th width='15%'>金額</th><th width='15%'></th></tr>";
    let totalprice = 0;


    data.forEach((item) => {

        totalprice += parseInt(item.product.price);
        str += `
    <tr>
        <td>
            <div class="cardItem-title">
                <img src="https://i.imgur.com/HvT3zlU.png" alt="">
                <p>${item.product.title}</p>
            </div>
        </td>
        <td>NT$${item.product.origin_price}</td>
        <td>1</td>
        <td>NT$${item.product.price}</td>
        <td class="discardBtn">
            <a data-id="${item.id}" data-del="del"  class="material-icons">clear</a>
        </td>
    </tr>
    `;

    });

    str += `<tr>
    <td>
        <a href="#" class="discardAllBtn">刪除所有品項</a>
    </td>
    <td></td>
    <td></td>
    <td>
        <p>總金額</p>
    </td>
    <td>NT$${totalprice}</td>
</tr>`;


    shoppingCart.innerHTML = str;

    delClick();
}


// 刪除購物車全部品項
function deleteAllCart() {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/trista/carts`,
    )
        .then(function (response) {
            getcartList();

        }).catch(function (error) {
            // console.log(error.response.data);
        });
}

// 刪除購物車特定品項
function deleteCartItem(id) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/trista/carts/${id}`,

    )
        .then(function (response) {
            getcartList();
        }).catch(function (error) {
            // console.log(error.response.data);
        });
}

//刪除按鈕事件
function delClick() {
    shoppingCart.addEventListener('click', function (e) {
        e.preventDefault();

        if (e.target.getAttribute("data-del") !== "del") return;
        let id = e.target.getAttribute("data-id");

        deleteCartItem(id);

    })



    let delAll = document.querySelector(".discardAllBtn");

    delAll.addEventListener('click', function (e) {
        deleteAllCart();

    })

}


//填寫訂單

const submit = document.querySelector(".orderInfo-btn");

submit.addEventListener("click", (e) => {

    const name = document.querySelector("#customerName").value;
    const tel = document.querySelector("#customerPhone").value;
    const email = document.querySelector("#customerEmail").value;
    const address = document.querySelector("#customerAddress").value;
    const pay = document.querySelector("#tradeWay").value;
    // console.log(name,tel,email,address,pay);
    if (!ifCheckOk) {
        alert("請確實填寫訂單!");
    } else {
        console.log("準備發送訂單!");
        let objOreder = {};
        objOreder.name = name;
        objOreder.tel = tel;
        objOreder.email = email;
        objOreder.address = address;
        objOreder.payment = pay;

        createOrder(objOreder);

        //送出訂單重新將選項清空
        inputs.forEach((item) => {
            item.value = "";
        });
        document.querySelector("#tradeWay").value = "ATM";

        init();
    }
});

//檢查送出資料
function checkData() {

    //驗證規則
    const constraints = {
        姓名: {
            presence: {
                message: "為必填!"
            }
        },
        電話: {
            presence: {
                message: "為必填!"
            },
            numericality: {
                onlyInteger: true,
                message: "格式不正確！"
            },
            length: {
                is: 10,
                message: "要 10 碼！"
            }
        },
        信箱: {
            presence: {
                message: "為必填!"
            },
            email: {
                message: "請輸入正確信箱格式"
            }
        },
        地址: {
            presence: {
                message: "為必填!"
            }
        }
    };
    //檢查

    inputs.forEach((item) => {

        item.addEventListener("change", function () {
            item.nextElementSibling.setAttribute("style", "display: none;");
            // console.log(item.nextElementSibling);

            let errors = validate(form, constraints);
            // console.log(errors);
            //檢查是否有錯誤訊息
            if (errors) {
                Object.keys(errors).forEach(function (keys) {
                    // console.log(keys);
                    txt.forEach((item) => {
                        if (item.getAttribute("data-message") === keys) {
                            item.setAttribute("style", "");
                            item.innerHTML = errors[keys];
                        }
                    });
                });
                ifCheckOk = false;
            } else {
                ifCheckOk = true;
            }
        });
    });

}


// 送出購買訂單
function createOrder(item) {
    console.log(item);
    axios
        .post(
            `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlpath}/orders`,
            {
                data: {
                    user: item
                }
            }
        )
        .then(function (response) {
            // console.log(response.data);
            alert("訂單送出成功!");
            //重新取得購物車內容
            init();
        })
        .catch(function (error) {
            // console.log(error.response.data);
        });
}

//下拉選單選取事件
function condition() {
    const condition = document.querySelector(".productSelect");
    condition.addEventListener("change", (e) => {
        ddlcont = e.target.value;
        getProduct();
    });

}


function init() {
    getProduct();
    getcartList();
    checkData();
    condition();
}

init();