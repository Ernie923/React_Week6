import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'


//環境變數(.env)
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage() {
	const [cart, setCart] = useState({});

	//取得購物車
	const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}v2/api/${API_PATH}/cart`);
      setCart(res.data.data);
			console.log(cart)
    } catch (error) {
      alert('取得購物車失敗')
    }
  }

	useEffect(() => {
		getCart();
	}, [])

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

	const formRef = useRef(null);

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
      axios.post(`${BASE_URL}v2/api/${API_PATH}/order`, userInfo);
			formRef.current.reset();  //清空表單
    } catch (error) {
      alert('送出訂單失敗');
    }
  }



	return (
		<div className='container'>
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
			<div className="my-5 row justify-content-center">
				<form className="col-md-8" onSubmit={onSubmit} ref={formRef}>
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
							type="text"
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
						<button type="submit" className={`btn btn-danger w-100 p-3 ${cart.carts?.length === 0 && 'disabled'}`}>
							送出訂單
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}