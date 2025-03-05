import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
// import './App.css'

//環境變數(.env)
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


export default function ProductsPage() {
	//產品列表
  const [products, setProducts] = useState([]);

	//取得產品
  const getProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}v2/api/${API_PATH}/products`);
      setProducts(res.data.products)
    } catch (error) {
      alert('取得產品失敗');
    }
  }

  useEffect(() => {
    getProducts();
  }, [])

	const addCartItem = async (product_id, qty) => {
    try {
      await axios.post(`${BASE_URL}v2/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty)
        }
      })
      
    } catch (error) {
      alert('加入購物車失敗')
    }
  }


	return(
		<div className="container">
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
								<Link
									to={`${product.id}`}
									className="btn btn-outline-secondary rounded-3"
								>
									查看更多
								</Link>
								<button type="button" className="btn btn-outline-primary rounded-3" onClick={() => addCartItem(product.id, 1)}>
									加到購物車
								</button>
							</div>  
							</td>
						</tr>
					))} 
				</tbody>
      </table>
		</div>
	)
}