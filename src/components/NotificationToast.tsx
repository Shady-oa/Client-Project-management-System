
import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

const NotificationToast = () => {
  const { notifications, markNotificationAsRead } = useProject();
  const { user } = useUser();
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unreadNotifications = notifications.filter(n => !n.read);
    
    // Show toast for new notifications
    if (unreadNotifications.length > lastNotificationCount && lastNotificationCount > 0) {
      const newNotifications = unreadNotifications.slice(0, unreadNotifications.length - lastNotificationCount);
      
      newNotifications.forEach(notification => {
        toast(notification.title, {
          description: notification.message,
          duration: 5000,
          icon: <Bell className="w-4 h-4" />,
          action: {
            label: "Mark as read",
            onClick: () => markNotificationAsRead(notification.id),
          },
        });
      });
    }
    
    setLastNotificationCount(unreadNotifications.length);
  }, [notifications, user, lastNotificationCount, markNotificationAsRead]);

  return null;
};

export default NotificationToast;
