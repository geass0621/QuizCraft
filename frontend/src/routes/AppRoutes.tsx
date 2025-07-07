import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import CreateQuestionnairePage from "../pages/CreateQuestionnairePage";
import TakeQuestionnairePage from "../pages/TakeQuestionnairePage";
import RootLayout from "../pages/RootLayout";


const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    errorElement: <ErrorPage />,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "create-questionnaire",
        element: <CreateQuestionnairePage />
      },
      {
        path: "take-questionnaire",
        element: <TakeQuestionnairePage />
      }
    ]
  }
]);

export default router;