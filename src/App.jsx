import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap'
import { useForm } from 'react-hook-form'
import './App.css'

//環境變數(.env)
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


function App() {
  //產品列表
  const [products, setProducts] = useState([]);
  //modal產品
  const [modalProduct, setModalProduct] = useState([]);

  //取得產品
  const getProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}v2/api/${API_PATH}/products`);
      setProducts(res.data.products)
    } catch (error) {
      alert('取得產品失敗')
    }
  }

  useEffect(() => {
    getProducts();
    getCart();
  }, [])

  const productModalRef = useRef(null);

  //建立bootstrap modal實體
  useEffect(() => {
    new Modal(productModalRef.current, {backdrop: false});
  }, [])

  //modal開啟及關閉
  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  }

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  }

  //查看更多按鈕處理
  const handleSeeMore = (product) => {
    setModalProduct(product);
    openModal();
  }

  //購物車數量
  const [qtySelect, setQtySelect] = useState(1);

  //加入購物車
  const addCartItem = async (product_id, qty) => {
    try {
      await axios.post(`${BASE_URL}v2/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty)
        }
      })
      getCart();
    } catch (error) {
      alert('加入購物車失敗')
    }
  }

  //取得購物車
  const [cart, setCart] = useState({});

  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}v2/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      alert('取得購物車失敗')
    }
  }

  //清空購物車
  const removeCart = async () => {
    try {
      await axios.delete(`${BASE_URL}v2/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      alert('清空購物車失敗');
    }
  }

  //清除購物車單一品項
  const removeCartItem = async (cartItem_id) => {
    try {
      await axios.delete(`${BASE_URL}v2/api/${API_PATH}/cart/${cartItem_id}`);
      getCart();
    } catch (error) {
      alert('刪除購物車品項失敗');
    }
  }

  //修改購物車數量
  const updateCartItem = async (cartItem_id, product_id, qty) => {
    try {
      await axios.put(`${BASE_URL}v2/api/${API_PATH}/cart/${cartItem_id}`,{
        data: {
          product_id,
          qty: Number(qty)
        }
      });
      getCart();
    } catch (error) {
      alert('更新購物車失敗');
    }
  }

  //表單
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    const {message, ...user} = data;
    const userInfo = {
      data: {
        user,
        message
      }
    };
    checkOut(userInfo);
  })

  //送出訂單處理
  const checkOut = async (userInfo) => {
    try {
      axios.post(`${BASE_URL}v2/api/${API_PATH}/order`, userInfo) 
    } catch (error) {
      alert('送出訂單失敗');
    }
  }
  


  

  return (
    <>
      <div className="container">
        <div className="mt-4">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{width: '200px'}}>
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className='img-fluid object-fit-contain'
                      style={{width: '200px', height: '150px'}}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>
                    <del className="h6">原價 {product.origin_price} 元</del>
                    <div className="h5">特價 {product.price}元</div> 
                  </td>
                  <td>
                  <div className="btn-group btn-group-sm gap-2">
                    <button
                      onClick={() => handleSeeMore(product)}
                      type="button"
                      className="btn btn-outline-secondary rounded-3"
                    >
                      查看更多
                    </button>
                    <button type="button" className="btn btn-outline-primary rounded-3" onClick={() => addCartItem(product.id, 1)}>
                      加到購物車
                    </button>
                  </div>  
                  </td>
                </tr>
              ))} 
            </tbody>
          </table>

          {/* 產品modal */}
          <div
          ref={productModalRef}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          className="modal fade"
          id="productModal"
          tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-5">
                    產品名稱：{modalProduct.title}
                  </h2>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>  
                </div>
                <div className="modal-body">
                  <img
                    src={modalProduct.imageUrl}
                    alt={modalProduct.title}
                    className="img-fluid"
                  />
                  <p>內容：{modalProduct.content}</p>
                  <p>描述：{modalProduct.description}</p>
                  <p>
                    價錢：{modalProduct.price}{" "}
                    <del>{modalProduct.origin_price}</del> 元
                  </p>
                  <div className="input-group align-items-center">
                    <label htmlFor="qtySelect">數量：</label>
                    <select
                      value={qtySelect}
                      onChange={(e) => setQtySelect(e.target.value)}
                      id="qtySelect"
                      className="form-select"
                    >
                      {Array.from({ length: 10 }).map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => addCartItem(modalProduct.id, qtySelect)}>
                  加入購物車
                </button>
                </div>
              </div>    
            </div>

          </div>

          {/* 購物車若為空的則不顯示 */}
          {cart.carts?.length > 0 && (
            <div>
              <div className="text-end py-3">
                <button className="btn btn-outline-danger" type="button" onClick={removeCart}>
                  清空購物車
                </button>
              </div>

              <table className="table align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>品名</th>
                    <th style={{ width: "150px" }}>數量/單位</th>
                    <th className="text-end">單價</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.carts?.map((cartItem) => (
                    <tr key={cartItem.id}>
                      <td>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeCartItem(cartItem.id)}>
                          x
                        </button>
                      </td>
                      <td>{cartItem.product.title}</td>
                      <td style={{ width: "150px" }}>
                        <div className="d-flex align-items-center">
                          <div className="btn-group me-2" role="group">
                            <button
                              type="button"
                              className={`btn btn-outline-dark btn-sm ${cartItem.qty === 1 && 'disabled'}`}
                              onClick={() => updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty - 1)}
                            >
                              -
                            </button>
                            <span
                              className="btn border border-dark"
                              style={{ width: "50px", cursor: "auto" }}
                            >{cartItem.qty}</span>
                            <button
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => updateCartItem(cartItem.id, cartItem.product_id, cartItem.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <span className="input-group-text bg-transparent border-0">
                            {cartItem.product.unit}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">{cartItem.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end">
                      總計：
                    </td>
                    <td className="text-end" style={{ width: "130px" }}>{cart.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* 表單 */}
        <div className="my-5 row justify-content-center">
          <form className="col-md-8" onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-primary fs-4">
                Email
              </label>
              <input
                id="email"
                type="email"
                //is-invalid屬性為錯誤提示
                className={`form-control border-3 ${errors.email && 'is-invalid'}`}
                placeholder="請輸入 Email"
                //註冊屬性/required為必填 可寫提示字樣/pattern為資料格式
                {...register('email', {
                  required: 'email為必填欄位',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'email格式錯誤'
                  }
                })}
              />

              {/* 錯誤訊息提示 */}
              {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-primary fs-4">
                收件人姓名
              </label>
              <input
                id="name"
                className={`form-control border-3 ${errors.name && 'is-invalid'}`}
                placeholder="請輸入姓名"
                {...register('name', {
                  required: '收件人姓名為必填欄位',
                })}
              />
              {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="tel" className="form-label text-primary fs-4">
                收件人電話
              </label>
              <input
                id="tel"
                type="tel"
                className={`form-control border-3 ${errors.tel && 'is-invalid'}`}
                placeholder="請輸入電話"
                {...register('tel', {
                  required: '電話為必填欄位',
                  pattern: {
                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                    message: '電話格式錯誤'
                  }
                })}
              />
              {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label text-primary fs-4">
                收件人地址
              </label>
              <input
                id="address"
                type="text"
                className={`form-control border-3 ${errors.address && 'is-invalid'}`}
                placeholder="請輸入地址"
                {...register('address', {
                  required: '地址為必填欄位',
                })}
              />

              {errors.address && <p className="text-danger my-2">{errors.address.message}</p>}
            </div>
            <div className="mb-3">
            <label htmlFor="message" className="form-label text-primary fs-4">
              留言
            </label>
            <textarea
              id="message"
              className="form-control border-3"
              cols="20"
              rows="10"
              {...register('message')}
            ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className={`btn btn-danger w-100 p-3 ${cart.carts.length === 0 && 'disabled'}`}>
                送出訂單
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default App
