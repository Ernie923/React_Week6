import { createHashRouter } from "react-router-dom";
import FrontLayout from "../assets/layout/Frontlayput";
import HomePage from "../assets/pages/HomePage";
import ProductsPage from "../assets/pages/ProductsPage";
import ProductDetailPage from "../assets/pages/ProductDetailPage";
import CartPage from "../assets/pages/CartPage";
import NotFound from "../assets/pages/NotFound";

const router = createHashRouter([
	{
		path: '/',
		element: <FrontLayout />,
		children: [
			{
				path: '',
				element: <HomePage />
			},
			{
				path: 'products',
				element: <ProductsPage />,
				
			},
			{
				path: 'products/:id',
				element: <ProductDetailPage />
			},
			{
				path: 'cart',
				element: <CartPage />
			}
		]
	},
	{
		path: '*',
		element: <NotFound />
	}
])

export default router;