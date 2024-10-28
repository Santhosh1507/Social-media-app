import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Provider } from 'react-redux'
import store from './Redux/store.js';
import { SocketContextProvider } from "./context/SocketContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<Provider store={store}>
					<QueryClientProvider client={queryClient}>
						<SocketContextProvider>
							<App />
						</SocketContextProvider>
					</QueryClientProvider>
				</Provider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
