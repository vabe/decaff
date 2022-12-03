import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import capitalize from "lodash/capitalize";
import Alert, { AlertColor } from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";

const NotificationContext = createContext({} as ReturnType<any>);

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children?: ReactNode }) {
  const { events } = useRouter();

  const [notificationType, setNotificationType] = useState<AlertColor>();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notification, setNotification] = useState("");

  function dismissNotification() {
    setNotificationOpen(false);
  }

  function showNotification() {
    setNotificationOpen(true);
  }

  function updateNotificationType(type: AlertColor) {
    setNotificationType(type);
  }

  function updateNotification(title: string) {
    setNotification(title);
  }

  function clearNotification() {
    setNotification("");
  }

  const handleNotificationDismiss = () => {
    dismissNotification();
    setTimeout(() => {
      clearNotification();
    }, 200);
  };

  useEffect(() => {
    events.on("routeChangeStart", handleNotificationDismiss);

    return () => {
      events.off("routeChangeStart", handleNotificationDismiss);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NotificationContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        showNotification,
        dismissNotification,
        clearNotification,
        updateNotification,
        updateNotificationType,
        handleNotificationDismiss,
      }}
    >
      {children}
      <Snackbar
        open={notificationOpen}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        autoHideDuration={3000}
        onClose={handleNotificationDismiss}
        sx={{
          bottom: 120,
        }}
      >
        <Alert
          onClose={handleNotificationDismiss}
          severity={notificationType}
          sx={{
            width: "100%",
          }}
        >
          <AlertTitle>{capitalize(notificationType)}</AlertTitle>
          {notification}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
