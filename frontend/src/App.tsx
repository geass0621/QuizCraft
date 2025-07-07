import { RouterProvider } from "react-router-dom"
import router from "./routes/appRoutes.tsx"

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
