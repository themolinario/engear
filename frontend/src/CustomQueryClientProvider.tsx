import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export function CustomQueryClientProvider ({children}: {children: any}){
    const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}