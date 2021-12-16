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
let carList={}; //累計購物車數量



//取得產品列表
function getProduct(statue) {
    axios
        .get(
            `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlpath}/products`
        )
        .then(function (response) {
            data = response.data.products;
            renderProduct(data);
            //防呆:初始化時，加入購物車按鈕註冊click
            
            if (statue === "init") {
                btnClick();
            }


        })
        .then(function (response) {
            getcartList();
            
        }).catch(function (error) {

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




}

//按鈕給予click事件
function btnClick() {


    prodList.addEventListener("click", (e) => {
        e.preventDefault();
        let target = e.target;
        if (target.getAttribute("class") !== "addCardBtn") {
            return;
        }
        // console.log(target.getAttribute("class"));

        addCart(target.getAttribute("data-id"));
    });
}


//加入購物車
function addCart(id) {
    let num =1;
    
    if(carList[id]!==undefined){
        num =carList[id]+1;
    }
    axios
        .post(
            `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlpath}/carts`,
            {
                data: {
                    productId: id,
                    quantity: num
                }
            }
        )
        .then(function (response) {
            //重新取得購物車內容
            

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
            rendercartList(data);
            delClick();
        }).catch(function (error) {
            // console.log(error.response.data);
        });
}

//顯示購物車資訊
function rendercartList(data) {

    // console.log(data);

    let str = "<tr><th width='40%'>品項</th><th width='15%'>單價</th><th width='15%'>數量</th><th width='15%'>金額</th><th width='15%'></th></tr>";
    let totalprice = 0;

    data.forEach((item) => {
        carList[item.product.id]=item.quantity;
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
        <td><p class="cartAmount"> 
        <a href="#"><span class="material-icons cartAmount-icon" data-num="${item.quantity - 1}" data-id="${item.id}">remove</span></a>
        <span>${item.quantity}</span>
        <a href="#"><span class="material-icons cartAmount-icon" data-num="${item.quantity + 1}" data-id="${item.id}">add</span></a>
      </p></td>
        <td>NT$${item.product.price}</td>
        <td class="discardBtn">
            <a data-id="${item.id}" data-del="del"  class="material-icons">clear</a>
        </td>
    </tr>
    `;



    });

    //購物車內沒有商品，隱藏刪除所有品項
    let length=data.length;
    str += "<tr><td>";
    if(length!==0){
        str +="<a href='#' class='discardAllBtn'>刪除所有品項</a>";
    }
    
    str +=`</td>
    <td></td>
    <td></td>
    <td>
        <p>總金額</p>
    </td>
    <td>NT$${totalprice}</td></tr>`;


    shoppingCart.innerHTML = str;

    let cartNumEdit = document.querySelectorAll('.cartAmount-icon');
        cartNumEdit.forEach(function(item) {
            item.addEventListener('click', function(e){
            e.preventDefault();
            editCartNum(e.target.dataset.num, e.target.dataset.id);
        })
    })

}

function editCartNum(num, id) {
    if (num > 0) {
      let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${urlpath}/carts`;
      let data = {
        data: {
          id: id,
          quantity: parseInt(num)
        }
      }
      axios.patch(url, data)
        .then(function (res) {
            getcartList();
        })
        .catch(function (error) {
          console.log(error);
        })
    }else {
        deleteCartItem(id);
    }
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


//填寫訂單後送出

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
            alert("訂單送出成功，購物車內產品已清空，請再次選購您需要的產品!");
            //重新取得購物車內容

        }).then(function (res) {
            //送出訂單重新將選項清空
            inputs.forEach((item) => {
                item.value = "";
            });
            document.querySelector("#tradeWay").value = "ATM";
            getProduct("change");
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
        getProduct("change");
    });

}


function init() {
    getProduct("init");
    checkData();
    condition();
}

init();