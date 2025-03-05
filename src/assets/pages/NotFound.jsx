import { Link } from "react-router-dom"

export default function NotFound() {
	return (
		<>
			<h1>此頁面不存在</h1>
			<Link to='/'>回到首頁</Link>
		</>
	)
}