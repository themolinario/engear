import { Alert, AlertTitle } from "@mui/material";

export function AlertMessage({ error, setError }: { error: { isActive: boolean, message: string }, setError: any }) {
  const isActive = error.isActive;
  const message = error.message;

  if (isActive) {
    return <Alert severity="error" onClose={() => {setError(false)}}>
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>;
  }

  return <></>;
}